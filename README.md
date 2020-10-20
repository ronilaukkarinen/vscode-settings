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

### Dark neon theme (custom)

The old dark theme I have used is ported from [sublime-settings](https://github.com/digitoimistodude/sublime-settings). It's based on the combination of Monokai Extended, Spacegray and Synthwave '84. Color overrides are achieved via [settings.json (settings.backup-darkneon.json)](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.backup-darkneon.json) so no actual theme is needed, just activate Monokai Extended, Synthwave '84 Neon Dreams and you are good to go.

So, in summary, how to enable:

1. Get settings.json modifications of this repository
2. Cmd + shift 7, comment out synthwave84.css specific color settings from settings.json if not enabled already
3. Install Synthwave '84 and Customize UI
4. Install Monokai Extended or Dracula
5. Enable Synthwave
6. Enable Neon Dreams and restart (You may want to install Fix Checksums plugin and apply Fix Checksums)
7. Enable Monokai Extended or Dracula Soft from Dracula Official plugin

#### With Dracula:
![Screenshot](https://i.imgur.com/yim4rNQ.png "Screenshot")

#### With Monokai Extended:
![Screenshot](https://i.imgur.com/8m8ESKo.png "Screenshot")

### Light GitHub theme (custom)

Current active theme is GitHub with some fixes and overrides with [custom.css](https://github.com/ronilaukkarinen/vscode-settings/blob/master/custom.css) and [settings.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.json). The theme is a combination of [GitHub theme for VS Vode](https://github.com/primer/github-vscode-theme), [Github Light Theme](https://github.com/chuling/vscode-theme-github-light) and [GitHub Theme for Visual Studio Code](https://github.com/thomaspink/vscode-github-theme).

So, in summary, how to enable:

1. Get settings.json modifications of this repository
2. Install [thomaspink/vscode-github-theme](https://github.com/thomaspink/vscode-github-theme) (not GitHub Light or primer's GitHub theme)
3. Cmd + shift 7, comment out Github specific color settings from settings.json if not enabled already
4. Enable Github

![Screenshot](https://i.imgur.com/X7NYkhm.png "Screenshot")

### Plugins

Updated 20.10.2020:

``` bash
$ /bin/ls -1 ~/.vscode/extensions/
1000ch.svgo-1.6.2
alefragnani.project-manager-11.3.1
bmewburn.vscode-intelephense-client-1.5.4
bookworms.file-header-0.0.1
cacher.cacher-vscode-1.1.1
cdonohue.quill-icons-0.0.2
coenraads.bracket-pair-colorizer-2-0.2.0
cssinate.scss-language-improvements-1.1.1
dbaeumer.vscode-eslint-2.1.13
diigu.copywithline-0.0.2
dracula-theme.theme-dracula-2.22.1
eamodio.gitlens-10.2.2
editorconfig.editorconfig-0.15.1
formulahendry.auto-close-tag-0.5.9
formulahendry.auto-rename-tag-0.1.5
helgardrichard.helium-icon-theme-1.0.0
ikappas.phpcs-1.0.5
iocave.customize-ui-0.1.49
iocave.monkey-patch-0.1.11
kamikillerto.vscode-colorize-0.8.17
keshan.markdown-live-1.2.1
lehni.vscode-fix-checksums-1.1.0
maxvanderschee.web-accessibility-0.2.83
mikestead.dotenv-1.0.1
mrmlnc.vscode-scss-0.9.0
ms-python.python-2020.9.114305
ms-vscode.jscs-0.1.9
ms-vscode.sublime-keybindings-4.0.7
oderwat.indent-rainbow-7.4.0
pnp.polacode-0.3.4
rashwell.tcl-0.1.0
riussi.code-stats-vscode-1.0.18
robbowen.synthwave-vscode-0.1.8
ronilaukkarinen.vscode-stylefmt-2.8.1
softwaredotcom.swdc-100-days-of-code-1.0.11
softwaredotcom.swdc-vscode-2.3.14
stylelint.vscode-stylelint-0.85.0
vincaslt.highlight-matching-tag-0.10.0
wakatime.vscode-wakatime-4.0.9
wscats.qf-6.8.88
wwm.better-align-1.1.6
zh9528.file-size-0.1.3
```