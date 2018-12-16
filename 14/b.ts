interface Node {
  value: number;
  next: Node;
}

const circularLinkedList = (values: number[]) => {
  const instances = values.map(value => ({ value } as Node));
  for (let idx = 0; idx < values.length; idx++) {
    instances[idx].next = instances[idx + 1];
  }
  instances[instances.length - 1].next = instances[0];
  return instances;
};

let list = circularLinkedList([3, 7]);

let firstNode = list[0];
let lastNode = list[1];

const TARGET = "209231";

let elf1 = list[0];
let elf2 = elf1.next;
let length = 3;
let matched: string[] = [];

while (true) {
  // add next numbers to the list
  const values = [elf1.value, elf2.value];
  let nextSum = values[0] + values[1];
  let nextVals: number[] = [];
  if (nextSum >= 10) {
    nextVals.push(Math.trunc(nextSum / 10));
  }
  nextVals.push(nextSum % 10);

  // see if any of the new numbers match the part of the target we are on
  nextVals.forEach(value => {
    if (String(value) === TARGET[matched.length]) {
      matched.push(String(value));
    } else if (matched.length > 0) {
      matched = [];
    }

    if (matched.length === TARGET.length) {
      console.log("MATCHED", length - matched.length);

      process.exit();
    }

    length++;
    const node = { value, next: firstNode };
    lastNode.next = node;
    lastNode = node;
  });

  for (let i = 0; i < values[0] + 1; i++) {
    elf1 = elf1.next;
  }
  for (let i = 0; i < values[1] + 1; i++) {
    elf2 = elf2.next;
  }

  //printList();
}

function printList() {
  let curNode = firstNode;
  let i = 0;
  let vals = [];
  while (i < length - 1) {
    if (elf1 === curNode) vals.push("(" + curNode.value + ")");
    else if (elf2 === curNode) vals.push("[" + curNode.value + "]");
    else vals.push("" + curNode.value);
    curNode = curNode.next;
    i++;
  }
  console.log(vals.join(" "));
}
