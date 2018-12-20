import { getInput } from "../input";

const PADDING = 8;

interface Input {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

type Grid = string[][];

const input = parseInput("input-small.txt");
const { minY, maxY } = calcLimits();

let grid: Grid = Array.from({ length: PADDING * 2 }, () =>
  Array.from({ length: maxY + 2 }, () => ".")
);

grid[0][Math.trunc(maxY / 2)] = "+";

input.forEach(i => {
  for (let j = i.x1; j <= i.x2; j++) {
    for (let k = i.y1; k <= i.y2; k++) {
      const x = j - 500 + Math.trunc(maxY / 2);
      const y = k;
      grid[y][x] = "#";
    }
  }
});

printGrid(grid);

function printGrid(grid: Grid) {
  console.log(
    grid
      .map(y => y.join(""))
      .map((x, i) => `${i.toString().padStart(2, " ")} ${x}`)
      .join("\n")
  );
}

function calcLimits(): { minY: number; maxY: number } {
  return input.reduce(
    (acc, cur) => {
      const { minY: min, maxY: max } = acc;
      if (cur.y1 < min) acc.minY = cur.y1;
      if (cur.y2 > max) acc.maxY = cur.y2;
      return acc;
    },
    { minY: Number.MAX_VALUE, maxY: Number.MIN_VALUE }
  );
}

function parseInput(filename: string): Input[] {
  const raw = getInput(filename);
  const regex = /^(?:(?:x=([\d]+), y=([\d]+)\.\.([\d]+)))|(?:(?:y=([\d]+), x=([\d]+)\.\.([\d]+)))$/;

  return raw.map(r => {
    const matches = r.match(regex);
    if (!matches) throw new Error("invariant");
    const [_, xa1, ya1, ya2, yb1, xb1, xb2] = (matches as any).map(
      (m: number) => m && Number(m)
    );
    if (xa1 !== undefined) {
      return { x1: xa1, x2: xa1, y1: ya1, y2: ya2 };
    } else {
      return { x1: xb1, x2: xb2, y1: yb1, y2: yb1 };
    }
  });
}
