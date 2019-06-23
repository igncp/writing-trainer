# Writing Trainer

[![Build Status](https://travis-ci.org/igncp/writing-trainer.svg?branch=master)](https://travis-ci.org/igncp/writing-trainer)
[![npm license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/igncp/writing-trainer)
[![Netlify Status](https://api.netlify.com/api/v1/badges/91b60a19-45bd-4d20-834a-19e9660bdcd4/deploy-status)](https://app.netlify.com/sites/writing-trainer/deploys)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Figncp%2Fwriting-trainer%2Fmaster%2Fpackage.json)](https://github.com/plantain-00/type-coverage)

Chrome extension to assist for learning languages. It allows you to quickly
practice texts with non-lating characters (e.g. chinese) without using a
special input method, and focusing in learning the pronunciation and menaning
of the words.

The extension is still on an early stage and not published yet. It is already
functional and you can build, install and try it locally.

- [Storybook](https://writing-trainer.netlify.com)
- [Tests Coverage](https://writing-trainer.netlify.com/tests-coverage)
- [Next Tasks](./docs/TODO.md)

## Install Locally

### Requirements

- [Node v10](https://nodejs.org/en/)
- [Chrome](https://www.google.com/chrome/)

### Process

- Install: `npm i`
- Build: `npm run package`
- Go to `chrome://extensions/`
- Enable Developer Mode in the top right
- Click Load Uncompressed in the top left
- Choose the `dist` directory
- After this, on rebuild you can choose to just refresh the extension

## Usage

The extension is disabled by default in every page. You can configure which
pages will use it by clicking on the extension icon, configuration, and the use
regular expressions to include a website. If you add `.` it would match every
website. Don't forget to save afterwards.

Once enabled, whenever you select a text you will see a trigger in the top
right to open the panel. The panel will default to use Mandarin as the
language. Currently these languages are supported:

- Mandarin Chinese: Traditional Characters
- Japanese

If all the characters are present in the local dictionary, you can start
practicing right away, it would automatically populate the pronunciation text
area. Otherwise you will need to manually add the pronunciation, including the
tones if necessary.

## LICENSE

MIT
