/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="Constants.ts"/>
module GTE{
    /** A class representing the rectangle which selects vertices*/
    export class SelectionRectangle extends Phaser.Sprite{
        start:Phaser.Point;
        previewCircle:Phaser.Sprite;
        onHoldTween:Phaser.Tween;

        constructor(game:Phaser.Game){
            super(game,0,0);
            this.loadTexture(this.game.cache.getBitmapData("line"));

            this.previewCircle = this.game.add.sprite(0,0,this.game.cache.getBitmapData("node-circle"));
            this.previewCircle.alpha = 0;
            this.previewCircle.tint = PREVIEW_CIRCLE_COLOR;
            this.previewCircle.scale.set(0,0);
            this.previewCircle.anchor.set(0.5,0.5);

            this.start = new Phaser.Point();
            this.tint = SELECTION_INNER_COLOR;

            this.alpha = 0;

            //when we click and hold, we reset the rectangle.
            this.game.input.onDown.add(()=>{
                this.previewCircle.alpha = 1;
                this.onHoldTween = this.game.add.tween(this.previewCircle.scale).to({x:0.7,y:0.7},400,Phaser.Easing.Back.Out,true);
                this.onHoldTween.onUpdateCallback(()=>{
                   if(this.game.input.activePointer.isUp){
                       this.onHoldTween.stop(true);
                   }
                });

                this.width = 0;
                this.height = 0;
                this.start.x = this.game.input.activePointer.position.x;
                this.start.y = this.game.input.activePointer.position.y;
                this.position = this.start;
                this.alpha = 0.3;
            },this);

            //When we release, reset the rectangle
            this.game.input.onUp.add(()=>{
                this.alpha = 0;
                this.width = 0;
                this.height = 0;
                this.game.add.tween(this.previewCircle.scale).to({x:0,y:0},200,Phaser.Easing.Default,true);
            });
            //On dragging, update the transform of the rectangle*/
            this.game.input.addMoveCallback(this.onDrag,this);
            this.game.add.existing(this);
        }
        /** The method which resizes the rectangle as we drag*/
        onDrag(){
            this.game.canvas.style.cursor = "default";
            if(this.game.input.activePointer.isDown) {
                this.previewCircle.position.set(this.game.input.activePointer.x,this.game.input.activePointer.y);
                this.height = this.game.input.activePointer.y-this.start.y;
                this.width = this.game.input.activePointer.x - this.start.x;
            }
        }
    }
}