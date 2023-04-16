import Validation from "../validation";

/**
 * Mock Transaction Output class
 */
export default class TransactionOutput {
  toAddress: string;
  amount: number;
  tx?: string;

  constructor(txOut?: TransactionOutput) {
    this.toAddress = txOut?.toAddress || "abc";
    this.amount = txOut?.amount || 10;
    this.tx = txOut?.tx || "xyz";
  }

  isValid(): Validation {
    if (this.amount < 1)
      return new Validation(false, 'Negative amount.') 
    
    return new Validation();
  }

  getHash(): string {
    return "abc";
  }
}