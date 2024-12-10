#!/bin/bash

echo "Installing deno"
/root/.deno/bin/deno install --allow-scripts

echo "Running relayer"
/root/.deno/bin/deno run prod

# /usr/bin/supervisord -c /app/supervisord.relayer.conf

# echo "Sleeping 30s"
# sleep 30
# cat /var/log/supervisor/relayer.log

# echo "Sleeping 30s"
# sleep 30