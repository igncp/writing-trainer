import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  documents: ['src/**/*.tsx'],
  generates: {
    './src/react-ui/graphql/': {
      preset: 'client',
    },
  },
  ignoreNoDocuments: true,
  schema: 'http://localhost:9000/graphql',
}

export default config
