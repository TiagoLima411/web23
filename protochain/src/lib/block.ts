import SHA256 from "crypto-js/sha256";

/**
 * Block class
*/

export class Block {
  index: number;
  timestamp : number;
  hash: string;
  previousHash: string;
  data: string;
  
  /**
   * Creates new block
   * @param index The block index in blockchain
   * @param hash The block hash
   * @param previousHash The previous block hash
   * @param data The block data
  */
  constructor(index: number, previousHash: string, data: string){
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.data = data;
    this.hash = this.getHash();
  }

  getHash(){
    return SHA256(this.index + this.data + this.timestamp + this.previousHash),toString();
  }

  /**
   * Validates the block
   * @returns Returns true if the block is valid
  */
  isValid(): boolean {
    if (this.index < 0) return false;
    if (!this.hash) return false;
    if (!this.data) return false;
    if (this.timestamp < 1) return false;
    if (!this.previousHash) return false;
    return true
  }
}