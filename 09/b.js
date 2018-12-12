const { getInput } = require("../input");

let { numPlayers, lastMarble } = load("input.txt");
lastMarble = lastMarble * 100;

let scores = Array.from({ length: numPlayers + 1 }, () => 0);

let current = node(0, null, null);
current.prev = current;
current.next = current;
let player = 1;
let marble = 1;
while (marble <= lastMarble) {
  if (!isSpecial(marble)) {
    const before = current.next;
    const after = current.next.next;
    const newNode = node(marble, before, after);
    before.next = newNode;
    after.prev = newNode;
    current = newNode;
  } else {
    const toRemove = current.prev.prev.prev.prev.prev.prev.prev;

    scores[player] += marble + toRemove.value;
    toRemove.prev.next = toRemove.next;
    toRemove.next.prev = toRemove.prev;

    current = toRemove.next;
  }

  marble += 1;
  player = (player + 1) % numPlayers;
}

const sortedScores = scores
  .map((score, player) => ({ player, score }))
  .sort(({ score: score1 }, { score: score2 }) => {
    return score2 - score1;
  });

console.log("Highest score", sortedScores[0]);
// Highest score { player: 221, score: 3169872331 }

function isSpecial(marble) {
  return marble % 23 === 0;
}

function node(value, prev, next) {
  return { value, next, prev };
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
