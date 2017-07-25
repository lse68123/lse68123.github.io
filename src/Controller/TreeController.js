/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
///<reference path="../View/TreeViewProperties.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="../Utils/SelectionRectangle.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="../Utils/ErrorPopUp.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../Menus/LabelInput/LabelInput.ts"/>
var GTE;
(function (GTE) {
    /**A class which connects the TreeView and the Tree Model.
     * Depending on the level of abstraction, some properties can be moved to different classes*/
    var TreeController = (function () {
        function TreeController(game, labelInput) {
            this.game = game;
            this.labelInput = labelInput;
            this.setCircleBitmapData(1);
            this.nodesToDelete = [];
            this.selectedNodes = [];
            this.selectionRectangle = new GTE.SelectionRectangle(this.game);
            this.createInitialTree();
            this.attachHandlersToNodes();
            this.errorPopUp = new GTE.ErrorPopUp(this.game);
            this.hoverSignal = new Phaser.Signal();
        }
        /**A method which creates the initial 3-node tree in the scene*/
        TreeController.prototype.createInitialTree = function () {
            this.tree = new GTE.Tree();
            this.tree.addNode();
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addChildToNode(this.tree.nodes[0]);
            this.tree.addPlayer(new GTE.Player(0, "0", 0x000000));
            this.tree.addPlayer(new GTE.Player(1, "1", GTE.PLAYER_COLORS[0]));
            this.tree.addPlayer(new GTE.Player(2, "2", GTE.PLAYER_COLORS[1]));
            this.treeViewProperties = new GTE.TreeViewProperties(220, 1000);
            this.treeView = new GTE.TreeView(this.game, this.tree, this.treeViewProperties);
            this.treeView.nodes[0].ownerLabel.text = "A";
            this.treeView.nodes[1].ownerLabel.text = "B";
            this.treeView.nodes[2].ownerLabel.text = "C";
        };
        /**The update method is built-into Phaser and is called 60 times a second.
         * It handles the selection of nodes, while holding the mouse button*/
        TreeController.prototype.update = function () {
            var _this = this;
            if (this.game.input.activePointer.isDown) {
                this.treeView.nodes.forEach(function (n) {
                    if (_this.selectionRectangle.overlap(n) && _this.selectedNodes.indexOf(n) === -1) {
                        // n.setColor(NODE_SELECTED_COLOR);
                        n.isSelected = true;
                        n.resetNodeDrawing();
                        _this.selectedNodes.push(n);
                    }
                    if (!_this.selectionRectangle.overlap(n) && _this.selectedNodes.indexOf(n) !== -1 && !_this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                        n.isSelected = false;
                        n.resetNodeDrawing();
                        _this.selectedNodes.splice(_this.selectedNodes.indexOf(n), 1);
                    }
                });
            }
        };
        /**A method for creating the circle for the nodes.
         * This method will imitate the zoom-in/zoom-out functionality*/
        TreeController.prototype.setCircleBitmapData = function (scale) {
            this.bmd = this.game.make.bitmapData(this.game.height * GTE.NODE_RADIUS * scale, this.game.height * GTE.NODE_RADIUS * scale, "node-circle", true);
            this.bmd.ctx.fillStyle = "#ffffff";
            this.bmd.ctx.beginPath();
            this.bmd.ctx.arc(this.bmd.width / 2, this.bmd.width / 2, this.bmd.width * 0.45, 0, Math.PI * 2);
            this.bmd.ctx.fill();
        };
        /**Attaching listeners, that will listen for specific actions from the user*/
        TreeController.prototype.attachHandlersToNodes = function () {
            var _this = this;
            this.treeView.nodes.forEach(function (n) {
                _this.attachHandlersToNode(n);
            });
        };
        /** Empties the selected nodes in a better way*/
        TreeController.prototype.emptySelectedNodes = function () {
            while (this.selectedNodes.length !== 0) {
                this.selectedNodes.pop();
            }
        };
        /** The node specific method for attaching handlers
         * Also when we add node we attach the handler for the parent move label*/
        TreeController.prototype.attachHandlersToNode = function (n) {
            var _this = this;
            n.events.onInputOver.add(function () {
                _this.handleInputOverNode(n);
            });
            n.events.onInputDown.add(function () {
                _this.handleInputDownNode(n);
            });
            n.events.onInputOut.add(function () {
                _this.handleInputOutNode(n);
            });
            n.ownerLabel.events.onInputDown.add(function () {
                var nodeLabel = arguments[0];
                this.handleInputDownNodeLabel(nodeLabel, n);
            }, this);
            n.payoffsLabel.events.onInputDown.add(function () {
                var nodeLabel = arguments[0];
                this.handleInputDownNodePayoffs(nodeLabel, n);
            }, this);
            if (n.node.parentMove) {
                var move_1 = this.treeView.findMoveView(n.node.parentMove);
                move_1.label.events.onInputDown.add(function () {
                    var moveLabel = arguments[0];
                    this.handleInputDownMoveLabel(moveLabel, move_1);
                }, this);
            }
        };
        /**The iSet specific method for attaching handlers*/
        TreeController.prototype.attachHandlersToISet = function (iSet) {
            iSet.events.onInputOver.add(function () {
                var iSet = arguments[0];
                this.handleInputOverISet(iSet);
            }, this);
        };
        /**Handler for the signal HOVER on a Node*/
        TreeController.prototype.handleInputOverNode = function (nodeV) {
            if (!this.game.input.activePointer.isDown && nodeV.node.iSet === null) {
                this.hoverSignal.dispatch(nodeV);
            }
        };
        /**Handler for the signal HOVER_OUT on a Node*/
        TreeController.prototype.handleInputOutNode = function (nodeV) {
        };
        /**Handler for the signal CLICK on a Node*/
        TreeController.prototype.handleInputDownNode = function (nodeV) {
            if (!this.game.input.activePointer.isDown) {
                this.hoverSignal.dispatch(nodeV);
            }
        };
        /**Handler for the signal HOVER on an ISet*/
        TreeController.prototype.handleInputOverISet = function (iSetV) {
            if (!this.game.input.activePointer.isDown) {
                this.hoverSignal.dispatch(iSetV);
            }
        };
        /**Halder for the signal CLICK on a Move Label*/
        TreeController.prototype.handleInputDownMoveLabel = function (label, move) {
            if (label.alpha !== 0) {
                this.labelInput.show(label, move);
            }
        };
        /**Handler for the signal CLICK on a Node Label*/
        TreeController.prototype.handleInputDownNodeLabel = function (label, node) {
            if (label.alpha !== 0) {
                this.labelInput.show(label, node);
            }
        };
        TreeController.prototype.handleInputDownNodePayoffs = function (label, node) {
            if (label.alpha !== 0) {
                this.labelInput.show(label, node);
            }
        };
        /**Adding child or children to a node*/
        TreeController.prototype.addNodeHandler = function (nodeV) {
            this.handleInputOutNode(nodeV);
            if (nodeV.node.children.length === 0) {
                var child1 = this.treeView.addChildToNode(nodeV);
                var child2 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
                this.attachHandlersToNode(child2);
            }
            else {
                var child1 = this.treeView.addChildToNode(nodeV);
                this.attachHandlersToNode(child1);
            }
            this.resetTree();
        };
        /**A method for deleting a node - 2 step deletion.*/
        TreeController.prototype.deleteNodeHandler = function (node) {
            var _this = this;
            if (this.tree.nodes.indexOf(node) === -1) {
                return;
            }
            if (node.children.length === 0 && node !== this.tree.root) {
                this.deleteNode(node);
            }
            else {
                this.nodesToDelete = [];
                this.getAllBranchChildren(node);
                this.nodesToDelete.pop();
                this.nodesToDelete.forEach(function (n) {
                    _this.deleteNode(n);
                });
                this.nodesToDelete = [];
                node.convertToDefault();
            }
            this.resetTree();
        };
        /** A method for assigning a player to a given node.*/
        TreeController.prototype.assignPlayerToNode = function (playerID, n) {
            var _this = this;
            //if someone adds player 4 before adding player 3, we will add player 3 instead.
            if (playerID > this.tree.players.length) {
                playerID--;
            }
            this.addPlayer(playerID);
            n.node.convertToLabeled(this.tree.findPlayerById(playerID));
            // If the node is in an iset, change the owner of the iSet to the new player
            if (n.node.iSet && n.node.iSet.nodes.length > 1) {
                var iSetView = this.treeView.findISetView(n.node.iSet);
                iSetView.nodes.forEach(function (nv) {
                    nv.resetNodeDrawing();
                    nv.resetLabelText(_this.treeViewProperties.zeroSumOn);
                });
                iSetView.tint = iSetView.iSet.player.color;
            }
            n.resetNodeDrawing();
            n.resetLabelText(this.treeViewProperties.zeroSumOn);
            this.resetTree();
        };
        /**A method for assigning chance player to a given node*/
        TreeController.prototype.assignChancePlayerToNode = function (n) {
            n.node.convertToChance(this.tree.players[0]);
            n.resetNodeDrawing();
            n.resetLabelText(this.treeViewProperties.zeroSumOn);
            this.resetTree();
        };
        /**A method for adding a new player if there isn't one created already*/
        TreeController.prototype.addPlayer = function (playerID) {
            //if someone adds player 4 before adding player 3, we will add player 3 instead.
            if (playerID > this.tree.players.length) {
                playerID--;
            }
            if (playerID > this.tree.players.length - 1) {
                this.tree.addPlayer(new GTE.Player(playerID, playerID.toString(), GTE.PLAYER_COLORS[playerID - 1]));
                $("#player-number").html((this.tree.players.length - 1).toString());
                this.treeView.drawLabels();
            }
        };
        /**Creates an iSet with the corresponding checks*/
        TreeController.prototype.createISet = function (nodesV) {
            var _this = this;
            var nodes = [];
            nodesV.forEach(function (n) {
                nodes.push(n.node);
            });
            //Check for errors
            try {
                this.tree.canCreateISet(nodes);
            }
            catch (err) {
                this.errorPopUp.show(err.message);
                return;
            }
            // Create a list of nodes to put into an iSet - create the union of all iSets
            var iSetNodes = [];
            var player = null;
            nodesV.forEach(function (n) {
                if (n.node.iSet) {
                    n.node.iSet.nodes.forEach(function (iNode) {
                        iSetNodes.push(iNode);
                    });
                    var iSetView = _this.treeView.findISetView(n.node.iSet);
                    _this.tree.removeISet(n.node.iSet);
                    _this.treeView.removeISetView(iSetView);
                }
                else {
                    iSetNodes.push(n.node);
                }
                if (n.node.player) {
                    player = n.node.player;
                }
            });
            this.tree.addISet(player, iSetNodes);
            this.resetTree();
        };
        /**A method for deleting an iSet*/
        TreeController.prototype.removeISetHandler = function (iSet) {
            this.tree.removeISet(iSet);
            this.treeView.removeISetView(this.treeView.findISetView(iSet));
            this.resetTree();
        };
        /**A method which removes all isets from the selected nodes*/
        TreeController.prototype.removeISetsByNodesHandler = function () {
            var iSetsToRemove = this.getSelectedISets();
            for (var i = 0; i < iSetsToRemove.length; i++) {
                this.removeISetHandler(iSetsToRemove[i]);
            }
            iSetsToRemove = null;
        };
        /**A helper method which returns all iSets from the selected nodes*/
        TreeController.prototype.getSelectedISets = function () {
            var distinctISets = [];
            this.selectedNodes.forEach(function (n) {
                if (n.node.iSet && distinctISets.indexOf(n.node.iSet) === -1) {
                    distinctISets.push(n.node.iSet);
                }
            });
            return distinctISets;
        };
        /**A method which cuts the information set*/
        TreeController.prototype.cutInformationSet = function (iSetV, x, y) {
            if (iSetV.nodes.length === 2) {
                this.removeISetHandler(iSetV.iSet);
            }
            else {
                var leftNodes_1 = [];
                var rightNodes_1 = [];
                iSetV.nodes.forEach(function (n) {
                    if (n.x <= x) {
                        leftNodes_1.push(n);
                    }
                    else {
                        rightNodes_1.push(n);
                    }
                });
                if (leftNodes_1.length === 1) {
                    iSetV.iSet.removeNode(leftNodes_1[0].node);
                    iSetV.removeNode(leftNodes_1[0]);
                }
                else if (rightNodes_1.length === 1) {
                    iSetV.iSet.removeNode(rightNodes_1[0].node);
                    iSetV.removeNode(rightNodes_1[0]);
                }
                else {
                    this.removeISetHandler(iSetV.iSet);
                    this.createISet(leftNodes_1);
                    this.createISet(rightNodes_1);
                }
            }
            this.resetTree();
        };
        /**A method for assigning random payoffs to nodes*/
        TreeController.prototype.randomPayoffs = function () {
            var leaves = this.tree.getLeaves();
            leaves.forEach(function (n) {
                n.payoffs.setRandomPayoffs();
            });
            this.resetTree();
        };
        /**A method for resetting the tree after each action on the tree*/
        TreeController.prototype.resetTree = function () {
            var _this = this;
            if (this.tree.nodes.length > 1) {
                this.treeView.drawTree();
                this.treeView.iSets.forEach(function (iSetV) {
                    _this.attachHandlersToISet(iSetV);
                });
            }
        };
        /**Get all children of a given node*/
        TreeController.prototype.getAllBranchChildren = function (node) {
            var _this = this;
            node.children.forEach(function (c) {
                _this.getAllBranchChildren(c);
            });
            this.nodesToDelete.push(node);
        };
        /**A method for deleting a single! node from the treeView and tree*/
        TreeController.prototype.deleteNode = function (node) {
            this.treeView.removeNodeView(this.treeView.findNodeView(node));
            this.tree.removeNode(node);
        };
        return TreeController;
    }());
    GTE.TreeController = TreeController;
})(GTE || (GTE = {}));
//# sourceMappingURL=TreeController.js.map