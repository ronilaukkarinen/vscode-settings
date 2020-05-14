# Better Search

This extension adds a new search functionality that presents your results in a full window. This approach is borrowed from Sublime Text, many Emacs modes, and various other common editors.

![Better Search Example](https://github.com/thieman/better-search/raw/master/media/search.png)

## Features

- Displays search results in an editor window, rather than the sidebar
- Results link to the matching file at the correct line
- Shows context lines around the line matching your query
- Syntax highlighting based on the most common file type found in your search results
- Integrates with File Explorer so you can easily search in specific folders

## How to Use

Once you've installed the extension, you can take it for a spin:

1. Hit Cmd + P and type to find "Better Seach: Quick Find" and hit enter to run the command
2. In the search buffer, type `enter` on one of the links (file name or column number) to go to a file
3. To re-run the current search, type `g` or run `betterSearch.reexecute`

There's also `betterSearch.searchFull` if you'd like to run a search with more control over the execution options.

## Configuration

- `betterSearch.context`: Number of context lines to show around search results. Default: 2
- `betterSearch.sortFiles`: Sort files for deterministic sort. Enabling this limits the search to 1 thread and will negatively impact performance.

## Attributions

Magnifying glass icon courtesy of [icon lauk](https://www.iconfinder.com/andhikairfani)
