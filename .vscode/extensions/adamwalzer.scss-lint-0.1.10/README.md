# scss-lint README

This is a small scss-lint extension for vscode.

![Alt text](https://github.com/adamwalzer/vscode-scss-lint/raw/master/images/demo.gif?raw=true "Demo Gif")

## Features

This extension runs scss-lint in bash and displays the errors found by underlining and/or highlighting the errors in your scss files upon saving of that file.

## Requirements

This extension is dependent on the ruby gem scss-lint. To install the gem run the following in your terminal:
`gem install scss_lint`

The extension has only been tested with version .0.49.0 of scss_lint and above.

## Extension Settings

This extension runs scss-lint which uses your .scss-lint.yml file. Simply install the extension, and it works for .scss files.
scssLint.showHighlights sets whether or not to show highlights in addition to underlines.
scssLint.runOnTextChange determines if this extension should run when text changes on a document.
scssLint.errorBackgroundColor sets the error background color and defaults to "rgba(200, 0, 0, .8)".
scssLint.warningBackgroundColor sets the warning background color and defaults to "rgba(200, 120, 0, .8)".
scssLint.languages sets the languages this extension works with. It defaults to ["scss"]. To add css make it ["scss", "css"].
scssLint.statusBarText sets what the status bar text should read.

Default settings

```settings.json
{
    "scssLint.showHighlights": false,
    "scssLint.runOnTextChange": false,
    "scssLint.errorBackgroundColor": "rgba(200, 0, 0, .8)",
    "scssLint.warningBackgroundColor": "rgba(200, 120, 0, .8)",
    "scssLint.languages": [
        "scss"
    ],
    "scssLint.statusBarText": "`$(telescope) scss-lint  ${errors.length} $(x)  ${warnings.length} $(alert)`",
    "scssLint.configDir": ""
}
```

Example settings updates:

```settings.json
{
    "scssLint.showHighlights": false,
    "scssLint.runOnTextChange": true,
    "scssLint.errorBackgroundColor": "rgba(200, 50, 50, .8)",
    "scssLint.warningBackgroundColor": "rgba(200, 100, 20, .8)",
    "scssLint.languages": [
        "css",
        "scss"
    ],
    "scssLint.statusBarText": "`$(telescope) scss-lint ${errors.length} $(x)`",
    "scssLint.configDir": "/Users/adam/"
}
```

## Known Issues

Known issues are tracked on github. Feel free to post them there or resolve some of the issues you see.

## Release Notes

### See the [CHANGELOG](https://github.com/adamwalzer/vscode-scss-lint/blob/master/CHANGELOG.md) for notes on each release.

-----------------------------------------------------------------------------------------------------------

## Thanks

We must thank [sass](http://sass-lang.com), [scss-lint](https://github.com/brigade/scss-lint), and [vscode-wordcount](https://github.com/Microsoft/vscode-wordcount) for the help they provided in making this extension.

Also, thank you to everyone who has submitted issues and helped to improve the project. I'll try to mention you in the [CHANGELOG](https://github.com/adamwalzer/vscode-scss-lint/blob/master/CHANGELOG.md), but if I miss you, please let me know.

**Enjoy!**
