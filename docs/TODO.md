## Tasks

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

## Code Quality

- Host static pages in github pages and add link in main README
- Don't import from dist, but setup package.json
- Sort react props
- TS prune
- Import alias
- Sort imports
- Fix tests coverage in core
- GH actions to check, build and serve some subpackages

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
