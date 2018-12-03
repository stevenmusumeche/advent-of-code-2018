const fs = require("fs");

const inputs = getInput();
const counts = inputs.map(input => {
  const freqs = getLetterFrequencies(input);
  return {
    input,
    hasTwo: hasFrequency(2, freqs),
    hasThree: hasFrequency(3, freqs)
  };
});

const withTwo = counts.filter(count => count.hasTwo);
const withThree = counts.filter(count => count.hasThree);

console.log(withTwo.length * withThree.length);

function hasFrequency(num, freqs) {
  let hasFreq = false;
  Object.keys(freqs).forEach(key => {
    if (freqs[key] === num) {
      hasFreq = true;
    }
  });

  return hasFreq;
}

function getLetterFrequencies(input) {
  return input.split("").reduce((acc, cur) => {
    if (acc[cur]) acc[cur]++;
    else acc[cur] = 1;
    return acc;
  }, {});
}

function getInput() {
  const input = fs.readFileSync("./input.txt", "utf8");
  return input.split("\n");
}
