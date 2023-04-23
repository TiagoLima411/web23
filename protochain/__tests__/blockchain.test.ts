import { describe, test, expect, jest } from '@jest/globals'
import Block from '../src/lib/block'
import { Blockchain } from '../src/lib/blockchain'
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transaction-input';
import TransactionOutput from '../src/lib/transaction-output';
import { TransactionType } from '../src/lib/transaction-type';
import Wallet from '../src/lib/wallet';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transaction-input');

describe("Blockchain tests", () => {
  let alice: Wallet;

  beforeAll(() => {
    alice = new Wallet();
  })

  test("retuns genesis block", ()=> {
    const blochain = new Blockchain(alice.publicKey);
    expect(blochain.blocks.length).toEqual(1)
  })

  describe(".isValid", () => {
    test("returns true", () => {
      const blockchain = new Blockchain(alice.publicKey);
      expect(blockchain.isValid().success).toEqual(true)
    })

    test("returns true with tree blocks", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const secondBlock = new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction)]
      } as Block);

      blockchain.addBlock(secondBlock)

      const lastBlock = new Block({
        index: 2, 
        previousHash: secondBlock.previousHash,
        transactions: [new Transaction({
          txInputs: [new TransactionInput()],
        } as Transaction)],
      } as Block);
      blockchain.addBlock(lastBlock);
      
      expect(blockchain.isValid().success).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction);

      blockchain.mempool.push(tx);

      const secondBlock = new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [tx],
      } as Block);
      blockchain.addBlock(secondBlock)
      
      blockchain.blocks[1].index = -1; 
      
      expect(blockchain.isValid().success).toEqual(false)
    })
  })

  describe('.addTransaction', () => {
    test("returns true", () => {
      const blockchain = new Blockchain(alice.publicKey);
      const txo = blockchain.blocks[0].transactions[0];

      const tx = new Transaction();
      tx.hash = 'tx'
      tx.txInputs = [new TransactionInput({
        amount: 10,
        previousTx: txo.hash,
        fromAddress: alice.publicKey,
        signature: 'abc',
      } as TransactionInput)];

      tx.txOutputs = [new TransactionOutput({
        amount: 10,
        toAddress: 'abc',
      } as TransactionOutput)];

      const validation = blockchain.addTransaction(tx);
      
      expect(validation.success).toEqual(true);
    })

    test("returns false with pending tx", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "xyz"
      } as Transaction);

      blockchain.addTransaction(tx);
      
      const tx2 = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "xyz"
      } as Transaction);

      const validation = blockchain.addTransaction(tx2);
      expect(validation.success).toEqual(false);
    })

    test("returns false with invalid tx", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "xyz",
        timestamp: -1,
      } as Transaction);

      const validation = blockchain.addTransaction(tx);
      
      expect(validation.success).toEqual(false);
    })

    test("returns false with duplicated in blockchain", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "xyz"
      } as Transaction);

      blockchain.blocks.push(new Block({
        transactions: [tx]
      } as Block));

      const validation = blockchain.addTransaction(tx);
      expect(validation.success).toEqual(false);
    })
  })

  describe('.getTransaction', () => {
    test("returns expected mempool index", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "abc"
      } as Transaction);

      blockchain.mempool.push(tx);

      const result = blockchain.getTransaction("abc");
      
      expect(result.mempoolIndex).toEqual(0)
    })

    test("returns expected blockchain index", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
        hash: "xyz"
      } as Transaction);

      blockchain.blocks.push(new Block({
        transactions: [tx]
      } as Block));

      const result = blockchain.getTransaction("xyz");
      
      expect(result.blockIndex).toEqual(1)
    })

    test("returns not found transaction", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const result = blockchain.getTransaction("xyz");
      
      expect(result.blockIndex).toEqual(-1);
      expect(result.mempoolIndex).toEqual(-1);
    })
  })

  describe('.addBlock', () => {
    test("returns true", () => {
      const blockchain = new Blockchain(alice.publicKey);

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction);

      blockchain.mempool.push(tx);

      const result = blockchain.addBlock(new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [tx],
      } as Block));

      expect(result.success).toEqual(true);
    })

    test("returns false (invalid mempool)", () => {
      const blockchain = new Blockchain(alice.publicKey);
      blockchain.mempool.push(new Transaction());
      blockchain.mempool.push(new Transaction());

      const tx = new Transaction({
        txInputs: [new TransactionInput()],
      } as Transaction);

      blockchain.mempool.push(tx);

      const result = blockchain.addBlock(new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [tx],
      } as Block));

      expect(result.success).toBeFalsy();
    })

    test("returns false (invalid index)", () => {
      const blockchain = new Blockchain(alice.publicKey);
      blockchain.mempool.push(new Transaction());
      
      const block = new Block({
        index: -1, 
        previousHash: blockchain.blocks[0].hash,
      } as Block);

      block.transactions.push(new Transaction({
        type: TransactionType.FEE,
        txOutputs: [new TransactionOutput({
          toAddress: alice.publicKey,
          amount: 1,
        } as TransactionOutput)]
      } as Transaction));

      block.hash = block.getHash();

      const result = blockchain.addBlock(block);
      expect(result.success).toEqual(false)
    })
  })

  describe(".getBlock", () => {
    test("returns block", () => {
      const blochain = new Blockchain(alice.publicKey);
      const block = blochain.getBlock(blochain.blocks[0].hash);
      expect(block).toBeTruthy();
    })
  })

  describe(".getNextBlock", () => {
    test("returns expected index", () => {
      const blochain = new Blockchain(alice.publicKey);
      blochain.mempool.push(new Transaction());

      const info = blochain.getNextBlock();
      expect(info ? info.index : 0).toEqual(1);
    })

    test("returns null", () => {
      const blochain = new Blockchain(alice.publicKey);
      const info = blochain.getNextBlock();
      expect(info).toBeNull();
    })
  })
})
