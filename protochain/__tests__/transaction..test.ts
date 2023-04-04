import { describe, test, expect } from "@jest/globals"
import Transaction from "../src/lib/transaction";
import { TransactionType } from "../src/lib/transaction-type";

describe("Transaction tests", () => {
  test("returns true (REGULAR default)", () => {
    const tx = new Transaction({
      data: "fake tx"
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  })

  test("returns false (invalid hash)", () => {
    const tx = new Transaction({
      data: "fake tx",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  })

  test("returns true (FEE)", () => {
    const tx = new Transaction({
      data: "fake tx",
      type: TransactionType.FEE
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  })

  test("returns false to invalid data", () => {
    const tx = new Transaction()
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  })
})