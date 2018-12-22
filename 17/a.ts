import { getInput } from "../input";

// used/cheated from https://github.com/albertobastos/advent-of-code-2018-nodejs/blob/master/src/d17.js

enum Content {
  CLAY = "#",
  WATER = "~",
  WATER_FLOW = "|",
  EMPTY = ".",
  SPRING = "+",
  CURSOR = "X"
}

interface Cell {
  x: number;
  y: number;
  contents: string;
}

interface Input {
  xFrom: number;
  xTo: number;
  yFrom: number;
  yTo: number;
}

interface Coord {
  x: number;
  y: number;
}

type Grid = { [coord: string]: Content };

const grid: Grid = {};
const inputs = parseInput("./17/input.txt");
const { minY, maxY } = getLimits(inputs);
fillGrid(grid, inputs);

run(grid);

const withWaterOrFlow = Object.keys(grid).filter(
  coord => grid[coord] === Content.WATER || grid[coord] === Content.WATER_FLOW
);

const withWater = Object.keys(grid).filter(
  coord => grid[coord] === Content.WATER
);

console.log("FINAL PART 1", withWaterOrFlow.length);
console.log("FINAL PART 2", withWater.length);

function run(grid: Grid) {
  flowWater(grid, { x: 500, y: 0 });
}

function flowWater(grid: Grid, cursor: Coord) {
  if (cursor.y >= maxY) return;

  let cursorDown = { x: cursor.x, y: cursor.y + 1 };
  let cursorLeft = { x: cursor.x - 1, y: cursor.y };
  let cursorRight = { x: cursor.x + 1, y: cursor.y };

  // try down
  if (isEmpty(grid, cursorDown)) {
    // careful, answer expects only water from first row with clay
    if (cursorDown.y >= minY) fill(grid, cursorDown, Content.WATER_FLOW);
    flowWater(grid, cursorDown);
  }

  // down is exhausted, try left
  if (isEmpty(grid, cursorLeft) && isStale(grid, cursorDown)) {
    // we have either stale water or clay below and free space to the left, water can flow that way
    fill(grid, cursorLeft, Content.WATER_FLOW);
    flowWater(grid, cursorLeft);
  }

  // down and left are exhausted, try right
  if (isEmpty(grid, cursorRight) && isStale(grid, cursorDown)) {
    // we have either stale water or clay below and free space to the right, water can flow that way
    fill(grid, cursorRight, Content.WATER_FLOW);
    flowWater(grid, cursorRight);
  }

  if (
    isStale(grid, cursorDown) &&
    hasWallLeft(grid, cursor) &&
    hasWallRight(grid, cursor)
  ) {
    fillLeft(grid, cursor, Content.WATER);
    fillRight(grid, cursor, Content.WATER);
    fill(grid, cursor, Content.WATER);
  }
}

function fillLeft(grid: Grid, cursor: Coord, content: Content) {
  let offset = -1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isClay(grid, cursorOffset)) return;
    fill(grid, cursorOffset, content);
    offset--;
  }
}

function fillRight(grid: Grid, cursor: Coord, content: Content) {
  let offset = 1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isClay(grid, cursorOffset)) return;
    fill(grid, cursorOffset, content);
    offset++;
  }
}

function fill(grid: Grid, cursor: Coord, content: Content) {
  grid[strXY(cursor.x, cursor.y)] = content;
}

function isEmpty(grid: Grid, cursor: Coord) {
  return getContents(grid, cursor) === undefined;
}

function isStale(grid: Grid, cursor: Coord) {
  return [Content.WATER, Content.CLAY].indexOf(getContents(grid, cursor)) > -1;
}

function isClay(grid: Grid, cursor: Coord) {
  return getContents(grid, cursor) === Content.CLAY;
}

function hasWallLeft(grid: Grid, cursor: Coord) {
  let offset = -1;
  while (true) {
    let cursorOffset = { x: cursor.x + offset, y: cursor.y };
    if (isEmpty(grid, cursorOffset)) return false;
    if (isClay(grid, cursorOffset)) return true;
    offset--;
  }
}

function hasWallRight(grid: Grid, cursor: Coord) {
  let offset = 1;
  while (true) {
    let cursorOffset = { x: cursor.x + offset, y: cursor.y };
    if (isEmpty(grid, cursorOffset)) return false;
    if (isClay(grid, cursorOffset)) return true;
    offset++;
  }
}

function printGrid(grid: Grid, cursor?: Coord) {
  if (cursor) grid[strXY(cursor.x, cursor.y)] = Content.CURSOR;
  const limits = getGridLimits(grid);
  let str = "";
  for (let y = limits.minY; y <= limits.maxY; y++) {
    for (let x = limits.minX; x <= limits.maxX; x++) {
      str += getContents(grid, { x, y }) || ".";
    }
    str += "\n";
  }
  console.log(str);
}

function getGridLimits(grid: Grid) {
  return Object.keys(grid).reduce(
    (acc, cur) => {
      const [x, y] = cur.split(",").map(Number);
      if (x < acc.minX) acc.minX = x;
      if (x > acc.maxX) acc.maxX = x;
      if (y < acc.minY) acc.minY = y;
      if (y > acc.maxY) acc.maxY = y;

      return acc;
    },
    {
      minX: Number.MAX_VALUE,
      maxX: Number.MIN_VALUE,
      minY: Number.MAX_VALUE,
      maxY: Number.MIN_VALUE
    }
  );
}

function fillGrid(grid: Grid, inputs: Input[]) {
  grid[strXY(500, 0)] = Content.SPRING;
  inputs.forEach(input => {
    for (let x = input.xFrom; x <= input.xTo; x++) {
      for (let y = input.yFrom; y <= input.yTo; y++) {
        grid[strXY(x, y)] = Content.CLAY;
      }
    }
  });
}

function getContents(grid: Grid, { x, y }: Coord) {
  return grid[strXY(x, y)];
}

function strXY(x: number, y: number) {
  return `${x},${y}`;
}

function getLimits(input: Input[]) {
  return input.reduce(
    (acc, cur) => {
      if (cur.yFrom < acc.minY) acc.minY = cur.yFrom;
      if (cur.yTo > acc.maxY) acc.maxY = cur.yTo;
      return acc;
    },
    {
      minY: Number.MAX_VALUE,
      maxY: Number.MIN_VALUE
    }
  );
}

function parseInput(filename: string): Input[] {
  const raw = getInput(filename);
  const input = [];
  const regex = /^(?:(?:x=([\d]+), y=([\d]+)\.\.([\d]+)))|(?:(?:y=([\d]+), x=([\d]+)\.\.([\d]+)))$/;

  return raw.map(r => {
    const matches = r.match(regex);
    if (!matches) throw new Error("invariant");
    const [_, xa1, ya1, ya2, yb1, xb1, xb2] = (matches as any).map(
      (m: number) => m && Number(m)
    );
    if (xa1 !== undefined) {
      return { xFrom: xa1, xTo: xa1, yFrom: ya1, yTo: ya2 };
    } else {
      return { xFrom: xb1, xTo: xb2, yFrom: yb1, yTo: yb1 };
    }
  });
}
