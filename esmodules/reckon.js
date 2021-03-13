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
class Timestep1 {
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
export { Timestep1 as Timestep };
