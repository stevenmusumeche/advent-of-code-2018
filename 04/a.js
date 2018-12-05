const { getInput } = require("../input");

const STATES = {
  START: "START",
  SLEEP: "SLEEP",
  WAKE: "WAKE"
};

const rawInput = getInput();
const inputs = parseInput(rawInput);
const guardLog = buildGuardLog(inputs);
const hoursLog = processGuardLog();

const sleepiestGuard = Object.keys(hoursLog).reduce(
  (acc, cur) => {
    if (hoursLog[cur].numHoursSleeping > acc.numHours) {
      acc = { guardId: cur, numHours: hoursLog[cur].numHoursSleeping };
    }
    return acc;
  },
  { guardId: null, numHours: 0 }
);

console.log("sleepest guard", sleepiestGuard);
const allMinsForSleepiestGuard = hoursLog[sleepiestGuard.guardId].mins;

const sleepiestMinute = Object.keys(allMinsForSleepiestGuard).reduce(
  (acc, cur) => {
    if (allMinsForSleepiestGuard[cur] > acc.count) {
      acc = { count: allMinsForSleepiestGuard[cur], minute: cur };
    }
    return acc;
  },
  { count: 0, minute: null }
);

console.log("sleepiest minute:", sleepiestMinute);

console.log(
  "Puzzle result",
  Number(sleepiestGuard.guardId) * Number(sleepiestMinute.minute)
);

function processGuardLog() {
  let hoursLog = {};
  Object.keys(guardLog).forEach(guardId => {
    hoursLog[guardId] = { mins: {}, numHoursSleeping: 0 };
    // total hours
    const numHoursSleeping = guardLog[guardId].reduce((acc, cur) => {
      acc += cur.duration;
      return acc;
    }, 0);
    hoursLog[guardId].numHoursSleeping = numHoursSleeping;
    // minutes
    guardLog[guardId].forEach(({ startMins, endMins }) => {
      for (let i = startMins; i < endMins; i++) {
        if (!hoursLog[guardId]["mins"][i]) {
          hoursLog[guardId]["mins"][i] = 1;
        } else {
          hoursLog[guardId]["mins"][i] += 1;
        }
      }
    });
  });
  return hoursLog;
}

function buildGuardLog(inputs) {
  const guardLog = {};
  let currentGuard = null;
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const nextInput = inputs[i + 1];

    // if current and next states are both START, skip this row (guard never went to sleep)
    if (input.state === STATES.START && nextInput.state === STATES.START) {
      continue;
    }

    if (input.state === STATES.START) {
      currentGuard = input.guardId;
    }

    // inspect the next entries until we find the next START state
    let foundNext = false;
    let j = i + 1;
    while (foundNext === false && j < inputs.length) {
      if (inputs[j].state === STATES.START) {
        foundNext = true;
      } else {
        // add the non-START entries to this guard's entries
        if (!guardLog[currentGuard]) guardLog[currentGuard] = [];

        if (
          inputs[j].state !== STATES.SLEEP ||
          inputs[j + 1].state !== STATES.WAKE
        ) {
          throw new Error("invariant");
        }

        guardLog[currentGuard].push({
          start: inputs[j].timestamp,
          startMins: Number(inputs[j].minutes),
          end: inputs[j + 1].timestamp,
          endMins: Number(inputs[j + 1].minutes),
          duration: Number(inputs[j + 1].minutes) - Number(inputs[j].minutes)
        });
        j = j + 2;
      }
    }
    // skip the NON-START entries we just found
    i += j - i - 1;
  }
  return guardLog;
}

function parseInput(inputs) {
  const re = /\[(?<timestamp>[\d]{4}\-[\d]{2}\-[\d]{2} [\d]{2}\:(?<minutes>[\d]{2}).*?)\] ((Guard #(?<guardId>[\d]+) begins shift)|(?<wake>wakes up)|(?<sleep>falls asleep))/;

  return inputs
    .map(input => {
      const { groups } = input.match(re);
      return {
        input,
        timestamp: groups.timestamp,
        minutes: groups.minutes,
        state: getState(groups),
        guardId: groups.guardId ? Number(groups.guardId) : null
      };
    })
    .sort((a, b) => {
      return a.timestamp > b.timestamp ? 1 : -1;
    });
}

function getState(groups) {
  if (groups.guardId) {
    return STATES.START;
  }
  if (groups.wake) {
    return STATES.WAKE;
  }
  if (groups.sleep) {
    return STATES.SLEEP;
  }
  throw new Error("unable to determine state");
}
