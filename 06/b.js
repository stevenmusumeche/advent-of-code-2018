const { getInput } = require("../input");

const coords = getCoords();
const limits = getLimits(coords);
const grid = makeGrid(limits);

const MAX_DISTANCE = 10000;

let closeEnough = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    let totalDistance = coords
      .map(coord => calcManhattanDistance([col, row], coord))
      .reduce((acc, cur) => acc + cur, 0);

    if (totalDistance < MAX_DISTANCE) {
      closeEnough++;
    }
  }
}

console.log("The answer is", closeEnough);

function makeGrid(limits) {
  const grid = Array.from({ length: limits.maxRow + 1 }, () =>
    Array.from({ length: limits.maxCol + 2 })
  );

  return grid;
}

function getCoords() {
  const input = getInput();
  return input.map(x => x.split(", ").map(Number));
}

function getLimits(coords) {
  return coords.reduce(
    (acc, cur) => {
      const [col, row] = cur;
      if (row > acc.maxRow) acc.maxRow = row;
      if (row < acc.minRow) acc.minRow = row;
      if (col > acc.maxCol) acc.maxCol = col;
      if (col < acc.minCol) acc.minCol = col;

      return acc;
    },
    { maxRow: 0, maxCol: 0, minRow: Infinity, minCol: Infinity }
  );
}

function calcManhattanDistance(a, b) {
  const [x1, y1] = a;
  const [x2, y2] = b;

  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
