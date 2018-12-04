const fs = require("fs");

function getInput(file = "./input.txt") {
  const input = fs.readFileSync(file, "utf8");
  return input.split("\n");
}

module.exports = { getInput };
