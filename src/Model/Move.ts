///<reference path="Node.ts"/>
module GTE {
    /**The class Move which has type, from, to, label and probability */
    export class Move {
        from:Node;
        to:Node;
        label:string;
        probability:number;

        constructor(from?:Node, to?:Node){
            this.from = from;
            this.to = to;
            this.label = "asd";
        }
        /**Converts the Move to a labeled Move */
        convertToLabeled(label?:string){
            this.label = label || null;
            this.probability = null;
        }
        /**Converts to a chance move with given probabilities */
        convertToChance(probability?:number){
            this.probability = probability || 0;
            this.label = null;
        }
        /**Resets the move */
        convertToDefault(){
            this.probability = null;
            this.label = null;
        }
        /**Returns the text of the probability, depending on the current mode*/
        getProbabilityText(fractional?:boolean){
            if(fractional && this.probability!==1 && this.probability!==0){
                for (let i = 1; i < 21; i++) {
                    for (let j = i+1; j < 20; j++) {
                        if(Math.abs(i/j-this.probability)<0.00001){
                            return i + "/" + j;
                        }
                    }
                }
                return this.convertToFraction();
            }
            else{
                return (Math.round(this.probability * 100) / 100).toString();
            }
        }

        private convertToFraction(){
            let strProbability = this.probability.toString();
            let fractString = strProbability.substring(strProbability.indexOf(".")+1);
            let numerator = parseInt(fractString);
            let denominator = Math.pow(10,fractString.length);
            let gcd = this.gcd(numerator,denominator);

            return numerator/gcd + "/" + denominator/gcd;

        }

        private gcd(m:number,n:number){
            if (!n) {
                return m;
            }

            return this.gcd(n, m % n);
        }
        /**Destroy method ensures there are no memory-leaks */
        destroy(){
            this.from.childrenMoves.splice(this.from.childrenMoves.indexOf(this),1);
            this.label = null;
            this.probability = null;
        }
    }
}