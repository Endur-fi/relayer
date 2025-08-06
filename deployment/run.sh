#!/bin/bash

npx prisma db push

# Source bashrc to ensure environment is loaded
source ~/.bashrc
cd /app

# Start all indexer processes using PM2 ecosystem config
pm2 start ./ecosystem.config.js

# Save PM2 process list
pm2 save

node index.js
