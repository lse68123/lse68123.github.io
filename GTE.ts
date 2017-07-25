/// <reference path = "lib/phaser.d.ts"/>
///<reference path="src/Controller/Boot.ts"/>
///<reference path="src/Controller/MainScene.ts"/>
///<reference path="src/Menus/TopMenu/TopMenu.ts"/>

module GTE {
    class GTE extends Phaser.Game {
        game: Phaser.Game;

        constructor(width?: number, height?: number) {

            super(width, height, Phaser.CANVAS, 'phaser-div', null, false, true);

            this.game = this;
            this.game.state.add("Boot", Boot, false);
            this.game.state.add("MainScene", MainScene, false);
            this.game.state.start("Boot");
        }
    }

    window.onload = () => {
        let width = window.innerWidth * devicePixelRatio;
        let height = window.innerHeight * devicePixelRatio;
        if (width > 1920) {
            width = 1920;
            height = 1920 / window.innerWidth * window.innerHeight;
        }
        new GTE(width, height);
    }
}