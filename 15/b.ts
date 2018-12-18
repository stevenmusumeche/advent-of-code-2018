import { getInput } from "../input";

interface Coord {
  x: number;
  y: number;
}

interface CoordPath {
  x: number;
  y: number;
  path: string[];
}

interface Player {
  val: "E" | "G";
  coord: Coord;
  hp: number;
  ap: number;
}

type Board = Array<Array<string>>;

class Node {
  constructor(public data: any, public next: any) {}
}

class Queue {
  public front: any = null;
  public back: any = null;

  enqueue(element: any) {
    var node = new Node(element, null);
    if (this.back === null) {
      this.front = node;
      this.back = node;
    } else {
      this.back.next = node;
      this.back = node;
    }
  }

  dequeue() {
    if (this.front === null) {
      throw Error("Cannot dequeue because queue is empty");
    }

    let first = this.front;
    this.front = this.front.next;

    if (this.front === null) {
      this.back = null;
    }
    return first.data;
  }
}

let raw = getInput("input.txt");

/**
  real    0m5.853s
  user    0m5.801s
  sys     0m0.092s
 */

let board: Board;
let round = 1;
let players: Player[] = [];
let power: number;
for (power = 4; power < 100; power++) {
  try {
    board = raw.map((x: string) => x.split(""));
    players = getInitialPlayers(board, power);

    round = 1;
    let finished = false;

    while (finished === false) {
      // sort players
      players = sortPlayers(players);

      for (let i = 0; i < players.length; i++) {
        const curPlayer = players[i];
        const targets = players.filter(p => p.val !== curPlayer.val);

        // check for adjacent enemies
        let attackedPlayer: Player;
        const adjacentTargets = findAdjacentTargets(targets, curPlayer);
        if (adjacentTargets.length > 0) {
          // current player is already adjacent to an enemy
          attackedPlayer = attack(curPlayer, board, adjacentTargets);
        } else {
          let inRange = getInRange(targets);
          let withPath = addShortestPaths(inRange, curPlayer);
          if (withPath.length === 0) {
            // no moves or attacks. skip this player.
          } else {
            move(curPlayer, board, withPath[0]);

            // now that we've moved, are we adjacent to an enemy?
            const adjacentTargets = findAdjacentTargets(targets, curPlayer);
            if (adjacentTargets.length > 0) {
              // if so, attack
              attackedPlayer = attack(curPlayer, board, adjacentTargets);
            }
          }
        }

        // remove dead players
        if (attackedPlayer! && attackedPlayer!.hp <= 0) {
          if (attackedPlayer!.val === "E") throw new Error("elf died");

          const indexOfDeadTarget = players.findIndex(
            player =>
              player.coord.x === attackedPlayer.coord.x &&
              player.coord.y === attackedPlayer.coord.y
          );

          if (indexOfDeadTarget < i) {
            i = i - 1;
          }
          let oldPlayers = players;
          players = players.filter(player => player.hp > 0);

          if (hasWinner(players)) {
            // if the player killed is the last player, then this should be considered a complete round
            if (players.length === i + 1) {
              round++;
            }
            finished = true;
            break;
          }
        }
      }

      // console.log(board.map(x => x.join("")));
      // console.log(players);

      if (!finished) round++;
    }

    if (finished) {
      break;
    }
  } catch (e) {
    // ignore this power because an elf died
  }
}

const numFullRounds = round - 1;
const sumOfHitPoints = players.reduce((acc, cur) => {
  return acc + cur.hp;
}, 0);
const answer = numFullRounds * sumOfHitPoints;

console.log("full rounds", numFullRounds);
console.log("hit points remaining", sumOfHitPoints);
console.log("power used", power);
console.log("answer", answer);

function hasWinner(players: Player[]) {
  return (
    players.reduce((acc: Array<typeof cur.val>, cur) => {
      if (!acc.includes(cur.val)) acc.push(cur.val);
      return acc;
    }, []).length === 1
  );
}

function attack(curPlayer: Player, board: Board, targets: Player[]): Player {
  const bestTarget = findBestTarget(targets);
  bestTarget.hp -= curPlayer.ap;
  if (bestTarget.hp <= 0) {
    // he ded
    board[bestTarget.coord.x][bestTarget.coord.y] = ".";
  }

  return bestTarget;
}

function findBestTarget(targets: Player[]) {
  if (targets.length === 1) return targets[0];

  const sorted = targets.sort((a, b) => {
    return a.hp - b.hp || a.coord.x - b.coord.x || a.coord.y - b.coord.y;
  });

  return sorted[0];
}

