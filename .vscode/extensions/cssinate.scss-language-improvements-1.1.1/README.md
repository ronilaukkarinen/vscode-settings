# SCSS Language Improvements

## The problem

Have you ever noticed that some properties in your SCSS files are oddly-colored by your syntax highlighter?

![content and cursor properties are colored incorrectly](https://github.com/cssinate/scss-language-improvements/raw/master/example.png)

This small extension solves that issue.

## Why does this happen in the first place?
The words "content" "cursor" "filter" "font" and "mask" are all words that have been identified as selectors (https://github.com/atom/language-css/blob/master/grammars/css.cson#L2056) and property names (https://github.com/atom/language-css/blob/master/grammars/css.cson#L1488).

## Why isn't this in the real language pack?

VSCode takes its SASS language definition directionly from the Atom language definition. There is an open issue [here](https://github.com/atom/language-sass/issues/226) discussing the issue. My fix fails the tests that run against that extension, but it seems only to be returning scope definitions the tests don't expect. I haven't found any unexpected issues in my own development.

## How does it work?

This code change targets specifically those problematic words. This plugin first considers them property names by default, but once they're followed by a curly brace, pseudo-element or pseudo-selector, they resolve to selectors.

### 1.1.1

I forgot to set the URL in my readme properly.

### 1.1.0

Fixing an issue where font properties that had two words were getting mis-highlighted (e.g. font-size, font-weight, etc.)

### 1.0.1

Removing some redundant code

### 1.0.0

Initial release of scss-language-improvements