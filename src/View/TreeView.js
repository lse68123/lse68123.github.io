/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="TreeViewProperties.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="MoveView.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="ISetView.ts"/>
///<reference path="../Utils/TreeTweenManager.ts"/>
var GTE;
(function (GTE) {
    /** A class for the graphical representation of the tree. The main algorithm for drawing and repositioning
     * the tree is in this class*/
    var TreeView = (function () {
        function TreeView(game, tree, properties) {
            this.game = game;
            this.treeTweenManager = new GTE.TreeTweenManager(this.game);
            this.tree = tree;
            this.properties = properties;
            this.nodes = [];
            this.moves = [];
            this.iSets = [];
            this.drawInitialTree();
            this.centerGroupOnScreen();
        }
        TreeView.prototype.drawInitialTree = function () {
            var _this = this;
            this.tree.nodes.forEach(function (n) {
                var nodeView = new GTE.NodeView(_this.game, n);
                _this.nodes.push(nodeView);
                if (n !== _this.tree.root) {
                    var parent_1 = _this.findNodeView(n.parent);
                    _this.moves.push(new GTE.MoveView(_this.game, parent_1, nodeView));
                }
            });
            this.drawTree();
            // NOTE: Moves positions are only updated on initial drawing
            this.moves.forEach(function (m) {
                m.updateMovePosition();
                m.updateLabel(_this.properties.fractionOn);
            });
        };
        /**This method draws the tree by recursively calling the drawNode method*/
        TreeView.prototype.drawTree = function () {
            this.treeTweenManager.oldCoordinates = this.getOldCoordinates();
            this.setYCoordinates(this.tree.root);
            this.updateLeavesPositions();
            this.centerParents(this.tree.root);
            this.centerGroupOnScreen();
            this.drawISets();
            this.drawLabels();
            this.treeTweenManager.startTweens(this.nodes, this.moves, this.iSets);
            // NOTE: All other moves will be updated from the tween manager.
            if (this.moves.length > 0) {
                this.moves[this.moves.length - 1].updateMovePosition();
                this.moves[this.moves.length - 1].updateLabel(this.properties.fractionOn);
            }
        };
        TreeView.prototype.getOldCoordinates = function () {
            var oldCoordinates = [];
            this.nodes.forEach(function (n) {
                oldCoordinates.push({ x: n.x, y: n.y });
            });
            return oldCoordinates;
        };
        /**Sets the Y-coordinates for the tree nodes*/
        TreeView.prototype.setYCoordinates = function (node) {
            var _this = this;
            node.children.forEach(function (n) { return _this.setYCoordinates(n); });
            var nodeView = this.findNodeView(node);
            nodeView.y = nodeView.level * this.properties.levelHeight;
        };
        /**Update the leaves' x coordinate first*/
        TreeView.prototype.updateLeavesPositions = function () {
            var leaves = this.tree.getLeaves();
            var widthPerNode = this.game.width * 0.7 / leaves.length;
            var offset = (this.game.width - widthPerNode * leaves.length) / 2;
            for (var i = 0; i < leaves.length; i++) {
                var nodeView = this.findNodeView(leaves[i]);
                nodeView.x = (widthPerNode * i) + (widthPerNode / 2) - nodeView.width / 2 + offset;
            }
        };
        /**Update the parents' x coordinate*/
        TreeView.prototype.centerParents = function (node) {
            var _this = this;
            if (node.children.length !== 0) {
                node.children.forEach(function (n) { return _this.centerParents(n); });
                // let depthDifferenceToLeft = node.children[0].depth - node.depth;
                var depthDifferenceToLeft = this.findNodeView(node.children[0]).level - this.findNodeView(node).level;
                // let depthDifferenceToRight = node.children[node.children.length - 1].depth - node.depth;
                var depthDifferenceToRight = this.findNodeView(node.children[node.children.length - 1]).level - this.findNodeView(node).level;
                var total = depthDifferenceToLeft + depthDifferenceToRight;
                var leftChildNodeView = this.findNodeView(node.children[0]);
                var rightChildNodeView = this.findNodeView(node.children[node.children.length - 1]);
                var horizontalDistanceToLeft = depthDifferenceToLeft * (rightChildNodeView.x - leftChildNodeView.x) / total;
                var currentNodeView = this.findNodeView(node);
                currentNodeView.x = leftChildNodeView.x + horizontalDistanceToLeft;
            }
        };
        TreeView.prototype.drawISets = function () {
            var _this = this;
            for (var i = 0; i < this.iSets.length; i++) {
                // this.iSets[i].destroy();
                this.removeISetView(this.iSets[i]);
                i--;
            }
            this.tree.iSets.forEach(function (iSet) {
                var iSetNodes = [];
                var maxDepth = 0;
                iSet.nodes.forEach(function (node) {
                    if (node.depth > maxDepth) {
                        maxDepth = node.depth;
                    }
                    iSetNodes.push(_this.findNodeView(node));
                });
                _this.iSets.push(new GTE.ISetView(_this.game, iSet, iSetNodes));
                //DFS branch children and increase by maxDepth - parentDepth
            });
        };
        /** Adds a child to a specified node*/
        TreeView.prototype.addChildToNode = function (nodeV) {
            var node = nodeV.node;
            var child = new GTE.Node();
            this.tree.addChildToNode(node, child);
            var childV = new GTE.NodeView(this.game, child);
            var move = new GTE.MoveView(this.game, nodeV, childV);
            this.nodes.push(childV);
            this.moves.push(move);
            this.drawTree();
            return childV;
        };
        /** A helper method for finding the nodeView, given a Node*/
        TreeView.prototype.findNodeView = function (node) {
            for (var i = 0; i < this.nodes.length; i++) {
                var nodeView = this.nodes[i];
                if (nodeView.node === node) {
                    return nodeView;
                }
            }
        };
        /**A helper method for finding the moveView, given a Move*/
        TreeView.prototype.findMoveView = function (move) {
            for (var i = 0; i < this.moves.length; i++) {
                var moveView = this.moves[i];
                if (moveView.move === move) {
                    return moveView;
                }
            }
        };
        /**A method which removes the given nodeView from the treeView*/
        TreeView.prototype.removeNodeView = function (nodeV) {
            var _this = this;
            if (this.nodes.indexOf(nodeV) !== -1) {
                //Delete the associated moves.
                this.moves.forEach(function (m) {
                    if (m.to === nodeV) {
                        _this.moves.splice(_this.moves.indexOf(m), 1);
                        m.destroy();
                    }
                });
                //Remove the nodeView from the treeView and destroy it
                this.nodes.splice(this.nodes.indexOf(nodeV), 1);
                nodeV.events.onInputOut.dispatch(nodeV);
                nodeV.destroy();
            }
        };
        /**A helper method for finding the iSetView, given iSet*/
        TreeView.prototype.findISetView = function (iSet) {
            for (var i = 0; i < this.iSets.length; i++) {
                var iSetView = this.iSets[i];
                if (iSetView.iSet === iSet) {
                    return iSetView;
                }
            }
        };
        /**A method which removes the given iSetView from the treeView*/
        TreeView.prototype.removeISetView = function (iSetView) {
            if (this.iSets.indexOf(iSetView) !== -1) {
                this.iSets.splice(this.iSets.indexOf(iSetView), 1);
                iSetView.destroy();
            }
        };
        /** A method which decides whether to show the labels or not*/
        TreeView.prototype.drawLabels = function () {
            var _this = this;
            if (this.tree.checkAllNodesLabeled()) {
                this.tree.resetLabels();
                this.moves.forEach(function (m) {
                    m.label.alpha = 1;
                    m.updateLabel(_this.properties.fractionOn);
                });
                this.nodes.forEach(function (n) {
                    if (n.node.children.length === 0) {
                        n.node.convertToLeaf();
                        n.resetNodeDrawing();
                        n.resetLabelText(_this.properties.zeroSumOn);
                    }
                });
            }
            else {
                this.tree.removeLabels();
                this.moves.forEach(function (m) {
                    m.label.alpha = 0;
                });
                this.nodes.forEach(function (n) {
                    n.resetLabelText(_this.properties.zeroSumOn);
                    n.payoffsLabel.alpha = 0;
                    if (n.node.type === GTE.NodeType.LEAF) {
                        n.node.convertToDefault();
                        n.resetNodeDrawing();
                    }
                });
            }
        };
        /**Re-centers the tree on the screen*/
        TreeView.prototype.centerGroupOnScreen = function () {
            var left = this.game.width * 5;
            var right = -this.game.width * 5;
            var top = this.game.height * 5;
            var bottom = -this.game.height * 5;
            this.nodes.forEach(function (n) {
                if (n.x < left) {
                    left = n.x;
                }
                if (n.x > right) {
                    right = n.x;
                }
                if (n.y < top) {
                    top = n.y;
                }
                if (n.y > bottom) {
                    bottom = n.y;
                }
            });
            var width = right - left;
            var height = bottom - top;
            if (height > this.game.height * 0.9) {
                this.properties.levelHeight = this.properties.levelHeight * 0.8;
                this.drawTree();
            }
            var treeCenterX = left + width / 2;
            var treeCenterY = top + height / 2;
            var offsetX = (this.game.width / 2 - treeCenterX);
            var offsetY = (this.game.height / 2 - treeCenterY);
            this.nodes.forEach(function (n) {
                n.setPosition(n.x + offsetX, n.y + offsetY);
            });
        };
        return TreeView;
    }());
    GTE.TreeView = TreeView;
})(GTE || (GTE = {}));
//# sourceMappingURL=TreeView.js.map