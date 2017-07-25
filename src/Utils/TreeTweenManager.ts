///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="Constants.ts"/>
module GTE {
    export class TreeTweenManager {
        game: Phaser.Game;
        oldCoordinates: Array<{x, y}>;

        constructor(game: Phaser.Game) {
            this.game = game;
        }

        startTweens(nodes: Array<NodeView>, moves: Array<MoveView>, iSets: Array<ISetView>) {
            let minLength = this.oldCoordinates.length < nodes.length ? this.oldCoordinates.length : nodes.length;
            for (let i = 0; i < minLength; i++) {
                let clonedCoords = this.oldCoordinates[i];
                let newNode = nodes[i];

                //Add tween to all nodes and update moves and node labels
                if (newNode && clonedCoords && this.oldCoordinates.length > 3 && clonedCoords.x !== 0 && clonedCoords.y != 0) {
                    this.game.add.tween(newNode).from({x: clonedCoords.x,y: clonedCoords.y}, TREE_TWEEN_DURATION, Phaser.Easing.Cubic.Out, true).onUpdateCallback(() => {
                        nodes.forEach(n => {
                            n.updateLabelPosition();
                        });
                        moves.forEach(m => {
                            m.updateMovePosition();
                        });
                    });
                }
                // Add tween to iSets in a clever way
                iSets.forEach(iSet => {
                    iSet.alpha = 0;
                    this.game.add.tween(iSet).to({alpha:0.15}, TREE_TWEEN_DURATION, Phaser.Easing.Cubic.Out, true);
                });


            }
            this.game.time.events.add(601, () => {
                nodes.forEach(n => {
                    // This if is a bug fixer if you click undo too quickly.
                    if(n && n.node) {
                        n.updateLabelPosition();
                    }
                });
                moves.forEach(m => {
                    m.updateMovePosition();
                });
            });
        }
    }
}