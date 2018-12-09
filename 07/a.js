const { getInput } = require("../input");
const input = parseInput();
const requirements = buildRequirements(input);

const path = [];
while (Object.keys(requirements).length > 0) {
  let candidates = Object.keys(requirements)
    .filter(key => requirements[key].every(entry => path.includes(entry)))
    .sort();
  path.push(candidates[0]);
  delete requirements[candidates[0]];
}

console.log("The answer is", path.join(""));

function buildRequirements(inputs) {
  return inputs.reduce((requirements, input) => {
    const [prev, next] = input;
    if (!requirements[next]) requirements[next] = [];
    if (!requirements[prev]) requirements[prev] = [];
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
