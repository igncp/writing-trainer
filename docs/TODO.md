## Code revamp

## Tasks

- Add a check if anki front is repeated
- Add simplified chinese script
- Pass manager via context
- Persist config in records (which subpanels are displayed)
- Support pronunciation with tones better
- Add collections: Lists of records that can be exported and imported
- Gamification with points, levels, or numbers of completions
- Shortcuts refactor
- Extract UI parts from Panel
- Find parts of the extension that could be moved to the core
  - commonLanguageUtils
- Code TODOs
- Move stats to the backend

## Backend

- Sync stats
- Remove offline records saving support

## Ideas

- Packages:
  - CLI
  - Google nest
  - Smart watch
  - Chromecast app

## Code Quality

- Move some unit tests to e2e tests, especially in core
  - Focus in good tests specs
- Avoid `acc[uiHandler.languageHandler.language.id] = uiHandler`)
- Remove highlevel code (e.g. using the dictionary)
- Add playwright
- Add back stories actions
- Update core interfaces to hide as much as possible implementation details
- Sort react props
- TS prune

## Periodic

- Update dependencies
- Naming
- Organization
- Linting rules
- Extract reusable parts

## New Ideas

- Decouple code to have a core (and plugins?) to be able to support:
  - Mobile app (react native, capacitor, ...)
- Remove dictionary for Japanese (support a different approach when looking for pronunciation, like suggestions)
- New package to export the current content? Other options: Files, S3, etc.
