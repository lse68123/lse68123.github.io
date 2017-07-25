///<reference path="Node.ts"/>
///<reference path="Move.ts"/>
///<reference path="ISet.ts"/>
///<reference path="Player.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="LabelSetter.ts"/>

module GTE {
    /**The class which stores all the needed information for the tree - lists of nodes, moves, isets, players and the root */
    export class Tree {
        root: Node;
        nodes: Array<Node>;
        moves: Array<Move>;
        iSets: Array<ISet>;
        players: Array<Player>;
        private dfsNodes:Array<Node>;
        private labelSetter: LabelSetter;

        constructor() {
            this.nodes = [];
            this.moves = [];
            this.iSets = [];
            this.players = [];
            this.labelSetter = new LabelSetter();
        }

        /** Adds a player to the list of players*/
        addPlayer(player: Player) {
            if (this.players.indexOf(player) === -1) {
                this.players.push(player);
            }
            this.resetPayoffsPlayers();
        }

        /** Removes a given player from the list, also removes all instances of the player from nodes and isets. */
        removePlayer(player: Player) {
            if (this.players.indexOf(player) !== -1) {
                this.players.splice(this.players.indexOf(player), 1);
                this.nodes.forEach(n => {
                    if (n.player === player) {
                        n.convertToDefault();
                    }
                });
                this.iSets.forEach(iSet => {
                    if (iSet.player === player) {
                        iSet.destroy();
                    }
                });
                this.resetPayoffsPlayers();
            }
        }

