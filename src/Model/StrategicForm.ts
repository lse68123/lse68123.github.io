///<reference path="Tree.ts"/>
///<reference path="Node.ts"/>
///<reference path="Move.ts"/>
module GTE {
    /**The class which will calculate the strategic form from the given tree */
    export class StrategicForm {
        tree: Tree;

        strategies: Array<Array<string>>;
        p1Strategies: Array<Array<Move>>;
        p2Strategies: Array<Array<Move>>;

        constructor(tree: Tree) {
            this.tree = tree;
            this.strategies = [];
            this.strategies[0] = [];
            this.strategies[1] = [];

            this.generateStrategicForm();
        }

        /**Generates the strategic form, which is stored in two arrays of strategies for P1 and P2*/
        generateStrategicForm() {
            this.checkStrategicFormPossible();

            // The order of information sets is breadth-first. If at some point we wish to change this - swap with dfs.
            let nodes = this.tree.DFSOnTree();
            let p1InfoSets = [];
            let p2InfoSets = [];

            //Get all P1 and P2 information sets and singletons separated from the DFS order.
            nodes.forEach(n => {
                if (n.player === this.tree.players[1]) {
                    if (n.iSet && p1InfoSets.indexOf(n.iSet) === -1) {
                        p1InfoSets.push(n.iSet);
                    }
                    else if (!n.iSet) {
                        p1InfoSets.push(n);
                    }
                }
                else if (n.player === this.tree.players[2]) {
                    if (n.iSet && p2InfoSets.indexOf(n.iSet) === -1) {
                        p2InfoSets.push(n.iSet);
                    }
                    else if (!n.iSet) {
                        p2InfoSets.push(n);
                    }
                }
            });

            this.p1Strategies = [];
            this.p2Strategies = [];
            this.generateStrategies(p1InfoSets);
            this.generateStrategies(p2InfoSets);
            // this.strategyToString(this.p1Strategies);
            // this.strategyToString(this.p2Strategies);

        }

        /**A method which generates the strategies for a specific player, given his collection of iSets*/
        generateStrategies(infoSets: Array<any>) {
            let currentStrategy = [];
            this.recurseStrategies(infoSets, 0, currentStrategy);
        }

        // We create combinations of all moves, given their specific slot (index) which corresponds to the current
        // node or an information set we are looking at. "Strategy" stores the moves that are played in the recursion.
        private recurseStrategies(infoSets, index, strategy) {
            // If we have reached the last slot for the combinations, save it and go back in the recursion.
            if (index === infoSets.length) {
                if (infoSets[0].player === this.tree.players[1]) {
                    this.p1Strategies.push(strategy.slice(0));
                }
                else if (infoSets[0].player === this.tree.players[2]) {
                    this.p2Strategies.push(strategy.slice(0));
                }
                return;
            }

            //Depending on whether the current iSet is a singleton (node) or not, we take the moves and save the nodes
            // of the iSet in an array
            let currentISet;
            let moves = [];

            if (infoSets[index] instanceof Node) {
                currentISet = [infoSets[index]];
                moves = currentISet[0].childrenMoves;
            }
            else if (infoSets[index] instanceof ISet) {
                currentISet = infoSets[index].nodes;
                moves = currentISet[0].childrenMoves;
            }

            // We perform a check of whether the node is reachable from the previously played moves by the player
            let isReachable = false;
            if (index !== 0) {
                let nonNullIndex = this.findFirstNonNullIndex(strategy, index);
                let nodesToCheckReachability = [];
                let lastEarlierMove: Move = strategy[nonNullIndex];

                if (lastEarlierMove.from.iSet === null) {
                    nodesToCheckReachability = [lastEarlierMove.to];
                }
                else {
                    let earlierMoveIndex = lastEarlierMove.from.childrenMoves.indexOf(lastEarlierMove);
                    for (let i = 0; i < lastEarlierMove.from.iSet.nodes.length; i++) {
                        nodesToCheckReachability.push(lastEarlierMove.from.iSet.nodes[i].childrenMoves[earlierMoveIndex].to);
                    }
                }

                isReachable = this.isReachable(currentISet, nodesToCheckReachability);
            }
            // If the move is the first that a player has played or is reachable, we save it to "strategies" and move on
            if (this.isFirstMove(currentISet[0]) || isReachable) {
                for (let i = 0; i < moves.length; i++) {
                    strategy.push(moves[i]);
                    this.recurseStrategies(infoSets, index + 1, strategy);
                    strategy.pop();
                }
            }
            // If the move is not reachable, we push "null" which will later be transformed into a "*"
            else {
                strategy.push(null);
                this.recurseStrategies(infoSets, index + 1, strategy);
                strategy.pop();
            }
        }

        // A helper method for the recursion
        private isFirstMove(node: Node) {
            let current = node.parent;
            while (current) {
                if (current.player === node.player) {
                    return false;
                }
                current = current.parent;
            }
            return true;
        }

        // A helper method for the recursion
        private findFirstNonNullIndex(strategy, index) {
            for (let i = index - 1; i >= 0; i--) {
                if (strategy[i]) {
                    return i;
                }
            }
            return 0;
        }

        // From is the "lower" (in terms of the tree) move
        isReachable(from: Array<Node>, to: Array<Node>) {
            for (let i = 0; i < from.length; i++) {
                let fromNode = from[i];
                for (let j = 0; j < to.length; j++) {
                    let toNode = to[j];
                    if (this.checkTwoNodesReachable(fromNode, toNode)) {
                        return true;
                    }
                }
            }
            return false;
        }

        private checkTwoNodesReachable(from: Node, to: Node) {
            // current is the node of the move we start from
            let current: Node = from;
            while (current.parent) {
                if (current.parent === to) {
                    return true;
                }
                current = current.parent;
            }
            return false;
        }

        checkStrategicFormPossible() {
            if (this.tree.players.length !== 3) {
                throw new Error(STRATEGIC_PLAYERS_ERROR_TEXT);
            }
            this.tree.perfectRecallCheck();
        }



        strategyToString(strategies) {
            let strategyAsString = [];
            for (let i = 0; i < strategies.length; i++) {
                let str = "";
                for (let j = 0; j < strategies[i].length; j++) {
                    let current = strategies[i][j];
                    if (current) {
                        str += current.label + ",";
                    }
                    else {
                        str += "*,";
                    }

                }
                strategyAsString.push(str.substring(0,str.length-1));
            }
            return strategyAsString;
        }

        destroy(){
            this.p1Strategies = null;
            this.p2Strategies = null;
            this.strategies = null;
        }
    }
}
