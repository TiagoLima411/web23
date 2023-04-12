import { describe, test, expect, jest } from "@jest/globals"
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transaction-input";
import { TransactionType } from "../src/lib/transaction-type";

jest.mock('../src/lib/transaction-input');

describe("Transaction tests", () => {
  test("returns true (REGULAR default)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "walletto"
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  })

  test("returns false (invalid hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: "walletto",
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  })

  test("returns true (FEE)", () => {
    const tx = new Transaction({
      to: "walletto",
      type: TransactionType.FEE
    } as Transaction);

    tx.txInput = undefined;
    tx.hash = tx.getHash();
    
    const valid = tx.isValid();
    expect(valid.success).toBeTruthy();
  })

  test("returns false for invalid to", () => {
    const tx = new Transaction()
    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  })

  test("returns false for invalid txInput", () => {
    const tx = new Transaction({
      to: "walletto",
      txInput: new TransactionInput({
        amount: -10,
        fromAddress: "walletfrom",
        signature: "abc",
      } as TransactionInput)
    } as Transaction);

    const valid = tx.isValid();
    expect(valid.success).toBeFalsy();
  })
})