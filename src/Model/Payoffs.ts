
module GTE{
    /**The class Payoff which is an array of numbers*/
    export class Payoffs{

        outcomes:Array<number>;
        private playersCount:number;


        constructor(payoffs?:Array<number>){
            this.playersCount = 2;

            if(payoffs){
                this.outcomes = payoffs.slice(0);
            }
            else{
                this.outcomes = [0,0,0,0];
            }
        }

        saveFromString(payoffs:string){
            let payoffsAsStringArray = payoffs.split(" ");
            for (let i = 0; i < payoffsAsStringArray.length; i++) {
                if(i>3){
                    return;
                }
                let currentPayoff = parseFloat(payoffsAsStringArray[i]);
                if(currentPayoff){
                    this.outcomes[i] = currentPayoff;
                }
            }
        }

        setRandomPayoffs(){
            for (let i = 0; i < this.outcomes.length; i++) {
                this.outcomes[i] = Math.floor(Math.random()*21);
            }
        }

        setPlayersCount(playersCount:number){
            this.playersCount = playersCount;
        }

        convertToZeroSum(){
            if(this.playersCount === 2){
                this.outcomes[1]=-this.outcomes[0];
            }
        }

        add(payoffsToAdd:Array<number>){
            for (let i = 0; i < this.outcomes.length; i++) {
                this.outcomes[i]+=payoffsToAdd[i];
            }
        }

        round(){
            for (let i = 0; i < this.outcomes.length; i++) {
                this.outcomes[i] = parseFloat(math.format(math.round(this.outcomes[i],2)));
            }
        }

        toString(){
            let numbersToShow = [];
            for (let i = 0; i < this.playersCount; i++) {
                numbersToShow.push(this.outcomes[i]);
            }
            return numbersToShow.join(" ");
        }

        destroy(){
            this.outcomes = null;
        }
    }
}