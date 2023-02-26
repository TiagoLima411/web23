import { describe, test, expect, beforeAll } from "@jest/globals"
import { Block } from "../src/lib/block"

describe("Block tests", () => {

  const exampleDifficulty = 0;
  const exampleMiner = "xpto-wallet"
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block(<Block>{previousHash: "", data: "Genesis Block"})
  })

  test("returns true", () => {
    const block = new Block(<Block>{index: 1, previousHash: genesis.hash, data: "fake data"})
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns falses with fallback", () => {
    const block = new Block()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty previous hash", () => {
    const block = new Block(<Block>{index: 1, previousHash: "", data: "fake data"})
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = new Block(<Block>{index: -1, previousHash: genesis.hash, data: "fake data"})
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block(<Block>{index: 1, previousHash: "invalid.hash", data: "fake data"})
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block(<Block>{index: 1, previousHash: genesis.hash, data: "fake data"})
    block.timestamp = -1
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty hash", () => {
    const block = new Block(<Block>{index: 1, previousHash: genesis.hash, data: "fake data"})
    block.mine(exampleDifficulty, exampleMiner);

    block.hash = ''
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to data", () => {
    const block = new Block(<Block>{index: 1, previousHash: genesis.hash, data: ""})
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to no mined", () => {
    const block = new Block(<Block>{index: 1, previousHash: genesis.hash, data: "fake data"})
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })
})