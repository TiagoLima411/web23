import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { Block } from '../lib/block';
import BlockInfo from '../lib/blockinfo';

const HOST = process.env.BLOCKCHAIN_SERVER;

const minerWallet = {
  privateKey: "123456",
  publicKey: `${process.env.MINER_WALLET}`,
}
console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0;

async function mine() {
  console.log("Getting next block info ...")
  const { data } = await axios.get(`${HOST}/blocks/next`);
  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);

  //TODO: adicionar tx de recompensa

  console.log("Start mine block #"+ blockInfo.index);

  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey)
  
  try {
    await axios.post(`${HOST}/blocks`, newBlock)
    console.log("Block sent and accepted!");
    totalMined++;
    console.log("Total mined blocks: "+ totalMined)
  } catch (error: any) {
    console.log(error.response, error.response.data, error.message)
  }

  setTimeout(() => { mine() }, 1000);
}

mine();
