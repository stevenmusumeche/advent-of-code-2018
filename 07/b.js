const { getInput } = require("../input");
const input = parseInput("input.txt");
const durations = {};
const requirements = buildRequirements(input);

const path = [];
const numWorkers = 5;
const workers = Array.from({ length: numWorkers }, () => ({
  step: null,
  timeLeft: 0
}));

let second = 0;
while (Object.keys(requirements).length > 0 && second < 75) {
  console.log("-----------------");

  console.log("path", path);

  // a step is a candidate if all of its requirements are complete
  let candidates = Object.keys(requirements)
    .filter(key => requirements[key].every(entry => path.includes(entry)))
    .sort();

  console.log("candidates", candidates);

  console.log("Second", second);
  console.log("Before 1", workers[0]);
  console.log("Before 2", workers[1]);
  console.log("Before 3", workers[2]);
  console.log("Before 4", workers[3]);
  console.log("Before 5", workers[4]);
  console.log("--");

  // loop over each worker
  for (let curWorker = 0; curWorker < numWorkers; curWorker++) {
    // get the first candidate
    const candidate = candidates.shift();
    //console.log("candidate", candidate, isInProgress(candidate));

    // if this candidate is currently in progress, then skip this step and put it back into the candidates list
    if (!isInProgress(candidate)) {
      console.log(curWorker, "trying", candidate, workers[curWorker]);

      if (candidate && workers[curWorker].timeLeft === 0) {
        workers[curWorker] = {
          step: candidate,
          timeLeft: durations[candidate]
        };
      } else {
        candidates.unshift(candidate);
      }
    }

    // for any in-progress steps, decrement the time left by 1 second
    // if the task is completed, then push the task onto the completed path list and delete it from requirements
    if (workers[curWorker].timeLeft > 0) {
      workers[curWorker].timeLeft -= 1;
      if (workers[curWorker].timeLeft === 0) {
        path.push(candidate);
        delete requirements[candidate];
      }
    }
  }

  console.log("After 1", workers[0]);
  console.log("After 2", workers[1]);
  console.log("After 3", workers[2]);
  console.log("After 4", workers[3]);
  console.log("After 5", workers[4]);

  second++;
}

console.log(path.join(""));

function isInProgress(step) {
  for (let worker of workers) {
    if (worker.step === step && worker.timeLeft > 0) return true;
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
