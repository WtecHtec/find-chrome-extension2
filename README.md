# Find Chrome Extension 2
find-chrome-extension2

Find a Google Chrome extension by name or extension ID. If you are looking for an extension in development, the extension ID is required.

## Installation

```
npm install --save find-chrome-extension2
```

## Usage

```javascript
const findChromeExtension = require('find-chrome-extension2');

const dir = findChromeExtension('FigmaCN');

console.log(dir);
```

The `console.log` statement should print the directory containing the extension (if found). Example: `C:\Users\herzshen\AppData\Local\Google\Chrome\User Data\Default\Extensions\japkpjkpfdakpkbcehooampdjfgefndj\1.6_0`. The `findChromeExtension` function returns null if not found.

## Platforms

Currently, this utility works on Windows, macOS, and Linux. It searches the `Default` as well as all `Profile` directories.