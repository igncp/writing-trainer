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
- [ ] Organize general types and reduce `any` types in Source Code
- [ ] Reduce `Function` types
- [ ] First iteration over UI

## Backlog

### Functionality

- [ ] Separate specific functionality in language packs
- [ ] Ability to save texts, maybe songs
- [ ] Ability to choose language
- [ ] Detect conflicts with passed pronunciation and dictionary pronunciation
- [ ] Automatically save some values in storage

### Infrastructure

- [ ] Setup Stylelint: Delayed because using inline-styles
- [ ] Setup Dockerfile for Sonar scanner (in addition to server)
- [ ] Setup Dockerfile with Chrome Headless: not possible to install extension, only for Storybook

### Ideas

- [ ] Netlify to serve static Storybook + Coverage
