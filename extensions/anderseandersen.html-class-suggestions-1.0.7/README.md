# HTML Class Suggestions

html-class-suggestions is a Visual Studio Code extension that provides completion options for html class attributes based on the css files in your workspace.

## Important VS Code v1.11.x

In v1.11 Microsoft implemented a change that makes intellisense a lot less eager in requesting suggestions from completion providers.

See release notes - https://code.visualstudio.com/updates/v1_11#_intellisense-in-comments

This unfortunately had the unintentional side effect of disabling automatic suggestions for this and all similar VS Code extensions. At the moment there are two known workarounds for this:

1. Suggestions can be called up manually using ctrl+space.
2. You can change the configuration setting described in the above release notes and set the `strings` option to `true`. This reenables the old behaviour.

More info here: [Microsoft/vscode#24464](https://github.com/Microsoft/vscode/issues/24464)

## Features

* Suggestions based on the css files in your workspace.
* Monitors your workspace for css file changes and refreshes the suggestions if needed.
* css parsing using the [css npm module](https://github.com/reworkcss/css).
* Avoids parsing identical files by comparing file hash.
* Language support: html, php
* View library support: Vue (new in 1.0.4!)

![Screenshot 1](https://raw.githubusercontent.com/andersea/HTMLClassSuggestionsVSCode/master/images/Screenshot%201.png)

## Requirements

The extension is bundled with all necessary requirements, so it should be plug and play.

## Release Notes

### 1.0.7

* Yet another small fix for [#10](https://github.com/andersea/HTMLClassSuggestionsVSCode/issues/10).

### 1.0.6

* Testability branch merged.
* Small fixes for [#10](https://github.com/andersea/HTMLClassSuggestionsVSCode/issues/10).

### 1.0.5

* Sanitation of css class names. Implements [#10](https://github.com/andersea/HTMLClassSuggestionsVSCode/issues/10).

### 1.0.4

* Basic Vue support - Suggestions should now be available in html templates in vue components.
* Hardened the css aggregator against malformed css which could break parsing completely in certain cases.

### 1.0.3

* Fixed handling of css media rules. Classes defined within media rules should now be correctly picked up by the aggregator.

### 1.0.2

* Added a status bar notification when processing is completed.

### 1.0.0
 
* I am releasing this as v1.0.0. No longer a preview. This release includes basic php support. - Issue #5.

### 0.2.1

* Fixed issue #4 - Refresh CSS classes on css file changes.

### 0.2.0

* Optimized parsing for projects with a lot of duplicate css files. See [8525aaf](https://github.com/andersea/HTMLClassSuggestionsVSCode/commit/8525aafee9f2f64ad1e39ceb78c38b91b59f0a9b).

### 0.1.2

* Fixed issue #1 - VSCode hangs when extension opens a large number of css files.

### 0.1.1

* Various minor packaging improvements.

### 0.1.0

* Initial release of html-class-suggestions.
