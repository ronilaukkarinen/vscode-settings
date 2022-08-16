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

## Installation & usage

1. Install [Visual Studio Code](https://code.visualstudio.com/) or [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) (Preferred, much faster)
2. Open Visual Studio Code and press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Preferences: Open Settings (JSON)`
3. Copy [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) of this repository and paste it to your settings.json (if you have made settings in this point, backup them, or cherry pick the preferred settings from this repo). By default this settings.json
4. Get [Ligaturized version of SFMono font](https://github.com/lemeb/a-better-ligaturizer/blob/master/output-fonts/SFMono.ttf) and [Liga SFMono Nerd Font](https://github.com/shaunsingh/SFMono-Nerd-Font-Ligaturized) (works for iTerm2 as well)
5. Find all `rolle` from [settings.json](https://raw.githubusercontent.com/ronilaukkarinen/vscode-settings/master/settings.json) and replace with your username (or fix paths if you are on different systems than macOS), remove possible leftover API keys or stuff that you don't want to use. In short: Tweak to your likings!
6. Press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Enable Custom CSS and JS`, restart VSCode
7. Press <kbd>⌘</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> (or <kbd>ctrl</kbd> <span>+</span> <kbd>⇧</kbd> <span>+</span> <kbd>P</kbd> on Windows system) and select `Fix Checksums: Apply`, restart VSCode by pressing  <kbd>⌘</kbd> <span>+</span> <kbd>Q</kbd> and reopen VSCode. You'll need to do this each time VSCode updates (you'll see when the font sizes change)

## Extensions

**You can decide which ones you want to install but I recommend to install them all to get the best experience. These extensions are carefully selected and fully supported by my VSCode settings.json already.**

