import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import readline from 'readline';
import Wallet from "../lib/wallet";
import Transaction from '../lib/transaction';
import { TransactionType } from '../lib/transaction-type';
import TransactionInput from '../lib/transaction-input';
import TransactionOutput from '../lib/transaction-output';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let myWalletPub: any;
let myWalletPriv: any;

function menu() {
  setTimeout(() => {
    console.clear();

    if (myWalletPub)
      console.log(`You are logged as ${myWalletPub}`);
    else
      console.log(`You aren't logged.`);

    console.log("1 Create Wallet");
    console.log("2 Recovery Wallet");
    console.log("3 Balance");
    console.log("4 Send tx");
    console.log("5 Search tx");
    rl.question("Choose your option: ", (answer) => {
      switch(answer) {
        case "1": createWallet(); break;
        case "2": recoverWallet(); break;
        case "3": getBalance(); break;
        case "4": sendTx(); break;
        case "5": searchTx(); break;
        default: {
          console.log('Wrong option!');
          menu();
        }
      }
    })
  }, 1000)
}

function preMenu() {
  rl.question(`Press any key to continue...`, () => {
    menu();
  })
}

function createWallet() {
  console.clear();
  const wallet = new Wallet();
  console.log(`Your new wallet`);
  console.log(wallet);

  myWalletPub = wallet.publicKey;
  myWalletPriv = wallet.privateKey;

  preMenu();
}

function recoverWallet() {
  console.clear();
  rl.question(`What is your private key or WIF? `, (wifOrPrivateKey) => {
    const wallet = new Wallet(wifOrPrivateKey);
    console.log(`Your recovered wallet`);
    console.log(wallet);

    myWalletPub = wallet.publicKey;
    myWalletPriv = wallet.privateKey;

    preMenu();
  });
}

function getBalance() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You don't have a wallet yet.`);
    return preMenu();
  }

  //TODO: get balance via API
  preMenu();
}

function sendTx() {
  console.clear();

  if (!myWalletPub) {
    console.log(`You don't have a wallet yet.`);
    return preMenu();
  }

  console.log(`Your wallet is ${myWalletPub}`);
  rl.question(`To Wallet `, (toWallet) => {
    if (toWallet.length < 66) {
      console.log(`Invalid wallet.`);
      return preMenu();
    }

    rl.question(`Àmount: `, async (amountStr) => {
      const amount = parseInt(amountStr)
      if (!amount) {
        console.log(`Invalid amount.`);
        return preMenu();
      }

      const walletResponse = await axios.get(`${BLOCKCHAIN_SERVER}wallets/${myWalletPub}`);
      const balance = walletResponse.data.balance as number;
      const fee = walletResponse.data.fee as number;
      const utxo = walletResponse.data.utxo as TransactionOutput[];

      if (balance < amount + fee) {
        console.log(`Insufficient balance (tx + fee).`);
        return preMenu();
      }

      const tx = new Transaction();
      tx.timestamp = Date.now();
      tx.txOutputs = [new TransactionOutput({
        toAddress: toWallet,
        amount,
      } as TransactionOutput)];

      tx.type = TransactionType.REGULAR;
      tx.txInputs = [new TransactionInput({
        amount,
        fromAddress: myWalletPub,
        previousTx: utxo[0].tx
      } as TransactionInput)];

      tx.txInputs[0].sign(myWalletPriv);
      tx.hash = tx.getHash();
      tx.txOutputs[0].tx = tx.hash;

      try {
        const txResponse = await axios.post(`${BLOCKCHAIN_SERVER}transactions/`, tx)
        console.log(`Transaction accepted. Waiting the miners!`);
        console.log(txResponse.data.hash);
      } catch (err: any) {
        console.error(err.response.data ? err.response.data : err.message);
      }

      return preMenu()
    })
  });
  preMenu();
}

function searchTx() {
  console.clear();
  rl.question(`Your tx hash `, async (hash) => {
    const response = await axios.get(`${BLOCKCHAIN_SERVER}transactions/${hash}`);
    console.log(response.data);
    return preMenu();
  })
}

menu();
