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
///<reference path="../Model/ISet.ts"/>
///<reference path="NodeView.ts"/>
///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../Utils/Constants.ts"/>
var GTE;
(function (GTE) {
    /**A class for drawing the iSet */
    var ISetView = (function (_super) {
        __extends(ISetView, _super);
        function ISetView(game, iSet, nodes) {
            var _this = _super.call(this, game, 0, 0, "") || this;
            _this.game = game;
            _this.iSet = iSet;
            _this.nodes = nodes;
            _this.sortNodesLeftToRight();
            _this.createSimpleISet();
            _this.label = _this.game.add.text(_this.nodes[0].x, _this.nodes[0].y, "", null);
            _this.inputEnabled = true;
            _this.input.priorityID = 100;
            _this.input.pixelPerfectClick = true;
            _this.input.pixelPerfectOver = true;
            _this.events.onInputOver.dispatch(_this);
            return _this;
        }
        ISetView.prototype.removeNode = function (nodeV) {
            if (this.nodes.indexOf(nodeV) !== -1) {
                this.nodes.splice(this.nodes.indexOf(nodeV), 1);
            }
        };
        /**Sorts the nodes left to right before drawing*/
        ISetView.prototype.sortNodesLeftToRight = function () {
            this.nodes.sort(function (n1, n2) {
                return n1.x <= n2.x ? -1 : 1;
            });
        };
        /**Create e very thick line that goes through all the points*/
        ISetView.prototype.createSimpleISet = function () {
            this.bmd = this.game.make.bitmapData(this.game.width, this.game.height);
            this.bmd.ctx.lineWidth = this.game.height * GTE.ISET_LINE_WIDTH;
            this.bmd.ctx.lineCap = "round";
            this.bmd.ctx.lineJoin = "round";
            this.bmd.ctx.strokeStyle = "#ffffff";
            this.bmd.ctx.beginPath();
            this.bmd.ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
            for (var i = 1; i < this.nodes.length; i++) {
                this.bmd.ctx.lineTo(this.nodes[i].x, this.nodes[i].y);
            }
            this.bmd.ctx.stroke();
            this.loadTexture(this.bmd);
            this.game.add.existing(this);
            if (this.iSet.player) {
                this.tint = this.iSet.player.color;
            }
            else {
                this.tint = 0x000000;
            }
            this.alpha = 0.15;
        };
        ISetView.prototype.destroy = function () {
            this.bmd.destroy();
            this.bmd = null;
            this.nodes = [];
            this.nodes = null;
            _super.prototype.destroy.call(this, true);
        };
        return ISetView;
    }(Phaser.Sprite));
    GTE.ISetView = ISetView;
})(GTE || (GTE = {}));
//# sourceMappingURL=ISetView.js.map