const getSums = (bangers)=>{
    const sums = [];
    let bangerIndex = 0;
    while(bangerIndex < bangers.length){
        const banger = bangers[bangerIndex];
        sums.push(banger.interval);
        bangerIndex += 1;
    }
    return sums;
};
class Timestep {
    constructor(bangers1){
        this.bangers = bangers1;
        this.step = -1;
        this.delta = -1;
        this.receipt = -1;
        this.status = "STOPPED";
        this.sums = getSums(this.bangers);
    }
    start() {
        if (this.status === "STARTED") {
            return;
        }
        this.status = "STARTED";
        this.sums = getSums(this.bangers);
        this.receipt = window.requestAnimationFrame(this.integrate);
    }
    stop() {
        window.cancelAnimationFrame(this.receipt);
        this.status = "STOPPED";
    }
    updateBangers(bangers) {
        if (this.status === "STARTED") {
            return;
        }
        this.bangers = bangers;
        this.step = -1;
        this.delta = -1;
        this.receipt = -1;
        this.sums = getSums(this.bangers);
    }
    integrate = ()=>{
        const currStep = performance.now();
        let delta = currStep - this.step;
        this.step = currStep;
        for(const bangerID in this.bangers){
            const banger = this.bangers[bangerID];
            const interval = banger.interval;
            if (delta > interval) {
                delta = interval;
            }
            this.sums[bangerID] -= delta;
            if (this.sums[bangerID] < 0) {
                const alpha = -1 * this.sums[bangerID] / interval;
                this.sums[bangerID] += interval;
                banger.bang(alpha);
            }
        }
        this.receipt = window.requestAnimationFrame(this.integrate);
    };
}
const title = "reckon:timestep";
const sleep = (ms)=>{
    return new Promise((resolve)=>window.setTimeout(resolve, ms)
    );
};
const getBangerSums = ()=>{
    const assertions = [];
    const fps12 = 1 / 12 * 1000;
    const fps8 = 1 / 12 * 1000;
    const bang = (alpha)=>{
    };
    const timeBangers = [
        {
            interval: fps12,
            bang
        },
        {
            interval: fps8,
            bang
        }, 
    ];
    const sums = getSums(timeBangers);
    if (sums[0] !== fps12) {
        assertions.push("initial sums for index 0 should be 12fps");
    }
    if (sums[1] !== fps8) {
        assertions.push("initial sums for index 1 should be 8fps");
    }
    return assertions;
};
const startAndStopTimestep = ()=>{
    const assertions = [];
    const fps12 = 1 / 12 * 1000;
    const bang = (alpha)=>{
    };
    const timeBangers = [
        {
            interval: fps12,
            bang
        }, 
    ];
    const timestep = new Timestep(timeBangers);
    if (timestep.status !== "STOPPED") {
        assertions.push("timestep should be initially stopped");
    }
    timestep.start();
    if (timestep.status !== "STARTED") {
        assertions.push("timestep should be started after start()");
    }
    timestep.stop();
    if (timestep.status !== "STOPPED") {
        assertions.push("timestep should be finally stopped");
    }
    return assertions;
};
const timestepOneTrackForOneSecond = async ()=>{
    const assertions = [];
    let count = 0;
    const fps12 = 1 / 12 * 1000;
    const bang = (alpha)=>{
        count += 1;
    };
    const timeBangers = [
        {
            interval: fps12,
            bang
        }, 
    ];
    const timestep = new Timestep(timeBangers);
    timestep.start();
    await sleep(1000);
    timestep.stop();
    if (count === 0) {
        assertions.push("there should be more than 0 count");
    }
    if (count === 1) {
        assertions.push("there should be more than 1 count");
    }
    if (count < 9) {
        assertions.push("count should be around 12 fps but definitely more than 15.");
    }
    if (count > 15) {
        assertions.push("count should be around 12 fps but definitely less than 15.");
    }
    return assertions;
};
const timestepTwoTracksForOneSecond = async ()=>{
    const assertions = [];
    const fps12 = 1 / 12 * 1000;
    const fps8 = 1 / 12 * 1000;
    let count12 = 0;
    let count8 = 0;
    const bang = (alpha)=>{
        count12 += 1;
    };
    const bang2 = (alpha)=>{
        count8 += 1;
    };
    const timeBangers = [
        {
            interval: fps12,
            bang
        },
        {
            interval: fps8,
            bang: bang2
        }, 
    ];
    const timestep = new Timestep(timeBangers);
    timestep.start();
    await sleep(1000);
    timestep.stop();
    if (count12 === 0) {
        assertions.push("there should be more than 0 count12");
    }
    if (count12 === 1) {
        assertions.push("there should be more than 1 count12");
    }
    if (count12 < 9) {
        assertions.push("count12 should be around 12 fps but definitely more than 15.");
    }
    if (count12 > 15) {
        assertions.push("count12 should be around 12 fps but definitely less than 15.");
    }
    if (count8 === 0) {
        assertions.push("there should be more than 0 count8");
    }
    if (count8 === 1) {
        assertions.push("there should be more than 1 count8");
    }
    if (count8 < 9) {
        assertions.push("count8 should be around 12 fps but definitely more than 15.");
    }
    if (count8 > 15) {
        assertions.push("count8 should be around 12 fps but definitely less than 15.");
    }
    return assertions;
};
const tests2 = [
    getBangerSums,
    startAndStopTimestep,
    timestepOneTrackForOneSecond,
    timestepTwoTracksForOneSecond, 
];
const unitTestTimestep = {
    title,
    tests: tests2,
    runTestsAsynchronously: true
};
const tests1 = [
    unitTestTimestep
];
export { tests1 as tests };
