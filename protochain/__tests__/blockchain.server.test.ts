import request from 'supertest';
import { describe, test, expect, jest } from "@jest/globals";
import { app } from '../src/server/blockchain.server';
import { Block } from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transaction-input';


jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transaction-input');

describe('Blockchain Server Tests', () => {
  describe('GET /status',() => {
    test('returns status', async () => {
      const response = await request(app).get('/status');
  
      expect(response.status).toEqual(200)
      expect(response.body.isValid.success).toEqual(true)
    })
  });

  describe('GET /blocks/next', () => {
    test('returns genesis block', async () => {
      const response = await request(app).get('/blocks/next');
  
      expect(response.status).toEqual(200)
      expect(response.body.index).toEqual(1)
    })
  });

  describe('GET /blocks/:indexOrHash', () => {
    test('returns genesis block', async () => {
      const response = await request(app).get('/blocks/0');
  
      expect(response.status).toEqual(200)
      expect(response.body.index).toEqual(0)
    })

    test('returns block', async () => {
      const response = await request(app).get('/blocks/abc');
  
      expect(response.status).toEqual(200)
      expect(response.body.hash).toEqual("abc")
    })

    test('returns not found', async () => {
      const response = await request(app).get('/blocks/-1');
  
      expect(response.status).toEqual(404)
    })
  });

  describe('POST /blocks', () => {
    test('returns created', async () => {
      const block = new Block({ index: 1 } as Block);
      const response = await request(app).post('/blocks/').send(block);
      expect(response.status).toEqual(201);
      expect(response.body.index).toEqual(1);
    })

    test('returns unprocessable entity', async () => {
      const response = await request(app).post('/blocks/').send({});
      expect(response.status).toEqual(422);
    })

    test('returns bad request', async () => {
      const block = new Block({ index: -1 } as Block);
      const response = await request(app).post('/blocks/').send(block);
      expect(response.status).toEqual(400);
    })
  });

  describe('GET /transactions/:hash', () => {
    test('returns transaction', async () => {
      const response = await request(app).get('/transactions/abc');
  
      expect(response.status).toEqual(200)
      expect(response.body.mempoolIndex).toEqual(0)
    })
  });

  describe('POST /transactions', () => {
    test('returns created', async () => {
      const tx = new Transaction({
        txInput: new TransactionInput(),
        to: 'walletto' 
      } as Transaction);

      const response = await request(app).post('/transactions/').send(tx);
      expect(response.status).toEqual(201);
    })
  });
})