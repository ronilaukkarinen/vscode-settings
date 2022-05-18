# 🚀 The ultimate Visual Studio Code setup

This repository contains a Visual Studio Code settings and theme.
Used when coding [Digitoimisto Dude Oy's Projects](https://github.com/digitoimistodude).

**Strongly WIP.**<br>
**Updates regurarly.**<br>
**Aims to be minimal and usable.**<br>

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

You can decide which ones you want to install but I recommend to install them all to get the best experience. These extensions are carefully selected and fully supported by my VSCode settings.json already.

[![codetime](https://user-images.githubusercontent.com/1534150/169009107-90463206-d916-435a-b1d2-08980ae9ffdb.jpg)](https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode)

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

### Extensions list

See [this .extension file](https://github.com/ronilaukkarinen/vscode-settings/blob/master/.extensions) which is produced by this crontab entry: `* * * * * /bin/ls -1 /Users/rolle/.vscode-insiders/extensions/ > /Users/rolle/Projects/vscode-settings/.extensions`.

### Windows 10-11

If you use Windows you need a bat file for executables, see [this](https://github.com/microsoft/vscode/issues/22391#issuecomment-310593201) and [this](https://www.reddit.com/r/bashonubuntuonwindows/comments/77idb8/where_is_the_executable_for_the_new_wsl_ubuntu_in/donn90c/?utm_source=reddit&utm_medium=web2x&context=3).
