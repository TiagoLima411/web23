import { Block } from "./block";
import Validation from "../validation";
import BlockInfo from "../blockinfo";
import Transaction from "./transaction";
import { TransactionType } from "../transaction-type";
import TransactionSearch from "../transaction-search";

/**
 * Mocked Blockchain class
*/
export class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;
  
  /**
   * Creates a new mocked blockchain
  */
  constructor(){
    this.mempool = [];
    this.blocks = [new Block(<Block>{
      index: 0, 
      hash: "abc", 
      previousHash: '', 
      transactions: [new Transaction({
        data: "tx1",
        type: TransactionType.FEE
      } as Transaction)],
      timestamp: Date.now()
    })]

    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length -1]
  }

  addBlock(block: Block): Validation{
    if(block.index < 0) return new Validation(false, "Invalid block");
    
    this.blocks.push(block);
    this.nextIndex++;
    
    return new Validation();
  }

  addTransaction(transaction: Transaction) : Validation {
    const validation = transaction.isValid();
    if (!validation.success) return validation;

    this.mempool.push(transaction);
    return new Validation();
  }

  getTransaction(hash: string) : TransactionSearch {
    return {
      mempoolIndex: 0,
      transaction: {
        hash
      }
    } as TransactionSearch;
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash);
  }

  isValid(): Validation {
    return new Validation();
  }

  getFeePerTx() : number {
    return 1;
  }

  getNextBlock() : BlockInfo {
    return {
      index: this.blocks.length,
      previousHash: this.getLastBlock().hash,
      difficulty: 0,
      maxDifficulty: 62,
      feePerTx: this.getFeePerTx(),
      transactions: [new Transaction({
        data: new Date().toISOString()
      } as Transaction)],
    }
  }
}