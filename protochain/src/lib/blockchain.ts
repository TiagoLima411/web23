import { Block } from "./block";
import Validation from "./validation";

/**
 * The Blockchain class
*/
export class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;
  
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

  addBlock(block: Block): Validation{
    const lastBlock = this.getLastBlock();
    const validation = block.isValid(lastBlock.hash, lastBlock.index);
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
      const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index);
      if (!validation.success) 
        return new Validation(false, `Invalid Block: ${currentBlock.index}: ${validation.message}`);
    }
    return new Validation();
  }
}