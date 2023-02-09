import { describe, test, expect } from '@jest/globals'
import { Blockchain } from '../src/lib/blockchain'

describe("Blockchain tests", () => {
  test("retuns blochain", ()=> {
    const blochain = new Blockchain()
    const block = blochain.blocks[0]

    expect(block.index).toEqual(0)
    expect(block.data).toEqual('Genesis Block')
    expect(block.previousHash).toEqual('')
  })
})