var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="TreeController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="KeyboardController.ts"/>
///<reference path="UserActionController.ts"/>
///<reference path="../Menus/TopMenu/TopMenu.ts"/>
var GTE;
(function (GTE) {
    /**A class for the main part of the software. This is the starting point of the core software*/
    var MainScene = (function (_super) {
        __extends(MainScene, _super);
        function MainScene() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainScene.prototype.create = function () {
            this.labelInput = new GTE.LabelInput(this.game);
            this.treeController = new GTE.TreeController(this.game, this.labelInput);
            this.userActionController = new GTE.UserActionController(this.game, this.treeController);
            this.keyboardController = new GTE.KeyboardController(this.game, this.userActionController);
            this.hoverManager = new GTE.HoverMenuController(this.game, this.userActionController);
            this.topMenu = new GTE.TopMenu(this.userActionController);
            // this.game.input.onDown.add(()=>{
            //     this.labelInput.show(this.game.input.activePointer.x,this.game.input.activePointer.y);
            // });
            // The line below is used for fps testing purposes
            this.game.time.advancedTiming = true;
        };
        /** The update method is built-into the engine for every state. It executes at most 60 times a second*/
        MainScene.prototype.update = function () {
            this.treeController.update();
            this.userActionController.updateCutSpriteHandler();
        };
        /** This is used for testing purposes - displays a text 60 times a second in the app*/
        MainScene.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString(), 20, 60, "#000000", "20px Arial");
            // if(this.treeController) {
            //     this.game.debug.text("undoTrees: "+this.treeController.undoRedoController.treesList.length,20,80,"#000000","20px Arial");
            // this.game.debug.text("index: "+this.treeController.undoRedoController.currentTreeIndex,20,100,"#000000","20px Arial");
            // }
            // this.game.debug.text("w: "+this.game.width + " h: "+this.game.height, 20,80, "#000000", "20px Arial");
            // if(this.hoverManager){
            //     this.game.debug.text("selected in Hover: "+this.hoverManager.selectedNodesSprites.length.toString(), 20,60, "#000000", "20px Arial");
            // }
            // if(this.userActionController){
            //     this.game.debug.text("cut x: "+this.userActionController.cutSprite.position.x+"    cut y: "+this.userActionController.cutSprite.position.y, 20,60, "#000000", "20px Arial");
            // }
            // if(this.treeController && this.treeController.treeView && this.treeController.treeView){
            //     this.treeController.treeView.nodes.forEach(n=>{
            //         if(n.payoffsLabel) {
            //             this.game.debug.spriteBounds(n.payoffsLabel,"#ff0000",false);
            //         }
            //     });
            // }
            // if(this.userActionController && this.userActionController.strategicFormView){
            //     this.userActionController.strategicFormView.cells.forEach(c=>{
            //         if(c.p1Text && c.p2Text) {
            //             this.game.debug.spriteBounds(c.p1Text,"#ff0000",false);
            //             this.game.debug.spriteBounds(c.p2Text,"#ff0000",false);
            //         }
            //     });
            // }
        };
        return MainScene;
    }(Phaser.State));
    GTE.MainScene = MainScene;
})(GTE || (GTE = {}));
//# sourceMappingURL=MainScene.js.map