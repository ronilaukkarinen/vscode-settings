# vscode-modular-css

> An extension to add [Modular CSS](https://github.com/tivac/modular-css) syntax highlighting to VSCode.

[![CI Status][ci-badge]][ci-link]
[![Visual Studio Marketplace][vscode-badge]][vscode-link]
[![Installs][installs-badge]][installs-link]
[![Downloads][downloads-badge]][downloads-link]

[![license MIT][license-badge]][license-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![commit style angular][commit-style-badge]][commit-style-link]
[![Dependabot Status][dependabot-badge]][dependabot-link]


![VSCode Window showing the plugin in action](https://github.com/AndrewLeedham/vscode-extensions/raw/master/packages/vscode-modular-css/highlighting.png)

## Features
Adds the following Modular-CSS specific rule and attribute syntax highlighting on top of regular CSS.
* `@value` variable decleration: regular, namespaced and wildcard imports.
* `composes:` attribute: local and imports.
* `:external` pseudo class: local and imports.
* `:global` pseudo class.

## Known Issues
Currently this extension only supports syntax highlighting. So errors may be thrown if you are using somesort of linter.
A suggested work-around is to add the following settings to your workspace:
```json
{
    "css.lint.validProperties": [
        "composes"
    ],
    "css.lint.unknownAtRules": "ignore",
    "scss.lint.validProperties": [
        "composes"
    ],
    "scss.lint.unknownAtRules": "ignore"
}
```

---
[CHANGELOG](https://github.com/AndrewLeedham/vscode-extensions/blob/master/./CHANGELOG.md) | [LICENSE][license-link]

[highlight-image]: https://github.com/AndrewLeedham/vscode-extensions/blob/master/

[vscode-badge]: https://flat.badgen.net/vs-marketplace/v/andrewleedham.vscode-modular-css
[vscode-link]: https://marketplace.visualstudio.com/items?itemName=andrewleedham.vscode-modular-css

[installs-badge]: https://flat.badgen.net/vs-marketplace/i/andrewleedham.vscode-modular-css
[installs-link]: https://marketplace.visualstudio.com/items?itemName=andrewleedham.vscode-modular-css

[downloads-badge]: https://flat.badgen.net/vs-marketplace/d/andrewleedham.vscode-modular-css
[downloads-link]: https://marketplace.visualstudio.com/items?itemName=andrewleedham.vscode-modular-css

[ci-badge]: https://flat.badgen.net/travis/AndrewLeedham/vscode-extensions
[ci-link]: https://travis-ci.org/github/AndrewLeedham/vscode-extensions

[license-badge]: https://flat.badgen.net/badge/license/MIT
[license-link]: ./LICENSE

[semantic-release-badge]: https://flat.badgen.net/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80/semantic%20release/e10079
[semantic-release-link]: https://github.com/semantic-release/semantic-release

[commit-style-badge]: https://flat.badgen.net/badge/commit%20style/angular/purple
[commit-style-link]: https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines

[dependabot-badge]: https://flat.badgen.net/dependabot/AndrewLeedham/vscode-extensions?icon=dependabot
[dependabot-link]: https://dependabot.com
