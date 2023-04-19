import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import { Block } from "../src/lib/block"
import BlockInfo from "../src/lib/blockinfo";
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transaction-input";
import TransactionOutput from "../src/lib/transaction-output";
import { TransactionType } from "../src/lib/transaction-type";
import Wallet from "../src/lib/wallet";

jest.mock("../src/lib/transaction");
jest.mock("../src/lib/transaction-input");
jest.mock("../src/lib/transaction-output");

describe("Block tests", () => {

  const exampleDifficulty = 1;
  let alice: Wallet;
  let genesis: Block;

  beforeAll(() => {
    alice = new Wallet();

    genesis = new Block({
      transactions: [new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction)]
    } as Block)
  })

  test("returns true", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as TransactionOutput)]
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns false (different hash)", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1
      } as TransactionOutput)]
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = "hash";
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false no fee", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction)],} as Block);

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("creates from block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [], 
      difficulty: exampleDifficulty, 
      feePerTx: 1, 
      index: 1, 
      maxDifficulty: 62, 
      previousHash: genesis.hash
    } as BlockInfo);
    
    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeTruthy();
  })

  test("returns falses with fallback", () => {
    const block = new Block();

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput()]
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
          txInputs: [new TransactionInput()],
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          txInputs: [new TransactionInput()],
        } as Transaction),
      ],} as Block)
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);

    expect(valid.success).toBeFalsy();
  })

  test("returns false (invalid tx)", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [] as Transaction[],
    } as Block)

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      timestamp: -1,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty previous hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "", 
      transactions: [new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction)]
      } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput]
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
      transactions: [] as Transaction[]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block({
      index: 1, 
      previousHash: "invalid.hash", 
      transactions: [] as Transaction[],
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [] as Transaction[]
    } as Block)
    block.timestamp = -1;

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));
  
    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty hash", () => {
    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput]
    } as Transaction));
  
    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);

    block.hash = ''
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to txInput", () => {
    const txInputs = [new TransactionInput()];
    txInputs[0].amount = -1;

    const block = new Block({
      index: 1, 
      previousHash: genesis.hash, 
      transactions: [new Transaction({
        txInputs,
      } as Transaction)]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput]
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to no mined", () => {
    const block = new Block({
      index: 1,
      nonce: 0,
      miner: alice.publicKey,
      previousHash: genesis.hash, 
      transactions: [] as Transaction[]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction));
  
    block.hash = block.getHash();
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty); 
    expect(valid.success).toBeFalsy();
  })
})