import { describe, test, expect, jest, beforeAll } from "@jest/globals"
import Transaction from "../src/lib/transaction";
import TransactionInput from "../src/lib/transaction-input";
import TransactionOutput from "../src/lib/transaction-output";
import { TransactionType } from "../src/lib/transaction-type";
import Wallet from "../src/lib/wallet";

jest.mock('../src/lib/transaction-input');
jest.mock('../src/lib/transaction-output');

describe("Transaction tests", () => {
  const exampleDifficulty: number = 1;
  const exampleFee: number = 1;
  const exampleTx: string = "9d821656a2c0ef69b23b571c1da4479c4a816291ba2df30d5ce25d6ba4a26436";
  let alice: Wallet, bob: Wallet;
  
  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet();
  })

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

  test("returns fee", () => {
    const txIn = new TransactionInput({
      amount: 11,
      fromAddress: alice.publicKey,
      previousTx: exampleTx,
    } as TransactionInput);

    const txOut = new TransactionOutput({
      amount: 10,
      toAddress: bob.publicKey
    } as TransactionOutput);

    const tx = new Transaction({
      txInputs: [txIn],
      txOutputs: [txOut]
    } as Transaction);

    const result = tx.getFee();
    
    expect(result).toBeGreaterThan(0);
  })

  test("returns zero fee", () => {
    const tx = new Transaction();
    tx.txInputs = undefined;
    const result = tx.getFee();
    
    expect(result).toEqual(0);
  })

  test("creates from reward", () => {
    const tx = Transaction.fromReward({
      amount: 10,
      toAddress: alice.publicKey,
      tx: exampleTx
    } as TransactionOutput);

    const result = tx.isValid(exampleDifficulty, exampleFee);
    expect(result.success).toBeTruthy();
  })

  test("returns false (fee excess)", () => {
    const txOut = new TransactionOutput({
      amount: Number.MAX_VALUE,
      toAddress: bob.publicKey,
    } as TransactionOutput);

    const tx = new Transaction({
      type: TransactionType.FEE,
      txOutputs: [txOut],
    } as Transaction);

    const result = tx.isValid(exampleDifficulty, exampleFee);
    expect(result.success).toBeFalsy();
  })
})