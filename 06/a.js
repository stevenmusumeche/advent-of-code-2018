const { getInput } = require("../input");
const coords = getCoords();

const limits = getLimits(coords);
const grid = makeGrid(limits);

addCoords(coords);

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    if (grid[row][col] !== undefined) continue;

    // this is an empty node, so calculate the manhattan distance between it and each coordinate
    let distances = coords
      .map((coord, coordId) => ({
        coordId,
        coord,
        md: calcManhattanDistance([col, row], coord)
      }))
      .sort((a, b) => a.md - b.md);

    // check for multiple instances of the same distance
    if (distances[0].md === distances[1].md) {
      grid[row][col] = ".";
    } else {
      grid[row][col] = distances[0].coordId;
    }
  }
}

const vals = {};
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    const key = grid[row][col];
    if (shouldCount(key)) {
      if (vals[key]) {
        vals[key] += 1;
      } else {
        vals[key] = 1;
      }
    }
  }
}

console.log(
  "The answer is",
  Object.keys(vals).reduce((acc, cur) => {
    if (vals[cur] > acc) return vals[cur];
    return acc;
  }, 0)
);

function shouldCount(id) {
  const matchingCoords = coords[id];
  if (!matchingCoords) return false;
  if (isEdge(id)) return false;

  return true;
}

function isEdge(id) {
  // check top and bottom row
  if (grid[0].includes(id) || grid[grid.length - 1].includes(id)) return true;

  // check first and last column
  for (let row = 0; row < grid.length; row++) {
    if (grid[row][0] === id || grid[row][grid[row].length] === id) return true;
  }

  return false;
}

function addCoords(coords) {
  let i = 0;
  for (coord of coords) {
    const [row, col] = coord;
    grid[col][row] = i;
    i++;
  }
}

function makeGrid(limits) {
  const grid = Array.from({ length: limits.maxRow + 1 }, () =>
    Array.from({ length: limits.maxCol + 2 })
  );

  return grid;
}

function getCoords() {
  const input = getInput("input.txt");
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
