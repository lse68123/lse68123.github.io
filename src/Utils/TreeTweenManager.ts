///<reference path="../../lib/phaser.d.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="../View/MoveView.ts"/>
///<reference path="Constants.ts"/>
///<reference path="../View/TreeViewProperties.ts"/>
module GTE {
    export class TreeTweenManager {
        game: Phaser.Game;
        oldCoordinates: Array<{x, y}>;
        properties:TreeViewProperties;

        constructor(game: Phaser.Game, properties:TreeViewProperties) {
            this.properties = properties;
            this.game = game;
        }

        startTweens(nodes: Array<NodeView>, moves: Array<MoveView>, iSets: Array<ISetView>, fractionOn:boolean) {
            let animationTimer = TREE_TWEEN_DURATION;
            moves.forEach((m:MoveView)=>{
               m.label.alpha=0;
            });

            if(!this.oldCoordinates[1] || !this.oldCoordinates[1].x){
                animationTimer = 1;
            }
            let minLength = this.oldCoordinates.length < nodes.length ? this.oldCoordinates.length : nodes.length;

            for (let i = 0; i < minLength; i++) {
                let clonedCoords = this.oldCoordinates[i];
                let newNode = nodes[i];

                //Add tween to all nodes and update moves and node labels
                if (newNode && clonedCoords && this.oldCoordinates.length > 3 && clonedCoords.x !== 0 && clonedCoords.y != 0) {
                    this.game.add.tween(newNode).from({x: clonedCoords.x,y: clonedCoords.y}, animationTimer, Phaser.Easing.Quartic.Out, true)
                        .onUpdateCallback(() => {
                        nodes.forEach(n => {
                            n.resetNodeDrawing();
                        });
                        moves.forEach(m => {
                            m.updateMovePosition();
                        });
                    });
                }
            }
            this.game.time.events.add(animationTimer+1, () => {
                nodes.forEach(n => {
                    // This if is a bug fixer if you click undo too quickly.
                    if(n && n.node) {
                        n.resetNodeDrawing();
                    }
                });
                moves.forEach(m => {
                    m.updateMovePosition();
                    m.updateLabel(this.properties.fractionOn,this.properties.levelHeight);
                    this.game.add.tween(m.label).to({alpha:1},200, Phaser.Easing.Default,true);
                });
            });
        }
    }
}