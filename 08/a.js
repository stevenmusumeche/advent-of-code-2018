const { getInput } = require("../input");

const [numbers] = parseInput();

let total = 0;
const queue = [];

while (numbers.length > 0) {
  const nodeCount = numbers.shift();
  const metadataCount = numbers.shift();

  queue.push({ nodeCount, metadataCount });

  while (queue.length > 0) {
    const job = queue.pop();

    if (job.nodeCount === 0) {
      const metadata = numbers.splice(0, job.metadataCount);

      total += metadata.reduce((n, s) => n + s, 0);
    } else {
      queue.push({
        nodeCount: job.nodeCount - 1,
        metadataCount: job.metadataCount
      });

      break;
    }
  }
}

console.log(total);

function parseInput() {
  const input = getInput("input.txt");
  const parsed = input.map(x => x.split(" ").map(Number));
  return parsed;
}
