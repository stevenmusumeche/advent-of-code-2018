import { getInput } from "../input";

type Grid = string[][];
interface Cart {
  x: number;
  y: number;
  dir: string;
  turn: number;
}

let grid = parseInput("input-small.txt");
let carts = extractCarts(grid);

console.log(`\n------ ORIGINAL ------\n`);
printGridWithCarts(grid, carts);

let tick = 1;
let hasCrash = false;
let crashes;
while (hasCrash === false) {
  console.log(`\n------- TICK ${tick} -------\n`);

  const currentCarts = sortCarts();

  currentCarts.forEach(cart => {
    let nextChar = getNextChar(cart);

    // todo: Ys are reversed

    switch (nextChar) {
      case "-":
        cart.y = cart.y + (cart.dir === ">" ? 1 : -1);
        break;
      case "|":
        cart.x = cart.x + (cart.dir === "v" ? 1 : -1);
        break;
      case "\\":
        if (cart.dir === ">") {
          cart.y = cart.y + 1;
          cart.dir = "v";
        } else if (cart.dir === "<") {
          cart.y = cart.y - 1;
          cart.dir = "^";
        } else if (cart.dir === "v") {
          cart.x = cart.x + 1;
          cart.dir = ">";
        } else if (cart.dir === "^") {
          cart.x = cart.x - 1;
          cart.dir = "<";
        }
        break;
      case "/":
        if (cart.dir === ">") {
          cart.y = cart.y + 1;
          cart.dir = "^";
        } else if (cart.dir === "<") {
          cart.y = cart.y - 1;
          cart.dir = "v";
        } else if (cart.dir === "v") {
          cart.x = cart.x + 1;
          cart.dir = "<";
        } else if (cart.dir === "^") {
          cart.x = cart.x - 1;
          cart.dir = ">";
        }
        break;
      case "+":
        switch (cart.turn % 3) {
          case 0:
            if (cart.dir === ">") {
              cart.y = cart.y + 1;
              cart.dir = "^";
            } else if (cart.dir === "<") {
              cart.y = cart.y - 1;
              cart.dir = "v";
            } else if (cart.dir === "v") {
              cart.x = cart.x + 1;
              cart.dir = ">";
            } else if (cart.dir === "^") {
              cart.x = cart.x - 1;
              cart.dir = "<";
            }
            break;

          case 1:
            if (cart.dir === ">") {
              cart.y = cart.y + 1;
            } else if (cart.dir === "<") {
              cart.y = cart.y - 1;
            } else if (cart.dir === "v") {
              cart.x = cart.x + 1;
            } else if (cart.dir === "^") {
              cart.x = cart.x - 1;
            }
            break;

          case 2:
            if (cart.dir === ">") {
              cart.y = cart.y + 1;
              cart.dir = "v";
            } else if (cart.dir === "<") {
              cart.y = cart.y - 1;
              cart.dir = "^";
            } else if (cart.dir === "v") {
              cart.x = cart.x + 1;
              cart.dir = "<";
            } else if (cart.dir === "^") {
              cart.x = cart.x - 1;
              cart.dir = ">";
            }
            break;
        }
        cart.turn++;

        break;
    }

    crashes = findCrashes(carts);
    if (crashes) {
      hasCrash = true;
    }
  });

  console.log("CRASH AT ", crashes);

  printGridWithCarts(grid, carts);

  carts = currentCarts;
  tick++;
}

function findCrashes(carts: Cart[]): Cart | void {
  for (let i = 0; i < carts.length; i++) {
    for (let j = i + 1; j < carts.length; j++) {
      if (carts[i].x === carts[j].x && carts[i].y === carts[j].y) {
        return carts[i];
      }
    }
  }
}

function getNextChar(cart: Cart): string {
  let nextChar = "";
  switch (cart.dir) {
    case ">":
      nextChar = grid[cart.x][cart.y + 1];
      break;
    case "<":
      nextChar = grid[cart.x][cart.y - 1];
      break;
    case "v":
      nextChar = grid[cart.x + 1][cart.y];
      break;
    case "^":
      nextChar = grid[cart.x - 1][cart.y];
      break;
  }
  return nextChar;
}

function sortCarts() {
  return carts
    .sort((a, b) => (a.y > b.y ? 1 : -1))
    .sort((a, b) => (a.x > b.x ? 1 : -1));
}

function extractCarts(grid: string[][]): Cart[] {
  const carts: Cart[] = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (isCart(grid[i][j])) {
        const newCart: Cart = { x: i, y: j, dir: grid[i][j], turn: 0 };
        carts.push(newCart);
        grid[newCart.x][newCart.y] = [">", "<"].includes(newCart.dir)
          ? "-"
          : "|";
      }
    }
  }
  return carts;
}

function isCart(char: string): boolean {
  return ["^", "v", "<", ">"].includes(char);
}

function parseInput(filename?: string): Grid {
  const raw = getInput(filename);
  return raw.map((x: string) => x.split(""));
}

function printGrid(grid: Grid): void {
  let str = "";
  for (let i = 0; i < grid.length; i++) {
    str += "\n";
    for (let j = 0; j < grid[i].length; j++) {
      str += grid[i][j];
    }
  }
  console.log(str);
}

function printGridWithCarts(grid: Grid, carts: Cart[]): void {
  let str = "";
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cart = carts.find(cart => cart.x === i && cart.y === j);
      if (cart) {
        str += cart.dir;
      } else {
        str += grid[i][j];
      }
    }
    str += "\n";
  }
  console.log(str);
}
