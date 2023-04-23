import { describe, test, expect, jest } from "@jest/globals"
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transaction-input";
import TransactionOutput from "../src/lib/transaction-output";
import { TransactionType } from "../src/lib/transaction-type";

jest.mock('../src/lib/transaction-input');
jest.mock('../src/lib/transaction-output');

describe("Transaction tests", () => {
  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;

  test("returns true (REGULAR default)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction)
    
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeTruthy();
  })

  test("returns false (txo hash != tx hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()]
    } as Transaction);
    
    tx.txOutputs[0].tx = 'xpto';

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false (inputs < outputs)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput({
        amount: 1,
      } as TransactionInput)],
      txOutputs: [new TransactionOutput({
        amount: 2
      } as TransactionOutput)]
    } as Transaction);
    
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false (invalid hash)", () => {
    const tx = new Transaction({
      txInputs: [new TransactionInput()],
      txOutputs: [new TransactionOutput()],
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: "abc",
    } as Transaction)
    
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns true (FEE)", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      type: TransactionType.FEE
    } as Transaction);

    tx.txInputs = undefined;
    tx.hash = tx.getHash();
    
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeTruthy();
  })

  test("returns false for invalid to", () => {
    const tx = new Transaction()
    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })

  test("returns false for invalid txInput", () => {
    const tx = new Transaction({
      txOutputs: [new TransactionOutput()],
      txInputs: [
        new TransactionInput({
          amount: -10,
          fromAddress: "walletfrom",
          signature: "abc",
        } as TransactionInput)
      ]
    } as Transaction);

    const valid = tx.isValid(exampleDifficulty, exampleFee);
    expect(valid.success).toBeFalsy();
  })
})