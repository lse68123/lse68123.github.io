///<reference path="Node.ts"/>
///<reference path="Move.ts"/>
///<reference path="ISet.ts"/>
///<reference path="Player.ts"/>
///<reference path="../Utils/Constants.ts"/>
///<reference path="LabelSetter.ts"/>
var GTE;
(function (GTE) {
    /**The class which stores all the needed information for the tree - lists of nodes, moves, isets, players and the root */
    var Tree = (function () {
        function Tree() {
            this.nodes = [];
            this.moves = [];
            this.iSets = [];
            this.players = [];
            this.labelSetter = new GTE.LabelSetter();
        }
        /** Adds a player to the list of players*/
        Tree.prototype.addPlayer = function (player) {
            if (this.players.indexOf(player) === -1) {
                this.players.push(player);
            }
            this.resetPayoffsPlayers();
        };
        /** Removes a given player from the list, also removes all instances of the player from nodes and isets. */
        Tree.prototype.removePlayer = function (player) {
            if (this.players.indexOf(player) !== -1) {
                this.players.splice(this.players.indexOf(player), 1);
                this.nodes.forEach(function (n) {
                    if (n.player === player) {
                        n.convertToDefault();
                    }
                });
                this.iSets.forEach(function (iSet) {
                    if (iSet.player === player) {
                        iSet.destroy();
                    }
                });
                this.resetPayoffsPlayers();
            }
        };
        /** Finds and returns the player by ID*/
        Tree.prototype.findPlayerById = function (id) {
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    return this.players[i];
                }
            }
            console.log("Player not found! ");
        };
        /** Adds an iSet to the list of isets */
        Tree.prototype.addISet = function (player, nodes) {
            var iSet = new GTE.ISet(player, nodes);
            this.iSets.push(iSet);
        };
        /** Removes an iSet from the list of isets*/
        Tree.prototype.removeISet = function (iSet) {
            if (this.iSets.indexOf(iSet) !== -1) {
                this.iSets.splice(this.iSets.indexOf(iSet), 1);
                iSet.destroy();
            }
        };
        /** Adds node to the tree and checks if it should be the root*/
        Tree.prototype.addNode = function (node) {
            node = node || new GTE.Node();
            if (this.nodes.length == 0) {
                node.depth = 0;
                this.root = node;
            }
            this.nodes.push(node);
        };
        /**Removes a given node from the tree.*/
        Tree.prototype.removeNode = function (node) {
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
        };
        /** Adds a child to a given node*/
        Tree.prototype.addChildToNode = function (node, child) {
            if (this.nodes.indexOf(node) === -1) {
                throw new Error("Node not found in tree");
            }
            child = child || new GTE.Node();
            node.addChild(child);
            this.nodes.push(child);
            this.moves.push(child.parentMove);
        };
        /**Depth first search on the nodes of the tree*/
        Tree.prototype.DFSOnTree = function () {
            this.dfsNodes = [];
            this.DFSRecursion(this.root);
            return this.dfsNodes;
        };
        Tree.prototype.DFSRecursion = function (node) {
            var _this = this;
            this.dfsNodes.push(node);
            node.children.forEach(function (n) {
                _this.DFSRecursion(n);
            });
        };
        /**Breadth first search on the nodes of the tree*/
        Tree.prototype.BFSOnTree = function () {
            var bfsNodes = [];
            var nodesQueue = [];
            nodesQueue.push(this.root);
            while (nodesQueue.length > 0) {
                var current = nodesQueue.shift();
                bfsNodes.push(current);
                current.children.forEach((function (n) {
                    nodesQueue.push(n);
                }));
            }
            return bfsNodes;
        };
        /**Returns the number of leaves in the tree.*/
        Tree.prototype.getLeaves = function () {
            var leaves = [];
            this.DFSOnTree();
            this.dfsNodes.forEach(function (n) {
                if (n.children.length === 0) {
                    leaves.push(n);
                }
            });
            return leaves;
        };
        /**A method which checks whether an information set can be created from a list of nodes.
         * If not, throws errors which are handled in the controller. Uses 4 helper methods.*/
        Tree.prototype.canCreateISet = function (nodes) {
            // NOTE: Marked as not needed - iSets can be created without players
            // if(!this.checkIfNodesHavePlayers(nodes)){
            //     throw new Error(NODES_MISSING_PLAYERS_ERROR_TEXT);
            // }
            if (!this.checkNumberOfChildren(nodes)) {
                throw new Error(GTE.NODES_NUMBER_OF_CHILDREN_ERROR_TEXT);
            }
            // The below method will throw an error when there are 2 different players among the nodes
            // but will not throw an error if there is 1 player and some nodes without a player
            if (!this.checkIfNodesHaveTheSamePlayer(nodes)) {
                throw new Error(GTE.NODES_DIFFERENT_PLAYERS_ERROR_TEXT);
            }
            if (this.checkIfNodesSharePathToRoot(nodes)) {
                throw new Error(GTE.SAME_PATH_ON_ROOT_ERROR_TEXT);
            }
        };
        /**A method for checking whether the game has perfect recall.*/
        Tree.prototype.perfectRecallCheck = function () {
            var _loop_1 = function (i) {
                var iSet = this_1.iSets[i];
                var iSetReachability = [];
                iSet.nodes.forEach(function (n) {
                    var current = n.parent;
                    var currentMove = n.parentMove;
                    while (current) {
                        if (current.player === n.player) {
                            iSetReachability.push({ node: current, move: currentMove });
                        }
                        currentMove = current.parentMove;
                        current = current.parent;
                    }
                });
                console.log(iSetReachability);
                for (var j = 0; j < iSetReachability.length; j++) {
                    var pair1 = iSetReachability[j];
                    for (var k = j + 1; k < iSetReachability.length; k++) {
                        var pair2 = iSetReachability[k];
                        if (pair1.node === pair2.node && pair1.move !== pair2.move) {
                            throw new Error(GTE.IMPERFECT_RECALL_ERROR_TEXT);
                        }
                    }
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.iSets.length; i++) {
                _loop_1(i);
            }
        };
        Tree.prototype.checkAllNodesLabeled = function () {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].children.length !== 0 && this.players.indexOf(this.nodes[i].player) === -1) {
                    return false;
                }
            }
            return true;
        };
        Tree.prototype.removeLabels = function () {
            this.labelSetter.removeLabels(this.moves);
        };
        Tree.prototype.resetLabels = function () {
            this.labelSetter.calculateLabels(this.BFSOnTree(), this.players);
            this.resetChanceProbabilities();
        };
        Tree.prototype.resetChanceProbabilities = function () {
            // Find all chance moves
            this.nodes.forEach(function (node) {
                var shouldReset = false;
                if (node.type === GTE.NodeType.CHANCE) {
                    var sum = 0;
                    for (var i = 0; i < node.childrenMoves.length; i++) {
                        var move = node.childrenMoves[i];
                        if (!move.probability) {
                            shouldReset = true;
                            break;
                        }
                        sum += move.probability;
                    }
                    if (shouldReset || sum !== 1) {
                        node.childrenMoves.forEach(function (m) {
                            m.probability = 1 / node.childrenMoves.length;
                        });
                    }
                }
            });
        };
        Tree.prototype.changeMoveLabel = function (move, text) {
            if (move.from.type === GTE.NodeType.CHANCE) {
                this.chanceNodesSetProbabilities(move, text);
            }
            else {
                move.label = text;
                if (move.from.iSet !== null) {
                    var index_1 = move.from.childrenMoves.indexOf(move);
                    move.from.iSet.nodes.forEach(function (n) {
                        n.childrenMoves[index_1].label = text;
                    });
                }
            }
        };
        Tree.prototype.resetPayoffsPlayers = function () {
            var _this = this;
            this.nodes.forEach(function (n) {
                n.payoffs.setPlayersCount(_this.players.length - 1);
            });
        };
        /**Checks if all nodes have the required number of children*/
        Tree.prototype.checkNumberOfChildren = function (nodes) {
            if (nodes[nodes.length - 1].children.length === 0) {
                return false;
            }
            for (var i = 0; i < nodes.length - 1; i++) {
                if (nodes[i].children.length !== nodes[i + 1].children.length || nodes[i].children.length === 0) {
                    return false;
                }
            }
            return true;
        };
        /**Checks if selected nodes have the same player assigned*/
        Tree.prototype.checkIfNodesHaveTheSamePlayer = function (nodes) {
            var players = [];
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.player && players.indexOf(node.player) === -1) {
                    players.push(node.player);
                }
            }
            return players.length <= 1;
        };
        /**Checks whether any 2 nodes of an array share a path to the root.*/
        Tree.prototype.checkIfNodesSharePathToRoot = function (nodes) {
            for (var i = 0; i < nodes.length; i++) {
                var n1 = nodes[i];
                var path1 = n1.getPathToRoot();
                for (var j = i + 1; j < nodes.length; j++) {
                    var n2 = nodes[j];
                    var path2 = n2.getPathToRoot();
                    if (path1.indexOf(n2) !== -1 || path2.indexOf(n1) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        };
        /** A method which sets the probabilities of a chance node, once a new probability is set externally*/
        Tree.prototype.chanceNodesSetProbabilities = function (move, text) {
            var newProb = parseFloat(text);
            if (newProb >= 0 && newProb <= 1) {
                move.probability = newProb;
                var probabilities = [];
                var currentIndex = -1;
                // Take the current index of the move and take the probabilities
                for (var i = 0; i < move.from.childrenMoves.length; i++) {
                    probabilities.push(move.from.childrenMoves[i].probability);
                    if (move === move.from.childrenMoves[i]) {
                        currentIndex = i;
                    }
                }
                // Calculate the sum of all probabilities before the given element
                var probSumBeforeCurrent = 0;
                for (var i = 0; i < currentIndex; i++) {
                    probSumBeforeCurrent += probabilities[i];
                }
                // Case 0: Borderline case - if the last element is set with total probability less than 1
                // We reset all previous elements
                if (probSumBeforeCurrent + newProb < 1 && currentIndex === probabilities.length - 1) {
                    for (var i = 0; i < currentIndex; i++) {
                        move.from.childrenMoves[i].probability = (1 - newProb) / (currentIndex);
                    }
                }
                else if (probSumBeforeCurrent + newProb <= 1) {
                    for (var i = currentIndex + 1; i < probabilities.length; i++) {
                        move.from.childrenMoves[i].probability = (1 - probSumBeforeCurrent - newProb) / (probabilities.length - currentIndex - 1);
                    }
                }
                else if (probSumBeforeCurrent + newProb > 1) {
                    for (var i = 0; i < currentIndex; i++) {
                        move.from.childrenMoves[i].probability = (1 - newProb) / (currentIndex);
                    }
                    for (var i = currentIndex + 1; i < probabilities.length; i++) {
                        move.from.childrenMoves[i].probability = 0;
                    }
                }
            }
        };
        return Tree;
    }());
    GTE.Tree = Tree;
})(GTE || (GTE = {}));
//# sourceMappingURL=Tree.js.map