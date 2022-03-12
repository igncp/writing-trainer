## Tasks

- Replace T_Record with model
- Pass manager via context
- Review TODO document
- Persist config in records (which subpanels are displayed)
- Add Cantonese language with its own dictionary 
- Generalize dictionary and inputvalue outside of langopts?
- Add collections: Lists of records that can be exported and imported
- Find parts of the extension that could be moved to the core
  - commonLanguageUtils

## Ideas

- Packages:
  - CLI
  - Google nest
  - Smart watch
  - Chromecast app

## Code Quality

- Move some unit tests to e2e tests, especially in core
    - Focus in good tests specs
- Update core interfaces to hide as much as possible implementation details
- Host static pages in github pages and add link in main README
- Sort react props
- TS prune
- Import alias
- Progressively add linter rules
- GH actions to check, build and serve some subpackages
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
