const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 4010;
const redis = require('redis');
const { RpcProvider } = require('starknet');

if (!process.env.PERSIST_TO_REDIS) {
  console.error("PERSIST_TO_REDIS environment variable is not set.");
  process.exit(1);
}

const redisClient = redis.createClient({
  url: process.env.PERSIST_TO_REDIS
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

async function getAllKeys() {
  return new Promise(async (resolve, reject) => {
    try {
      const keys = await redisClient.keys('apibara:sink:relayer:*');
      resolve(keys);
    } catch (error) {
      console.error('Error fetching keys from Redis:', error);
      reject(error);
    }
  });
}

// Function to execute grpcurl command and get the status
function getIndexState(key) {
  return new Promise(async (resolve, reject) => {
    const data = await redisClient.get(key);
    console.log("Data from redis: ", data);
    if (data) {
      resolve(JSON.parse(data));
    } else {
      reject(new Error(`No data found for key: ${key}`));
    }
  });
}

app.get('/summary', async (_req, res) => {
    const results = []
    let isAllSynced = true
    const provider = new RpcProvider({
      nodeUrl: process.env.NETWORK == 'mainnet' ? 'https://starknet-mainnet.public.blastapi.io' : 'https://starknet-sepolia.public.blastapi.io',
    })

    let currentBlock = 0;
    try {
      currentBlock = (await provider.getBlockLatestAccepted()).block_number;
    } catch (error) {
      return res.status(500).json({ error: `Error fetching latest block: ${error.message}` });
    }

    for (let key of indexerKeys) {
        try {
            const status = await getIndexState(key); 
            const isSynced = Math.abs(currentBlock - Number(status.cursor.orderKey)) <= 10;
            results.push({
                file: key,
                status: {...status, currentBlock},
                isSynced: isSynced ? "isActive" : "isSyncing"
            });
            if (!isSynced) {
                isAllSynced = false
            }
        } catch (error) {
            results.push({
                file,
                error: error.message
            });
            isAllSynced = false
        }
    }
    return res.status(200).json({
        isAllSynced,
        results
    });
});

app.get('/', (_req, res) => {
    return res.status(200).json({
        status: "OK"
    });
})

const indexerKeys = [];

// Connect to redis and Start the Express server
redisClient.connect().then(async () => {
  // preload the indexer keys
  const keys = await getAllKeys();
  if (keys.length === 0) {
    throw new Error("No indexer keys found in Redis.");
  }
  indexerKeys.push(...keys);
  console.log(`Loaded ${indexerKeys.length} indexer keys from Redis.`);

  // Start the Express server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

}).catch((err) => {
  console.error('Error connecting to Redis:', err);
  process.exit(1);
});
