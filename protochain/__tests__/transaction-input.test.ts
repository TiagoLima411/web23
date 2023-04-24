import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import TransactionInput from "../src/lib/transaction-input";
import TransactionOutput from "../src/lib/transaction-output";
import Wallet from "../src/lib/wallet";

describe("TransactionInput tests", () => {

  let alice: Wallet, bob: Wallet;
  const exampleTx: string = "9d821656a2c0ef69b23b571c1da4479c4a816291ba2df30d5ce25d6ba4a26436";

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet(); 
  })

  test("returns true", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc',
    } as TransactionInput);

    txInput.sign(alice.privateKey);

    const valid = txInput.isValid()
    expect(valid.success).toBeTruthy();
  })

  test("returns false for default values", () => {
    const txInput = new TransactionInput();

    txInput.sign(alice.privateKey);

    const valid = txInput.isValid();
    expect(valid.success).toBeFalsy();
  })

  test("returns false for empty signature", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc',
    } as TransactionInput);

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("returns false for negative amount", () => {
    const txInput = new TransactionInput({
      amount: -1,
      fromAddress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput);

    txInput.sign(alice.privateKey);

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("returns false for invalid signature", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
      previousTx: 'abc',
    } as TransactionInput);

    txInput.sign(bob.privateKey);

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("returns false for invalid previousTx", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAddress: alice.publicKey,
    } as TransactionInput);

    txInput.sign(alice.privateKey);

    const valid = txInput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("creates from TXO", () => {
    const txi = TransactionInput.fromTxo({
      amount: 10,
      toAddress: alice.publicKey,
      tx: exampleTx,
    } as TransactionOutput);

    txi.sign(alice.privateKey);
    txi.amount = 11;
    const result = txi.isValid()
    expect(result.success).toBeFalsy();
  })
})