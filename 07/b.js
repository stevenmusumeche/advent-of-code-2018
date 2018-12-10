const { getInput } = require("../input");
const input = parseInput("input.txt");
const durations = {};
const requirements = buildRequirements(input);

const path = [];
const numWorkers = 5;
const workers = Array.from({ length: numWorkers }, () => ({
  step: null,
  timeLeft: null
}));

let candidates;
let second = 0;
while (Object.keys(requirements).length > 0) {
  candidates = Object.keys(requirements)
    .filter(key => requirements[key].every(entry => path.includes(entry)))
    .filter(key => !isInProgress(key))
    .sort();

  // assign any available candidates to available workers
  for (let candidate of candidates) {
    for (let curWorker = 0; curWorker < numWorkers; curWorker++) {
      if (workerAvailable(workers[curWorker])) {
        workers[curWorker] = {
          step: candidate,
          timeLeft: durations[candidate]
        };
        // since we found a worker for this candidate, break out of the worker loop
        // and start over with the next candidate
        break;
      }
    }
  }

  // decrement time and check for completeness
  for (let curWorker = 0; curWorker < numWorkers; curWorker++) {
    if (!workerAvailable(workers[curWorker])) {
      workers[curWorker].timeLeft--;
    }

    //see if we're done
    if (workers[curWorker].timeLeft === 0) {
      path.push(workers[curWorker].step);
      workers[curWorker].timeLeft = null;
      delete requirements[workers[curWorker].step];
    }
  }

  second++;
}

console.log(path.join(""), "in", second, "seconds");

process.exit(0);

function workerAvailable(worker) {
  return worker.timeLeft === null;
}

function isInProgress(step) {
  for (let worker of workers) {
    if (worker.step === step) return true;
  }
  return false;
}

function buildRequirements(inputs) {
  return inputs.reduce((requirements, input) => {
    const [prev, next] = input;
    if (!requirements[next]) {
      requirements[next] = [];
      durations[next] = calcDuration(next);
    }
    if (!requirements[prev]) {
      requirements[prev] = [];
      durations[prev] = calcDuration(prev);
    }
    requirements[next].push(prev);

    return requirements;
  }, {});
}

function parseInput(filename) {
  const raw = getInput(filename);
  const regex = /^Step (?<prev>.*?) must be finished before step (?<next>.*?) can begin.$/;
  return raw.map(input => {
    const { groups } = input.match(regex);
    return [groups.prev, groups.next];
  });
}

function calcDuration(letter) {
  return 60 + letter.charCodeAt() - 64;
}
