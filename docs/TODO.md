# TODO

## First Prototype

### Functionality

Only one language supported for this version: Mandarin

- [x] Clear all
- [x] Characters display
- [x] Error display
- [x] Dictionary load
- [x] Link to G. Translate, pronunciation and Dictionary
- [x] Shortcuts to hide / show pronunciation / text
- [x] Allow practice with tones

### Infrastructure

- [x] Setup Dockerfile with Sonar server

### Refactor

- [x] Enable `noImplicitAny`
- [x] Raise coverage threshold to 10% (visible in Sonar)
- [x] Organize general types and reduce `any` types in source code

## Backlog

### Functionality

- [ ] Separate specific functionality in language packs
- [ ] Ability to save texts in local storage, maybe songs
- [ ] Ability to choose language
- [ ] Detect conflicts with passed pronunciation and dictionary pronunciation
- [ ] Automatically save some values in storage

### Infrastructure

- [ ] Setup Stylelint: Delayed because using inline-styles
- [ ] Setup Dockerfile for Sonar scanner (in addition to server)
- [ ] Setup Dockerfile with Chrome Headless: not possible to install extension, only for Storybook

### Refactor

- [ ] Reduce `Function` types
- [ ] First iteration over UI

### Ideas

- [ ] Netlify to serve static Storybook + Coverage
- [ ] Add Japanese (no tones but pronunciation for Kanjis)
- [ ] Instead of shortcut, use long key press for toggling in panel
