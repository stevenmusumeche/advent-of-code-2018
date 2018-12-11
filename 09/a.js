const { getInput } = require("../input");

const { numPlayers, lastMarble } = load("input.txt");
let scores = Array.from({ length: numPlayers + 1 }, () => 0);

const board = [0];
let curMarble = 0;
let curIndex = 0;
let curPlayer = 1;
for (let i = 1; i <= lastMarble; i++) {
  const { nextIndex, nextMarble } = calcInsertion();
  curMarble = nextMarble;
  curIndex = nextIndex;

  if (!isSpecial(nextMarble)) {
    board.splice(nextIndex, 0, nextMarble);
  } else {
    const [removed] = board.splice(nextIndex, 1);
    scores[curPlayer] += curMarble + removed;
  }

  if (curPlayer % numPlayers === 0) curPlayer = 1;
  else curPlayer++;
}

const sortedScores = scores
  .map((score, player) => ({ player, score }))
  .sort(({ score: score1 }, { score: score2 }) => {
    return score2 - score1;
  });

console.log("Highest score", sortedScores[0]);

function calcInsertion() {
  let nextIndex;
  let nextMarble = curMarble + 1;

  if (!isSpecial(nextMarble)) {
    nextIndex = findPlacement(curIndex, board, +2);
  } else {
    nextIndex = findPlacement(curIndex, board, -7);
  }

  return { nextIndex, nextMarble };
}

function isSpecial(marble) {
  return marble % 23 === 0;
}

function findPlacement(curIndex, board, step) {
  if (step > 0) {
    if (curIndex + step <= board.length) {
      return curIndex + step;
    } else {
      return curIndex + step - board.length;
    }
  } else {
    if (curIndex + step > 0) {
      return curIndex + step;
    } else {
      return board.length - (Math.abs(step) - curIndex);
    }
  }
}

function load(filename) {
  const [raw] = getInput(filename);

  const regex = /^(?<numPlayers>[\d]+) players.*?(?<lastMarble>[\d]+) points$/;
  const { groups } = raw.match(regex);
  return {
    numPlayers: Number(groups.numPlayers),
    lastMarble: Number(groups.lastMarble)
  };
}
