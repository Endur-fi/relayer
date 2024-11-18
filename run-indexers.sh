#!/bin/bash

# Function to start an indexer
start_indexer() {
  local indexer_name=$1
  echo "Starting ${indexer_name}..."
  apibara run "${indexer_name}" --allow-env=.env
}

# Start all indexers
echo "Starting all indexers..."

for indexer in src/indexers/*/*.ts; do
  echo "Running $indexer..."
  start_indexer "$indexer" &
done
