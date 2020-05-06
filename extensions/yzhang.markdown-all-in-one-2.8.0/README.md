# Markdown Support for Visual Studio Code

[![version](https://img.shields.io/vscode-marketplace/v/yzhang.markdown-all-in-one.svg?style=flat-square&label=vscode%20marketplace)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
[![installs](https://img.shields.io/vscode-marketplace/d/yzhang.markdown-all-in-one.svg?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/yzhang-gh/vscode-markdown/CI?style=flat-square)](https://github.com/yzhang-gh/vscode-markdown/actions)
[![GitHub stars](https://img.shields.io/github/stars/yzhang-gh/vscode-markdown.svg?style=flat-square&label=github%20stars)](https://github.com/yzhang-gh/vscode-markdown)
[![GitHub Contributors](https://img.shields.io/github/contributors/yzhang-gh/vscode-markdown.svg?style=flat-square)](https://github.com/yzhang-gh/vscode-markdown/graphs/contributors)

All you need for Markdown (keyboard shortcuts, table of contents, auto preview and more).

## Features

- **Keyboard shortcuts** (toggle bold, italic, code span, strikethrough and heading)

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/toggle-bold.gif" alt="toggle bold gif" width="282px"></p>

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/check-task-list.gif" alt="check task list" width="240px"></p>

  See full key binding list in the [keyboard shortcuts](#keyboard-shortcuts) section

- **Table of contents**

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/toc.png" alt="toc" width="305px"></p>

  - The indentation rule (tab or spaces) of TOC will be the same of your current file (find it in the right bottom corner)

  - To make TOC compatible with GitHub, set option `githubCompatibility` to `true`

  - Use `<!-- omit in toc -->` to ignore a specific heading in TOC  
    (It can also be placed above a heading)

  - You can also use the `omittedFromToc` setting to omit some headings (and their subheadings) from TOC:
    ```js
    // In your settings.json
    "markdown.extension.toc.omittedFromToc": {
      // Use a path relative to your workspace.
      "README.md": [
          "# Introduction",
          "## Also omitted",
      ],
      // Or an absolute path for standalone files.
      "/home/foo/Documents/todo-list.md": [
        "## Shame list (I'll never do these)",
      ]
    }
    ```
    Note: headings underlined with `===` or `---` can also be omitted, just put their `# ` and `## ` versions in the setting, respectively.

- **List editing**

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/on-enter-key.gif" alt="on enter key" width="214px"></p>

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/tab-backspace.gif" alt="on tab/backspace key" width="214px"></p>

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/fix-marker.gif" alt="fix ordered list markers" width="214px"></p>

- **Print Markdown to HTML**

  - Command `Markdown: Print current document to HTML`

  - Compatible with [Markdown Footnotes](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-footnotes)

  - It's recommended to print the exported HTML to PDF with browser (e.g. Chrome) if you want to share your documents with others

- **GitHub Flavored Markdown**

  - Table formatter

    <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/table-formatter.gif" alt="table formatter" width="246px"></p>

    (Note that the keybinding is <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> on Linux)

  - Task list

- **Math**

  <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/math.png" alt="math" width="544px"></p>

  Please use [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) for dedicated math support. Be sure to disable `math.enabled` option of this extension.

- **Auto completions**

  Tip: also support the option `completion.root`

  - Images/Files

    <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/image-completions.png" alt="image completions" width="351px"></p>

  - Math functions

    <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/math-completions.png" alt="math completions" width="154px"></p>

  - Reference links

    <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/reference-link.png" alt="reference links" width="301px"></p>

- **Others**

  - Paste link on selected text

    <p><img src="https://github.com/yzhang-gh/vscode-markdown/raw/master/images/gifs/paste-link.gif" alt="paste link" width="342px"></p>

  - Override "Open Preview" keybinding with "Toggle Preview", which means you can close preview using the same keybinding (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> or <kbd>Ctrl</kbd> + <kbd>K</kbd> <kbd>V</kbd>).

## Available Commands

- Markdown: Create Table of Contents
- Markdown: Update Table of Contents
- Markdown: Toggle code span
- Markdown: Toggle code block
- Markdown: Print current document to HTML
- Markdown: Toggle math environment
- Markdown: Toggle list

## Keyboard Shortcuts

<details>
<summary>Table</summary>

| Key                                                              | Command                      |
| ---------------------------------------------------------------- | ---------------------------- |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>B</kbd>                    | Toggle bold                  |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>I</kbd>                    | Toggle italic                |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>]</kbd> | Toggle heading (uplevel)     |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>[</kbd> | Toggle heading (downlevel)   |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>M</kbd>                    | Toggle math environment      |
| <kbd>Alt</kbd> + <kbd>C</kbd>                                    | Check/Uncheck task list item |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> | Toggle preview               |
| <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>K</kbd> <kbd>V</kbd>       | Toggle preview to side       |

</details>

## Supported Settings

<details>
<summary>Table</summary>

| Name                                               | Default    | Description                                                                                      |
| -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `markdown.extension.completion.root`               |            | Root folder when providing file path completions (It takes effect when the path starts with `/`) |
| `markdown.extension.italic.indicator`              | `*`        | Use `*` or `_` to wrap italic text                                                               |
| `markdown.extension.katex.macros`                  | `{}`       | KaTeX macros e.g. `{ "\\name": "expansion", ... }`                                               |
| `markdown.extension.list.indentationSize`          | `adaptive` | Use different indentation size for ordered and unordered list                                    |
| `markdown.extension.orderedList.autoRenumber`      | `true`     | Auto fix list markers as you edits                                                               |
| `markdown.extension.orderedList.marker`            | `ordered`  | Or `one`: always use `1.` as ordered list marker                                                 |
| `markdown.extension.preview.autoShowPreviewToSide` | `false`    | Automatically show preview when opening a Markdown file.                                         |
| `markdown.extension.print.absoluteImgPath`         | `true`     | Convert image path to absolute path                                                              |
| `markdown.extension.print.imgToBase64`             | `false`    | Convert images to base64 when printing to HTML                                                   |
| `markdown.extension.print.onFileSave`              | `false`    | Print to HTML on file save                                                                       |
| `markdown.extension.print.validateUrls`            | `true`     | Enable/disable URL validation when printing                                                      |
| `markdown.extension.print.theme`                   | `light`    | Theme of the exported HTML                                                                       |
| `markdown.extension.syntax.decorations`            | `true`     | Add decorations to strikethrough and code spans                                                  |
| `markdown.extension.syntax.plainTheme`             | `false`    | A distraction-free theme                                                                         |
| `markdown.extension.tableFormatter.enabled`        | `true`     | Enable GFM table formatter                                                                       |
| `markdown.extension.toc.downcaseLink`              | `true`     | Force the TOC links to be lowercase                                                              |
| `markdown.extension.toc.githubCompatibility`       | `false`    | GitHub compatibility                                                                             |
| `markdown.extension.toc.omittedFromToc`            | `{}`       | Lists of headings to omit by project file (e.g. `{ "README.md": ["# Introduction"] }`)           |
| `markdown.extension.toc.levels`                    | `1..6`     | Control the heading levels to show in the table of contents.                                     |
| `markdown.extension.toc.orderedList`               | `false`    | Use ordered list in the table of contents.                                                       |
| `markdown.extension.toc.plaintext`                 | `false`    | Just plain text.                                                                                 |
| `markdown.extension.toc.unorderedList.marker`      | `-`        | Use `-`, `*` or `+` in the table of contents (for unordered list)                                |
| `markdown.extension.toc.updateOnSave`              | `true`     | Automatically update the table of contents on save.                                              |

</details>

## Changelog

See [CHANGELOG](https://github.com/yzhang-gh/vscode-markdown/blob/master/CHANGELOG.md) for more information.

## Latest Development Build

Download it [here](https://github.com/yzhang-gh/vscode-markdown/actions/), please click the latest passing event to download artifacts.

To install, execute `Extensions: Install from VSIX...` in the Command Palette (`ctrl + shift + p`)

## Contributing

- File bugs, feature requests in [GitHub Issues](https://github.com/yzhang-gh/vscode-markdown/issues).
- Leave a review on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one#review-details).
- Buy me a coffee ☕ (via [PayPal](https://www.paypal.me/2yzhang), [Alipay or WeChat](https://github.com/yzhang-gh/vscode-markdown/blob/master/donate.md)).

Special thanks to all the [contributors](https://github.com/yzhang-gh/vscode-markdown/graphs/contributors).

---

## Related

[More extensions of mine](https://marketplace.visualstudio.com/publishers/yzhang)

---

Thank [VSCode Power User Course](https://VSCode.pro?utm_source=MarkdownAllInOne) for sharing many VSCode tips with me.

[![VSCode Power User course](https://img.shields.io/badge/Learn%20-VSCode%20Power%20User%20Course%20%E2%86%92-gray.svg?style=flat-square&colorA=444444&colorB=4F44D6)](https://VSCode.pro?utm_source=MarkdownAllInOne)
