const max = 300;
let results = buildCoordinateScores(5153);
let integrals = buildIntegrals(results);

const size = 3;
winner = { key: null, score: -Infinity };
for (let x = 1; x <= max - 2; x++) {
  for (let y = 1; y <= max - 2; y++) {
    const key = `${x},${y}`;
    const score = calcGridScore(x, y, size);

    if (score > winner.score) {
      winner.score = score;
      winner.key = key;
    }
  }
}

console.log("b", winner);

function buildIntegrals(results) {
  let integrals = new Map();
  for (let x = 1; x <= max; x++) {
    for (let y = 1; y <= max; y++) {
      const key = `${x},${y}`;
      let integral = results.get(key);
      integral += integrals.get(`${x},${y - 1}`) || 0;
      integral += integrals.get(`${x - 1},${y}`) || 0;
      integral -= integrals.get(`${x - 1},${y - 1}`) || 0;

      integrals.set(key, integral);
    }
  }
  return integrals;
}

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
  const a = integrals.get(`${x - 1},${y - 1}`) || 0;
  const b = integrals.get(`${x - 1},${y + size - 1}`) || 0;
  const c = integrals.get(`${x + size - 1},${y - 1}`) || 0;
  const d = integrals.get(`${x + size - 1},${y + size - 1}`) || 0;

  return d + a - b - c;
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
