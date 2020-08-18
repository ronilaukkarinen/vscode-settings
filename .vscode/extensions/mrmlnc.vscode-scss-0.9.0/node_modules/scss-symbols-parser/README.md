# scss-symbols-parser

> A very simple and fast SCSS Symbols parser.

[![Travis Status](https://travis-ci.org/mrmlnc/scss-symbols-parser.svg?branch=master)](https://travis-ci.org/mrmlnc/scss-symbols-parser)

## Install

```shell
$ npm i -S scss-symbols-parser
```

## Why?

Primarily, this module is designed to work with [vscode-scss](https://github.com/mrmlnc/vscode-scss) extension.

  * Dependencies free.
  * Returns document Variables, Mixins, Functions and Imports.
  * Tolerant to errors.
  * Very fast.

## Usage

```js
const symbolsParser = require('scss-symbols-parser');

const symbols = symbolsParser.parseSymbols('$a: 1;');
// console.log(symbols);
// {
//   variables: [ { name: '$a', value: '1', offset: 0 } ],
//   mixins: [],
//   functions: [],
//   imports: []
// }
```

## Symbols

**variable**

  * name: `string`
  * value: `string`
  * offset: `number`

**mixin**

  * name: `string`
  * parameters: `variable[]`
  * offset: `number`

**function**

  * name: `string`
  * parameters: `variable[]`
  * offset: `number`

**import**

  * filepath: `string`
  * modes: `string[]`
  * dynamic: `boolean` (filepath contains `#`, `{` or `}` or filepaths contains `//` – URLs)
  * css: `boolean` (filepath contains `css` extension or mode)

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/scss-symbols-parser/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
