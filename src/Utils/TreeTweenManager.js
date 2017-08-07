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
            if (!this.oldCoordinates[1].x) {
                animationTimer = 1;
            }
            var minLength = this.oldCoordinates.length < nodes.length ? this.oldCoordinates.length : nodes.length;
            for (var i = 0; i < minLength; i++) {
                var clonedCoords = this.oldCoordinates[i];
                var newNode = nodes[i];
                //Add tween to all nodes and update moves and node labels
                if (newNode && clonedCoords && this.oldCoordinates.length > 3 && clonedCoords.x !== 0 && clonedCoords.y != 0) {
                    this.game.add.tween(newNode).from({ x: clonedCoords.x, y: clonedCoords.y }, animationTimer, Phaser.Easing.Cubic.Out, true)
                        .onUpdateCallback(function () {
                        nodes.forEach(function (n) {
                            n.resetNodeDrawing();
                        });
                        moves.forEach(function (m) {
                            m.updateMovePosition();
                        });
                    });
                }
                // Add tween to iSets in a clever way
                iSets.forEach(function (iSet) {
                    iSet.alpha = 0;
                    _this.game.add.tween(iSet).to({ alpha: 0.15 }, animationTimer, Phaser.Easing.Cubic.Out, true);
                });
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
                });
            });
        };
        return TreeTweenManager;
    }());
    GTE.TreeTweenManager = TreeTweenManager;
})(GTE || (GTE = {}));
//# sourceMappingURL=TreeTweenManager.js.map