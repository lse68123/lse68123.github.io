///<reference path="TreeController.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
///<reference path="../Utils/TreeParser.ts"/>
///<reference path="../View/NodeView.ts"/>
module GTE {

    /**A class for handling the Undo/Redo functionality */
    export class UndoRedoController {
        treeController: TreeController;
        treesList: Array<Tree>;
        currentTreeIndex: number;
        treeParser:TreeParser;
        treeCoordinates:Array<Array<{x:number,y:number}>>;

        constructor(treeController: TreeController) {
            this.treeController = treeController;
            this.treesList = [];
            this.treeCoordinates = [];
            this.currentTreeIndex = 0;
            this.treeParser = new TreeParser();
            this.treesList.push(this.treeParser.parse(this.treeParser.stringify(this.treeController.tree)));

        }

        /**Undo-Redo method */
        changeTreeInController(undo: boolean) {
            if (undo && this.currentTreeIndex - 1 >= 0) {
                this.currentTreeIndex--;
            }
            else if(!undo && this.currentTreeIndex+1<this.treesList.length){
                this.currentTreeIndex++;
            }
            else{
                return;
            }

            //1. Delete the current Tree and ISets in tree controller
            this.treeController.deleteNodeHandler(this.treeController.tree.root);
            this.treeController.treeView.nodes[0].destroy();
            this.treeController.treeView.iSets.forEach((iSet:ISetView)=>{
                iSet.destroy();
            });

            //2. Change it with the corresponding one in treelist
            // this.treeController.tree = this.treesList[this.currentTreeIndex].clone();
            this.treeController.tree = this.treeParser.parse(this.treeParser.stringify(this.treesList[this.currentTreeIndex]));
            this.treeController.treeView = new TreeView(this.treeController.game, this.treeController.tree, this.treeController.treeViewProperties);
            this.treeController.emptySelectedNodes();
            this.treeController.treeView.nodes.forEach(n=>{
               n.resetNodeDrawing();
               n.resetLabelText(this.treeController.treeViewProperties.zeroSumOn);
            });

            this.treeController.treeView.drawLabels(true);
            this.treeController.attachHandlersToNodes();
            this.treeController.treeView.iSets.forEach((iSet)=>{
                this.treeController.attachHandlersToISet(iSet);
            });

            if(this.treeCoordinates[this.currentTreeIndex]){
                for (let i = 0; i < this.treeController.treeView.nodes.length; i++) {
                    this.treeController.treeView.nodes[i].position.x = this.treeCoordinates[this.currentTreeIndex][i].x;
                    this.treeController.treeView.nodes[i].position.y = this.treeCoordinates[this.currentTreeIndex][i].y;
                }
                this.treeController.treeView.drawISets()
            }

            this.resetUndoReddoButtons();
        }

        saveNewTree(saveCoordinates?:boolean) {
            this.treesList.splice(this.currentTreeIndex+1, this.treesList.length);
            this.treesList.push(this.treeParser.parse(this.treeParser.stringify(this.treeController.tree)));
            if(saveCoordinates){
                let coordsArray = [];
                this.treeController.treeView.nodes.forEach((n:NodeView)=>{
                   coordsArray.push({x:n.position.x,y:n.position.y});
                });
                this.treeCoordinates[this.currentTreeIndex+1]=coordsArray;
            }
                this.resetUndoReddoButtons();
            this.currentTreeIndex++;
        }

        /**A method which resets the top-menu undo-redo buttons*/
        private resetUndoReddoButtons() {
            if (this.currentTreeIndex === 0) {
                $("#undo-wrapper").css({opacity: 0.3});
            }
            else {
                $("#undo-wrapper").css({opacity: 1});
            }
            if (this.currentTreeIndex === this.treesList.length - 1) {
                $("#redo-wrapper").css({opacity: 0.3});
            }
            else {
                $("#redo-wrapper").css({opacity: 1});
            }
        }
    }
}