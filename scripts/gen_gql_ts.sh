#!/usr/bin/env bash

set -e

./node_modules/.bin/graphql-codegen

cp src/react-ui/graphql/gql.ts /tmp/gql.ts
echo "
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
" >src/react-ui/graphql/gql.ts
cat /tmp/gql.ts >>src/react-ui/graphql/gql.ts && rm /tmp/gql.ts

cp src/react-ui/graphql/fragment-masking.ts /tmp/fragment-masking.ts
echo "
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
" >src/react-ui/graphql/fragment-masking.ts
cat /tmp/fragment-masking.ts >>src/react-ui/graphql/fragment-masking.ts && rm /tmp/fragment-masking.ts

./node_modules/.bin/prettier --write 'src/react-ui/graphql/**/*'
./node_modules/.bin/eslint --fix src/react-ui/graphql/

echo "GraphQL types generated successfully!"
