import { Block } from "./block";
import BlockInfo from "./blockinfo";
import Validation from "./validation";

/**
 * The Blockchain class
*/
export class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  static readonly DIFFICULTY_FACTOR = 5;
  static readonly MAX_DIFFICULTY = 62;
  
  /**
   * Creates a new blockchain
  */
  constructor(){
    this.blocks = [new Block(<Block>{index: 0, previousHash: '', data: `Genesis Block: created at: ${new Date().toISOString()}`})]
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length -1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
  }

  addBlock(block: Block): Validation{
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficulty());
    if(!validation.success) 
      return new Validation(false, `Invalid block: ${lastBlock.index}: ${validation.message}`);
    
    this.blocks.push(block);
    this.nextIndex++;
    
    return new Validation();
  }

  getBlock(hash: string): Block | undefined {
    return this.blocks.find(block => block.hash === hash);
  }

  isValid(): Validation {
    for (let i=this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());
      if (!validation.success) 
        return new Validation(false, `Invalid Block: ${currentBlock.index}: ${validation.message}`);
    }
    return new Validation();
  }

  getFeePerTx() : number {
    return 1;
  }

  getNextBlock() : BlockInfo {
    return {
      index: this.blocks.length,
      previousHash: this.getLastBlock().hash,
      difficulty: this.getDifficulty(),
      maxDifficulty: Blockchain.MAX_DIFFICULTY,
      feePerTx: this.getFeePerTx(),
      data: new Date().toISOString(),
    }
  }
}