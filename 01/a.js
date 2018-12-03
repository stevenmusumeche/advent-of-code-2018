const fs = require("fs");

const input = fs.readFileSync("./input.txt", "utf8");
const nums = input.split("\n");
const result = nums.reduce((acc, cur) => {
  acc += Number(cur);
  return acc;
}, 0);
console.log(result);
