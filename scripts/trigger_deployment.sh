#!/usr/bin/env bash

set -e

gh workflow run .github/workflows/deploy.yml
