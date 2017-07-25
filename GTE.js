/// <reference path = "lib/phaser.d.ts"/>
///<reference path="src/Controller/Boot.ts"/>
///<reference path="src/Controller/MainScene.ts"/>
///<reference path="src/Menus/TopMenu/TopMenu.ts"/>
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
var GTE;
(function (GTE_1) {
    var GTE = (function (_super) {
        __extends(GTE, _super);
        function GTE(width, height) {
            var _this = _super.call(this, width, height, Phaser.CANVAS, 'phaser-div', null, false, true) || this;
            _this.game = _this;
            _this.game.state.add("Boot", GTE_1.Boot, false);
            _this.game.state.add("MainScene", GTE_1.MainScene, false);
            _this.game.state.start("Boot");
            return _this;
        }
        return GTE;
    }(Phaser.Game));
    window.onload = function () {
        var width = window.innerWidth * devicePixelRatio;
        var height = window.innerHeight * devicePixelRatio;
        if (width > 1920) {
            width = 1920;
            height = 1920 / window.innerWidth * window.innerHeight;
        }
        new GTE(width, height);
    };
})(GTE || (GTE = {}));
//# sourceMappingURL=GTE.js.map