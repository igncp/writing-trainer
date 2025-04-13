#!/usr/bin/env bash

set -e

DEPLOYMENT_NAME="writing-trainer"
MISSING_ENVS=""

# 擷取 DEPLOYMENT_TOKEN 嘅步驟:
# k get serviceaccounts # 呢個會顯示秘密名稱
# k get secret SECRET_NAME -o jsonpath='{.data.token}' | base64 -d

if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$DEPLOYMENT_LOCATION" ]; then
  echo "DEPLOYMENT_LOCATION is not set"
  MISSING_ENVS="true"
fi

if [ -z "$DEPLOYMENT_TOKEN" ]; then
  echo "DEPLOYMENT_TOKEN is not set"
  MISSING_ENVS="true"
fi

if [ -n "$MISSING_ENVS" ]; then
  exit 1
fi

curl "$DEPLOYMENT_LOCATION/apis/apps/v1/namespaces/default/deployments/$DEPLOYMENT_NAME" \
  -i \
  --insecure \
  --silent \
  --show-error \
  -X PATCH \
  -H "Authorization: Bearer $DEPLOYMENT_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/strategic-merge-patch+json" \
  --data "@-" <<EOF
{
  "spec": {
    "template": {
      "metadata": {
        "annotations": {
          "$DEPLOYMENT_NAME/restartedAt": "$(date +%Y-%m-%d_%T%Z)"
        }
      }
    }
  }
}
EOF

echo ""
echo "Redeployed $DEPLOYMENT_NAME"
