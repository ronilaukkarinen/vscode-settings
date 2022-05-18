# 🚀 The ultimate Visual Studio Code setup

This repository contains a Visual Studio Code settings and theme.
Used when coding [Digitoimisto Dude Oy's Projects](https://github.com/digitoimistodude).

**Strongly WIP.**<br>
**Updates regurarly.**<br>
**Aims to be minimal and usable.**<br>

## Table of contents

* [Features](#features)
* [Installation & usage](#installation--usage)
* [Extensions](#extensions)
* [Interface](#interface)
* [Keymaps](#keymaps)
* [Windows 10-11 support](#windows-10-11-support)

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

## Installation & usage

1. Install [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) (Preferred, much faster)
2. Open Visual Studio Code and type <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Preferences: Open Settings (JSON)`
3. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) of this repository and paste it to your settings.json (if you have made settings in this point, backup them, or cherry pick the preferred settings from this repo). By default this settings.json
4. Get [Ligaturized version of SFMono font](https://github.com/lemeb/a-better-ligaturizer/blob/master/output-fonts/SFMono.ttf) and [Liga SFMono Nerd Font](https://github.com/shaunsingh/SFMono-Nerd-Font-Ligaturized) (works for iTerm2 as well)
5. Find all `rolle` from [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) and replace with your username (or fix paths if you are on different systems than macOS), remove possible leftover API keys or stuff that you don't want to use. In short: Tweak to your likings!

## Extensions

**You can decide which ones you want to install but I recommend to install them all to get the best experience. These extensions are carefully selected and fully supported by my VSCode settings.json already.**

[![codetime](https://user-images.githubusercontent.com/1534150/169009107-90463206-d916-435a-b1d2-08980ae9ffdb.jpg)](https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode) [![codestats](https://user-images.githubusercontent.com/1534150/169009947-e6cb5fa8-5d67-475d-9201-0fb26316e5e4.jpg)](https://marketplace.visualstudio.com/items?itemName=riussi.code-stats-vscode) [![custom](https://user-images.githubusercontent.com/1534150/169010107-47b0a358-7107-4097-b152-ee3c0676aec2.jpg)](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) [![doiuse](https://user-images.githubusercontent.com/1534150/169010213-7ce820ae-4e31-4bc7-9dfe-c05293e2acf3.jpg)](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-doiuse) [![dotnev](https://user-images.githubusercontent.com/1534150/169011125-f44eb153-618f-4cda-af12-36a6e129b9c6.jpg)](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) [![draculasoft](https://user-images.githubusercontent.com/1534150/169011196-483d7b2b-7019-457a-82f4-5bfa39dc0445.jpg)](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft) [![editorconfig](https://user-images.githubusercontent.com/1534150/169011405-e3d8c3ac-5fd5-4073-9c02-90d87d3d293b.jpg)](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) [![errorlens](https://user-images.githubusercontent.com/1534150/169011505-7cd30b14-c71f-472e-9bc8-e9be21e3cc79.jpg)](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) ![eslint](https://user-images.githubusercontent.com/1534150/169011658-3c306ae4-c6e3-4c8f-9de2-40841f0424c9.jpg)

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums
https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins
https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme
https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag
https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css
https://marketplace.visualstudio.com/items?itemName=guillaumedoutriaux.name-that-color
https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs
https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager
https://marketplace.visualstudio.com/items?itemName=RescueTime.rescuetime
https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss
https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint
https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings
https://marketplace.visualstudio.com/items?itemName=1000ch.svgo
https://marketplace.visualstudio.com/items?itemName=octref.vetur
https://marketplace.visualstudio.com/items?itemName=jankincai.vscodefileheader
https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime

---

### Extensions list

See [this .extension file](https://github.com/ronilaukkarinen/vscode-settings/blob/master/.extensions) which is produced by this crontab entry: `* * * * * /bin/ls -1 /Users/rolle/.vscode-insiders/extensions/ > /Users/rolle/Projects/vscode-settings/.extensions`.

## Interface

### Dark neon dracula spacegray theme

My "theme" is my own mix of Spacegray, Synthwave '84 and Dracula. Color overrides are achieved via settings.json so no actual theme extension is needed.

--- 

#### How to install:

1. Go through the [installation steps](#installation--usage)
2. Install extensions: [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css), [Dracula Soft Syntax Theme](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft), [Fix VSCode Checksums](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums)
3. Fix path in settings.json: `"vscode_custom_css.imports": ["file:///Users/rolle/Projects/vscode-settings/editor.css"],`
6. Install [Dracula Soft](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft)
7. Enable Dracula Soft Syntax Theme, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Preferences: Color Theme`.
8. Enable Custom CSS and JS, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Enable Custom CSS and JS`.
9. Restart VSCode
10. If you get the "corrupted" notification, ignore it or select Don't show again behind cog igon. Then, <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Fix Checksums: Apply` and restart.

![Screen-Shot-2022-05-18-12-24-18 07](https://user-images.githubusercontent.com/1534150/169008168-ce74d88f-21fe-4b46-8896-912e1b9bc62a.png)

If you don't want to use CSS customizations, everything may look a big big and clumsy. You'll fix this by changing font/UI size settings to this:

```json
"editor.lineHeight": 24,
"window.zoomLevel": 0.4,
"editor.fontSize": 14,
```

## Keymaps

If you want to import your Sublime Keymaps, [go through this documentation](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings).

## Windows 10-11 support

If you use Windows you need a bat file for executables, see [this](https://github.com/microsoft/vscode/issues/22391#issuecomment-310593201) and [this](https://www.reddit.com/r/bashonubuntuonwindows/comments/77idb8/where_is_the_executable_for_the_new_wsl_ubuntu_in/donn90c/?utm_source=reddit&utm_medium=web2x&context=3).
