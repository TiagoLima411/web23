import { Block } from "./block";
import Validation from "../validation";
import BlockInfo from "../blockinfo";

/**
 * Mocked Blockchain class
*/
export class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  
  /**
   * Creates a new mocked blockchain
  */
  constructor(){
    this.blocks = [new Block(<Block>{
      index: 0, 
      hash: "abc", 
      previousHash: '', 
      data: `Genesis Block: created at: ${new Date().toISOString()}`,
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
      data: new Date().toISOString(),
    }
  }
}