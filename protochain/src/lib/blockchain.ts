import { Block } from "./block";

/**
 * The Blockchain class
*/
export class Blockchain {
  blocks: Block[];
  
  /**
   * Creates a new blockchain
  */
  constructor(){
    this.blocks = [new Block(0, '', "Genesis Block")]
  }
}