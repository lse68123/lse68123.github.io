/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="../Model/Move.ts"/>
module GTE {
    /** A class which represents how the move looks like, it has a reference to the start and end points and the label text*/
    export class MoveView extends Phaser.Sprite {
        game: Phaser.Game;
        from: NodeView;
        to: NodeView;
        label:Phaser.Text;
        move:Move;

        constructor(game: Phaser.Game, from: NodeView, to: NodeView) {
            super(game, from.x, from.y, game.cache.getBitmapData("move-line"));

            this.from = from;
            this.to = to;
            this.move = this.to.node.parentMove;

            this.position = this.from.position;
            this.tint = 0x000000;
            this.anchor.set(0.5, 0);

            this.rotation = Phaser.Point.angle(this.from.position, this.to.position) + Math.PI / 2;
            this.height = Phaser.Point.distance(this.from.position, this.to.position);

            this.label = this.game.add.text(0,0,this.move.label,null);
            this.label.anchor.set(0.5,0.5);
            this.label.fontSize = this.from.width*0.44;
            this.label.fill = this.from.ownerLabel.tint;
            this.label.fontStyle = "italic";
            this.label.fontWeight = 200;

            this.label.inputEnabled = true;
            this.label.events.onInputDown.dispatch(this);

            this.game.add.existing(this);
            this.game.world.sendToBack(this);
        }

        /** A method for repositioning the Move, once we have changed the position of the start or finish node */
        updateMovePosition(){
            this.rotation = Phaser.Point.angle(this.from.position, this.to.position) + Math.PI / 2;
            this.height = Phaser.Point.distance(this.from.position, this.to.position);
        }

        updateLabel(fractionOn:boolean){
            if(this.move.from.type===NodeType.CHANCE && this.move.probability!==null){
                this.label.text = this.move.getProbabilityText(fractionOn);
            }
            else if(this.move.from.type===NodeType.OWNED && this.move.label){
                this.label.text = this.move.label;

            }
            else{
                this.label.text = "";
                this.label.alpha = 0;
            }
            let center = new Phaser.Point(Math.abs((this.from.x+this.to.x)/2),Math.abs((this.from.y+this.to.y)/2));
            if(this.rotation>0){
                center.x=center.x-this.label.height/2;
            }
            else{
                center.x = center.x+this.label.height/2;

            }
            this.label.x = center.x;
            this.label.y = center.y-this.label.height*0.33;
            if (this.move.from.type===NodeType.OWNED) {
                this.label.fill = this.from.ownerLabel.fill;
            }
            else if(this.move.from.type===NodeType.CHANCE){
                this.label.fill = "#000";
            }
        }

        destroy() {
            this.from = null;
            this.to = null;
            this.label.destroy();
            super.destroy();
        }
    }
}