        /** Finds and returns the player by ID*/
        findPlayerById(id: number) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    return this.players[i];
                }
            }
            console.log("Player not found! ");
        }

        /** Adds an iSet to the list of isets */
        addISet(player: Player, nodes?: Array<Node>) {
            let iSet = new ISet(player, nodes);
            this.iSets.push(iSet);
        }

        /** Removes an iSet from the list of isets*/
        removeISet(iSet: ISet) {
            if (this.iSets.indexOf(iSet) !== -1) {
                this.iSets.splice(this.iSets.indexOf(iSet), 1);
                iSet.destroy();
            }
        }

        /** Adds node to the tree and checks if it should be the root*/
        addNode(node?: Node) {
            node = node || new Node();
            if (this.nodes.length == 0) {
                node.depth = 0;
                this.root = node;
            }

            this.nodes.push(node);
        }

        /**Removes a given node from the tree.*/
        removeNode(node: Node) {
            if (this.nodes.indexOf(node) !== -1) {
                //Remove the parent move from the tree
                if (this.moves.indexOf(node.parentMove) !== -1) {
                    this.moves.splice(this.moves.indexOf(node.parentMove), 1);
                    node.parentMove.destroy();
                }
                this.nodes.splice(this.nodes.indexOf(node), 1);

                if (node.parent && node.parent.iSet) {
                    if (node.parent.iSet.nodes.length <= 2) {
                        this.iSets.splice(this.iSets.indexOf(node.iSet), 1);
                    }
                    node.parent.iSet.removeNode(node.parent);
                }
                node.destroy();
            }
        }

        /** Adds a child to a given node*/
        addChildToNode(node: Node, child?: Node) {

            if (this.nodes.indexOf(node) === -1) {
                throw new Error("Node not found in tree");
            }

            child = child || new Node();
            node.addChild(child);
            this.nodes.push(child);
            this.moves.push(child.parentMove);
        }

        /**Depth first search on the nodes of the tree*/
        DFSOnTree(){
            this.dfsNodes = [];
            this.DFSRecursion(this.root);
            return this.dfsNodes;
        }

        private DFSRecursion(node:Node){
            this.dfsNodes.push(node);
            node.children.forEach(n=>{
               this.DFSRecursion(n);
            });
        }


        /**Breadth first search on the nodes of the tree*/
        BFSOnTree() {
            let bfsNodes: Array<Node> = [];
            let nodesQueue: Array<Node> = [];
            nodesQueue.push(this.root);
            while (nodesQueue.length > 0) {
                let current = nodesQueue.shift();
                bfsNodes.push(current);
                current.children.forEach((n => {
                    nodesQueue.push(n);
                }));
            }
            return bfsNodes;
        }

        /**Returns the number of leaves in the tree.*/
        getLeaves() {
            let leaves = [];
            this.DFSOnTree();
            this.dfsNodes.forEach(n=>{
                if(n.children.length===0){
                    leaves.push(n);
                }
            });
            return leaves;
        }

        /**A method which checks whether an information set can be created from a list of nodes.
         * If not, throws errors which are handled in the controller. Uses 4 helper methods.*/
        canCreateISet(nodes: Array<Node>) {
            // NOTE: Marked as not needed - iSets can be created without players
            // if(!this.checkIfNodesHavePlayers(nodes)){
            //     throw new Error(NODES_MISSING_PLAYERS_ERROR_TEXT);
            // }

            if (!this.checkNumberOfChildren(nodes)) {
                throw new Error(NODES_NUMBER_OF_CHILDREN_ERROR_TEXT);
            }

            // The below method will throw an error when there are 2 different players among the nodes
            // but will not throw an error if there is 1 player and some nodes without a player
            if (!this.checkIfNodesHaveTheSamePlayer(nodes)) {
                throw new Error(NODES_DIFFERENT_PLAYERS_ERROR_TEXT);
            }

            if (this.checkIfNodesSharePathToRoot(nodes)) {
                throw new Error(SAME_PATH_ON_ROOT_ERROR_TEXT);
            }
        }

        /**A method for checking whether the game has perfect recall.*/
        perfectRecallCheck() {
            for (let i = 0; i < this.iSets.length; i++) {
                let iSet = this.iSets[i];
                let iSetReachability = [];
                iSet.nodes.forEach((n: Node) => {
                    let current = n.parent;
                    let currentMove = n.parentMove;
                    while (current) {
                        if (current.player === n.player) {
                            iSetReachability.push({node:current,move:currentMove});
                        }
                        currentMove = current.parentMove;
                        current=current.parent;
                    }
                });
                console.log(iSetReachability);
                for (let j = 0; j < iSetReachability.length; j++) {
                    let pair1 = iSetReachability[j];
                    for (let k = j+1; k < iSetReachability.length; k++) {
                        let pair2 = iSetReachability[k];
                        if(pair1.node === pair2.node && pair1.move !== pair2.move){
                            throw new Error(IMPERFECT_RECALL_ERROR_TEXT);
                        }
                    }
                }
            }
        }

        checkAllNodesLabeled() {
            for (let i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].children.length !== 0 && this.players.indexOf(this.nodes[i].player) === -1) {
                    return false;
                }
            }
            return true;
        }

        removeLabels() {
            this.labelSetter.removeLabels(this.moves);
        }

        resetLabels() {
            this.labelSetter.calculateLabels(this.BFSOnTree(), this.players);
            this.resetChanceProbabilities();
        }

        private resetChanceProbabilities() {
            // Find all chance moves
            this.nodes.forEach(node => {
                let shouldReset = false;
                if (node.type === NodeType.CHANCE) {
                    let sum = 0;
                    for (let i = 0; i < node.childrenMoves.length; i++) {
                        let move = node.childrenMoves[i];
                        if (!move.probability) {
                            shouldReset = true;
                            break;
                        }
                        sum += move.probability;
                    }

                    if (shouldReset || sum !== 1) {
                        node.childrenMoves.forEach(m => {
                            m.probability = 1 / node.childrenMoves.length;
                        });
                    }
                }
            });
        }

        changeMoveLabel(move: Move, text: string) {
            if (move.from.type === NodeType.CHANCE) {
                this.chanceNodesSetProbabilities(move, text);
            }
            else {
                move.label = text;
                if (move.from.iSet !== null) {
                    let index = move.from.childrenMoves.indexOf(move);
                    move.from.iSet.nodes.forEach(n => {
                        n.childrenMoves[index].label = text;
                    });
                }
            }
        }

        resetPayoffsPlayers() {
            this.nodes.forEach(n => {
                n.payoffs.setPlayersCount(this.players.length - 1);
            });
        }

        /**Checks if all nodes have the required number of children*/
        private checkNumberOfChildren(nodes: Array<Node>): boolean {
            if (nodes[nodes.length - 1].children.length === 0) {
                return false;
            }
            for (let i = 0; i < nodes.length - 1; i++) {
                if (nodes[i].children.length !== nodes[i + 1].children.length || nodes[i].children.length === 0) {
                    return false;
                }
            }
            return true;
        }

        /**Checks if selected nodes have the same player assigned*/
        private checkIfNodesHaveTheSamePlayer(nodes: Array<Node>): boolean {
            let players = [];
            for (let i = 0; i < nodes.length; i++) {
                let node = nodes[i];
                if (node.player && players.indexOf(node.player) === -1) {
                    players.push(node.player);
                }
            }
            return players.length <= 1;
        }

        /**Checks whether any 2 nodes of an array share a path to the root.*/
        private checkIfNodesSharePathToRoot(nodes: Array<Node>): boolean {
            for (let i = 0; i < nodes.length; i++) {
                let n1 = nodes[i];
                let path1 = n1.getPathToRoot();
                for (let j = i + 1; j < nodes.length; j++) {
                    let n2 = nodes[j];
                    let path2 = n2.getPathToRoot();
                    if (path1.indexOf(n2) !== -1 || path2.indexOf(n1) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }

        /** A method which sets the probabilities of a chance node, once a new probability is set externally*/
        private chanceNodesSetProbabilities(move: Move, text: string) {
            let newProb = parseFloat(text);
            if (newProb>=0 && newProb <= 1) {
                move.probability = newProb;
                let probabilities = [];
                let currentIndex = -1;
                // Take the current index of the move and take the probabilities
                for (let i = 0; i < move.from.childrenMoves.length; i++) {
                    probabilities.push(move.from.childrenMoves[i].probability);
                    if (move === move.from.childrenMoves[i]) {
                        currentIndex = i;
                    }
                }

                // Calculate the sum of all probabilities before the given element
                let probSumBeforeCurrent = 0;
                for (let i = 0; i < currentIndex; i++) {
                    probSumBeforeCurrent += probabilities[i];
                }

                // Case 0: Borderline case - if the last element is set with total probability less than 1
                // We reset all previous elements
                if (probSumBeforeCurrent + newProb < 1 && currentIndex === probabilities.length - 1) {
                    for (let i = 0; i < currentIndex; i++) {
                        move.from.childrenMoves[i].probability = (1 - newProb) / (currentIndex);
                    }
                }
                // Case 1: Standard case - the new probabilitiy with the previous does not exceed 1
                // We set the remaining probabilities to be the average of the remaining
                else if (probSumBeforeCurrent + newProb <= 1) {
                    for (let i = currentIndex + 1; i < probabilities.length; i++) {
                        move.from.childrenMoves[i].probability = (1 - probSumBeforeCurrent - newProb) / (probabilities.length - currentIndex - 1);
                    }
                }
                // Case 2: If the previous + the current new probability exceed 1
                // We set all probabilities afterwards to be 0, and the previous will be averaged of the remaining
                else if (probSumBeforeCurrent + newProb > 1) {
                    for (let i = 0; i < currentIndex; i++) {
                        move.from.childrenMoves[i].probability = (1 - newProb) / (currentIndex);
                    }
                    for (let i = currentIndex + 1; i < probabilities.length; i++) {
                        move.from.childrenMoves[i].probability = 0;
                    }
                }
            }
        }
    }
}