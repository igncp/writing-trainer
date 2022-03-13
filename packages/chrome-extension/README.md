# Writing Trainer - Chrome Extension

Chrome extension to assist for learning languages. It allows you to quickly
practice texts with non-latin characters (e.g. chinese) without using a
special input method, and focusing in learning the pronunciation and meaning
of the words.

The extension is still on an early stage and not published yet. It is already
functional and you can build, install and try it locally.

## Install Locally

### Requirements

- [Node LTS](https://nodejs.org/en/)
- [Chrome](https://www.google.com/chrome/)

### Process

- Install: `npm i`
- Build: `npm run build`
- Go to `chrome://extensions/`
- Enable Developer Mode in the top right
- Click "Load Uncompressed" in the top left
- Choose the `dist` directory
- After this, on rebuild you can choose to just refresh the extension

## Usage

The extension is disabled by default in every page. You can configure which
pages will use it by clicking on the extension icon, configuration, and the use
regular expressions to include a website. If you add `.` it would match every
website. Don't forget to save afterwards.

Once enabled, whenever you select a text you will see a trigger in the top
right to open the panel. The panel will default to use Mandarin as the
language.

If all the characters are present in the local dictionary, you can start
practicing right away, it would automatically populate the pronunciation text
area. Otherwise you will need to manually add the pronunciation, including the
ones if necessary.
