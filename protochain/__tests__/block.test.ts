import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import { Block } from "../src/lib/block"
import BlockInfo from "../src/lib/blockinfo";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transaction-input";
import { TransactionType } from "../src/lib/transaction-type";

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transaction-input");

describe("Block tests", () => {

  const exampleDifficulty = 1;
  const exampleMiner = "xpto-wallet"
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block)
  })

  test("returns true", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)],} as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns false no fee", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)],} as Block);

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("creates from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)], 
      difficulty: exampleDifficulty, 
      feePerTx: 1, 
      index: 1, 
      maxDifficulty: 62, 
      previousHash: genesis.hash
    } as BlockInfo);
    
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns falses with fallback", () => {
    const block = new Block();

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));

    block.hash = block.getHash();

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
          txInput: new TransactionInput(),
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          txInput: new TransactionInput(),
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

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);
  
    block.transactions[0].to = "";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty previous hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "", 
      transactions: [new Transaction(
          {
            txInput: new TransactionInput(),
          } as Transaction)]
      } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
    
    block.hash = block.getHash();
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = new Block({
      index: -1, 
      previousHash: 
      genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "invalid.hash", 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficulty, exampleMiner);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block)
    block.timestamp = -1;

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
  
    block.hash = block.getHash();
    block.mine(exampleDifficulty, exampleMiner);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, exampleMiner);

    block.hash = ''
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to txInput", () => {
    const txInput = new TransactionInput();
    txInput.amount = -1;

    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput,
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to no mined", () => {
    const block = new Block({
      index: 1,
      nonce: 0,
      miner: exampleMiner,
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInput: new TransactionInput(),
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      to: exampleMiner
    } as Transaction));
  
    block.hash = block.getHash();
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })
})