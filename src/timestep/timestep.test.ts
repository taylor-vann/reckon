// brian taylor vann
// timestep

import type { TimeBangers, BangerBridge } from "./timestep.ts";
import { Timestep, getSums } from "./timestep.ts";

const title = "reckon:timestep";

const runTestsAsynchronously = true;

type Sleep = (ms: number) => Promise<void>;

const sleep: Sleep = (ms) => {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
};

const getBangerSums = () => {
  const assertions: string[] = [];

  const fps12 = (1 / 12) * 1000;
  const fps8 = (1 / 12) * 1000;

  const bang: BangerBridge = (alpha) => {};

  const timeBangers: TimeBangers = [
    {
      interval: fps12,
      bang,
    },
    {
      interval: fps8,
      bang,
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

const startAndStopTimestep = () => {
  const assertions: string[] = [];

  const fps12 = (1 / 12) * 1000;
  const bang: BangerBridge = (alpha) => {};
  const timeBangers: TimeBangers = [
    {
      interval: fps12,
      bang,
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

const timestepOneTrackForOneSecond = async () => {
  const assertions: string[] = [];

  // in milliseconds
  let count = 0;
  const fps12 = (1 / 12) * 1000;

  const bang: BangerBridge = (alpha) => {
    count += 1;
  };

  const timeBangers: TimeBangers = [
    {
      interval: fps12,
      bang,
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
    assertions.push(
      "count should be around 12 fps but definitely more than 15."
    );
  }

  if (count > 15) {
    assertions.push(
      "count should be around 12 fps but definitely less than 15."
    );
  }

  return assertions;
};

const timestepTwoTracksForOneSecond = async () => {
  const assertions: string[] = [];

  // in milliseconds
  const fps12 = (1 / 12) * 1000;
  const fps8 = (1 / 12) * 1000;

  let count12 = 0;
  let count8 = 0;

  const bang: BangerBridge = (alpha) => {
    count12 += 1;
  };

  const bang2: BangerBridge = (alpha) => {
    count8 += 1;
  };

  const timeBangers: TimeBangers = [
    {
      interval: fps12,
      bang,
    },
    {
      interval: fps8,
      bang: bang2,
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
    assertions.push(
      "count12 should be around 12 fps but definitely more than 15."
    );
  }

  if (count12 > 15) {
    assertions.push(
      "count12 should be around 12 fps but definitely less than 15."
    );
  }

  if (count8 === 0) {
    assertions.push("there should be more than 0 count8");
  }

  if (count8 === 1) {
    assertions.push("there should be more than 1 count8");
  }

  if (count8 < 9) {
    assertions.push(
      "count8 should be around 12 fps but definitely more than 15."
    );
  }

  if (count8 > 15) {
    assertions.push(
      "count8 should be around 12 fps but definitely less than 15."
    );
  }

  return assertions;
};

// compose with state and update

const tests = [
  getBangerSums,
  startAndStopTimestep,
  timestepOneTrackForOneSecond,
  timestepTwoTracksForOneSecond,
];

const unitTestTimestep = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestTimestep };
