#!/usr/bin/env bash

set -e

if [ "$SKIP_CHECK" = "true" ]; then
  gh workflow run .github/workflows/deploy.yml -f skip_check=true
  exit 0
fi

gh workflow run .github/workflows/deploy.yml
