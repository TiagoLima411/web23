import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import TransactionOutput from "../src/lib/transaction-output";
import Wallet from "../src/lib/wallet";

describe("TransactionOutput tests", () => {

  let alice: Wallet;
  let bob: Wallet;

  beforeAll(() => {
    alice = new Wallet();
    bob = new Wallet(); 
  })

  test("returns true", () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      tx: "abc",
    } as TransactionOutput);

    const valid = txOutput.isValid()
    expect(valid.success).toBeTruthy();
  })

  test("returns true with default values", () => {
    const txOutput = new TransactionOutput();
    const valid = txOutput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("returns false", () => {
    const txOutput = new TransactionOutput({
      amount: -10,
      toAddress: alice.publicKey,
      tx: "abc",
    } as TransactionOutput);

    const valid = txOutput.isValid()
    expect(valid.success).toBeFalsy();
  })

  test("returns hash", () => {
    const txOutput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey,
      tx: "abc",
    } as TransactionOutput);

    const hash = txOutput.getHash()
    expect(hash).toBeTruthy();
  })
})