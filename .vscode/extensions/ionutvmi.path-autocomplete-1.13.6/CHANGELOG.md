# Path Autocomplete Change Log

#### 1.13.6
Moved the change log from the readme file to the `CHANGELOG.md` file.

#### 1.13.5
resolve [#72](https://github.com/ionutvmi/path-autocomplete/issues/72) - include `require` in the "extensionOnImport" preference

#### 1.13.3
Fixes the completion items for json files. Fixes [#47](https://github.com/ionutvmi/path-autocomplete/issues/47)

#### 1.13.2
Fixes the mapping conflict with the node modules. Fixes [#30](https://github.com/ionutvmi/path-autocomplete/issues/30).

#### 1.13.1
Fixes the mapping of keys with the same prefix.

#### 1.13.0
Adds the `path-autocomplete.ignoredFilesPattern` option to disable the extension on certain file types.  
Example configuration:
```
    "path-autocomplete.ignoredFilesPattern": "**/*.{css,scss}"
```

#### 1.12.0
Adds the `path-autocomplete.useBackslash` option to enable the use of `\\` for windows paths.

#### 1.11.0
Adds the `path-autocomplete.pathSeparators` option to control the separators when 
inserting the path outside strings.

#### 1.10.0
- Updates the behavior of `extensionOnImport` to be taken into account only on import statements line.
- Adds the `path-autocomplete.includeExtension` option to control the extension on standard paths. (#45)
- Fixes the completion kind for folders and files (#43)
- Adds support for merging multiple folders in the path mappings configuration
```
"path-autocomplete.pathMappings": {
    "$root": ["${folder}/p1/src", "${folder}/p2/src"]
}
```

#### 1.9.0
- Adds `{` and `[` as separators for the current path

#### 1.8.1
- Fixes the handing of the path outside strings for markdown links `[](https://github.com/ionutvmi/path-autocomplete/blob/master/./)`

#### 1.8.0
- Added support for multi root vscode folders via the `${folder}` variable in pathMappings

#### 1.7.0
- Adds support for redefining the root folder via the pathMappings with the `$root`
special key.

#### 1.6.0
- Adds the `path-autocomplete.enableFolderTrailingSlash` option

#### 1.5.0
- Adds support for path autocomplete outside strings. 
    Available via `path-autocomplete.triggerOutsideStrings`
- Improves the support for node_modules lookup. [#15](https://github.com/ionutvmi/path-autocomplete/issues/15)

#### 1.4.0
- Adds support for custom transformation

#### 1.3.0
- Adds support for custom user mappings

#### 1.2.1
- Fixes the extension trimming for folders. Fixes [#6](https://github.com/ionutvmi/path-autocomplete/issues/6)

#### 1.2.0
- Adds support for the trailing slash functionality. Fixes [#5](https://github.com/ionutvmi/path-autocomplete/issues/5)
- Adds support for path autocomplete inside backticks. Fixes [#3](https://github.com/ionutvmi/path-autocomplete/issues/3)

#### 1.1.0
- Added option to exclude files

#### 1.0.2
- Initial release
