import { describe, test, expect } from "@jest/globals"
import { Block } from "../src/lib/block"

describe("Block tests", () => {
  test("returns true", () => {
    const block = new Block(1, "prev hash", "fake data")
    const valid = block.isValid();
    expect(valid).toBeTruthy();
  })

  test("returns false to hash", () => {
    const block = new Block(1, '', "fake data")
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("returns false to index", () => {
    const block = new Block(-1, '', "fake data")
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("returns false to previousHash", () => {
    const block = new Block(1, '', "fake data")
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("returns false to timestamp", () => {
    const block = new Block(1, "prev hash", "fake data")
    block.timestamp = 0
    const valid = block.isValid(); 
    expect(valid).toBeFalsy();
  })

  test("returns false to hash", () => {
    const block = new Block(1, "prev hash", "fake data")
    block.hash = ''
    const valid = block.isValid(); 
    expect(valid).toBeFalsy();
  })

  test("returns false to data", () => {
    const block = new Block(1, "prev hash", "")
    const valid = block.isValid(); 
    expect(valid).toBeFalsy();
  })
})