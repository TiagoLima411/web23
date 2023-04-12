import TransactionInput from "./transaction-input";
import { TransactionType } from "../transaction-type";
import Validation from "../validation";

export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  to: string;
  txInput: TransactionInput;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.to = tx?.to || "walletto";
    this.txInput = tx?.txInput ? new TransactionInput(tx?.txInput) : new TransactionInput();
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }

  isValid(): Validation {
    if (!this.to)
      return new Validation(false, "Invalid mock transaction.");

    if (!this.txInput.isValid().success) return new Validation(false, "Invalid mock transaction.");

    return new Validation();
  }
}