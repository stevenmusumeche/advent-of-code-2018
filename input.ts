const fs = require("fs");

export function getInput(file = "./input.txt"): string[] {
  const input = fs.readFileSync(file, "utf8");
  return input.split("\n");
}
