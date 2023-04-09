import { describe, test, expect, beforeAll, jest } from "@jest/globals"
import Wallet from "../src/lib/wallet";

describe("Wallet tests", () => {

  const exampleWif = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ"
  let alice : Wallet;

  beforeAll(() => {
    alice = new Wallet();  
  })

  test("returns wallet", () => {
    const wallet = new Wallet();

    expect(wallet.privateKey).toBeTruthy();
    expect(wallet.publicKey).toBeTruthy();
  })

  test("recover wallet using private key", () => {
    const wallet = new Wallet(alice.privateKey);

    expect(wallet.publicKey).toEqual(alice.publicKey);
  })

  test("recover wallet using wif", () => {
    const wallet = new Wallet(exampleWif);

    expect(wallet.publicKey).toBeTruthy();
    expect(wallet.privateKey).toBeTruthy();
  })
})