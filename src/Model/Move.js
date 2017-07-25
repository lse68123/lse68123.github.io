///<reference path="Node.ts"/>
var GTE;
(function (GTE) {
    /**The class Move which has type, from, to, label and probability */
    var Move = (function () {
        function Move(from, to) {
            this.from = from;
            this.to = to;
            this.label = "asd";
        }
        /**Converts the Move to a labeled Move */
        Move.prototype.convertToLabeled = function (label) {
            this.label = label || null;
            this.probability = null;
        };
        /**Converts to a chance move with given probabilities */
        Move.prototype.convertToChance = function (probability) {
            this.probability = probability || 0;
            this.label = null;
        };
        /**Resets the move */
        Move.prototype.convertToDefault = function () {
            this.probability = null;
            this.label = null;
        };
        /**Returns the text of the probability, depending on the current mode*/
        Move.prototype.getProbabilityText = function (fractional) {
            if (fractional && this.probability !== 1 && this.probability !== 0) {
                for (var i = 1; i < 21; i++) {
                    for (var j = i + 1; j < 20; j++) {
                        if (Math.abs(i / j - this.probability) < 0.00001) {
                            return i + "/" + j;
                        }
                    }
                }
                return this.convertToFraction();
            }
            else {
                return (Math.round(this.probability * 100) / 100).toString();
            }
        };
        Move.prototype.convertToFraction = function () {
            var strProbability = this.probability.toString();
            var fractString = strProbability.substring(strProbability.indexOf(".") + 1);
            var numerator = parseInt(fractString);
            var denominator = Math.pow(10, fractString.length);
            var gcd = this.gcd(numerator, denominator);
            return numerator / gcd + "/" + denominator / gcd;
        };
        Move.prototype.gcd = function (m, n) {
            if (!n) {
                return m;
            }
            return this.gcd(n, m % n);
        };
        /**Destroy method ensures there are no memory-leaks */
        Move.prototype.destroy = function () {
            this.from.childrenMoves.splice(this.from.childrenMoves.indexOf(this), 1);
            this.label = null;
            this.probability = null;
        };
        return Move;
    }());
    GTE.Move = Move;
})(GTE || (GTE = {}));
//# sourceMappingURL=Move.js.map