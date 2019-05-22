

const lib = require("./lib/factoryworks"),
      FactoryWorks = lib.FactoryWorks;

const input = require("./test/sample2.json");

function solve (inp) {
    let work1 = new FactoryWorks();
    work1.setDurations(inp);
    let count = work1.getCycleCount();
    return {
         productionCycle: count
    }
}


console.log("SOLUTION:", solve(input));