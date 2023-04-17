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
    const txInput = new TransactionOutput({
      amount: 10,
      toAddress: alice.publicKey
    } as TransactionOutput);

    const valid = txInput.isValid()
    expect(valid.success).toBeTruthy();
  })
})