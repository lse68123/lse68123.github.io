///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../Model/ISet.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="UndoRedoController.ts"/>
///<reference path="../Utils/TreeParser.ts"/>
///<reference path="../../lib/FileSaver.d.ts"/>
///<reference path="../Model/StrategicForm.ts"/>
///<reference path="../View/StrategicFormView.ts"/>
var GTE;
(function (GTE) {
    var UserActionController = (function () {
        function UserActionController(game, treeController) {
            this.game = game;
            this.treeController = treeController;
            this.nodesBFSOrder = [];
            this.leavesDFSOrder = [];
            this.undoRedoController = new GTE.UndoRedoController(this.treeController);
            this.treeParser = new GTE.TreeParser();
            this.createBackgroundForInputReset();
            this.createCutSprite();
        }
        /**This sprite is created for the cut functionality of an independent set*/
        UserActionController.prototype.createCutSprite = function () {
            this.cutSprite = this.game.add.sprite(0, 0, "scissors");
            this.cutSprite.anchor.set(0.5, 0.5);
            this.cutSprite.alpha = 0;
            this.cutSprite.tint = GTE.CUT_SPRITE_TINT;
            this.cutSprite.width = this.game.height * GTE.ISET_LINE_WIDTH;
            this.cutSprite.height = this.game.height * GTE.ISET_LINE_WIDTH;
        };
        /**This sprite resets the input and node selection if someone clicks on a sprite which does not have input*/
        UserActionController.prototype.createBackgroundForInputReset = function () {
            var _this = this;
            this.backgroundInputSprite = this.game.add.sprite(0, 0, "");
            this.backgroundInputSprite.width = this.game.width;
            this.backgroundInputSprite.height = this.game.height;
            this.backgroundInputSprite.inputEnabled = true;
            this.backgroundInputSprite.sendToBack();
            this.backgroundInputSprite.events.onInputDown.add(function () {
                if (!_this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
                    _this.deselectNodesHandler();
            });
        };
        /**Resets the current Tree*/
        UserActionController.prototype.createNewTree = function () {
            this.treeController.deleteNodeHandler(this.treeController.tree.root);
            this.treeController.addNodeHandler(this.treeController.treeView.nodes[0]);
        };
        /**Saves a tree to a txt file*/
        UserActionController.prototype.saveTreeToFile = function () {
            var text = this.treeParser.stringify(this.treeController.tree);
            var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            saveAs(blob, GTE.GTE_DEFAULT_FILE_NAME + ".txt");
        };
        /**Toggles the open file menu to chose a txt file with a tree*/
        UserActionController.prototype.toggleOpenFile = function () {
            var _this = this;
            var input = event.target;
            var reader = new FileReader();
            reader.onload = function () {
                var text = reader.result;
                _this.loadTreeFromFile(text);
            };
            reader.readAsText(input.files[0]);
        };
        /**A method which loads the tree from a selected file*/
        UserActionController.prototype.loadTreeFromFile = function (text) {
            var _this = this;
            console.log("handler");
            try {
                this.treeController.deleteNodeHandler(this.treeController.tree.root);
                this.treeController.treeView.nodes[0].destroy();
                this.treeController.treeView.iSets.forEach(function (iSet) {
                    iSet.destroy();
                });
                var tree = this.treeParser.parse(text);
                if (tree.nodes.length >= 3) {
                    this.treeController.tree = tree;
                    this.treeController.treeView = new GTE.TreeView(this.treeController.game, this.treeController.tree, this.treeController.treeViewProperties);
                    this.treeController.emptySelectedNodes();
                    this.treeController.treeView.nodes.forEach(function (n) {
                        n.resetNodeDrawing();
                        n.resetLabelText(_this.treeController.treeViewProperties.zeroSumOn);
                    });
                    this.treeController.treeView.drawLabels();
                    this.treeController.attachHandlersToNodes();
                    this.treeController.treeView.iSets.forEach(function (iSetV) {
                        _this.treeController.attachHandlersToISet(iSetV);
                    });
                }
            }
            catch (err) {
                this.treeController.errorPopUp.show("Error in reading file. ");
                this.treeController.createInitialTree();
            }
        };
        /**A method which saves the tree to a png file*/
        UserActionController.prototype.saveTreeToImage = function () {
            this.game.world.getByName("hoverMenu").alpha = 0;
            setTimeout(function () {
                var cnvs = $('#phaser-div').find('canvas');
                cnvs[0].toBlob(function (blob) {
                    saveAs(blob, GTE.GTE_DEFAULT_FILE_NAME + ".png");
                });
            }, 100);
        };
        /**A method for deselecting nodes.*/
        UserActionController.prototype.deselectNodesHandler = function () {
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    n.isSelected = false;
                    n.resetNodeDrawing();
                });
                this.treeController.emptySelectedNodes();
            }
        };
        /**A method for adding children to selected nodes (keyboard N).*/
        UserActionController.prototype.addNodesHandler = function (nodeV) {
            var _this = this;
            if (nodeV) {
                this.treeController.addNodeHandler(nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    _this.treeController.addNodeHandler(n);
                });
            }
            this.undoRedoController.saveNewTree();
        };
        /** A method for deleting nodes (keyboard DELETE).*/
        UserActionController.prototype.deleteNodeHandler = function (nodeV) {
            var _this = this;
            if (nodeV) {
                this.treeController.deleteNodeHandler(nodeV.node);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    _this.treeController.deleteNodeHandler(n.node);
                });
            }
            var deletedNodes = [];
            if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    if (n.node === null) {
                        deletedNodes.push(n);
                    }
                });
            }
            deletedNodes.forEach(function (n) {
                _this.treeController.selectedNodes.splice(_this.treeController.selectedNodes.indexOf(n), 1);
            });
            this.undoRedoController.saveNewTree();
        };
        /**A method for assigning players to nodes (keyboard 1,2,3,4)*/
        UserActionController.prototype.assignPlayerToNodeHandler = function (playerID, nodeV) {
            var _this = this;
            if (nodeV) {
                this.treeController.assignPlayerToNode(playerID, nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    _this.treeController.assignPlayerToNode(playerID, n);
                });
            }
            this.undoRedoController.saveNewTree();
        };
        /**A method for assigning chance player to a node (keyboard 0)*/
        UserActionController.prototype.assignChancePlayerToNodeHandler = function (nodeV) {
            var _this = this;
            if (nodeV) {
                this.treeController.assignChancePlayerToNode(nodeV);
            }
            else if (this.treeController.selectedNodes.length > 0) {
                this.treeController.selectedNodes.forEach(function (n) {
                    _this.treeController.assignChancePlayerToNode(n);
                });
            }
            this.undoRedoController.saveNewTree();
        };
        /**A method which removes the last player from the list of players*/
        UserActionController.prototype.removeLastPlayerHandler = function () {
            var _this = this;
            this.treeController.tree.removePlayer(this.treeController.tree.players[this.treeController.tree.players.length - 1]);
            $("#player-number").html((this.treeController.tree.players.length - 1).toString());
            this.treeController.treeView.nodes.forEach(function (n) {
                n.resetNodeDrawing();
                n.resetLabelText(_this.treeController.treeViewProperties.zeroSumOn);
            });
            this.treeController.treeView.drawTree();
            this.undoRedoController.saveNewTree();
        };
        /**A method for creating an iSet (keyboard I)*/
        UserActionController.prototype.createISetHandler = function () {
            if (this.treeController.selectedNodes.length > 1) {
                this.treeController.createISet(this.treeController.selectedNodes);
            }
            this.undoRedoController.saveNewTree();
        };
        /**Remove iSetHandler*/
        UserActionController.prototype.removeISetHandler = function (iSet) {
            this.treeController.removeISetHandler(iSet);
            this.undoRedoController.saveNewTree();
        };
        /**Removes and iSet by a given list of nodes*/
        UserActionController.prototype.removeISetsByNodesHandler = function (nodeV) {
            if (nodeV) {
                this.removeISetHandler(nodeV.node.iSet);
            }
            else {
                this.treeController.removeISetsByNodesHandler();
            }
            this.undoRedoController.saveNewTree();
        };
        /**A method for assigning undo/redo functionality (keyboard ctrl/shift + Z)*/
        UserActionController.prototype.undoRedoHandler = function (undo) {
            this.undoRedoController.changeTreeInController(undo);
            $("#player-number").html((this.treeController.tree.players.length - 1).toString());
        };
        /**A method for assigning random payoffs*/
        UserActionController.prototype.randomPayoffsHandler = function () {
            this.treeController.randomPayoffs();
        };
        /**A method which toggles the zero sum on or off*/
        UserActionController.prototype.toggleZeroSum = function () {
            this.treeController.treeViewProperties.zeroSumOn = !this.treeController.treeViewProperties.zeroSumOn;
            this.treeController.treeView.drawTree();
        };
        /**A method which toggles the fractional or decimal view of chance moves*/
        UserActionController.prototype.toggleFractionDecimal = function () {
            this.treeController.treeViewProperties.fractionOn = !this.treeController.treeViewProperties.fractionOn;
            this.treeController.treeView.drawTree();
        };
        /**Starts the "Cut" state for an Information set*/
        UserActionController.prototype.initiateCutSpriteHandler = function (iSetV) {
            var _this = this;
            this.cutInformationSet = iSetV;
            this.cutSprite.bringToTop();
            this.deselectNodesHandler();
            this.game.add.tween(this.cutSprite).to({ alpha: 1 }, 300, Phaser.Easing.Default, true);
            this.game.input.keyboard.enabled = false;
            this.treeController.treeView.nodes.forEach(function (n) {
                n.inputEnabled = false;
            });
            this.treeController.treeView.iSets.forEach(function (iSet) {
                iSet.inputEnabled = false;
            });
            this.game.input.onDown.addOnce(function () {
                _this.treeController.treeView.nodes.forEach(function (n) {
                    n.inputEnabled = true;
                });
                _this.treeController.treeView.iSets.forEach(function (iSet) {
                    iSet.inputEnabled = true;
                });
                _this.game.input.keyboard.enabled = true;
                _this.cutSprite.alpha = 0;
                _this.treeController.cutInformationSet(_this.cutInformationSet, _this.cutSprite.x, _this.cutSprite.y);
                _this.undoRedoController.saveNewTree();
            }, this);
        };
        /**Updates the position of the cut sprite once every frame, when the cut functionality is on*/
        UserActionController.prototype.updateCutSpriteHandler = function () {
            if (this.cutSprite.alpha > 0) {
                var mouseXPosition = this.game.input.mousePointer.x;
                var finalPosition = new Phaser.Point();
                var nodeWidth = this.cutInformationSet.nodes[0].width * 0.5;
                //Limit from the left for X coordinate
                if (mouseXPosition - nodeWidth < this.cutInformationSet.nodes[0].x) {
                    finalPosition.x = this.cutInformationSet.nodes[0].x + nodeWidth;
                }
                else if (mouseXPosition + nodeWidth > this.cutInformationSet.nodes[this.cutInformationSet.nodes.length - 1].x) {
                    finalPosition.x = this.cutInformationSet.nodes[this.cutInformationSet.nodes.length - 1].x - nodeWidth;
                }
                else {
                    finalPosition.x = mouseXPosition;
                }
                var closestLeftNodeIndex = void 0;
                // Find the two consecutive nodes where the sprite is
                for (var i = 0; i < this.cutInformationSet.nodes.length - 1; i++) {
                    if (finalPosition.x >= this.cutInformationSet.nodes[i].x && finalPosition.x <= this.cutInformationSet.nodes[i + 1].x) {
                        closestLeftNodeIndex = i;
                    }
                }
                // set the y difference to be proportional to the x difference
                var closestLeftNodePosition = this.cutInformationSet.nodes[closestLeftNodeIndex].position;
                var closestRightNodePosition = this.cutInformationSet.nodes[closestLeftNodeIndex + 1].position;
                var proportionInX = (finalPosition.x - closestLeftNodePosition.x) / (closestRightNodePosition.x - closestLeftNodePosition.x);
                // console.log(proportionInX);
                finalPosition.y = closestLeftNodePosition.y + proportionInX * (closestRightNodePosition.y - closestLeftNodePosition.y);
                this.cutSprite.position.x = finalPosition.x;
                this.cutSprite.position.y = finalPosition.y;
                finalPosition = null;
                mouseXPosition = null;
                nodeWidth = null;
            }
        };
        /**If the label input is active, go to the next label
         * If next is false, we go to the previous label*/
        UserActionController.prototype.activateLabel = function (next) {
            if (this.treeController.labelInput.active) {
                if (this.treeController.labelInput.shouldRecalculateOrder) {
                    this.nodesBFSOrder = this.treeController.tree.BFSOnTree();
                    this.leavesDFSOrder = this.treeController.tree.getLeaves();
                }
                // If we are currently looking at moves
                if (this.treeController.labelInput.currentlySelected instanceof GTE.MoveView) {
                    var index = this.nodesBFSOrder.indexOf(this.treeController.labelInput.currentlySelected.move.to);
                    // Calculate the next index in the BFS order to tab to. If it is the last node, go to the next after the root, i.e. index 1
                    var nextIndex = void 0;
                    if (next) {
                        nextIndex = this.nodesBFSOrder.length !== index + 1 ? index + 1 : 1;
                    }
                    else {
                        nextIndex = index === 1 ? this.nodesBFSOrder.length - 1 : index - 1;
                    }
                    // Activate the next move
                    var nextMove = this.treeController.treeView.findMoveView(this.nodesBFSOrder[nextIndex].parentMove);
                    nextMove.label.events.onInputDown.dispatch(nextMove.label);
                }
                else if (this.treeController.labelInput.currentlySelected instanceof GTE.NodeView) {
                    // If owner label
                    if (this.treeController.labelInput.currentlySelected.ownerLabel.alpha === 1) {
                        var index = this.nodesBFSOrder.indexOf(this.treeController.labelInput.currentlySelected.node);
                        var nextIndex = this.calculateNodeLabelIndex(next, index);
                        var nextNode = this.treeController.treeView.findNodeView(this.nodesBFSOrder[nextIndex]);
                        nextNode.ownerLabel.events.onInputDown.dispatch(nextNode.ownerLabel);
                    }
                    else {
                        var index = this.leavesDFSOrder.indexOf(this.treeController.labelInput.currentlySelected.node);
                        var nextIndex = void 0;
                        if (next) {
                            nextIndex = this.leavesDFSOrder.length !== index + 1 ? index + 1 : 0;
                        }
                        else {
                            nextIndex = index === 0 ? this.leavesDFSOrder.length - 1 : index - 1;
                        }
                        var nextNode = this.treeController.treeView.findNodeView(this.leavesDFSOrder[nextIndex]);
                        nextNode.payoffsLabel.events.onInputDown.dispatch(nextNode.payoffsLabel);
                    }
                }
            }
        };
        /**If the input field is on and we press enter, change the label*/
        UserActionController.prototype.changeLabel = function () {
            var _this = this;
            if (this.treeController.labelInput.active) {
                // If we are looking at moves
                if (this.treeController.labelInput.currentlySelected instanceof GTE.MoveView) {
                    this.treeController.tree.changeMoveLabel(this.treeController.labelInput.currentlySelected.move, this.treeController.labelInput.inputField.val());
                    this.treeController.treeView.moves.forEach(function (m) {
                        m.updateLabel(_this.treeController.treeViewProperties.fractionOn);
                    });
                    this.activateLabel(true);
                }
                else if (this.treeController.labelInput.currentlySelected instanceof GTE.NodeView) {
                    if (this.treeController.labelInput.currentlySelected.ownerLabel.alpha === 1) {
                        this.treeController.labelInput.currentlySelected.node.player.label = this.treeController.labelInput.inputField.val();
                        this.treeController.treeView.nodes.forEach(function (n) {
                            n.resetLabelText(_this.treeController.treeViewProperties.zeroSumOn);
                        });
                        this.activateLabel(true);
                    }
                    else {
                        this.treeController.labelInput.currentlySelected.node.payoffs.loadFromString(this.treeController.labelInput.inputField.val());
                        this.treeController.treeView.nodes.forEach(function (n) {
                            n.resetLabelText(_this.treeController.treeViewProperties.zeroSumOn);
                        });
                        this.activateLabel(true);
                    }
                }
                this.undoRedoController.saveNewTree();
            }
        };
        /**Hides then input*/
        UserActionController.prototype.hideInputLabel = function () {
            if (this.treeController.labelInput.active) {
                this.treeController.labelInput.hideLabel();
            }
        };
        /**A helper method which calculates the next possible index of a labeled node*/
        UserActionController.prototype.calculateNodeLabelIndex = function (next, current) {
            var nodeIndex = current;
            if (next) {
                for (var i = current + 1; i < this.nodesBFSOrder.length; i++) {
                    if (this.nodesBFSOrder[i].player && this.nodesBFSOrder[i].player !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
                // If we have not found such an element in the next, keep search from the beginning
                for (var i = 0; i < current; i++) {
                    if (this.nodesBFSOrder[i].player && this.nodesBFSOrder[i].player !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
            }
            else {
                for (var i = current - 1; i >= 0; i--) {
                    if (this.nodesBFSOrder[i].player && this.nodesBFSOrder[i].player !== this.treeController.tree.players[0]) {
                        return i;
                    }
                }
                // If we have not found such an element in the next, keep search from the beginning
                if (nodeIndex === current) {
                    for (var i = this.nodesBFSOrder.length - 1; i > current; i--) {
                        if (this.nodesBFSOrder[i].player && this.nodesBFSOrder[i].player !== this.treeController.tree.players[0]) {
                            return i;
                        }
                    }
                }
            }
            return current;
        };
        //TEST METHOD!
        UserActionController.prototype.createStrategicForm = function () {
            if (this.strategicForm) {
                this.strategicForm.destroy();
            }
            if (this.strategicFormView) {
                this.strategicFormView.destroy();
            }
            try {
                this.strategicForm = new GTE.StrategicForm(this.treeController.tree);
                this.strategicFormView = new GTE.StrategicFormView(this.game, this.strategicForm);
            }
            catch (err) {
                this.treeController.errorPopUp.show(err.message);
            }
        };
        return UserActionController;
    }());
    GTE.UserActionController = UserActionController;
})(GTE || (GTE = {}));
//# sourceMappingURL=UserActionController.js.map