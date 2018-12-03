const fs = require("fs");

const inputs = getInput();

const winners = [];
for (let i = 0; i < inputs.length; i++) {
  const cur = inputs[i].trim().split("");
  for (let j = i + 1; j < inputs.length; j++) {
    const comparing = inputs[j].trim().split("");
    let numDiff = 0;
    cur.forEach((curLetter, k) => {
      if (curLetter !== comparing[k]) {
        numDiff++;
      }
      if (numDiff > 1) {
        return;
      }
    });
    if (numDiff <= 1) {
      winners.push(inputs[i]);
      winners.push(inputs[j]);
    }
  }
}

const comparing = winners[1].split("");
winners[0].split("").forEach((curLetter, k) => {
  if (curLetter !== comparing[k]) {
    console.log("different letter:", k, curLetter);
  }
});

console.log(winners);

function getInput() {
  const input = fs.readFileSync("./input.txt", "utf8");
  return input.split("\n");
}
