var GTE;
(function (GTE) {
    /**The class Payoff which is an array of numbers*/
    var Payoffs = (function () {
        function Payoffs(payoffs) {
            this.outcomes = [];
            this.playersCount = 2;
            if (payoffs) {
                this.outcomes = payoffs.slice(0);
            }
            else {
                this.outcomes = [0, 0, 0, 0];
            }
        }
        Payoffs.prototype.loadFromString = function (payoffs) {
            var payoffsAsStringArray = payoffs.split(" ");
            for (var i = 0; i < payoffsAsStringArray.length; i++) {
                if (i > 3) {
                    return;
                }
                var currentPayoff = parseInt(payoffsAsStringArray[i]);
                if (currentPayoff) {
                    this.outcomes[i] = currentPayoff;
                }
            }
        };
        Payoffs.prototype.setRandomPayoffs = function () {
            for (var i = 0; i < this.outcomes.length; i++) {
                this.outcomes[i] = Math.floor(Math.random() * 21);
            }
        };
        Payoffs.prototype.setPlayersCount = function (playersCount) {
            this.playersCount = playersCount;
        };
        Payoffs.prototype.convertToZeroSum = function () {
            if (this.playersCount === 2) {
                this.outcomes[1] = -this.outcomes[0];
            }
        };
        Payoffs.prototype.toString = function () {
            var numbersToShow = [];
            for (var i = 0; i < this.playersCount; i++) {
                numbersToShow.push(this.outcomes[i]);
            }
            return numbersToShow.join(" ");
        };
        Payoffs.prototype.destroy = function () {
            this.outcomes = null;
        };
        return Payoffs;
    }());
    GTE.Payoffs = Payoffs;
})(GTE || (GTE = {}));
//# sourceMappingURL=Payoffs.js.map