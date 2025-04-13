#!/usr/bin/env bash

set -e

./node_modules/.bin/graphql-codegen

sed -i 's|import \* as types.*||' src/react-ui/graphql/gql.ts
sed -i 's|const documents =|const documents: any[] =|' src/react-ui/graphql/gql.ts

bun run prettier:fix
