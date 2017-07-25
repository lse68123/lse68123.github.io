/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="TreeViewProperties.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="MoveView.ts"/>
///<reference path="../Model/Node.ts"/>
///<reference path="ISetView.ts"/>
///<reference path="../Utils/TreeTweenManager.ts"/>

module GTE {
    /** A class for the graphical representation of the tree. The main algorithm for drawing and repositioning
     * the tree is in this class*/
    export class TreeView {
        game: Phaser.Game;
        tree: Tree;
        //The properties field determines the horizontal and vertical offsets between each level.
        properties: TreeViewProperties;
        nodes: Array<NodeView>;
        moves: Array<MoveView>;
        iSets: Array<ISetView>;
        treeTweenManager: TreeTweenManager;

        constructor(game: Phaser.Game, tree: Tree, properties: TreeViewProperties) {
            this.game = game;
            this.treeTweenManager = new TreeTweenManager(this.game);
            this.tree = tree;
            this.properties = properties;
            this.nodes = [];
            this.moves = [];
            this.iSets = [];
            this.drawInitialTree();
            this.centerGroupOnScreen()
        }

        private drawInitialTree() {
            this.tree.nodes.forEach(n => {
                let nodeView = new NodeView(this.game, n);

                this.nodes.push(nodeView);
                if (n !== this.tree.root) {
                    let parent = this.findNodeView(n.parent);
                    this.moves.push(new MoveView(this.game, parent, nodeView));
                }
            });
            this.drawTree();
            // NOTE: Moves positions are only updated on initial drawing
            this.moves.forEach(m => {
                m.updateMovePosition();
                m.updateLabel(this.properties.fractionOn);
            });
        }

        /**This method draws the tree by recursively calling the drawNode method*/
        drawTree() {

            this.treeTweenManager.oldCoordinates = this.getOldCoordinates();

            this.setYCoordinates(this.tree.root);
            this.updateLeavesPositions();
            this.centerParents(this.tree.root);
            this.centerGroupOnScreen();
            this.drawISets();
            this.drawLabels();

            this.treeTweenManager.startTweens(this.nodes, this.moves, this.iSets);
            // NOTE: All other moves will be updated from the tween manager.
            if(this.moves.length>0) {
                this.moves[this.moves.length - 1].updateMovePosition();
                this.moves[this.moves.length - 1].updateLabel(this.properties.fractionOn);
            }
        }


        private getOldCoordinates() {
            let oldCoordinates = [];
            this.nodes.forEach(n => {
                oldCoordinates.push({x: n.x, y: n.y});
            });
            return oldCoordinates;
        }

        /**Sets the Y-coordinates for the tree nodes*/
        private setYCoordinates(node: Node) {
            node.children.forEach(n => this.setYCoordinates(n));
            let nodeView = this.findNodeView(node);
            nodeView.y = nodeView.level * this.properties.levelHeight;
        }

        /**Update the leaves' x coordinate first*/
        private updateLeavesPositions() {
            let leaves = this.tree.getLeaves();
            let widthPerNode = this.game.width * 0.7 / leaves.length;
            let offset = (this.game.width - widthPerNode * leaves.length) / 2;

            for (let i = 0; i < leaves.length; i++) {
                let nodeView = this.findNodeView(leaves[i]);
                nodeView.x = (widthPerNode * i) + (widthPerNode / 2) - nodeView.width / 2 + offset;
            }
        }

        /**Update the parents' x coordinate*/
        private centerParents(node: Node) {
            if (node.children.length !== 0) {
                node.children.forEach(n => this.centerParents(n));
                // let depthDifferenceToLeft = node.children[0].depth - node.depth;
                let depthDifferenceToLeft = this.findNodeView(node.children[0]).level - this.findNodeView(node).level;
                // let depthDifferenceToRight = node.children[node.children.length - 1].depth - node.depth;
                let depthDifferenceToRight = this.findNodeView(node.children[node.children.length - 1]).level - this.findNodeView(node).level;

                let total = depthDifferenceToLeft + depthDifferenceToRight;

                let leftChildNodeView = this.findNodeView(node.children[0]);
                let rightChildNodeView = this.findNodeView(node.children[node.children.length - 1]);

                let horizontalDistanceToLeft = depthDifferenceToLeft * (rightChildNodeView.x - leftChildNodeView.x) / total;

                let currentNodeView = this.findNodeView(node);
                currentNodeView.x = leftChildNodeView.x + horizontalDistanceToLeft;
            }
        }

