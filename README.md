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
3. Install Synthwave '84
4. Install Monokai Extended or Dracula
5. Enable Synthwave
6. Enable Neon Dreams and restart
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
