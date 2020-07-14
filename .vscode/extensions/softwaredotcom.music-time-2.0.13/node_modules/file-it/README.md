file-it
================

Helps minimize the amount of `fs` read and write logic, `try/catch` logic, writes clean UTF8 json content, and cleans up byte order mark and newline characters to cleanly read and parse json content.



Installation
------------

    npm install --save file-it
    OR
    yarn add file-it

Import or Require
-----------------
    import fileIt from "file-it";
    OR
    const fileIt = require("file-it");

API
---

* [`setJsonValue(filename, key, value, [options])`](#setjsonvalue-filename-key-value-options)
  - create or update a top level json value
* [`getJsonValue(filename, key)`](#getjsonvaluefilename-key)
  - fetch a top level json value
* [`readJsonArraySync(filename)`](#readjsonarraysyncfilename)
  - returns a json array object from a stringified json array file
* [`readJsonLinesSync(filename)`](#readjsonlinessyncfilename)
  - returns a json array object from a file containing stringified objects appended in a file
* [`readContentFile(filename)`](#readcontentfilefilename)
  - returns the string content of a file asynchronously
* [`readContentFileSync(filename)`](#readcontentfilesyncfilename)
  - returns the string content of a file synchronously
* [`readJsonFile(filename, callback)`](#readjsonfilefilename-options-callback)
  - returns a json object from a file asynchronously
* [`readJsonFileSync(filename)`](#readjsonfilesyncfilename)
  - returns a json object from a file synchronously
* [`appendJsonFileSync(filename, obj, [options])`](#appendjsonfilesyncfilename-obj-options)
  - append a json object to a file synchronously
* [`writeContentFile(filename, content, callback)`](#writecontentfilefilename-content-callback)
  - write string content to a file asynchronously
* [`writeContentFileSync(filename, content)`](#writecontentfilesyncfilename-content)
  - write string content to a file synchronously
* [`writeJsonFile(filename, obj, [options], callback)`](#writejsonfilefilename-obj-options-callback)
  - write a json object to a file asynchronously
* [`writeJsonFileSync(filename, obj, [options])`](#writejsonfilesyncfilename-obj-options)
  - write a json object to a file synchronously
* [`findSortedJsonElement(filename, attribute, direction)`](#findsortedjsonelementfilename-attribute-direction)
  - returns the top element sorted by the specified object attribute based on sort direction. "desc" is used by default

----

### setJsonValue(filename, key, value, [options])

* `filename` the full file path
* `key` the name of the element in the json file
* `value` the value you want to set

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.setJsonValue(file, "hello", "universe", {spaces: 2});
```

----

### getJsonValue(filename, key)

* `filename` the full file path
* `key` the name of the element in the json file

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
await fileIt.setJsonValue(file, "hello", "universe", {spaces: 2});
const val = await fileIt.getJsonValue(file, "hello");
console.log("val: ", val); // prints out "universe"
```

----

### readJsonArraySync(filename)

* `filename` the full file path
  - `throws` If `JSON.parse` throws an error, pass this error to the callback


```js
const fileIt = require('file-it')
const file = '/tmp/jsonArrayFile.json'
fileIt.readJsonArraySync(file, function (err, data) {
  if (err) console.error(err)
  else console.log(data)
})
```

----

### readJsonLinesSync(filename)

* `filename` the full file path
  - `throws` If `JSON.parse` throws an error, pass this error to the callback


```js
const fileIt = require('file-it')
const file = '/tmp/linesOfJsonData.json'
fileIt.readJsonLinesSync(file, function (err, data) {
  if (err) console.error(err)
  else console.log(data)
})
```

----

### readContentFile(filename)

* `filename` the full file path

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.readContentFile(file, function (err, data) {
  if (err) console.error(err)
  else console.log(data)
})
```

----

### readContentFileSync(filename)

* `filename` the full file path

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
console.log(fileIt.readContentFileSync(file))
```

----

### readJsonFile(filename)

* `filename` the full file path
  - `throws` If `JSON.parse` throws an error, pass this error to the callback


```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.readJsonFile(file, function (err, data) {
  if (err) console.error(err)
  else console.log(data)
})
```

You can also use this method with promises. The `readJsonFile` method will return a promise if you do not pass a callback function.

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'
fileIt.readJsonFile(file)
  .then(data => console.log(data))
  .catch(error => console.error(error))
```

----

### readJsonFileSync(filename)

* `filename`: the full file path
* `content`: The string object to write
  - `throws` If an error is encountered reading or parsing the file, throw the error

```js
const fileIt = require('file-it')
const file = '/tmp/data.json'

console.log(fileIt.readJsonFileSync(file))
```

----

### appendJsonFileSync(filename, obj, [options])

* `filename`: the full file path
* `obj`: The json object to append to the file
* `options`: Pass in any [`fs.appendFileSync`](https://nodejs.org/api/fs.html#fs_fs_appendfilesync_path_data_options) options or set `replacer` for a [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). Can also pass in `spaces` and override `EOL` string.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.appendJsonFileSync(filename, content, function (err) {
  if (err) console.error(err)
})
```

----

----

### writeContentFile(filename, content, callback)

* `filename`: the full file path
* `content`: The string object to write

```js
const fileIt = require('file-it')

const file = '/tmp/data.txt'
const content = "hello world"

fileIt.writeContentFile(filename, content, function (err) {
  if (err) console.error(err)
})
```

----

### writeContentFileSync(filename, content)


```js
const fileIt = require('file-it')

const file = '/tmp/data.txt'
const content = "hello world"

fileIt.writeContentFile(filename, content)
```

----

### writeJsonFile(filename, obj, [options], callback)

* `filename`: the full file path
* `obj`: The json object to write
* `options`: Pass in any [`fs.writeFile`](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) options or set `replacer` for a [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). Can also pass in `spaces` and override `EOL` string.


```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, function (err) {
  if (err) console.error(err)
})
```
Or use with promises as follows:

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj)
  .then(res => {
    console.log('Write complete')
  })
  .catch(error => console.error(error))
```


**formatting with spaces:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { spaces: 2 }, function (err) {
  if (err) console.error(err)
})
```

**overriding EOL:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { spaces: 2, EOL: '\r\n' }, function (err) {
  if (err) console.error(err)
})
```

**appending to an existing JSON file:**

You can use `fs.writeFile` option `{ flag: 'a' }` to achieve this.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFile(file, obj, { flag: 'a' }, function (err) {
  if (err) console.error(err)
})
```

----

### writeJsonFileSync(filename, obj, [options])

* `filename`: the full file path
* `obj`: The json object to write
* `options`: Pass in any [`fs.writeFileSync`](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options) options or set `replacer` for a [JSON replacer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). Can also pass in `spaces` and override `EOL` string.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj)
```

**formatting with spaces:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { spaces: 2 })
```

**overriding EOL:**

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { spaces: 2, EOL: '\r\n' })
```

**appending to an existing JSON file:**

You can use `fs.writeFileSync` option `{ flag: 'a' }` to achieve this.

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'
const obj = { hello: 'World' }

fileIt.writeJsonFileSync(file, obj, { flag: 'a' })
```

----

### findSortedJsonElement(filename, attribute, direction?)

* `filename`: the full file path
* `attribute`: the name of the attribute within a json element
* `direction`: the sort direction ["asc" | "desc"] - default is desc

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'

const topElement = fileIt.findSortedJsonElement(file, "count")
```

```js
const fileIt = require('file-it')

const file = '/tmp/data.json'

const bottomElement = fileIt.findSortedJsonElement(file, "count", "asc")
```


