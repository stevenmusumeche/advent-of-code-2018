const { getInput } = require("../input");

const input = getInput();
const parsedInput = parseInput(input);
const uniqueClaimants = new Set();
const grid = buildGrid(parsedInput);

console.log("Winner:", uniqueClaimants.values());

function buildGrid(input) {
  const gridSize = getGridSize(input);
  const grid = initGrid(gridSize);

  for (entry of input) {
    // create a Set with all claims
    uniqueClaimants.add(entry.claimId);

    for (let row = entry.top; row < entry.height + entry.top; row++) {
      for (let col = entry.left; col < entry.left + entry.width; col++) {
        // add this claim to this slot
        grid[row][col].push(entry.claimId);

        // if this slot already has another claim in it, remove this claimId from uniqueClaimants
        if (grid[row][col].length > 1) {
          grid[row][col].forEach(claimId => {
            uniqueClaimants.delete(claimId);
          });
        }
      }
    }
  }
  return grid;
}

/**
 * initialize the grid with all zeros
 */
function initGrid(gridSize) {
  return Array.from({ length: gridSize.height }, () =>
    Array.from({ length: gridSize.width }, () => [])
  );
}

function parseInput(input) {
  return input.map(x => {
    const re = /^#(?<claimId>[\d]+) @ (?<left>[\d]+),(?<top>[\d]+): (?<width>[\d]+)x(?<height>[\d]+)$/;
    const { groups } = x.match(re);

    // convert to numbers
    const numberedGroups = Object.keys(groups).reduce((acc, cur) => {
      acc[cur] = Number(groups[cur]);
      return acc;
    }, {});

    return { ...numberedGroups, input: x };
  });
}

function getGridSize(input) {
  return input.reduce(
    (acc, cur) => {
      const { left, top, width, height } = cur;
      const curWidth = Number(left) + Number(width) + 1;
      const curHeight = Number(top) + Number(height) + 1;
      if (curWidth > acc.width) acc.width = curWidth;
      if (curHeight > acc.height) acc.height = curHeight;
      return acc;
    },
    {
      width: 0,
      height: 0
    }
  );
}
