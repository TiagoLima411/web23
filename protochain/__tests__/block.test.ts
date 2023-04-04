import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import { Block } from "../src/lib/block"
import BlockInfo from "../src/lib/blockinfo";
import Transaction from "../src/lib/transaction";
import { TransactionType } from "../src/lib/transaction-type";

jest.mock("../src/lib/transaction")

describe("Block tests", () => {

  const exampleDifficulty = 0;
  const exampleMiner = "xpto-wallet"
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      transactions: [new Transaction({
        data: "Genesis block"
      } as Transaction)]
    } as Block)
  })

  test("returns true", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)],} as Block)
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("creates from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [new Transaction({
        data: "Block 2",
      } as Transaction)], 
      difficulty: exampleDifficulty, 
      feePerTx: 1, 
      index: 1, 
      maxDifficulty: 62, 
      previousHash: genesis.hash
    } as BlockInfo);
    
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns falses with fallback", () => {
    const block = new Block()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false (2 fee)", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: "fee 1"
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          data: "fee 2"
        } as Transaction),
      ],} as Block)
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false (invalid tx)", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction()],
    } as Block)
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty previous hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "", 
      transactions: [new Transaction(
          {
            data: "fake data"
          } as Transaction)]
      } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = new Block({
      index: -1, 
      previousHash: 
      genesis.hash, 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)]
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "invalid.hash", 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)]
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)]
    } as Block)
    block.timestamp = -1
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)]
    } as Block)
    block.mine(exampleDifficulty, exampleMiner);

    block.hash = ''
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to data", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: ""
      } as Transaction)]
    } as Block)
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to no mined", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        data: "fake data"
      } as Transaction)]
    } as Block)
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })
})