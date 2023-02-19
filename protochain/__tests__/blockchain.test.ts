import { describe, test, expect, jest } from '@jest/globals'
import { Block } from '../src/lib/block'
import { Blockchain } from '../src/lib/blockchain'

jest.mock('../src/lib/block');

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
      const secondBlock = new Block(<Block>{index: 1, previousHash: blockchain.blocks[0].hash, data: "second block"});
      blockchain.addBlock(secondBlock)
      const lastBlock = new Block(<Block>{index: 2, previousHash: secondBlock.previousHash, data: "more data"});
      blockchain.addBlock(lastBlock);
      
      expect(blockchain.isValid().success).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain();
      const secondBlock = new Block(<Block>{index: 1, previousHash: blockchain.blocks[0].hash, data: "second block"});
      blockchain.addBlock(secondBlock)
      
      blockchain.blocks[1].index = -1; 
      
      expect(blockchain.isValid().success).toEqual(false)
    })
  })

  describe('.addBlock', () => {
    test("returns true", () => {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block(<Block>{index: 1, previousHash: blockchain.blocks[0].hash, data: "New data"}));
      expect(result.success).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block(<Block>{index: -1, previousHash: blockchain.blocks[0].hash, data: "New data"}));
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

})