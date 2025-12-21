const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const port = process.env.PORT || 4010;
const { RpcProvider } = require('starknet');
const PrismaClient = require('@prisma/client');
const prisma = new PrismaClient.PrismaClient();

if (!process.env.RPC_URL) {
  console.error("RPC_URL environment variable is not set.");
  process.exit(1);
}

async function getMinIndexerHeadFromDB() {
  try {
    const result = await prisma.$queryRaw`
      SELECT order_key as min_order_key 
      FROM airfoil.checkpoints 
      WHERE order_key IS NOT NULL
    `;

    if (!result.length || result[0].min_order_key === null) {
      throw new Error('No valid cursor found in the checkpoints table.');
    }

    const minOrderKey = Number(result[0].min_order_key);
    console.info(`DB::Minimum indexer head orderKey: ${minOrderKey}`);
    return minOrderKey;

  } catch (error) {
    console.error('Error fetching min orderKey from database:', error);
    throw new Error('Failed to retrieve minimum orderKey from checkpoints table');
  }
}

// Function to get summary data and update metrics
async function getSummaryData() {
  const results = [];
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_URL
  });

  let currentBlock = 0;
  try {
    currentBlock = (await provider.getBlockLatestAccepted()).block_number;
  } catch (error) {
    throw new Error(`Error fetching latest block: ${error.message}`);
  }

  const minIndexerHead = await getMinIndexerHeadFromDB();
  const blockLag = Math.abs(currentBlock - Number(minIndexerHead));
  const isSynced = blockLag <= 100;
      
  results.push({
    file: 'indexer_head',
    status: {
      currentBlock,
      cursor: { orderKey: minIndexerHead }
    },
    isSynced: isSynced ? "isActive" : "isSyncing",
    blockLag
  });

  const isAllSynced = isSynced;

  return {
    isAllSynced,
    results,
    currentBlock
  };
}

app.get('/summary', async (_req, res) => {
  try {
    const summaryData = await getSummaryData();
    
    // Log the summary
    console.info('Indexer summary generated', { 
      isAllSynced: summaryData.isAllSynced,
      indexerCount: summaryData.results.length,
      currentBlock: summaryData.currentBlock
    });
    
    return res.status(200).json(summaryData);
  } catch (error) {
    console.error('Error generating summary', { error: error.message });
    
    return res.status(500).json({ error: error.message });
  }
});

app.get('/', (_req, res) => {
  return res.status(200).json({
    status: "OK"
  });
});

// Start the Express server
app.listen(port, () => {
  console.info(`Indexer service running on port ${port}`, { 
    port,
    network: process.env.NETWORK,
    version: process.env.VERSION
  });
});