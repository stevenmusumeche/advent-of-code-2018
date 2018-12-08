const { getInput } = require("../input");
const coords = getCoords();

const limits = getLimits(coords);
const grid = makeGrid(limits);

addCoords(coords);

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    if (grid[row][col]) continue;

    // this is an empty node, so calculate the manhattan distance between it and each coordinate
    let distances = coords
      .map((coord, coordId) => ({
        coordId: String.fromCharCode(97 + coordId),
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

console.log(grid);

const vals = {};
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[row].length; col++) {
    if (vals[grid[row][col]]) {
      vals[grid[row][col]] += 1;
    } else {
      vals[grid[row][col]] = 1;
    }
  }
}

//console.log(vals);

function addCoords(coords) {
  let i = 0;
  for (coord of coords) {
    const [row, col] = coord;
    grid[col][row] = String.fromCharCode(65 + i);
    i++;
  }
}

function makeGrid(limits) {
  const grid = Array.from({ length: limits.row + 1 }, () =>
    Array.from({ length: limits.col + 2 })
  );

  return grid;
}

function getCoords() {
  const input = getInput("input-small.txt");
  return input.map(x => x.split(", ").map(Number));
}

function getLimits(coords) {
  return coords.reduce(
    (acc, cur) => {
      const [col, row] = cur;
      if (row > acc.row) acc.row = row;
      if (col > acc.col) acc.col = col;

      return acc;
    },
    { row: 0, col: 0 }
  );
}

function calcManhattanDistance(a, b) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  // console.log(a, b, Math.abs(x2 - x1) + Math.abs(y2 - y1));

  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
