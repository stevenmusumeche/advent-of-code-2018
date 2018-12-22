import { getInput } from "../input";

enum Content {
  OPEN = ".",
  TREES = "|",
  LUMBERYARD = "#"
}

type Limits = { x: number; y: number };

type Grid = { [xy: string]: Content };
let { grid, limits } = buildInitialGrid("./18/input.txt");

let minute;
let resourceVal: number = 0;
let oldResourceVal: number = 0;
let diffs: any = {};
for (minute = 0; minute < 1000; minute++) {
  // console.log("\n---------", minute, "---------\n");
  // printGrid(grid, limits);
  const typeTotals = Object.keys(grid).reduce(
    (total, key) => {
      total[grid[key]]++;
      return total;
    },
    {
      [Content.OPEN]: 0,
      [Content.LUMBERYARD]: 0,
      [Content.TREES]: 0
    }
  );

  resourceVal = typeTotals[Content.TREES] * typeTotals[Content.LUMBERYARD];
  const diff = oldResourceVal - resourceVal;
  // if (!diffs[diff]) diffs[diff] = 1;
  // else diffs[diff]++;
  if (resourceVal === 195290) {
    console.log(
      "Resource value",
      minute,
      typeTotals[Content.TREES] * typeTotals[Content.LUMBERYARD]
      // diff
    );
  }
  oldResourceVal = resourceVal;

  grid = makeNewGrid(grid, limits);
}

// console.log("\n--------- FINAL", minute, "---------\n");
// printGrid(grid, limits);

const typeTotals = Object.keys(grid).reduce(
  (total, key) => {
    total[grid[key]]++;
    return total;
  },
  {
    [Content.OPEN]: 0,
    [Content.LUMBERYARD]: 0,
    [Content.TREES]: 0
  }
);

console.log(
  "Resource value",
  minute,
  typeTotals[Content.TREES] * typeTotals[Content.LUMBERYARD]
);

// console.log(diffs);

// Resource value 472 180560 3832
// Resource value 500 180560 3832
// 28 iterations between a repeat

// 1000000000 = 1000 + (28x)
// 999,999,000 / 28 === 35714250
// 1000 + 35714250 iterations of 28

function makeNewGrid(oldGrid: Grid, limits: Limits): Grid {
  let newGrid: Grid = {};
  for (let x = 0; x < limits.x; x++) {
    for (let y = 0; y < limits.y; y++) {
      const adjacent = getAdjacentVals(x, y, oldGrid);

      switch (oldGrid[strXY(x, y)]) {
        case Content.OPEN:
          newGrid[strXY(x, y)] = oldGrid[strXY(x, y)];
          if (adjacent[Content.TREES] >= 3) {
            newGrid[strXY(x, y)] = Content.TREES;
          }
          break;

        case Content.TREES:
          newGrid[strXY(x, y)] = oldGrid[strXY(x, y)];
          if (adjacent[Content.LUMBERYARD] >= 3) {
            newGrid[strXY(x, y)] = Content.LUMBERYARD;
          }
          break;

        case Content.LUMBERYARD:
          newGrid[strXY(x, y)] = Content.OPEN;
          if (
            adjacent[Content.LUMBERYARD] >= 1 &&
            adjacent[Content.TREES] >= 1
          ) {
            newGrid[strXY(x, y)] = Content.LUMBERYARD;
          }
          break;
      }
    }
  }
  return newGrid;
}

function getAdjacentVals(x: number, y: number, grid: Grid) {
  let adjacent: Content[] = [];
  for (let xx = x - 1; xx <= x + 1; xx++) {
    for (let yy = y - 1; yy <= y + 1; yy++) {
      if (xx === x && yy === y) continue;
      if (grid[strXY(xx, yy)]) adjacent.push(grid[strXY(xx, yy)]);
    }
  }
  return adjacent.reduce(
    (acc, cur) => {
      acc[cur]++;
      return acc;
    },
    {
      [Content.OPEN]: 0,
      [Content.LUMBERYARD]: 0,
      [Content.TREES]: 0
    }
  );
}

function printGrid(grid: Grid, limits: Limits) {
  let str = "";
  for (let x = 0; x < limits.x; x++) {
    for (let y = 0; y < limits.y; y++) {
      str += grid[strXY(x, y)];
    }
    str += "\n";
  }
  console.log(str);
}

function buildInitialGrid(filename: string): { grid: Grid; limits: Limits } {
  let grid: Grid = {};
  let raw: any = getInput(filename);
  raw = raw.map((x: string) => x.split(""));

  for (let x = 0; x < raw.length; x++) {
    for (let y = 0; y < raw[x].length; y++) {
      grid[strXY(x, y)] = raw[x][y] as Content;
    }
  }

  return { grid, limits: { x: raw.length, y: raw[0].length } };
}

function strXY(x: number | string, y: number | string) {
  return `${x},${y}`;
}
