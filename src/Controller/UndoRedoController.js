///<reference path="TreeController.ts"/>
///<reference path="../Model/Tree.ts"/>
///<reference path="../View/TreeView.ts"/>
///<reference path="../Utils/TreeParser.ts"/>
var GTE;
(function (GTE) {
    /**A class for handling the Undo/Redo functionality */
    var UndoRedoController = (function () {
        function UndoRedoController(treeController) {
            this.treeController = treeController;
            this.treesList = [];
            this.currentTreeIndex = 0;
            this.treeParser = new GTE.TreeParser();
            this.treesList.push(this.treeParser.parse(this.treeParser.stringify(this.treeController.tree)));
        }
        /**Undo-Redo method */
        UndoRedoController.prototype.changeTreeInController = function (undo) {
            var _this = this;
            if (undo && this.currentTreeIndex - 1 >= 0) {
                this.currentTreeIndex--;
            }
            else if (!undo && this.currentTreeIndex + 1 < this.treesList.length) {
                this.currentTreeIndex++;
            }
            else {
                return;
            }
            //1. Delete the current Tree and ISets in tree controller
            this.treeController.deleteNodeHandler(this.treeController.tree.root);
            this.treeController.treeView.nodes[0].destroy();
            this.treeController.treeView.iSets.forEach(function (iSet) {
                iSet.destroy();
            });
            //2. Change it with the corresponding one in treelist
            // this.treeController.tree = this.treesList[this.currentTreeIndex].clone();
            this.treeController.tree = this.treeParser.parse(this.treeParser.stringify(this.treesList[this.currentTreeIndex]));
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
        };
        UndoRedoController.prototype.saveNewTree = function () {
            this.treesList.splice(this.currentTreeIndex + 1, this.treesList.length);
            this.treesList.push(this.treeParser.parse(this.treeParser.stringify(this.treeController.tree)));
            this.currentTreeIndex++;
        };
        return UndoRedoController;
    }());
    GTE.UndoRedoController = UndoRedoController;
})(GTE || (GTE = {}));
//# sourceMappingURL=UndoRedoController.js.map