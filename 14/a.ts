interface Node {
  value: number;
}

const AFTER = 209231;
const NUM_RECIPES = 10;

let firstElfIndex = 0;
let secondElfIndex = 1;

let list: Node[] = [];
list.push(createNode(3));
list.push(createNode(7));

let foo = 0;
while (AFTER + NUM_RECIPES >= list.length) {
  //console.log(`----- After ${foo + 1} -----`);
  let nextSum = list[firstElfIndex].value + list[secondElfIndex].value;
  if (nextSum >= 10) list.push(createNode(Math.floor((nextSum / 10) % 10)));
  list.push(createNode((nextSum / 1) % 10));

  let dist = 1 + list[firstElfIndex].value;
  let nextIndex = (firstElfIndex + dist) % list.length;
  firstElfIndex = nextIndex;

  dist = 1 + list[secondElfIndex].value;
  nextIndex = (secondElfIndex + dist) % list.length;
  secondElfIndex = nextIndex;

  //printList(list);

  foo++;
}

console.log("FINAL");
console.log(
  list
    .map(x => x.value)
    .join("")
    .substr(AFTER, NUM_RECIPES)
);

function createNode(value: number): Node {
  return { value };
}

function printList(list: Node[]) {
  let withOwners = list.map((node, i) => {
    if (i === firstElfIndex) return `(${node.value})`;
    if (i === secondElfIndex) return `[${node.value}]`;
    return node.value;
  });

  console.log(withOwners.join(" "));
}
