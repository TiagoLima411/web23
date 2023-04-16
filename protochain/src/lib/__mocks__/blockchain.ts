import { Block } from "./block";
import Validation from "../validation";
import BlockInfo from "../blockinfo";
import Transaction from "./transaction";
import { TransactionType } from "../transaction-type";
import TransactionSearch from "../transaction-search";
import TransactionInput from "./transaction-input";

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
  constructor(miner: string){
    this.blocks = [];
    this.mempool = [new Transaction()];

    this.blocks = [new Block({
      index: 0, 
      hash: "abc", 
      previousHash: '', 
      miner,
      timestamp: Date.now()
    } as Block)]

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
    if (hash === "-1")
      return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch; 
    
    return {
      mempoolIndex: 0,
      transaction: new Transaction(),
    } as TransactionSearch;
  }

  getBlock(hash: string): Block | undefined {
    if (!hash || hash === "-1") return undefined;
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
      transactions: this.mempool.slice(0, 2),
      difficulty: 1,
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62,
    } as BlockInfo;
  }
}