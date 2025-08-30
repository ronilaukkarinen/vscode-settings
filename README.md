# 🚀 The ultimate Visual Studio Code setup

This repository contains a Visual Studio Code settings and theme.
Used when coding [Digitoimisto Dude Oy's Projects](https://github.com/digitoimistodude).

**Strongly WIP.**<br>
**Updates regurarly.**<br>
**Aims to be minimal and usable.**<br>

## Features

**🎨 Beautiful** - I'm a highly visual perfectionist-person so and that means my editor must look perfectly minimal, distract-free and beautiful. There are not a lot themes out there that please me, so I decided to build my own.

**🧠 Useful extensions** - Contains lots of extensions that will not slow down VSCode. Browse extensions [here](#extensions).

**✂ Snippets** - Useful snippets like `media + tab` for media queries. Browse snippets [here](https://github.com/ronilaukkarinen/vscode-settings/tree/master/snippets).

**⌨ Key bindings** - Useful keybindings for different kind of tasks. Browse keybindings [here](https://github.com/ronilaukkarinen/vscode-settings/blob/master/keybindings.json).
**⚡ Fast** - VSCode has not always been the fastest but I select my extensions wisely. No excessive extensions that don't get updated.

**👨‍💻 Customizable** - Feel free to fork this repository and modify settings to your liking. Let me know what you have done!

## Installation

1. Install [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) or [VSCodium](https://vscodium.com) or [Cursor](https://cursor.com)
2. Get [Ligaturized version of SFMono font](https://github.com/lemeb/a-better-ligaturizer/blob/master/output-fonts/SFMono.ttf) and [Liga SFMono Nerd Font](https://github.com/shaunsingh/SFMono-Nerd-Font-Ligaturized) (works for iTerm2 as well)
3. Open editor and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Preferences: Open Keyboard Shortcuts (JSON)`. Copy the contents of [keybindings.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/keybindings.json) to the editor.
3. Open editor and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Snippets: Configure Snippets`, select `html`. Copy the contents of [html](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/html.json) to the editor.
4. Open editor and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Snippets: Configure Snippets`, select `php`. Copy the contents of [php](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/php.json) to the editor.
5. Open editor and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Snippets: Configure Snippets`, select `scss`. Copy the contents of [scss](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/scss.json) to the editor.

## Recommended settings

1. Open editor and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Preferences: Open User Settings (JSON)`
2. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) of this repository and paste it to your settings.json (if you have made settings in this point, backup them, or cherry pick the preferred settings from this repo).
3. Find all `rolle` from [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) and replace with your username (or fix paths if you are on different systems than macOS). Save and restart VSCode when asked.
4. Tweak to your likings, if you want to
5. Install all [extensions and themes from below](https://github.com/ronilaukkarinen/vscode-settings#extensions)

## Extensions

**You can decide which ones you want to install but I recommend to install them all to get the best experience. These extensions are carefully selected and fully supported by my VSCode settings.json already.**

- [dotenv](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) — `mikestead.dotenv`
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) — `EditorConfig.EditorConfig`
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) — `usernamehw.errorlens`
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — `dbaeumer.vscode-eslint`
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) — `eamodio.gitlens`
- [Gremlins tracker for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins) — `nhoizey.gremlins`
- [Helium Icon Theme](https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme) — `helgardrichard.helium-icon-theme`
  - or [Sweet vscode Icons](https://open-vsx.org/extension/Letgamer/sweet-vscode-icons) — `sweet-vscode-icons`
- [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag) — `vincaslt.highlight-matching-tag`
- [PHP_CodeSniffer](https://marketplace.visualstudio.com/items?itemName=obliviousharmony.vscode-php-codesniffer) — `obliviousharmony.vscode-php-codesniffer`
- [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) — `alefragnani.project-manager`
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) — `stylelint.vscode-stylelint`
- [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg) — `1000ch.svgo`

## Interface

### GitHub Purple + Sweet icons

Recommended install: [Github Purple](https://marketplace.visualstudio.com/items?itemName=4a454646.github-purple) + [Sweet vscode Icons](https://marketplace.visualstudio.com/items?itemName=EliverLara.sweet-vscode-icons) to get this look:

#### Install [GitHub Purple theme](https://github.com/ronilaukkarinen/github-purple):

```bash
cd ~/.vscode/extensions/
# Or: cd ~/.cursor/extensions
# Or: cd ~/.vscode-oss/extensions
git clone https://github.com/ronilaukkarinen/github-purple
```

After this you can select GitHub Purple from the Theme Color navigation (Ctrl + P).

![Screen-Shot-2023-04-03-11-10-24 05](https://user-images.githubusercontent.com/1534150/229450660-3a8c26e6-2382-4f4a-bf66-560edd54edd4.png)

## Add colored icons

Change these to settings.json:

```json
"helium-icon-theme.saturation": 1,
"helium-icon-theme.opacity": 1,
```

Then <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> and select `Preferences: File Icon Theme`, select any other than Helium. After this re-activate Helium icons.

## Disable CSS customizations 

If you don't want to use CSS customizations, everything may look a big big and clumsy. You'll fix this by changing font/UI size settings to this:

```json
"editor.lineHeight": 24,
"window.zoomLevel": 0.4,
"editor.fontSize": 14,
```

## Keymaps

If you want to import your Sublime Keymaps, [go through this documentation](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings).

## Windows 10-11 support

If you use Windows you need a bat file for executables, see [this](https://github.com/microsoft/vscode/issues/22391#issuecomment-310593201) and [this](https://www.reddit.com/r/bashonubuntuonwindows/comments/77idb8/where_is_the_executable_for_the_new_wsl_ubuntu_in/donn90c/?utm_source=reddit&utm_medium=web2x&context=3). Get my bat files from [vscode-windows-helpers](https://github.com/ronilaukkarinen/vscode-windows-helpers).
