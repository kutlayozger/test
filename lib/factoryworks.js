
const moment = require("moment");

/*** Class Production is special linked list for conditional adding 
 *  For documentation (jsdoc etc should be formated)
***/
class Production {
    constructor ({start, end}) {
        this.start = start;
        this.end = end;
        this.min = start;
        this.max = end;
        this.next = null;
    }    
    isConflict (prod) {
        if (prod.end.diff(this.min, 'days') <= 0 || prod.start.diff(this.max, 'days') >= 0) {
            return false;
        }            
        console.log(`${prod} conflicted with ${this}`, prod.end.diff(this.start, 'days'), prod.start.diff(this.end, 'days'));
        return true;
    }
    add (prod) {
        let p = this;
        while (p.next) {
            p = p.next;
        }
        p.next = prod;
        if (prod.start.diff(this.min) < 0) {
            this.min = prod.start;
        }
        if (prod.end.diff(this.max) > 0) {
            this.max = prod.end;
        }
        console.log(" added", this.toString())
    }
    toString () {
        return `${this.min.format('DD.MM')} - ${this.max.format('DD.MM')}`;
    }
}

/*** Class CycleManager manages Cycles add production to list
 *  For documentation (jsdoc etc should be formated)
***/
class CycleManager {
    constructor () {
        this.prods = [];
    }
    addCycle(newProd) {
        let added = false;
        console.log(`adding new ${newProd} production Current Cycle count:${this.length()}`);
        this.prods.forEach((prod) => {
            let p = prod, canAdd = true;
            do {
                if (p.isConflict(newProd)) {
                    canAdd = false;
                }
                p = p.next;
            } while (p != null);
            if (canAdd && !added) {
                console.log(`${newProd} added to ${prod}`);
                prod.add(newProd);
                added = true;
            }
        });
        if (!added) {
            this.prods.push(newProd);
        }
    }
    length () {
        return this.prods.length;
    }
}

/*** Class Factory works class sets inputs to cycleManager ...
 *  For documentation (jsdoc etc should be formated)
***/
class FactoryWorks {
    constructor(inpArray) {
        this.jobArray = [];
        this.cycles = new CycleManager();
        if (inpArray) {
            this.setDurations(inpArray);
        }
    }
    setDurations (durations) {
        durations = durations.sort((proda, prodb) => {
            return prodb.duration - proda.duration;
        });
        durations.forEach((duration) => {
            this.add(duration);
        });
    }
    add (duration) {
        if (this.checkConstraints(duration)) {
            this.jobArray.push(duration);
            let cycle = new Production({start: moment(duration.startingDay), end: moment(duration.startingDay).add(duration.duration - 1, 'days')});
            this.cycles.addCycle(cycle);

        } else {
            console.error(`${duration.startingDay} - ${duration.duration} is not valid. Not added`);
        }
    }
    checkConstraints (duration) {
        return duration.startingDay < moment().format() && duration.duration > 0 && this.jobArray.length < 100000;
    }
    getCycleCount () {
        return this.cycles.length();
    }
}


module.exports = {FactoryWorks: FactoryWorks, Production: Production};
