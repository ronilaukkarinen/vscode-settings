# The ultimate Visual Studio Code setup

This repository contains a Visual Studio Code settings and theme.
Used when coding [Digitoimisto Dude Oy's Projects](https://github.com/digitoimistodude).

Strongly WIP.
Updated regurarly.
Aims to be minimal and usable.

## Features

### 🎨 Beautiful

I'm a highly visual perfectionist-person so and that means my editor must look perfectly minimal, distract-free and beautiful. There are not a lot themes out there that please me, so I decided to build my own.

### 🧠 Useful extensions

Contains lots of extensions that will not slow down VSCode. Browse extensions [here](#extensions).

### ✂ Snippets

Useful snippets like `media + tab` for media queries. Browse snippets [here](https://github.com/ronilaukkarinen/vscode-settings/tree/master/snippets).

### ⌨ Key bindings

Useful keybindings for different kind of tasks. Browse keybindings [here](https://github.com/ronilaukkarinen/vscode-settings/blob/master/keybindings.json).

### ⚡ Fast

VSCode has not always been the fastest but I select my extensions wisely. No excessive extensions that don't get updated.

### 👨‍💻 Customizable

Feel free to fork this repository and modify settings to your liking. Let me know what you have done!

# Installation & usage

1. Install [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) (Preferred, much faster)
2. Open Visual Studio Code and type <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Preferences: Open Settings (JSON)`
3. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) of this repository and paste it to your settings.json (if you have made settings in this point, backup them, or cherry pick the preferred settings from this repo). By default this settings.json
4. Get [Ligaturized version of SFMono font](https://github.com/lemeb/a-better-ligaturizer/blob/master/output-fonts/SFMono.ttf) and [Liga SFMono Nerd Font](https://github.com/shaunsingh/SFMono-Nerd-Font-Ligaturized) (works for iTerm2 as well)
5. Find all `rolle` from [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) and replace with your username (or fix paths if you are on different systems than macOS), remove possible leftover API keys or stuff that you don't want to use. In short: Tweak to your likings!

## Extensions

## Interface

After installing extensions, you need to apply some settings to get everything working.

Enable Dracula Soft Syntax Theme, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Preferences: Color Theme`.

Enable Custom CSS and JS, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Enable Custom CSS and JS`.

Some of the addons make core changes so you will most probably get `Your Code installation appears to be corrupt. Please reinstall.`, for that install [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums), <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Fix Checksums: Apply` and restart. If you get the notification again, just ignore it or select Don't show again behind cog igon. Fix Checksums apply should fix the problem though.

* [stylefmt](https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.vscode-stylefmt)
* [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)
* [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
* [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=coenraads.bracket-pair-colorizer)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
* [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [Helium Icon Theme](https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme)
* [phpcs](https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs)
* [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui)
* [colorize](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
* [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
* [SCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss)
* [Sublime Text Keymap and Settings Importer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings)
* [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
* [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag)
* [webhint](https://marketplace.visualstudio.com/items?itemName=webhint.vscode-webhint) 
* [doiuse](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-doiuse)
* [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
* [CSS var hint](https://marketplace.visualstudio.com/items?itemName=yanai101.css-var-hint)
* [svgo](https://marketplace.visualstudio.com/items?itemName=1000ch.svgo)
* [VSCodeFileHeader](https://marketplace.visualstudio.com/items?itemName=jankincai.vscodefileheader)

These plugins are fully supported by my vscode settings.json already.

## Keymaps
If you want to import your Sublime Keymaps, [go through this documentation](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings).
16. All done!

If you don't want to use CSS customizations, make sure you have these lines set:

```json
"editor.lineHeight": 24,
"window.zoomLevel": 0.4,
"editor.fontSize": 14,
```

### Dark neon theme (custom)

If you already did steps in [usage](#usage) above, you are already covered!

--- 

The old dark theme I have used is ported from [sublime-settings](https://github.com/digitoimistodude/sublime-settings). It's based on the combination of Monokai Extended, Spacegray and Synthwave '84. Color overrides are achieved via [settings.json (settings.backup-darkneon.json)](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.backup-darkneon.json) so no actual theme is needed, just activate Monokai Extended, Synthwave '84 Neon Dreams and you are good to go.

So, in summary, how to enable:

1. Get [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) modifications of this repository
2. <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>7</kbd>, comment out synthwave84.css specific color settings from settings.json if not enabled already
3. Install [Synthwave '84](https://marketplace.visualstudio.com/items?itemName=RobbOwen.synthwave-vscode) and [Customize UI](https://marketplace.visualstudio.com/items?itemName=iocave.customize-ui)
4. Install [Dracula Soft](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft)
5. Enable Synthwave with <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and selecting `Synthwave '84: Enable Neon Dreams`
6. Restart
7. Install [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums), <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Fix Checksums: Apply` and restart
8. Enable Dracula Soft Syntax Theme, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Preferences: Color Theme`

#### With [Dracula Soft](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft):
![Screenshot](https://i.imgur.com/yim4rNQ.png "Screenshot")

#### With [Monokai Extended](https://marketplace.visualstudio.com/items?itemName=SuperPaintman.monokai-extended):
![Screenshot](https://i.imgur.com/8m8ESKo.png "Screenshot")

### Light GitHub theme (custom)

Current active theme is GitHub with some fixes and overrides with [custom.css](https://github.com/ronilaukkarinen/vscode-settings/blob/master/custom.css) and [settings.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/settings.json). The theme is a combination of [GitHub theme for VS Vode](https://github.com/primer/github-vscode-theme), [Github Light Theme](https://github.com/chuling/vscode-theme-github-light) and [GitHub Theme for Visual Studio Code](https://github.com/thomaspink/vscode-github-theme).

So, in summary, how to enable:

1. Get [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) modifications of this repository
2. Uncomment `// GitHub light theme:` and comment out current active `"workbench.colorCustomizations": {`
3. Install [thomaspink/vscode-github-theme](https://github.com/thomaspink/vscode-github-theme) (not GitHub Light or primer's GitHub theme)
4. Comment out Github specific color settings with <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>7</kbd> from settings.json if not enabled already
5. Enable Github

If you have some dark areas after this, uncomment them from your settings.json.

![Screenshot](https://i.imgur.com/X7NYkhm.png "Screenshot")

### Plugins

See [this .extension file](https://github.com/ronilaukkarinen/vscode-settings/blob/master/.extensions) which is produced by this crontab entry: `* * * * * /bin/ls -1 /Users/rolle/.vscode-insiders/extensions/ > /Users/rolle/Projects/vscode-settings/.extensions`.

### Windows 10

If you use Windows you need a bat file for executables, see [this](https://github.com/microsoft/vscode/issues/22391#issuecomment-310593201) and [this](https://www.reddit.com/r/bashonubuntuonwindows/comments/77idb8/where_is_the_executable_for_the_new_wsl_ubuntu_in/donn90c/?utm_source=reddit&utm_medium=web2x&context=3).
