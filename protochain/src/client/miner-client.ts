import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import { Block } from '../lib/block';
import BlockInfo from '../lib/blockinfo';
import Wallet from '../lib/wallet';
import Transaction from '../lib/transaction';
import { TransactionType } from '../lib/transaction-type';
import TransactionOutput from '../lib/transaction-output';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);
console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0;

function getRewardTx() : Transaction {
  const txo = new TransactionOutput({
    toAddress: minerWallet.publicKey,
    amount: 10,
  } as TransactionOutput);
  
  const tx = new Transaction({
    txOutputs: [txo],
    type: TransactionType.FEE,
  } as Transaction);

  tx.hash = tx.getHash();
  tx.txOutputs[0].tx = tx.hash

  return tx;
}

async function mine() {
  console.log("Getting next block info ...")
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
  if (!data) {
    console.log("No tx found. Waiting...");
    return setTimeout(() => {
      mine();
    }, 5000);
  }

  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);

  newBlock.transactions.push(getRewardTx());

  newBlock.miner = minerWallet.publicKey;
  newBlock.hash = newBlock.getHash();

  console.log("Start mine block #"+ blockInfo.index);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);
  
  console.log("Block mined! Sending to blockchain...");
  try {
    await axios.post(`${BLOCKCHAIN_SERVER}blocks`, newBlock);
    console.log("Block sent and accepted!");
    totalMined++;
    console.log("Total mined blocks: "+ totalMined);
  } catch (error: any) {
    console.log(error.response, error.response.data, error.message);
  }

  setTimeout(() => { mine() }, 1000);
}

mine();
