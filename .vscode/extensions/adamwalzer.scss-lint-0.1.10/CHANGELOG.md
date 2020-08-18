# Change Log
All notable changes to the "scss-lint" extension will be documented in this file.

### [0.1.10]

Update to no longer echo the file unless running on text change.

### [0.1.9]

Use vscode-uri package for parsing file uri.

### [0.1.8]

Include FinalNewLine in extension. Issue reported by [@phc284](https://github.com/phc284)

### [0.1.7]

Update regex to match LF line endings as well as CRLF. Issue reported and resolved by [@entozoon](https://github.com/entozoon)

### [0.1.6]

Update the way we deal with paths to work better cross-platform. This should help with Windows. This also makes the extension fall back to the default settings of scss-lint if there is no .scss-lint.yml file found even when a configDir is set. Issue reported by [@entozoon](https://github.com/entozoon)

### [0.1.5]

Update the readme to better explain configDir. Issue reported by [@amaisano](https://github.com/amaisano)

### [0.1.4]

Make extension properly respect file excludes. Issue reported by [@garyking](https://github.com/garyking)

### [0.1.3]

Removed --no-color from the bash command which was causing issues for some users. Issue reported by [@mazikwyry](https://github.com/mazikwyry)

### [0.1.2]

Made the extension work when there is no config file. Should there be a flag to turn this off? Issue reported by [@explorador](https://github.com/explorador)

### [0.1.1]

Fixed issues caused by special characters in scss files. Issue reported by [@afridley](https://github.com/afridley)

### [0.1.0]

Added config to allow extension to run on text change. Fixed issues when running on files with spaces in path. Cleaned up code for clarity and efficiency. Issue reported by [@freszyk](https://github.com/freszyk)

### [0.0.22]

Fixed issues preventing the extension from working on windows. Issue reported by [@felipecesr](https://github.com/felipecesr)

### [0.0.21]

Make sure that special characters don't mess up execution in bash.

### [0.0.20]

Add variable to allow extension to run on text change. Feature requested by [@freszyk](https://github.com/freszyk)

### [0.0.19]

Report scss-lint exit codes as errors in config file.

### [0.0.18]

Add Windows compatibility. [@DrChills](https://github.com/DrChills)

### [0.0.17]

Add the ability to change the config directory. Feature requested by [@viviangb](https://github.com/viviangb)

### [0.0.16]

Make this extension underline instead of highlight but create a config to highlight if desired. Report errors and warnings in the Problems Panel. [@donni106](https://github.com/donni106)

### [0.0.15]

Make statusBarText an option. Prevent logging on the wrong files. Issue reported by [@AndrewRayCode](https://github.com/AndrewRayCode)

### [0.0.14]

Adding warning count to the status bar. Feature request by [@donni106](https://github.com/donni106)

### [0.0.13]

Improved README.

### [0.0.12]

Added language support for css. scssLint.languages is an array that controls what languages this extension works with.

### [0.0.11]

Adding in warnings as well as scssLint.errorBackgroundColor and scssLint.warningBackgroundColor configurations. Issue reported by [@andykenward](https://github.com/andykenward) and fixed confirmed by [@chialin](https://github.com/chialin)

### [0.0.10]

CHANGELOG updates forgotten in last update.

### [0.0.9]

Resolves issue with dependencies.

### [0.0.8]

An unsuccessful debug attempt.

### [0.0.7]

[@youdame](https://github.com/yoodame)'s PR makes this extension work even when the .scss-lint.yml isn't in the root directory of the project. Issue originally reported by [@mkallies](https://github.com/mkallies)

### [0.0.6]

Adding the demo gif and improving README.

### [0.0.5]

Improving efficiency and adding overview ruler color.

### [0.0.4]

Adding the icon and package.json update.

### [0.0.3]

This release uses a regex to map the error message to the output.

### [0.0.2]

This release fixes an issue with a potential race condition while updating the status bar.

### [0.0.1]

This is the initial release of this extension.
