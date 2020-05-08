# vscode-stylelint

[![Build Status](https://travis-ci.com/stylelint/vscode-stylelint.svg?branch=master)](https://travis-ci.com/stylelint/vscode-stylelint)

A [Visual Studio Code](https://code.visualstudio.com/) extension to lint [CSS](https://www.w3.org/Style/CSS/)/[SCSS](https://sass-lang.com/documentation/syntax)/[Less](http://lesscss.org/) with [stylelint](https://stylelint.io/)

![screenshot](https://github.com/stylelint/vscode-stylelint/raw/master/screenshot.png)

The extension uses the stylelint library installed in the opened workspace folder. If the workspace folder does not provide the stylelint, the extension looks for a global installed stylelint.  
If not in the global installed stylelint, the extension uses the stylelint embedded in the extension. (However, using stylelint embedded in the extension is not recommended.)

## Installation

1. Execute `Extensions: Install Extensions` command from [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).
2. Type `@id:stylelint.vscode-stylelint` into the search form and install the topmost one.

Read the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for more details.

### Optional (but recommended) setup

<img align="right" width="430" alt="duplicate messages from both the built-in linter and vscode-stylelint" src="https://raw.githubusercontent.com/stylelint/vscode-stylelint/master/media/duplicate.png">

To prevent both [the editor built-in linters](https://code.visualstudio.com/docs/languages/css#_syntax-verification-linting) `[css]` `[less]` `[scss]` and this extension `[stylelint]` from reporting essentially the same errors like in the screenshot, disable the built-in ones in User or Workspace [setting](https://code.visualstudio.com/docs/getstarted/settings):

```json
"css.validate": false,
"less.validate": false,
"scss.validate": false
```

## Usage

Once a user follows [the stylelint startup guide](https://stylelint.io/user-guide/get-started) by creating a [configuration](https://stylelint.io/user-guide/configuration) file or by editing [`stylelint.*` VSCode settings](#extension-settings), stylelint automatically validates documents with these [language identifiers](https://code.visualstudio.com/docs/languages/overview#_language-id):

<img align="right" width="430" alt="UI to select a language identifier" src="https://raw.githubusercontent.com/stylelint/vscode-stylelint/master/media/language.png">

- CSS (`css`)
- HTML (`html`)
- Less (`less`)
- JavaScript (`javascript`)
- JavaScript React (`javascriptreact`)
- Markdown (`markdown`)
- [Markdown+MathML (`source.markdown.math`)](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath)
- [PostCSS (`postcss`)](https://marketplace.visualstudio.com/items?itemName=mhmadhamster.postcss-language)
- [Sass (`sass`)](https://marketplace.visualstudio.com/items?itemName=Syler.sass-indented)
- SCSS (`scss`)
- styled-components
  - [Official (`source.css.styled`)](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
  - [Userland (`styled-css`)](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)
- [Sugarss (`sugarss`)](https://marketplace.visualstudio.com/items?itemName=mhmadhamster.postcss-language)
- [Svelte (`svelte`)](https://marketplace.visualstudio.com/items?itemName=JamesBirtles.svelte-vscode)
- TypeScript (`typescript`)
- TypeScript React (`typescriptreact`)
- [Vue (`vue`, `vue-html`, `vue-postcss`)](https://marketplace.visualstudio.com/items?itemName=octref.vetur)
- XML (`xml`)
- XSL (`xsl`)

### Extension settings

Though it's highly recommended to add a [stylelint configuration file](https://stylelint.io/user-guide/configure) to the current workspace folder instead, the following extension [settings](https://code.visualstudio.com/docs/getstarted/settings) are also available.

#### stylelint.enable

Type: `boolean`  
Default: `true`

Control whether this extension is enabled or not.

#### stylelint.configOverrides

Type: `Object`  
Default: `null`

Set stylelint [`configOverrides`](https://stylelint.io/user-guide/usage/node-api#configoverrides) option.

#### stylelint.config

Type: `Object`  
Default: `null`

Set stylelint [`config`](https://stylelint.io/user-guide/usage/node-api#config) option. Note that when this option is enabled, stylelint doesn't load configuration files.

#### stylelint.customSyntax

Type: `string`  
Default: `""`

Set stylelint [`customSyntax`](https://stylelint.io/user-guide/usage/options#customsyntax) option. An absolute path to a custom [PostCSS-compatible](https://github.com/postcss/postcss#syntaxes) syntax module.

e.g.

```json
  "stylelint.customSyntax": "sugarss"
```

You can use `${workspaceFolder}` to replace the the path of the folder opened in VS Code.

e.g.

```json
  "stylelint.customSyntax": "${workspaceFolder}/custom-syntax.js"
```

#### stylelint.reportNeedlessDisables

Type: `boolean`  
Default: `false`

Set stylelint [`reportNeedlessDisables`](https://stylelint.io/user-guide/usage/options#reportneedlessdisables) option. If `true`, also report errors for `stylelint-disable` comments that are not blocking a lint warning.

#### stylelint.validate

Type: `string[]`  
Default: `["css","html","javascript","javascriptreact","less","markdown","postcss","sass","scss","source.css.styled","source.markdown.math","styled-css","sugarss","svelte","typescript","typescriptreact","vue","vue-html","vue-postcss","xml","xsl"]`

An array of language identifiers specifying the files to be validated.

#### stylelint.stylelintPath

Type: `string`  
Default: `""`

Supply a custom path to the stylelint module.

#### stylelint.packageManager

Type: `"npm" | "yarn" | "pnpm"`  
Default: `"npm"`

Controls the package manager to be used to resolve the stylelint library. This has only an influence if the stylelint library is resolved globally. Valid values are `"npm"` or `"yarn"` or `"pnpm"`.

#### editor.codeActionsOnSave

This setting supports the entry `source.fixAll.stylelint`. If set to `true` all auto-fixable stylelint errors will be fixed on save.

```json
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  }
```

The setting below turns on Auto Fix for all providers including stylelint:

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
```

You can also selectively disable stylelint via:

```json
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.stylelint": false
  }
```

You can also selectively enable and disable specific languages using VS Code's language scoped settings. To disable `codeActionsOnSave` for HTML files, use the following setting:

```json
  "[html]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.stylelint": false
    }
  }
```

### Commands

This extension contributes the following commands to the Command palette.

- `Fix all auto-fixable problems`: applies stylelint auto-fix resolutions to all fixable problems.
