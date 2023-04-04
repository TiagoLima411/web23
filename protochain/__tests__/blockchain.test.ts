import { describe, test, expect, jest } from '@jest/globals'
import { Block } from '../src/lib/block'
import { Blockchain } from '../src/lib/blockchain'
import Transaction from '../src/lib/transaction';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');

describe("Blockchain tests", () => {
  test("retuns genesis block", ()=> {
    const blochain = new Blockchain()
    expect(blochain.blocks.length).toEqual(1)
  })

  describe(".isValid", () => {
    test("returns true", () => {
      const blockchain = new Blockchain();
      expect(blockchain.isValid().success).toEqual(true)
    })

    test("returns true with tree blocks", () => {
      const blockchain = new Blockchain();
      const secondBlock = new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [new Transaction({
          data: "second block"
        } as Transaction)]
      } as Block);
      blockchain.addBlock(secondBlock)
      const lastBlock = new Block({
        index: 2, 
        previousHash: secondBlock.previousHash,
        transactions: [new Transaction({
          data: "more data"
        } as Transaction)],
      } as Block);
      blockchain.addBlock(lastBlock);
      
      expect(blockchain.isValid().success).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain();
      const secondBlock = new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [new Transaction({
          data: "second block"
        } as Transaction)],
      } as Block);
      blockchain.addBlock(secondBlock)
      
      blockchain.blocks[1].index = -1; 
      
      expect(blockchain.isValid().success).toEqual(false)
    })
  })

  describe('.addBlock', () => {
    test("returns true", () => {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block({
        index: 1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [new Transaction({
          data: "New data"
        } as Transaction)],
      } as Block));
      expect(result.success).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block({
        index: -1, 
        previousHash: blockchain.blocks[0].hash, 
        transactions: [new Transaction({
          data: "New data"
        } as Transaction)],
      } as Block));
      expect(result.success).toEqual(false)
    })
  })

  describe(".getBlock", () => {
    test("returns block", () => {
      const blochain = new Blockchain();
      const block = blochain.getBlock(blochain.blocks[0].hash);
      expect(block).toBeTruthy();
    })
  })

  describe(".getNextBlock", () => {
    test("returns expected index", () => {
      const blochain = new Blockchain();
      const info = blochain.getNextBlock();
      expect(info.index).toEqual(1);
    })
  })

})