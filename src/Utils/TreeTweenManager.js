///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="Constants.ts"/>
///<reference path="../View/TreeViewProperties.ts"/>
var GTE;
(function (GTE) {
    var TreeTweenManager = (function () {
        function TreeTweenManager(game, properties) {
            this.properties = properties;
            this.game = game;
        }
        TreeTweenManager.prototype.startTweens = function (nodes, moves, iSets, fractionOn) {
            var _this = this;
            var animationTimer = GTE.TREE_TWEEN_DURATION;
            moves.forEach(function (m) {
                m.label.alpha = 0;
            });
            if (!this.oldCoordinates[1] || !this.oldCoordinates[1].x) {
                animationTimer = 1;
            }
            var minLength = this.oldCoordinates.length < nodes.length ? this.oldCoordinates.length : nodes.length;
            for (var i = 0; i < minLength; i++) {
                var clonedCoords = this.oldCoordinates[i];
                var newNode = nodes[i];
                //Add tween to all nodes and update moves and node labels
                if (newNode && clonedCoords && this.oldCoordinates.length > 3 && clonedCoords.x !== 0 && clonedCoords.y != 0) {
                    this.game.add.tween(newNode).from({ x: clonedCoords.x, y: clonedCoords.y }, animationTimer, Phaser.Easing.Quartic.Out, true)
                        .onUpdateCallback(function () {
                        nodes.forEach(function (n) {
                            n.resetNodeDrawing();
                        });
                        moves.forEach(function (m) {
                            m.updateMovePosition();
                        });
                    });
                }
            }
            this.game.time.events.add(animationTimer + 1, function () {
                nodes.forEach(function (n) {
                    // This if is a bug fixer if you click undo too quickly.
                    if (n && n.node) {
                        n.resetNodeDrawing();
                    }
                });
                moves.forEach(function (m) {
                    m.updateMovePosition();
                    m.updateLabel(_this.properties.fractionOn, _this.properties.levelHeight);
                    _this.game.add.tween(m.label).to({ alpha: 1 }, 200, Phaser.Easing.Default, true);
                });
            });
        };
        return TreeTweenManager;
    }());
    GTE.TreeTweenManager = TreeTweenManager;
})(GTE || (GTE = {}));
//# sourceMappingURL=TreeTweenManager.js.map