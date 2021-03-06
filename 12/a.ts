import { getInput } from "../input";

const NUM_GENERATIONS = 20;
const SPAN_LEN = 5;
const PADDING = 10;
const PAD = ".".repeat(PADDING);

let { initialState, remaining } = parseInput("input.txt");

let cur = initialState;
let generation = 1;
let centerIndex = 0;
while (generation <= NUM_GENERATIONS) {
  cur = trim(cur);
  cur = addPadding(cur);

  let next = ".".repeat(SPAN_LEN + 1);
  for (let i = SPAN_LEN + 1; i < cur.length - SPAN_LEN - 1; i++) {
    const span = cur.substr(i - SPAN_LEN + 3, 5);
    next += predict(span) ? "#" : ".";
  }
  // console.log("--------");
  // console.log(generation, centerIndex, next[centerIndex], next);

  cur = next;
  generation++;
}

let numSum = 0;
for (let i = 0; i < cur.length; i++) {
  if (cur[i] === "#") {
    numSum += i - centerIndex;
  }
}
console.log("Sum of numbers", numSum);

function predict(span: string) {
  const match = remaining.find(r => r.around === span);
  if (match) return match.filled;
  return false;
}

function trim(pots: string) {
  const firstTrue = pots.indexOf("#");
  if (firstTrue !== -1) {
    pots = pots.substr(firstTrue, pots.length - firstTrue);
    centerIndex -= firstTrue;
  }
  const lastTrue = pots.lastIndexOf("#");
  if (lastTrue !== -1) {
    pots = pots.substr(0, lastTrue + 1);
  }

  return pots;
}

function addPadding(pots: string) {
  centerIndex += PADDING;
  return PAD + pots + PAD;
}

function parseInput(file: string) {
  const raw: string[] = getInput(file);
  let [initialState, _, ...rest] = raw;
  initialState = initialState.substr(15, initialState.length);
  const keys = rest.map(x => {
    return {
      filled: x.substr(9, 1) === "#",
      around: x.substr(0, 5)
    };
  });

  return { initialState, remaining: keys };
}
