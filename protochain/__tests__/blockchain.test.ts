import { describe, test, expect } from '@jest/globals'
import { Block } from '../src/lib/block'
import { Blockchain } from '../src/lib/blockchain'

describe("Blockchain tests", () => {
  test("retuns genesis block", ()=> {
    const blochain = new Blockchain()
    expect(blochain.blocks.length).toEqual(1)
  })

  describe(".isValid", () => {
    test("returns true", () => {
      const blockchain = new Blockchain();
      expect(blockchain.isValid()).toEqual(true)
    })

    test("returns true with tree blocks", () => {
      const blockchain = new Blockchain();
      const secondBlock = new Block(1, blockchain.blocks[0].hash, "second block");
      blockchain.addBlock(secondBlock)
      const lastBlock = new Block(2, secondBlock.previousHash, "more data");
      blockchain.addBlock(lastBlock);
      
      expect(blockchain.isValid()).toEqual(true)
    })

    test("returns false", () => {
      const blockchain = new Blockchain();
      const secondBlock = new Block(1, blockchain.blocks[0].hash, "second block");
      blockchain.addBlock(secondBlock)
      
      blockchain.blocks[1].data = "invalid data"
      
      expect(blockchain.isValid()).toEqual(false)
    })
  })

  describe('.addBlock', () => {
    test("returns true", ()=> {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, "New data"));
      expect(result).toEqual(true)
    })

    test("returns false", ()=> {
      const blockchain = new Blockchain();
      const result = blockchain.addBlock(new Block(-1, blockchain.blocks[0].hash, "New data"));
      expect(result).toEqual(false)
    })
  })


})