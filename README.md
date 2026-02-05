# 🚀 The ultimate Visual Studio Code setup

This repository contains my Visual Studio Code settings and theme, used when coding [Digitoimisto Dude Oy's projects](https://github.com/digitoimistodude).

## Features

- **🎨 Beautiful** - I'm a visual perfectionist, so my editor must look clean, minimal, distraction-free, and beautiful.
- **🧠 Useful extensions** - Includes plenty of extensions that don't slow down VS Code.
- **✂ Snippets** - Handy snippets like `media + tab` for media queries.
- **⌨ Key bindings** - Helpful key bindings for various tasks.
- **⚡ Fast** - VS Code hasn’t always been the fastest, but I choose my extensions wisely.
- **👨‍💻 Customizable** - Feel free to fork this repo and tweak the settings to suit your preferences.

## Installation

1. Install [Visual Studio Code](https://code.visualstudio.com/), [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/), [VSCodium](https://vscodium.com), or [Cursor](https://cursor.com)  
2. Download [Maple Mono](https://font.subf.dev/en/), [Liga SFMono Nerd Font](https://github.com/shaunsingh/SFMono-Nerd-Font-Ligaturized), [Monaspace variable fonts](https://github.com/githubnext/monaspace/releases/download/v1.300/monaspace-variable-v1.300.zip) and add them to Font Book  
3. Open the editor and press <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>P</kbd> (or <kbd>Ctrl</kbd> + <kbd>⇧</kbd> + <kbd>P</kbd> on Windows) and choose `Preferences: Open Keyboard Shortcuts (JSON)`. Copy the contents of [keybindings.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/keybindings.json).  
4. Open `Snippets: Configure Snippets` and choose `html`, then copy [html.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/html.json).  
5. Do the same for `php` and [php.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/php.json).  
6. Repeat for `scss` and [scss.json](https://github.com/ronilaukkarinen/vscode-settings/blob/master/snippets/scss.json).

## Recommended settings

1. Open `Preferences: Open User Settings (JSON)`  
2. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) into your settings file. If you already have custom settings, make a backup or merge them selectively.  
3. Adjust them to your preferences.  
4. Install all [extensions and themes](#extensions) below.

## Extensions

You can install whichever you like, but I recommend all of them for the best experience. These have been carefully selected and fully supported by my `settings.json`.

> [!NOTE]  
> For Cursor, you’ll need to enable the VS Code marketplace by adding this to your settings.json (see [details here](https://github.com/cursor/cursor/issues/2461#issuecomment-3023527935)):  
> ```json
> "extensions.gallery.serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
> ```

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) — `EditorConfig.EditorConfig`  
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) — `usernamehw.errorlens`  
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) — `dbaeumer.vscode-eslint`  
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) — `eamodio.gitlens`  
- [PHP_CodeSniffer](https://marketplace.visualstudio.com/items?itemName=obliviousharmony.vscode-php-codesniffer) — `obliviousharmony.vscode-php-codesniffer`  
- [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) — `alefragnani.project-manager`  
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) — `stylelint.vscode-stylelint`  
- [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg) — `1000ch.svgo`  
- [Indenticator](https://marketplace.visualstudio.com/items?itemName=SirTori.indenticator) — `SirTori.indenticator`  
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) — `esbenp.prettier-vscode`  

## My current favorite themes

- [Catppuccin for VS Code](https://open-vsx.org/extension/Catppuccin/catppuccin-vsc) + [Catppuccin Noctis Icons](https://open-vsx.org/extension/alexdauenhauer/catppuccin-noctis-icons)  
- See below for more

## Interface

### CSS property syntax highlighting fix

Fix [this long-standing issue](https://github.com/atom/language-sass/issues/226#issuecomment-1129938430) by installing [SCSS Language Improvements](https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.scss-language-improvements) (`ronilaukkarinen.scss-language-improvements`) and adding this to your settings.json if not already present:

```json
"editor.tokenColorCustomizations": {
  "textMateRules": [
    {
      "scope": "meta.property-name-custom-unique.scss",
      "settings": { "foreground": "#79b8ff" }
    }
  ]
},
```

### GitHub Purple + Sweet icons

Recommended setup: [GitHub Purple](https://marketplace.visualstudio.com/items?itemName=4a454646.github-purple) + [Sweet VS Code Icons](https://marketplace.visualstudio.com/items?itemName=EliverLara.sweet-vscode-icons).  

Install [GitHub Purple theme](https://github.com/ronilaukkarinen/github-purple):

```bash
cd ~/.vscode/extensions/
# Or: cd ~/.cursor/extensions
# Or: cd ~/.vscode-oss/extensions
git clone https://github.com/ronilaukkarinen/github-purple
```

Then select “GitHub Purple” from the Theme Color menu (<kbd>Ctrl</kbd> + <kbd>P</kbd>).  

![Screen Shot 2023-04-03 at 11-10-24](https://user-images.githubusercontent.com/1534150/229450660-3a8c26e6-2382-4f4a-bf66-560edd54edd4.png)

## Add colored icons for Helium icon theme

Add these to settings.json:

```json
"helium-icon-theme.saturation": 1,
"helium-icon-theme.opacity": 1,
```

Then press <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>P</kbd> and select `Preferences: File Icon Theme`.  
Switch to any other theme, then re-enable Helium icons.

## Windows 10–11 support

If you’re using Windows, you’ll need a `.bat` file for executables — see [this Microsoft issue](https://github.com/microsoft/vscode/issues/22391#issuecomment-310593201) and [this Reddit thread](https://www.reddit.com/r/bashonubuntuonwindows/comments/77idb8/where_is_the_executable_for_the_new_wsl_ubuntu_in/donn90c/?utm_source=reddit&utm_medium=web2x&context=3).  

Get my `.bat` files from [vscode-windows-helpers](https://github.com/ronilaukkarinen/vscode-windows-helpers).
