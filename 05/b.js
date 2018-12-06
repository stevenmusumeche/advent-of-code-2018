const { getInput } = require("../input");
const [rawInput] = getInput();

let alphabet = getAlphabet();

let shortest = Infinity;

alphabet.forEach(letter => {
  console.log("working on " + letter);

  const attempt = rawInput.replace(new RegExp(letter, "gi"), "");
  let current;
  let next = attempt;
  do {
    current = next;
    next = replaceOnce(current);
  } while (current !== next);

  if (current.length < shortest) {
    shortest = current.length;
  }
});
console.log("Shortest polymer:", shortest);

function getAlphabet() {
  let alphabet = [];
  for (i = 65; i <= 90; i++) {
    alphabet.push(String.fromCharCode(i).toLowerCase());
  }
  return alphabet;
}

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
