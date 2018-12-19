import ops, { Register, Vals } from "./ops";
import { getInput } from "../input";

interface Input {
  before: Register;
  instructions: any;
  after: Register;
}

let inputs = parseInput();
let a;
//inputs = [inputs[0]];

const allOps = Object.keys(ops);

let withThreeDups = 0;
for (let input of inputs) {
  // console.log(input);
  // console.log();

  let numSame = 0;
  // loop over all ops, calculate and compare.  if 3 or more match, increment withThreeDups and break out of loop
  for (let op of allOps) {
    let opFn = (ops as any)[op];
    const [opCode, ...rest] = input.instructions;
    const answer = (ops as any)[op](rest, input.before);
    if (answer.join("") === input.after.join("")) {
      numSame++;
      //console.log("match");

      if (numSame >= 3) {
        //console.log("three");

        withThreeDups++;
        break;
      }
    }
    //console.log(op, answer);
  }
}

console.log("final", withThreeDups);

let reg: Register = [3, 2, 1, 1];
let code: Vals = [2, 1, 2];
let val;

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
