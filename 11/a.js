const max = 300;
const serial = 5153;
let results = new Map();
for (let x = 1; x <= max; x++) {
  for (let y = 1; y <= max; y++) {
    const key = `${x},${y}`;
    results.set(key, calcCoordinateScore(x, y, serial));
  }
}

winner = { key: null, score: 0 };
for (let x = 1; x <= max - 2; x++) {
  for (let y = 1; y <= max - 2; y++) {
    const key = `${x},${y}`;
    const score = calcGridScore(x, y);
    if (score > winner.score) {
      winner.score = score;
      winner.key = key;
    }
  }
}
console.log(winner);

function calcGridScore(x, y) {
  let score = 0;
  for (let i = x; i < x + 3; i++) {
    for (let j = y; j < y + 3; j++) {
      const key = `${i},${j}`;
      score += results.get(key);
    }
  }
  return score;
}

function calcCoordinateScore(x, y, serial) {
  let power = 0;
  const rackId = x + 10;
  power += rackId * y;
  power += serial;
  power = power * rackId;
  if (power < 100) return -5;

  const stringified = String(power);
  return Number(stringified[stringified.length - 3]) - 5;
}

//console.log(results);
