/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="../Utils/Constants.ts"/>

module GTE {
    /** A class for the initial animation of the GTE software
     * This class shows a very simple usage of the Phaser Engine - sprites, colours, bitmaps, repositioning and tweens
     * Here we also preload all sprites that will be used*/
    export class Boot extends Phaser.State {
        bmd: Phaser.BitmapData;
        logoGroup: Phaser.Group;
        point1: Phaser.Sprite;
        point2: Phaser.Sprite;
        point3: Phaser.Sprite;
        line1: Phaser.Sprite;
        line2: Phaser.Sprite;
        text: Phaser.Text;
        distance: number;
        radius: number;

        preload(){
            this.game.load.image("link","src/Assets/Images/HoverMenu/Link.png");
            this.game.load.image("minus","src/Assets/Images/HoverMenu/Minus.png");
            this.game.load.image("player","src/Assets/Images/HoverMenu/Player.png");
            this.game.load.image("plus","src/Assets/Images/HoverMenu/Plus.png");
            this.game.load.image("scissors","src/Assets/Images/HoverMenu/Scissors.png");
            this.game.load.image("unlink","src/Assets/Images/HoverMenu/Unlink.png");
            this.game.load.image("chance","src/Assets/Images/HoverMenu/Chance.png");
        }

        create() {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.createTextures();
            this.radius = this.game.height * INTRO_RADIUS;
            this.distance = this.game.height * INTRO_DISTANCE;
            this.createBitmapPoint();
            this.createBitmapLine();
            this.game.stage.backgroundColor = "#fff";

            this.logoGroup = this.game.add.group();
            this.logoGroup.x = this.game.width / 2 - 3 * this.distance;
            this.logoGroup.y = this.game.height / 2 - this.distance;

            this.createPoints();
            this.createLines();
            this.createText();
            this.createHoverCircle();
            this.createCell();

            this.game.time.events.add(1200, () => {
                this.game.state.start("MainScene");
            });
        }

        private createText() {
            this.text = this.game.add.text(this.point1.x + this.distance * 3, this.point1.y + this.distance / 2, "GTE", {font: "26px Arial"}, this.logoGroup);
            this.text.addColor("#f00", 1);
            this.text.addColor("#00f", 2);
            this.text.fontWeight = "bolder";
            this.text.fontSize = this.game.height * INTRO_TEXT_SIZE;
            this.text.anchor.set(0.5, 0.5);
            this.text.alpha = 0;
            this.game.add.tween(this.text).to({alpha: 1}, INTRO_TWEEN_DURATION, Phaser.Easing.Default, true);

        }

        private createLines() {
            this.line1 = this.game.add.sprite(this.point2.x, this.point2.y, this.game.cache.getBitmapData("line"), null, this.logoGroup);
            this.line1.anchor.set(0, 0.5);
            this.line2 = this.game.add.sprite(this.point1.x, this.point1.y, this.game.cache.getBitmapData("line"), null, this.logoGroup);
            this.line2.anchor.set(0, 0.5);
            this.line1.scale.set(0, 5);
            this.line2.scale.set(0, 5);
            this.line1.rotation = -Math.PI * 0.25;
            this.line2.rotation = Math.PI * 0.25;
            this.line1.tint = 0x000000;
            this.line2.tint = 0x000000;
            this.game.add.tween(this.line1.scale).to({x: this.distance * 1.44}, INTRO_TWEEN_DURATION, Phaser.Easing.Default, true, INTRO_TWEEN_DURATION * 2 + 200);
            this.game.add.tween(this.line2.scale).to({x: this.distance * 1.44}, INTRO_TWEEN_DURATION, Phaser.Easing.Default, true, INTRO_TWEEN_DURATION * 3 + 200);
        }

        private createPoints() {
            this.point1 = this.game.add.sprite(this.distance + this.radius, this.radius, this.game.cache.getBitmapData("point"), null, this.logoGroup);
            this.point2 = this.game.add.sprite(this.point1.x - this.distance, this.point1.y + this.distance, this.game.cache.getBitmapData("point"), null, this.logoGroup);
            this.point3 = this.game.add.sprite(this.point1.x + this.distance, this.point1.y + this.distance, this.game.cache.getBitmapData("point"), null, this.logoGroup);

            this.point1.anchor.set(0.5, 0.5);
            this.point2.anchor.set(0.5, 0.5);
            this.point3.anchor.set(0.5, 0.5);
            this.point1.scale.set(0, 0);
            this.point2.scale.set(0, 0);
            this.point3.scale.set(0, 0);

            this.game.add.tween(this.point1.scale).to({
                x: 1,
                y: 1
            }, INTRO_TWEEN_DURATION, Phaser.Easing.Back.Out, true, INTRO_TWEEN_DURATION + Math.random() * INTRO_TWEEN_DURATION);
            this.game.add.tween(this.point2.scale).to({
                x: 1,
                y: 1
            }, INTRO_TWEEN_DURATION, Phaser.Easing.Back.Out, true, INTRO_TWEEN_DURATION + Math.random() * INTRO_TWEEN_DURATION);
            this.game.add.tween(this.point3.scale).to({
                x: 1,
                y: 1
            }, INTRO_TWEEN_DURATION, Phaser.Easing.Back.Out, true, INTRO_TWEEN_DURATION + Math.random() * INTRO_TWEEN_DURATION);
        }

        createBitmapPoint() {
            this.bmd = this.game.make.bitmapData(this.game.height * 0.04, this.game.height * 0.04, "point", true);
            this.bmd.ctx.fillStyle = "#000000";
            this.bmd.ctx.arc(this.bmd.width / 2, this.bmd.height / 2, this.radius, 0, Math.PI * 2);
            this.bmd.ctx.fill();
        }


        createBitmapLine() {
            this.bmd = this.game.make.bitmapData(1, 1, "line", true);
            this.bmd.ctx.fillStyle = "#ffffff";
            this.bmd.ctx.fillRect(0, 0, 1, 1);
        }

        createTextures() {
            this.bmd = this.game.make.bitmapData(this.game.height * NODE_RADIUS * NODE_SCALE, this.game.height * NODE_RADIUS * NODE_SCALE, "node-square", true);
            this.bmd.ctx.fillStyle = "#fff";
            this.bmd.ctx.fillRect(0, 0, this.game.height * NODE_RADIUS * NODE_SCALE, this.game.height * NODE_RADIUS * NODE_SCALE);

            this.bmd = this.game.make.bitmapData(Math.round(this.game.height * LINE_WIDTH), Math.round(this.game.height * LINE_WIDTH), "move-line", true);
            this.bmd.ctx.fillStyle = "#fff";
            this.bmd.ctx.fillRect(0, 0, this.bmd.height, this.bmd.height);
        }

        createHoverCircle(){
            this.bmd = this.game.make.bitmapData(300,300, "hover-circle", true);
            this.bmd.ctx.fillStyle = "#ffffff";
            this.bmd.ctx.arc(this.bmd.width / 2, this.bmd.height / 2, 150, 0, Math.PI * 2);
            this.bmd.ctx.fill();
        }

        createCell(){
            let cellWidth = CELL_WIDTH*this.game.width;
            this.bmd = this.game.make.bitmapData(cellWidth,cellWidth,"cell",true);
            this.bmd.ctx.strokeStyle = "#000000";
            this.bmd.ctx.lineWidth = cellWidth*CELL_STROKE_WIDTH;
            this.bmd.ctx.strokeRect(0,0,cellWidth,cellWidth);
        }
    }
}