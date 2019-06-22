# TODO

## First Prototype

### Functionality

Only one language supported for this version: Mandarin

- [x] Separate specific functionality in language packs
- [x] Add Japanese
  - no tones but pronunciation for Kanjis, Hiragana, Katakana
- [x] Save in storage the latest language
- [x] Ability to choose language
- [ ] Have the ability to save, list, remove texts (no edit)
- [ ] Disable all pages except the ones listed

### Refactor

- [x] Increase Jest coverage threshold to 20% in all metrics
- [x] Standarize types naming: `T_` for functions, `T` for interfaces
- [ ] Increase Jest coverage threshold to 30% in all metrics
- [ ] Minify and optimize build

## Backlog

### Functionality

- [ ] Detect conflicts with passed pronunciation and dictionary pronunciation

### Infrastructure

- [ ] Setup Travis to run prepush hook
- [ ] Setup project badges
- [ ] Setup Stylelint: Delayed because using inline-styles
- [ ] Setup Dockerfile for Sonar scanner (in addition to server)
- [ ] Setup Dockerfile with Chrome Headless: not possible to install extension, only for Storybook

### Refactor

- [ ] First iteration over UI
- [ ] Convert some config files to TS

### Ideas

- [ ] Netlify to serve static Storybook + Coverage
- [ ] Instead of shortcut, use long key press for toggling in panel
