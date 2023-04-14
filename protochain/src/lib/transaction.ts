import { SHA256 } from "crypto-js";
import TransactionInput from "./transaction-input";
import { TransactionType } from "./transaction-type";
import Validation from "./validation";

export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  txInput: TransactionInput | undefined;
  to: string;

  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.to = tx?.to || "";

    if (tx && tx.txInput)
      this.txInput = new TransactionInput(tx.txInput);
    else
      this.txInput = undefined;

    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    const from = this.txInput ? this.txInput.getHash() : ""
    return SHA256(this.type + from + this.to + this.timestamp).toString();
  }

  isValid(): Validation {
    if (this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");

    if (!this.to)
      return new Validation(false, "Invalid to.");

    if (this.txInput) {
      const validation = this.txInput.isValid();
      if (!validation.success)
        return new Validation(false, `Invalid tx: ${validation.message}`);
    }

    return new Validation();
  }
}