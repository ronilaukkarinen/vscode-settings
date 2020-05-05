# Code::Stats extension to Visual Studio Code.

This is a Visual Studio Code extension to send updates to [https://codestats.net](https://codestats.net)

## NOTICE

I had to publish the latest version under a new publisher account. This means that if you have the old version installed you won't get an update for it. You have to uninstall the 1.0.8 or older version and install the new one from the new publisher name 'riussi' from https://marketplace.visualstudio.com/items?itemName=riussi.code-stats-vscode

## Features

This extension tracks the amount of changes you make to your files and sends out pulses to [https://codestats.net/api-docs#pulse](https://codestats.net/api-docs#pulse) to track your XP.

## Extension Settings

You need to register your machine at [https://codestats.net/my/machines](https://codestats.net/my/machines) to get an API key which you need to set in the settings.

This extension contributes the following settings:

- `codestats.apikey`: API key for your machine
- `codestats.apiurl`: Base URL for the API-endpoint
- `codestats.username`: Code::stats username

## Known Issues

## Release Notes

### 1.0.18

Updated dependencies.

### 1.0.16/1.0.17

Updated dependencies.
Added filtering out of some output languages like code runner, etc.

### 1.0.15

Added Q# to languages.

Merged PR from thebird956:
Replaced deprecated 'vscode.previewHtml' command to the webview API.

### 1.0.14

Updated deps and moved to latest VS code engine.

### 1.0.13

Updated some outdated vulnerable dependency packages. Moved the repo to Gitlab.

### 1.0.12

Updated some outdated dependency packages.

### 1.0.11

Fixed the missing lodash.template dependency for the merged HTML profile view.

### 1.0.10

Updated security vulnerable dependecy per CVE-2017-16042. Growl to 1.10.5

### 1.0.9

Merged a PR from scout199 to for a HTML-profile view and addition of username setting.

Change in the extension publisher account from juha-ristolainen to riussi. You need to uninstall the old extension and re-install.

### 1.0.8

Merged a PR from nicd to refactor the counting logic.

### 1.0.7

Merged a PR from sharpred to count formatting a large JSON-object only as 1 XP.

### 1.0.6

Changed to return just the langId if not found in the mapped languages names.
Added Elm and Elixir to the mapped names.

### 1.0.5

Changed language names to reflect the ones already used in Code::Stats.

### 1.0.4

Added a manual mapping to natural language language names.

### 1.0.3

Fixed an accumulation of XP bug.
Added a license for the logo.

### 1.0.2

Added a logo for the extension.

### 1.0.1

Added the missing github information to package.json
Added the .vsix installation package as well.

### 1.0.0

Initial release of code-stats-vscode

### For more information

- [Gitlab repository](https://gitlab.com/juha.ristolainen/code-stats-vscode)

**Enjoy!**
