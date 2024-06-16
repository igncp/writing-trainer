#!/usr/bin/env bash

set -e

(while true; do
  ./writing-trainer-backend 2>&1 >>/tmp/api.log
done) &

echo "Starting nginx on port 3000"

nginx -g 'daemon off;'
