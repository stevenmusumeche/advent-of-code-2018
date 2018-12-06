const { getInput } = require("../input");
const [rawInput] = getInput();

let current;
let next = rawInput;
do {
  current = next;
  next = replaceOnce(current);
} while (current !== next);

console.log("final size:", current.length);

function replaceOnce(input) {
  for (let i = 0; i < input.length - 1; i++) {
    const cur = input[i];
    const next = input[i + 1];
    if (cur.toLowerCase() === next.toLowerCase() && cur !== next) {
      return input.slice(0, i) + input.slice(i + 2, input.length);
    }
  }
  return input;
}
