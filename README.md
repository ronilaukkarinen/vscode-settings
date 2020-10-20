# The ultimate Visual Studio Code setup

This repository contains a Visual Studio Code settings and theme.
Used when coding [Digitoimisto Dude Oy's Projects](https://github.com/digitoimistodude).

Strongly WIP.
Updated regurarly.
Aims to be minimal and usable.

## Features

### Useful extensions

Contains lots of extensions that will not slow down VSCode. Browse extensions [here](https://github.com/ronilaukkarinen/vscode-settings/tree/master/.vscode/extensions).

### Snippets

Useful snippets like `media + tab` for media queries. Browse snippets [here](https://github.com/ronilaukkarinen/vscode-settings/tree/master/snippets).

### Key bindings

Useful keybindings for different kind of tasks. Browse keybindings [here](https://github.com/ronilaukkarinen/vscode-settings/blob/master/keybindings.json).

# Usage

1. Install [Visual Studio Code](https://code.visualstudio.com/)
2. Open Visual Studio Code and type <kbd>cmd + Shift + P</kbd> (or <kbd>CTRL + Shift + P</kbd> on Windows system) and select `Preferences: Open Settings (JSON)`
3. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) of this repository and paste it to your settings.json (if you have made settings in this point, backup them, or cherry pick the preferred settings from this repo). By default this settings.json
4. Install [Synthwave '84](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode) and [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui)
5. Install [Monokai Extended](https://marketplace.visualstudio.com/items?itemName=SuperPaintman.monokai-extended) or [Dracula](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula)
6. Enable Synthwave with <kbd>cmd + Shift + P</kbd> and selecting `Synthwave '84: Enable Neon Dreams`
7. Restart
8. Some of the addons make core changes so you will most probably get `Your Code installation appears to be corrupt. Please reinstall.`, for that install [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums), <kbd>cmd + Shift + P</kbd> and select `Fix Checksums: Apply` and restart. If you get the notification again, just ignore it or select Don't show again behind cog igon. Fix Checksums apply should fix the problem though.
9. Enable Monokai Extended or Dracula Soft from Dracula Official plugin, <kbd>cmd + Shift + P</kbd> and select `Preferences: Color Theme`
10. Install your preferred [plugins](#plugins), I recommend to have at least **all of the following**: [stylefmt](https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.vscode-stylefmt), [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager), [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client), [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=coenraads.bracket-pair-colorizer), [SCSS Language Improvements](https://marketplace.visualstudio.com/items?itemName=cssinate.scss-language-improvements), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens), [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig), [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag), [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag), [Helium Icon Theme](https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme) [phpcs](https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs), [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui), [colorize](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize), [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv), [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss), [Sublime Text Keymap and Settings Importer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings), [indent-rainbow](https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow), [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint), [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag), [Better Align](https://marketplace.visualstudio.com/items?itemName=wwm.better-align) and [file-size](https://marketplace.visualstudio.com/items?itemName=zh9528.file-size) as they are fully supported by these settings.
10. If you want to import your Sublime Keymaps, [go through this documentation](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings).
11. All done!

### Dark neon theme (custom)

If you already did steps in [usage](#usage) above, you are already covered!

--- 

The old dark theme I have used is ported from [sublime-settings](https://github.com/digitoimistodude/sublime-settings). It's based on the combination of Monokai Extended, Spacegray and Synthwave '84. Color overrides are achieved via [settings.json (settings.backup-darkneon.json)](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.backup-darkneon.json) so no actual theme is needed, just activate Monokai Extended, Synthwave '84 Neon Dreams and you are good to go.

So, in summary, how to enable:

1. Get [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) modifications of this repository
2. <kbd>cmd + shift 7</kbd>, comment out synthwave84.css specific color settings from settings.json if not enabled already
3. Install [Synthwave '84](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode) and [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui)
4. Install [Monokai Extended](https://marketplace.visualstudio.com/items?itemName=SuperPaintman.monokai-extended) or [Dracula](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula)
5. Enable Synthwave with <kbd>cmd + Shift + P</kbd> and selecting `Synthwave '84: Enable Neon Dreams`
6. Restart
7. Install [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums), <kbd>cmd + Shift + P</kbd> and select `Fix Checksums: Apply` and restart
8. Enable Monokai Extended or Dracula Soft from Dracula Official plugin, <kbd>cmd + Shift + P</kbd> and select `Preferences: Color Theme`

#### With Dracula:
![Screenshot](https://i.imgur.com/yim4rNQ.png "Screenshot")

#### With Monokai Extended:
![Screenshot](https://i.imgur.com/8m8ESKo.png "Screenshot")

### Light GitHub theme (custom)

Current active theme is GitHub with some fixes and overrides with [custom.css](https://github.com/ronilaukkarinen/vscode-settings/blob/master/custom.css) and [settings.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.json). The theme is a combination of [GitHub theme for VS Vode](https://github.com/primer/github-vscode-theme), [Github Light Theme](https://github.com/chuling/vscode-theme-github-light) and [GitHub Theme for Visual Studio Code](https://github.com/thomaspink/vscode-github-theme).

So, in summary, how to enable:

1. Get [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) modifications of this repository
2. Uncomment `// GitHub light theme:` and comment out current active `"workbench.colorCustomizations": {`
3. Install [thomaspink/vscode-github-theme](https://github.com/thomaspink/vscode-github-theme) (not GitHub Light or primer's GitHub theme)
4. Comment out Github specific color settings with <kbd>Cmd + shift + 7</kbd> from settings.json if not enabled already
5. Enable Github

If you have some dark areas after this, uncomment them from your settings.json.

![Screenshot](https://i.imgur.com/X7NYkhm.png "Screenshot")

### Plugins

Updated 20.10.2020:

``` bash
$ /bin/ls -1 ~/.vscode/extensions/
```

<a href="https://marketplace.visualstudio.com/items?itemName=1000ch.svgo">1000ch.svgo-1.6.2</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager">alefragnani.project-manager-11.3.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client">bmewburn.vscode-intelephense-client-1.5.4</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=bookworms.file-header">bookworms.file-header-0.0.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=cacher.cacher-vscode">cacher.cacher-vscode-1.1.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=cdonohue.quill-icons">cdonohue.quill-icons-0.0.2</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=coenraads.bracket-pair-colorizer-2">coenraads.bracket-pair-colorizer-2-0.2.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=cssinate.scss-language-improvements">cssinate.scss-language-improvements-1.1.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint-">dbaeumer.vscode-eslint-2.1.13</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=diigu.copywithline">diigu.copywithline-0.0.2</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula-">dracula-theme.theme-dracula-2.22.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens">eamodio.gitlens-10.2.2</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig">editorconfig.editorconfig-0.15.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=fmoronzirfas.open-in-marked">fmoronzirfas.open-in-marked-1.0.8</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag">formulahendry.auto-close-tag-0.5.9</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag">formulahendry.auto-rename-tag-0.1.5</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme">helgardrichard.helium-icon-theme-1.0.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs">ikappas.phpcs-1.0.5</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui">iocave.customize-ui-0.1.49</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=iocave.monkey-patch">iocave.monkey-patch-0.1.11</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize">kamikillerto.vscode-colorize-0.8.17</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=keshan.markdown-live">keshan.markdown-live-1.2.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums">lehni.vscode-fix-checksums-1.1.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=maxvanderschee.web-accessibility">maxvanderschee.web-accessibility-0.2.83</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv">mikestead.dotenv-1.0.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss">mrmlnc.vscode-scss-0.9.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=ms-python.python">ms-python.python-2020.9.114305</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.jscs">ms-vscode.jscs-0.1.9</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings">ms-vscode.sublime-keybindings-4.0.7</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=oderwat.indent-rainbow">oderwat.indent-rainbow-7.4.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=pnp.polacode">pnp.polacode-0.3.4</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=rashwell.tcl">rashwell.tcl-0.1.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=riussi.code-stats-vscode-">riussi.code-stats-vscode-1.0.18</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=robbowen.synthwave-vscode">robbowen.synthwave-vscode-0.1.8</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.vscode-stylefmt">ronilaukkarinen.vscode-stylefmt-2.8.1</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-100-days-of-code">softwaredotcom.swdc-100-days-of-code-1.0.11</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode">softwaredotcom.swdc-vscode-2.3.14</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint">stylelint.vscode-stylelint-0.85.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag">vincaslt.highlight-matching-tag-0.10.0</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=wakatime.vscode-wakatime">wakatime.vscode-wakatime-4.0.9</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=wscats.qf">wscats.qf-6.8.88</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=wwm.better-align">wwm.better-align-1.1.6</a><br />
<a href="https://marketplace.visualstudio.com/items?itemName=zh9528.file-size">zh9528.file-size-0.1.3</a><br />
