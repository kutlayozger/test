const input1 = require("./sample1.json"),
      input2 = require("./sample2.json");

//import {FactoryWorks, Production} from "../lib/factoryworks.js";

var lib = require("../lib/factoryworks.js"),
FactoryWorks = lib.FactoryWorks,
Production = lib.Production,
    moment = require("moment"),
    assert = require("assert");

describe('Factory Works Test', () => {
    it('Test010 Production test', () => {
        let prod1 = new Production({start: moment(), end: moment().add(3, 'days')});
        let prod2 = new Production({start: moment().add(-2, 'days'), end: moment().add(1, 'days')});
        let prod3 = new Production({start: moment().add(-5, 'days'), end: moment().add(-1, 'days')});
        console.log(`prod1: ${prod1}`);
        assert.equal(prod1.isConflict(prod2), true, 'Test010 - Assertion001')
        console.log(`prod2: ${prod2}`);
        assert.equal(prod1.isConflict(prod3), false, 'Test010 - Assertion002')
        console.log(`prod3: ${prod3}`);
        prod1.add(prod3);
        assert.equal(prod1.isConflict(prod3), true, 'Test010 - Assertion003')

    });
    it('Test020 input1 test', () => {
        let work1 = new FactoryWorks();
        work1.setDurations(input1);
        let result = work1.getCycleCount();
        assert.equal(result, 2, 'Test020 - Assertion001');
    });
    it('Test030 input2 test', () => {
        let work = new FactoryWorks();
        work.setDurations(input2);
        let result = work.getCycleCount();
        assert.equal(result, 4, 'Test030 - Assertion001');
    });
});


