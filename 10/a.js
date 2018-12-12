const { getInput } = require("../input");

let vals = getCoords();
//console.log(vals);

const boundingBox = 70;

let second = 0;
let newVals = vals;
while (second <= 11000) {
  vals.forEach(({ pos, vel }, key) => {
    const [x, y] = pos;
    const [vX, vY] = vel;

    const newX = x + second * vX;
    const newY = y + second * vY;
    newVals[key] = { pos, vel, newPos: [newX, newY] };
  });

  vals = newVals;
  const limits = calcLimits(vals);

  if (
    limits.maxX - limits.minX < boundingBox &&
    limits.maxY - limits.minY < boundingBox
  ) {
    console.log("second", second);
    draw(limits);
  }

  second++;
}

function draw(limits) {
  for (let col = limits.minY; col <= limits.maxY; col++) {
    let foo = [];
    for (let row = limits.minX; row <= limits.maxX; row++) {
      const val = vals.find(
        val => val.newPos[0] === row && val.newPos[1] === col
      );
      if (val) {
        foo.push("#");
      } else {
        foo.push(".");
      }
    }
    console.log(foo.join(""));
  }
}

function calcLimits(vals) {
  return vals.reduce(
    (acc, cur) => {
      const [x, y] = cur.newPos;
      if (x > acc.maxX) acc.maxX = x;
      if (x < acc.minX) acc.minX = x;
      if (y > acc.maxY) acc.maxY = y;
      if (y < acc.minY) acc.minY = y;
      return acc;
    },
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );
}

function getCoords() {
  const raw = getInput("input.txt");
  const regex = /position=<(?<posX>[\-\s\d]+),(?<posY>[\-\s\d]+)> velocity=<(?<velX>[\-\s\d]+),(?<velY>[\-\s\d]+)>/;
  const vals = raw.map(x => {
    const { groups } = x.match(regex);
    const pos = [Number(groups.posX.trim()), Number(groups.posY.trim())];
    return {
      pos: pos,
      vel: [Number(groups.velX.trim()), Number(groups.velY.trim())],
      newPos: pos
    };
  });
  return vals;
}
