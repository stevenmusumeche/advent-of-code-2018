export type Register = [number, number, number, number];
export type Vals = [number, number, number];

function clone(reg: Register): Register {
  return [...reg] as Register;
}

export default {
  // (add register) stores into register C the result of adding register A and register B.
  addr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] + reg[b];
    return mod;
  },
  // (add immediate) stores into register C the result of adding register A and value B.
  addi([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] + b;
    return mod;
  },
  // (multiply register) stores into register C the result of multiplying register A and register B.
  mulr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] * reg[b];
    return mod;
  },
  // (multiply immediate) stores into register C the result of multiplying register A and value B.
  muli([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] * b;
    return mod;
  },
  // (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  banr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] & reg[b];
    return mod;
  },
  // (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
  bani([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] & b;
    return mod;
  },
  // (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  borr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] | reg[b];
    return mod;
  },
  // (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
  bori([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] | b;
    return mod;
  },
  // (set register) copies the contents of register A into register C. (Input B is ignored.)
  setr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a];
    return mod;
  },
  // (set immediate) stores value A into register C. (Input B is ignored.)
  seti([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = a;
    return mod;
  },
  // (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  gtir([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = a > reg[b] ? 1 : 0;
    return mod;
  },
  // (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  gtri([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] > b ? 1 : 0;
    return mod;
  },
  // (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
  gtrr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] > reg[b] ? 1 : 0;
    return mod;
  },
  // (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  eqir([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = a === reg[b] ? 1 : 0;
    return mod;
  },
  // (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  eqri([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] === b ? 1 : 0;
    return mod;
  },
  // (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
  eqrr([a, b, c]: Vals, reg: Register): Register {
    const mod = clone(reg);
    mod[c] = reg[a] === reg[b] ? 1 : 0;
    return mod;
  }
};
