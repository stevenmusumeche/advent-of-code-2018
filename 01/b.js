const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf8");
const nums = input.split("\n");
const frequencies = { 0: true };
let frequency = 0;
let found = null;
while (found === null) {
  for (let i = 0; i < nums.length; i++) {
    frequency += Number(nums[i]);

    if (frequencies[frequency]) {
      found = frequency;
      break;
    }
    frequencies[frequency] = true;
  }
}

console.log(found);
