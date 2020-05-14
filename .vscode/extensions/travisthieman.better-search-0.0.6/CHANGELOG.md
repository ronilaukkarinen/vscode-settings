# Change Log

All notable changes to the "better-search" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.6] - 2019-10-12

- **BREAKING**: Search queries were being interpreted as regexes. This broke some queries using characters like braces, parens, etc. Queries are now treated as literals by default. Regex support may be enabled on a per-query basis using the Find (All Options) command.
- Fixes an issue where the search commands would do nothing if there was not an active editor
- Fixes critical issues with following links to search results on Windows.
- Added language detection support for C, C++, Lua, and Rust

## [0.0.5] - 2019-04-17

- Removes default keybinding of `C-x g` so that `C-x` keeps working (default Cut binding)

## [0.0.4] - 2019-04-13

- Fixes a critical bug where the extension did not work under Windows at all

## [0.0.3] - 2019-03-12

- Fixes an issue with shell escaping that could cause search to return zero results on some platforms or with some queries
- Fixes an issue where keybindings were too loosely scoped and would fire outside of an editor context

## [0.0.2] - 2019-03-12

- Fixes a critical bug where the extension only worked under x86 Linux. The extension now installs a ripgrep binary appropriate to the detected platform and architecture

## [0.0.1] - 2019-03-10

- Initial release