        private drawISets() {
            for (let i = 0; i < this.iSets.length; i++) {
                // this.iSets[i].destroy();
                this.removeISetView(this.iSets[i]);
                i--;
            }
            this.tree.iSets.forEach((iSet) => {
                let iSetNodes = [];
                let maxDepth = 0;
                iSet.nodes.forEach(node => {
                    if(node.depth>maxDepth){
                        maxDepth=node.depth;
                    }
                    iSetNodes.push(this.findNodeView(node));
                });

                this.iSets.push(new ISetView(this.game, iSet, iSetNodes));
                //DFS branch children and increase by maxDepth - parentDepth
            });
        }

        /** Adds a child to a specified node*/
        addChildToNode(nodeV: NodeView) {
            let node = nodeV.node;
            let child = new Node();
            this.tree.addChildToNode(node, child);

            let childV = new NodeView(this.game, child);
            let move = new MoveView(this.game, nodeV, childV);

            this.nodes.push(childV);
            this.moves.push(move);
            this.drawTree();
            return childV;
        }

        /** A helper method for finding the nodeView, given a Node*/
        findNodeView(node: Node) {
            for (let i = 0; i < this.nodes.length; i++) {
                let nodeView = this.nodes[i];
                if (nodeView.node === node) {
                    return nodeView;
                }
            }
        }

        /**A helper method for finding the moveView, given a Move*/
        findMoveView(move:Move){
            for (let i = 0; i < this.moves.length; i++) {
                let moveView = this.moves[i];
                if (moveView.move === move) {
                    return moveView;
                }
            }
        }

        /**A method which removes the given nodeView from the treeView*/
        removeNodeView(nodeV: NodeView) {
            if (this.nodes.indexOf(nodeV) !== -1) {
                //Delete the associated moves.
                this.moves.forEach(m => {
                    if (m.to === nodeV) {
                        this.moves.splice(this.moves.indexOf(m), 1);
                        m.destroy();
                    }
                });
                //Remove the nodeView from the treeView and destroy it
                this.nodes.splice(this.nodes.indexOf(nodeV), 1);
                nodeV.events.onInputOut.dispatch(nodeV);
                nodeV.destroy();
            }
        }

        /**A helper method for finding the iSetView, given iSet*/
        findISetView(iSet: ISet) {
            for (let i = 0; i < this.iSets.length; i++) {
                let iSetView = this.iSets[i];
                if (iSetView.iSet === iSet) {
                    return iSetView;
                }
            }
        }

        /**A method which removes the given iSetView from the treeView*/
        removeISetView(iSetView: ISetView) {
            if (this.iSets.indexOf(iSetView) !== -1) {
                this.iSets.splice(this.iSets.indexOf(iSetView), 1);
                iSetView.destroy();
            }
        }

        /** A method which decides whether to show the labels or not*/
        drawLabels(){
            if(this.tree.checkAllNodesLabeled()){
                this.tree.resetLabels();
                this.moves.forEach(m=>{
                    m.label.alpha=1;
                    m.updateLabel(this.properties.fractionOn);
                });
                this.nodes.forEach(n=>{
                    if(n.node.children.length===0){
                        n.node.convertToLeaf();
                        n.resetNodeDrawing();
                        n.resetLabelText(this.properties.zeroSumOn);
                    }
                });
            }
            else{
                this.tree.removeLabels();
                this.moves.forEach(m=>{
                    m.label.alpha = 0;
                });
                this.nodes.forEach(n=>{
                   n.resetLabelText(this.properties.zeroSumOn);
                   n.payoffsLabel.alpha = 0;
                   if(n.node.type===NodeType.LEAF){
                       n.node.convertToDefault();
                       n.resetNodeDrawing();
                   }
                });
            }
        }

        /**Re-centers the tree on the screen*/
        private centerGroupOnScreen() {
            let left = this.game.width * 5;
            let right = -this.game.width * 5;
            let top = this.game.height * 5;
            let bottom = -this.game.height * 5;

            this.nodes.forEach(n => {
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

            let width = right - left;
            let height = bottom - top;

            if (height > this.game.height * 0.9) {
                this.properties.levelHeight = this.properties.levelHeight * 0.8;
                this.drawTree();
            }

            let treeCenterX = left + width / 2;
            let treeCenterY = top + height / 2;

            let offsetX = (this.game.width / 2 - treeCenterX);
            let offsetY = (this.game.height / 2 - treeCenterY);

            this.nodes.forEach(n => {
                n.setPosition(n.x + offsetX, n.y + offsetY);
            });
        }
    }
}