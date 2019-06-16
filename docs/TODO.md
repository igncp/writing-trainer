# TODO

## First Prototype

### Functionality

Only one language supported for this version: Mandarin

- [x] Separate specific functionality in language packs
- [ ] Add Japanese
  - no tones but pronunciation for Kanjis, Hiragana, Katakana
- [ ] Save in storage the latest language

### Refactor

- [ ] Increase Jest coverage threshold to 20% in all metrics
- [ ] Standarize types naming: `T_` for functions, `T` for interfaces

## Backlog

### Functionality

- [ ] Ability to save texts in local storage, maybe songs
- [ ] Ability to choose language
- [ ] Detect conflicts with passed pronunciation and dictionary pronunciation
- [ ] Automatically save some values in storage

### Infrastructure

- [ ] Setup Stylelint: Delayed because using inline-styles
- [ ] Setup Dockerfile for Sonar scanner (in addition to server)
- [ ] Setup Dockerfile with Chrome Headless: not possible to install extension, only for Storybook

### Refactor

- [ ] First iteration over UI
- [ ] Convert some config files to TS

### Ideas

- [ ] Netlify to serve static Storybook + Coverage
- [ ] Instead of shortcut, use long key press for toggling in panel
