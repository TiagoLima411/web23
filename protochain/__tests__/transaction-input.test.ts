import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import TransactionInput from "../src/lib/transaction-input";
import Wallet from "../src/lib/wallet";

describe("TransactionInput tests", () => {

  let alice: Wallet;
  let bob: Wallet;

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
})