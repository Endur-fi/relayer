#!/bin/bash

echo "Running indexers"
/usr/bin/supervisord -c /app/supervisord.relayer.conf
