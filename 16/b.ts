import ops, { Register, Vals } from "./ops";
import { getInput } from "../input";
import { OutgoingMessage } from "http";

interface Input {
  before: Register;
  instructions: any;
  after: Register;
}

let inputs = parseInput();
const allOps = Object.keys(ops);
const opCodeMap = buildOpCodeMap();
const testInput = parseTestInput();

let register: Register = [0, 0, 0, 0];
for (let input of testInput) {
  let opFn = (ops as any)[input.opCode];
  register = opFn(input.vals, register);
}

console.log("Final register", register);

function buildOpCodeMap() {
  let potentials = getPotentials(inputs);

  const opCodeMap: string[] = Array.from({ length: 16 });

  let numRemaining = getNumRemaining(potentials);
  while (numRemaining > 0) {
    // loop over all options with only one possible answer
    let withOneOpCode = potentials.filter(p => p.vals.size === 1);
    withOneOpCode.forEach(match => {
      // store this result in the answers array
      const opName = match.vals.values().next().value;
      opCodeMap[match.opCode] = opName;

      // delete it from the possibilities of all other entries
      potentials.forEach(pot => {
        pot.vals.delete(opName);
      });
    });

    numRemaining = getNumRemaining(potentials);
  }

  return opCodeMap;
}

function getNumRemaining(potentials: any[]) {
  return potentials.reduce((acc, val) => {
    acc = new Set([...acc, ...val.vals]);
    return acc;
  }, new Set()).size;
}

function getPotentials(inputs: Input[]) {
  const potentials: Set<string>[] = Array.from({ length: 16 }, () => new Set());
  for (let input of inputs) {
    for (let op of allOps) {
      let opFn = (ops as any)[op];
      const [opCode, ...rest] = input.instructions;
      const answer = opFn(rest, input.before);
      if (answer.join("") === input.after.join("")) {
        potentials[opCode].add(op);
      }
    }
  }

  return potentials.map((p, i) => ({
    opCode: i,
    vals: p
  }));
}

function parseInput(): Input[] {
  const raw = getInput("input.txt");
  const input: Input[] = [];
  for (let i = 0; i < raw.length; i += 4) {
    // before
    let regex = /\[([\d]), ([\d]), ([\d]), ([\d])\]$/;
    let parsed = raw[i].match(regex);
    let [_, a, b, c, d, ...rest] = parsed;
    const before = [a, b, c, d].map(Number) as Register;

    // instructions
    regex = /^([\d]+) ([\d]+) ([\d]+) ([\d]+)$/;
    parsed = raw[i + 1].match(regex);
    [_, a, b, c, d, ...rest] = parsed;
    const instructions = [a, b, c, d].map(Number);

    // after
    regex = /\[([\d]), ([\d]), ([\d]), ([\d])\]$/;
    parsed = raw[i + 2].match(regex);
    [_, a, b, c, d, ...rest] = parsed;
    const after = [a, b, c, d].map(Number) as Register;

    input.push({ before, instructions, after });
  }
  return input;
}

function parseTestInput(): { opCode: string; vals: number[] }[] {
  const raw = getInput("input-test.txt");
  const regex = /^([\d]+) ([\d]+) ([\d]+) ([\d]+)$/;
  return raw.map((r: any) => {
    let parsed = r.match(regex);
    const [_, a, b, c, d, ...rest] = parsed;
    const instructions = { opCode: opCodeMap[a], vals: [b, c, d].map(Number) };
    return instructions;
  });
}
