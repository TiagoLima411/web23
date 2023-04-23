import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import Block from "../src/lib/block"
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

  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;
  const exampleTx: string = "9d821656a2c0ef69b23b571c1da4479c4a816291ba2df30d5ce25d6ba4a26436";
  let alice: Wallet, bob: Wallet;
  let genesis: Block;

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet();

    genesis = new Block({
      transactions: [new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction)]
    } as Block)
  })
 
  function getFullBlock(): Block {
    const txIn = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: exampleTx,
    } as TransactionInput);

    txIn.sign(alice.privateKey);

    const txOut = new TransactionOutput({
      amount: 10,
      toAddress: bob.publicKey,
    } as TransactionOutput);

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut]
    } as Transaction);

    const txFee = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        amount: 1,
        toAddress: alice.publicKey
      } as TransactionOutput)]
    } as Transaction);

    const block = new Block({
      index: 1,
      transactions: [tx, txFee],
      previousHash: genesis.hash,
    } as Block);

    block.mine(exampleDifficulty, alice.publicKey);

    return block;
  }

  test("returns true", () => {
    const block = getFullBlock();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);

    expect(valid.success).toBeTruthy();
  })

  test("returns false (different hash)", () => {
    const block = getFullBlock();
    block.hash = "abc";

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);
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
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);

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

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput({
        toAddress: alice.publicKey,
        amount: 1,
      } as TransactionOutput)]
    } as Transaction);
    
    block.transactions.push(tx);
    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);

    expect(valid.success).toBeTruthy();
  })

  test("returns falses with fallback", () => {
    const block = new Block();

    block.transactions.push(new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput()]
    } as Transaction));

    block.hash = block.getHash();

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false (2 fee)", () => {
    const block = getFullBlock();

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [new TransactionOutput()],
    } as Transaction);
    tx.txInputs = undefined;

    block.transactions.push(tx);

    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);

    expect(valid.success).toBeFalsy();
  })

  test("returns false (invalid tx)", () => {
    const block = getFullBlock();

    block.transactions[0].timestamp = -1
    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty previous hash", () => {
    const block = getFullBlock();

    block.previousHash = "";
    block.hash = block.getHash();
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);

    expect(valid.success).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = getFullBlock();
    block.index = -1;

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = getFullBlock();
    block.previousHash = "wrong";
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = getFullBlock();
    block.timestamp = -1;
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to empty hash", () => {
    const block = getFullBlock();
    block.hash = "";
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee); 
    expect(valid.success).toBeFalsy();
  })

  test("returns false to no mined", () => {
    const block = getFullBlock();
    block.nonce = 0;
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty, exampleFee); 
    expect(valid.success).toBeFalsy();
  })
})