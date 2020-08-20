# VS Code SVGO

This extension is a tiny wrapper for the SVGO npm package, and provides convenient access to SVGO optimisation from within the IDE.

## Features

This extension adds two commands to VS Code.  These commands are available in any file, and will naively attempt to pass the desired file or selection text to SVGO, and replace it in-place.

### *SVGO: Optimize current file*

Optimise the active editor tab's file contents with SVGO.

### *SVGO: Optimize current selection*

Optimise the current selection's contents with SVGO.

## Requirements

SVGO does not come bundled with this extension. It is assumed that you have installed SVGO via npm (or yarn) either locally, in your project, or globally.

## Extension Settings

At this time, **VS Code SVGO** does not support any options.

## Known Issues

## Release Notes

### 0.1.0

Initial release of VS Code SVGO
