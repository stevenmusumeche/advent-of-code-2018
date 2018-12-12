const max = 300;
let results = buildCoordinateScores(18);

winner = { key: null, score: 0 };
for (let x = 1; x <= max; x++) {
  console.log(x);

  for (let y = 1; y <= max; y++) {
    const maxSize = x > y ? max - x + 1 : max - y + 1;
    // console.log("----");
    // console.log(x, y, maxSize);

    for (let size = x; size < maxSize; size++) {
      const key = `${x},${y},${size}`;
      const score = calcGridScore(x, y, size);
      //console.log("try", key, score);
      if (score > winner.score) {
        winner.score = score;
        winner.key = key;
      }
    }
  }
}
console.log(winner);

function buildCoordinateScores(serial) {
  let results = new Map();
  for (let x = 1; x <= max; x++) {
    for (let y = 1; y <= max; y++) {
      const key = `${x},${y}`;
      results.set(key, calcCoordinateScore(x, y, serial));
    }
  }
  return results;
}

function calcGridScore(x, y, size) {
  let score = 0;
  for (let i = x; i < x + size; i++) {
    for (let j = y; j < y + size; j++) {
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