[![custom](https://user-images.githubusercontent.com/1534150/169010107-47b0a358-7107-4097-b152-ee3c0676aec2.jpg)](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) [![doiuse](https://user-images.githubusercontent.com/1534150/169010213-7ce820ae-4e31-4bc7-9dfe-c05293e2acf3.jpg)](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-doiuse) [![dotnev](https://user-images.githubusercontent.com/1534150/169011125-f44eb153-618f-4cda-af12-36a6e129b9c6.jpg)](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) [![draculasoft](https://user-images.githubusercontent.com/1534150/169011196-483d7b2b-7019-457a-82f4-5bfa39dc0445.jpg)](https://marketplace.visualstudio.com/items?itemName=yomed.theme-dracula-soft) [![editorconfig](https://user-images.githubusercontent.com/1534150/169011405-e3d8c3ac-5fd5-4073-9c02-90d87d3d293b.jpg)](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) [![errorlens](https://user-images.githubusercontent.com/1534150/169011505-7cd30b14-c71f-472e-9bc8-e9be21e3cc79.jpg)](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) [![eslint](https://user-images.githubusercontent.com/1534150/169011658-3c306ae4-c6e3-4c8f-9de2-40841f0424c9.jpg)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) [![fixchecksums](https://user-images.githubusercontent.com/1534150/169012114-32d71a14-45d3-446c-944f-727f468cbbbc.jpg)](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums) [![copilot](https://user-images.githubusercontent.com/1534150/169012224-d246cdf9-71a5-41c0-b436-7a95773837ba.jpg)](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) [![gitlens](https://user-images.githubusercontent.com/1534150/169012292-feb5921d-943f-46d9-bd77-c1b3ee8324bf.jpg)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) [![gremlins](https://user-images.githubusercontent.com/1534150/169012379-a1590bf1-2027-42d9-8783-d53cffa2d513.jpg)](https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins) [![helium](https://user-images.githubusercontent.com/1534150/169012440-8db77f09-662b-4aac-8883-ab40c8e093b6.jpg)](https://marketplace.visualstudio.com/items?itemName=helgardrichard.helium-icon-theme) [![highlight matching tag](https://user-images.githubusercontent.com/1534150/169012659-af3e5ee5-b7cf-4c5a-b0c2-a3563c2e5fd3.jpg)](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag) [![htmlcss](https://user-images.githubusercontent.com/1534150/169012766-49cb2677-6759-4694-8e55-9cd2e9272e40.jpg)](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css) [![namethat](https://user-images.githubusercontent.com/1534150/169012864-3474d873-31d6-485b-a908-45d55181e1d1.jpg)](https://marketplace.visualstudio.com/items?itemName=guillaumedoutriaux.name-that-color) [![phpcs](https://user-images.githubusercontent.com/1534150/169013048-2df3535f-a5d7-4b8a-9875-feb2094a6f5e.jpg)](https://marketplace.visualstudio.com/items?itemName=ikappas.phpcs) [![projectmanager](https://user-images.githubusercontent.com/1534150/169013150-656e4aec-8c83-4439-8694-8f69713ff4d1.jpg)](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) [![scssintellisense](https://user-images.githubusercontent.com/1534150/169013301-71be361e-f8dd-4016-b618-fa4bbba8d692.jpg)](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-scss) [![stylefmt](https://user-images.githubusercontent.com/1534150/169013438-aa324da1-8520-4349-91d2-a868988dc812.jpg)](https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.vscode-stylefmt) [![stylelint](https://user-images.githubusercontent.com/1534150/169013559-571915dd-ddf8-49d3-9ca1-cbb4d77156e3.jpg)](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) [![sublimekeymaps](https://user-images.githubusercontent.com/1534150/169013691-30ccd503-59ad-4def-bb3d-70c5043e89ee.jpg)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings) [![svgo](https://user-images.githubusercontent.com/1534150/169013778-6d87922d-63eb-4615-894e-e789e983d1a0.jpg)](https://marketplace.visualstudio.com/items?itemName=1000ch.svgo) [![vetur](https://user-images.githubusercontent.com/1534150/169013857-3694394e-486b-448a-a1b1-1ca94b25b23e.jpg)](https://marketplace.visualstudio.com/items?itemName=octref.vetur) [![vscodefileheader](https://user-images.githubusercontent.com/1534150/169013942-11f80bb7-daa6-49e6-8070-899ef36a7b1e.jpg)](https://marketplace.visualstudio.com/items?itemName=jankincai.vscodefileheader) [![scss-language-improvements](https://user-images.githubusercontent.com/1534150/169248621-123544ed-f941-4d0f-826c-c1efd62fcc8a.png)](https://marketplace.visualstudio.com/items?itemName=ronilaukkarinen.scss-language-improvements) [![Untitled-5](https://user-images.githubusercontent.com/1534150/170866383-45b0ffb8-b555-412d-b48f-2c7e324e533f.jpg)](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables)

## Optional extensions (fully personal preference)

These extensions are not related to my settings so you can choose whether you want to install them or not.

[![codetime](https://user-images.githubusercontent.com/1534150/169009107-90463206-d916-435a-b1d2-08980ae9ffdb.jpg)](https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode) [![codestats](https://user-images.githubusercontent.com/1534150/169009947-e6cb5fa8-5d67-475d-9201-0fb26316e5e4.jpg)](https://marketplace.visualstudio.com/items?itemName=riussi.code-stats-vscode) [![wakatime](https://user-images.githubusercontent.com/1534150/169014037-30ad9dda-a503-482b-b58b-4c9f1f115b56.jpg)](https://marketplace.visualstudio.com/items?itemName=WakaTime.vscode-wakatime) [![rescuetime](https://user-images.githubusercontent.com/1534150/169013232-f7fc4b82-d290-4ab4-a954-cbfd8024f1fc.jpg)](https://marketplace.visualstudio.com/items?itemName=RescueTime.rescuetime)

### Extensions list

See [this .extension file](https://github.com/ronilaukkarinen/vscode-settings/blob/master/.extensions) which is produced by this crontab entry:

```shell
* * * * * /bin/ls -1 /Users/rolle/.vscode-insiders/extensions/ > /Users/rolle/Projects/vscode-settings/.extensions
```

## Interface

### Dark neon dracula spacegray theme

My "theme" is my own mix of Spacegray, Synthwave '84 and Dracula. Color overrides are achieved via settings.json so no actual theme extension is needed.

![Screen-Shot-2022-05-18-12-24-18 07](https://user-images.githubusercontent.com/1534150/169008168-ce74d88f-21fe-4b46-8896-912e1b9bc62a.png)

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
