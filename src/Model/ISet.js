/// <reference path = "../../lib/phaser.d.ts"/>
///<reference path="Player.ts"/>
///<reference path="Node.ts"/>
var GTE;
(function (GTE) {
    /**The class that represents the ISet. The ISet has player, array storing all nodes, and a label */
    var ISet = (function () {
        function ISet(player, nodes) {
            var _this = this;
            this.player = player;
            this.nodes = [];
            this.label = "";
            if (nodes) {
                nodes.forEach(function (n) {
                    _this.addNode(n);
                    // n.convertToLabeled(this.player);
                });
            }
        }
        ISet.prototype.addNode = function (node) {
            if (this.player && node.player && node.player !== this.player) {
                throw new Error("ISet player is different from node player!");
            }
            if (this.player && !node.player) {
                node.player = this.player;
            }
            if (this.nodes.indexOf(node) === -1) {
                this.nodes.push(node);
                node.iSet = this;
            }
        };
        ISet.prototype.removeNode = function (node) {
            if (this.nodes.indexOf(node) !== -1) {
                this.nodes.splice(this.nodes.indexOf(node), 1);
                node.iSet = null;
            }
        };
        ISet.prototype.changePlayer = function (player) {
            this.player = player;
            this.nodes.forEach(function (n) {
                n.convertToLabeled(player);
            });
        };
        ISet.prototype.addLabel = function (label) {
            this.label = label;
        };
        ISet.prototype.removeLabel = function () {
            this.label = "";
        };
        /**The destroy method ensures that there are no memory-leaks */
        ISet.prototype.destroy = function () {
            this.player = null;
            this.nodes.forEach(function (n) { n.iSet = null; });
            this.nodes = [];
            this.nodes = null;
        };
        return ISet;
    }());
    GTE.ISet = ISet;
})(GTE || (GTE = {}));
//# sourceMappingURL=ISet.js.map