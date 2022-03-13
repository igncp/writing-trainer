## Tasks

- Pass manager via context
- Persist config in records (which subpanels are displayed)
- Add Cantonese language with its own dictionary 
- Support pronunciation with tones better
- Generalize dictionary and inputvalue outside of langopts?
- Add collections: Lists of records that can be exported and imported
- Find parts of the extension that could be moved to the core
  - commonLanguageUtils
- Code TODOs

## Ideas

- Packages:
  - CLI
  - Google nest
  - Smart watch
  - Chromecast app

## Code Quality

- Move some unit tests to e2e tests, especially in core
    - Focus in good tests specs
- Add playwright
- Upgrade gatsby when this is resolved: https://github.com/graphql-compose/graphql-compose/issues/374
- Hoist typescript
- Add back stories actions
- Update core interfaces to hide as much as possible implementation details
- Sort react props
- TS prune
- Progressively add linter rules
- API docs generation

## Periodic

- Update dependencies
  - Upgrade
  - Remove
  - Change
  - Add
- Naming
- Organization
- Linting rules
- Extract reusable parts

## New Ideas

- Decouple code to have a core (and plugins?) to be able to support:
  - Mobile app (react native, capacitor, ...)
  - Website
  - Chrome Extension
- Core and non-UI: Tests
- All: Types, linter, high-level docs
- Remove dictionary for Japanese (support a different approach when looking for pronunciation, like suggestions)
- Introduce Anki approach?
- New package to export the current content? Other options: Files, S3, etc.
