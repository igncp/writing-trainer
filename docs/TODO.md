## Tasks

- Fix japanese
  - Create several stories for each language
  - More tests for each language
- Generalize dictionary and inputvalue outside of langopts
- Find common logic in getCharObjs functions
- Update types names
- Improve records list UX
- Save config in records
- Add Cantonese

## Refactor

- Start splitting the codebase between `core` and `chrome-extension`
  - In future there will be more, like a package for common UI values
- Pull up as many config as possible to share between packages
- Hoist Lerna packages

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
  - Mobile app (react native, flutter, ...)
  - Website
  - Chrome Extension
- Core and non-UI: Tests
- UI: Storybook
- All: Types, linter, high-level docs
- Remove dictionary for Japanese (support a different approach when looking for pronunciation, like suggestions)
- Introduce Anki approach?
- New package to export the current content? Other options: Files, S3, etc.

## Old Prototype

### Functionality

Only one language supported for this version: Mandarin

- [x] Automatically scroll the chars display when writing
- [x] Popup option to include this page into whitelisted pages
- [ ] Complete functions for Japanese for `languageManager`
- [ ] Export / Import saved records to file

### Refactor

- [ ] Do a general round to detect performance bottle-necks
- [ ] Minify and optimize build
- [ ] Increase Jest coverage threshold to 40% in all metrics

## Old Backlog Remainder

### Functionality

- [ ] Detect conflicts with passed pronunciation and dictionary pronunciation

### Infrastructure

- [ ] Setup Stylelint: Delayed because using inline-styles

### Refactor

- [ ] First iteration over UI
- [ ] Convert some config files to TS

### Ideas

- [ ] Instead of shortcut, use long key press for toggling in panel
- [ ] Add user guide and tutorial points
- [ ] Add animation in main README.md