function move(curPlayer: Player, board: Board, path: CoordPath) {
  let newX = curPlayer.coord.x;
  let newY = curPlayer.coord.y;
  const move = path.path[0];
  board[curPlayer.coord.x][curPlayer.coord.y] = ".";
  if (move === "r") {
    newY += 1;
  } else if (move === "l") {
    newY -= 1;
  } else if (move === "u") {
    newX -= 1;
  } else if (move === "d") {
    newX += 1;
  }

  board[newX][newY] = curPlayer.val;
  curPlayer.coord = { x: newX, y: newY };
}

function addShortestPaths(destCoords: Coord[], curPlayer: Player): CoordPath[] {
  let minCurPath = Infinity;
  return (
    destCoords
      // calculate shortest path for each destination point
      .map(dest => {
        let path = getShortestPath(curPlayer.coord, dest);

        if (path.length > 0 && path.length < minCurPath)
          minCurPath = path.length;
        return { ...dest, path };
      })
      // remove anything longer than shortest
      .filter(x => x.path.length === minCurPath)
      // sort in reading order
      .sort((a, b) => a.x - b.x || a.y - b.y)
  );
}

function findAdjacentTargets(targets: Player[], curPlayer: Player) {
  return targets.filter(target => {
    if (
      curPlayer.coord.x === target.coord.x &&
      curPlayer.coord.y >= target.coord.y - 1 &&
      curPlayer.coord.y <= target.coord.y + 1
    ) {
      return true;
    }
    if (
      curPlayer.coord.y === target.coord.y &&
      curPlayer.coord.x >= target.coord.x - 1 &&
      curPlayer.coord.x <= target.coord.x + 1
    ) {
      return true;
    }
    return false;
  });
}

/**
 * find shortest path between two coords using breadth-first search
 */
function getShortestPath(a: Coord, b: Coord) {
  let tempBoard = board.map(function(arr) {
    return arr.slice();
  });

  let aa = { ...a, path: [] };

  let queue = new Queue();
  queue.enqueue(aa);

  while (queue.front !== null) {
    let cur = queue.dequeue();

    if (!cur) throw Error("invariant");

    for (let dir of ["u", "l", "r", "d"]) {
      let newLocation = explore(cur, dir, tempBoard);
      if (newLocation.x === b.x && newLocation.y === b.y) {
        return newLocation.path;
      } else if (newLocation.isValid) {
        queue.enqueue(newLocation);
      }
    }
  }
  return [];
}

function explore(location: CoordPath, direction: string, board: Board) {
  const path = [...location.path];
  path.push(direction);

  let newX = location.x;
  let newY = location.y;

  if (direction === "u") {
    newX -= 1;
  } else if (direction === "d") {
    newX += 1;
  } else if (direction === "r") {
    newY += 1;
  } else if (direction === "l") {
    newY -= 1;
  }

  const newLocation = {
    x: newX,
    y: newY,
    path,
    isValid: isValid({ x: newX, y: newY }, board)
  };

  if (newLocation.isValid) {
    board[newX][newY] = "V";
  }

  return newLocation;
}

function isValid(coord: Coord, board: Board): boolean {
  return board[coord.x][coord.y] === ".";
}

function getInRange(targets: Player[]): Coord[] {
  let inRange: Coord[] = [];
  for (let j = 0; j < targets.length; j++) {
    let target = targets[j];
    if (board[target.coord.x][target.coord.y + 1] === ".") {
      inRange.push({ x: target.coord.x, y: target.coord.y + 1 });
    }
    if (board[target.coord.x][target.coord.y - 1] === ".") {
      inRange.push({ x: target.coord.x, y: target.coord.y - 1 });
    }
    if (board[target.coord.x + 1][target.coord.y] === ".") {
      inRange.push({ x: target.coord.x + 1, y: target.coord.y });
    }
    if (board[target.coord.x - 1][target.coord.y] === ".") {
      inRange.push({ x: target.coord.x - 1, y: target.coord.y });
    }
  }
  return inRange;
}

function sortPlayers(players: Player[]): Player[] {
  return players.sort((a, b) => a.coord.x - b.coord.x || a.coord.y - b.coord.y);
}

function getInitialPlayers(board: Board, power: number): Player[] {
  let players: Player[] = [];
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      let val = board[x][y];
      if (val === "E") {
        players.push({ val, coord: { x, y }, hp: 200, ap: power });
      } else if (val === "G") {
        players.push({ val, coord: { x, y }, hp: 200, ap: 3 });
      }
    }
  }

  return players;
}
