import { describe, test, expect, beforeAll } from "@jest/globals"
import { Block } from "../src/lib/block"

describe("Block tests", () => {
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block(0, "", "Genesis Block")
  })

  test("returns true", () => {
    const block = new Block(1, genesis.hash, "fake data")
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid).toBeTruthy();
  })

  test("returns false to hash", () => {
    const block = new Block(1, "", "fake data")
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = new Block(-1, genesis.hash, "fake data")
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block(1, "invalid.hash", "fake data")
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block(1, genesis.hash, "fake data")
    block.timestamp = -1
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index); 
    expect(valid).toBeFalsy();
  })

  test("returns false to hash", () => {
    const block = new Block(1, genesis.hash, "fake data")
    block.hash = ''
    const valid = block.isValid(genesis.hash, genesis.index); 
    expect(valid).toBeFalsy();
  })

  test("returns false to data", () => {
    const block = new Block(1, genesis.hash, "")
    const valid = block.isValid(genesis.hash, genesis.index); 
    expect(valid).toBeFalsy();
  })
})