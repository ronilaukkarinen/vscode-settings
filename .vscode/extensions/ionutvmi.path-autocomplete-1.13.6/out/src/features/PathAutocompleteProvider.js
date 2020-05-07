"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vs = require("vscode");
const FileInfo_1 = require("./FileInfo");
const minimatch = require("minimatch");
const PathConfiguration_1 = require("./PathConfiguration");
// node modules
const fs = require("fs");
const path = require("path");
var configuration = new PathConfiguration_1.default();
// load the initial configurations
configuration.update();
class PathAutocomplete {
    provideCompletionItems(document, position, token) {
        var currentLine = document.getText(document.lineAt(position).range);
        var self = this;
        configuration.update(document.uri);
        this.currentFile = document.fileName;
        this.currentLine = currentLine;
        this.currentPosition = position.character;
        if (!this.shouldProvide()) {
            return Promise.resolve([]);
        }
        var foldersPath = this.getFoldersPath(document.fileName, currentLine, position.character);
        if (foldersPath.length == 0) {
            return Promise.resolve([]);
        }
        var result = this.getFolderItems(foldersPath).then((items) => {
            // build the list of the completion items
            var result = items.filter(self.filter, self).map((file) => {
                var completion = new vs.CompletionItem(file.getName());
                completion.insertText = this.getInsertText(file);
                // show folders before files
                if (file.isDirectory()) {
                    if (configuration.data.useBackslash) {
                        completion.label += '\\';
                    }
                    else {
                        completion.label += '/';
                    }
                    if (configuration.data.enableFolderTrailingSlash) {
                        var commandText = '/';
                        if (configuration.data.useBackslash) {
                            commandText = this.isInsideQuotes() ? '\\\\' : '\\';
                        }
                        completion.command = {
                            command: 'default:type',
                            title: 'triggerSuggest',
                            arguments: [{
                                    text: commandText
                                }]
                        };
                    }
                    completion.sortText = 'd';
                    completion.kind = vs.CompletionItemKind.Folder;
                }
                else {
                    completion.sortText = 'f';
                    completion.kind = vs.CompletionItemKind.File;
                }
                // this is deprecated but still needed for the completion to work
                // in json files
                completion.textEdit = new vs.TextEdit(new vs.Range(position, position), completion.insertText);
                return completion;
            });
            // add the `up one folder` item
            result.unshift(new vs.CompletionItem('..'));
            return Promise.resolve(result);
        });
        return result;
    }
    /**
     * Detemines if the file extension should be included in the selected options when
     * the selection is made.
     */
    isExtensionEnabled() {
        if (this.currentLine.match(/require|import/)) {
            return configuration.data.withExtensionOnImport;
        }
        return configuration.data.withExtension;
    }
    getInsertText(file) {
        var insertText = '';
        if (this.isExtensionEnabled() || file.isDirectory()) {
            insertText = path.basename(file.getName());
        }
        else {
            // remove the extension
            insertText = path.basename(file.getName(), path.extname(file.getName()));
        }
        if (configuration.data.useBackslash && this.isInsideQuotes()) {
            // determine if we should insert an additional backslash
            if (this.currentLine[this.currentPosition - 2] != '\\') {
                insertText = '\\' + insertText;
            }
        }
        // apply the transformations
        configuration.data.transformations.forEach((transform) => {
            var fileNameRegex = transform.when && transform.when.fileName && new RegExp(transform.when.fileName);
            if (fileNameRegex && !file.getName().match(fileNameRegex)) {
                return;
            }
            var parameters = transform.parameters || [];
            if (transform.type == 'replace' && parameters[0]) {
                insertText = String.prototype.replace.call(insertText, new RegExp(parameters[0]), parameters[1]);
            }
        });
        return insertText;
    }
    /**
     * Builds a list of the available files and folders from the provided path.
     */
    getFolderItems(foldersPath) {
        var results = foldersPath.map(folderPath => {
            return new Promise(function (resolve, reject) {
                fs.readdir(folderPath, function (err, items) {
                    if (err) {
                        return reject(err);
                    }
                    var results = [];
                    items.forEach(item => {
                        try {
                            results.push(new FileInfo_1.FileInfo(path.join(folderPath, item)));
                        }
                        catch (err) {
                            // silently ignore permissions errors
                        }
                    });
                    resolve(results);
                });
            });
        });
        return Promise.all(results).then(results => {
            return results.reduce((all, currentResults) => {
                return all.concat(currentResults);
            }, []);
        });
    }
    /**
     * Builds the current folder path based on the current file and the path from
     * the current line.
     *
     */
    getFoldersPath(fileName, currentLine, currentPosition) {
        var userPath = this.getUserPath(currentLine, currentPosition);
        var mappingResult = this.applyMapping(userPath);
        return mappingResult.items.map((item) => {
            var insertedPath = item.insertedPath;
            var currentDir = item.currentDir || this.getCurrentDirectory(fileName, insertedPath);
            // relative to the disk
            if (insertedPath.match(/^[a-z]:/i)) {
                return [path.resolve(insertedPath)];
            }
            // user folder
            if (insertedPath.startsWith('~')) {
                return [path.join(configuration.data.homeDirectory, insertedPath.substring(1))];
            }
            // npm package
            if (this.isNodePackage(insertedPath, currentLine)) {
                return [path.join(this.getNodeModulesPath(currentDir), insertedPath), path.join(currentDir, insertedPath)];
            }
            return [path.join(currentDir, insertedPath)];
        })
            .reduce((flat, toFlatten) => {
            return flat.concat(toFlatten);
        }, [])
            .filter(folderPath => {
            if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
                return false;
            }
            return true;
        });
    }
    /**
     * Retrieves the path inserted by the user. This is taken based on the last quote or last white space character.
     *
     * @param currentLine The current line of the cursor.
     * @param currentPosition The current position of the cursor.
     */
    getUserPath(currentLine, currentPosition) {
        var lastQuote = -1;
        var lastSeparator = -1;
        var pathSepartors = configuration.data.pathSeparators.split('');
        for (var i = 0; i < currentPosition; i++) {
            var c = currentLine[i];
            // skip next character if escaped
            if (c == "\\") {
                i++;
                continue;
            }
            // handle separators for support outside strings
            if (pathSepartors.indexOf(c) > -1) {
                lastSeparator = i;
                continue;
            }
            // handle quotes
            if (c == "'" || c == '"' || c == "`") {
                lastQuote = i;
            }
        }
        var startPosition = (lastQuote != -1) ? lastQuote : lastSeparator;
        return currentLine.substring(startPosition + 1, currentPosition);
    }
    /**
     * Searches for the node_modules folder in the parent folders of the current directory.
     *
     * @param currentDir The current directory
     */
    getNodeModulesPath(currentDir) {
        var rootPath = configuration.data.workspaceFolderPath;
        while (currentDir != path.dirname(currentDir)) {
            console.log(currentDir);
            var candidatePath = path.join(currentDir, 'node_modules');
            if (fs.existsSync(candidatePath)) {
                return candidatePath;
            }
            currentDir = path.dirname(currentDir);
        }
        return path.join(rootPath, 'node_modules');
    }
    /**
     * Returns the current working directory
     */
    getCurrentDirectory(fileName, insertedPath) {
        var currentDir = path.parse(fileName).dir || '/';
        var workspacePath = configuration.data.workspaceFolderPath;
        // based on the project root
        if (insertedPath.startsWith('/') && workspacePath) {
            currentDir = workspacePath;
        }
        return path.resolve(currentDir);
    }
    /**
     * Applies the folder mappings based on the user configurations
     */
    applyMapping(insertedPath) {
        var currentDir = '';
        var workspaceFolderPath = configuration.data.workspaceFolderPath;
        var workspaceRootPath = configuration.data.workspaceRootPath;
        var items = [];
        Object.keys(configuration.data.pathMappings || {})
            .sort((key1, key2) => {
            const f1 = insertedPath.startsWith(key1) ? key1.length : 0;
            const f2 = insertedPath.startsWith(key2) ? key2.length : 0;
            return f2 - f1;
        })
            .map((key) => {
            var candidatePaths = configuration.data.pathMappings[key];
            if (typeof candidatePaths == 'string') {
                candidatePaths = [candidatePaths];
            }
            return candidatePaths.map(candidatePath => {
                if (workspaceRootPath) {
                    candidatePath = candidatePath.replace('${workspace}', workspaceRootPath);
                }
                if (workspaceFolderPath) {
                    candidatePath = candidatePath.replace('${folder}', workspaceFolderPath);
                }
                candidatePath = candidatePath.replace('${home}', configuration.data.homeDirectory);
                return {
                    key: key,
                    path: candidatePath
                };
            });
        })
            .some((mappings) => {
            var found = false;
            mappings.forEach(mapping => {
                if (insertedPath.startsWith(mapping.key) || (mapping.key === '$root' && !insertedPath.startsWith('.'))) {
                    items.push({
                        currentDir: mapping.path,
                        insertedPath: insertedPath.replace(mapping.key, '')
                    });
                    found = true;
                }
            });
            // stop after the first mapping found
            return found;
        });
        // no mapping was found, use the raw path inserted by the user
        if (items.length === 0) {
            items.push({
                currentDir: '',
                insertedPath
            });
        }
        return { items };
    }
    /**
     * Determine if the current path matches the pattern for a node module
     */
    isNodePackage(insertedPath, currentLine) {
        if (!currentLine.match(/require|import/)) {
            return false;
        }
        if (!insertedPath.match(/^[a-z]/i)) {
            return false;
        }
        return true;
    }
    /**
     * Determine if we should provide path completion.
     */
    shouldProvide() {
        if (configuration.data.ignoredFilesPattern && minimatch(this.currentFile, configuration.data.ignoredFilesPattern)) {
            return false;
        }
        if (configuration.data.triggerOutsideStrings) {
            return true;
        }
        return this.isInsideQuotes();
    }
    /**
     * Determines if the cursor is inside quotes.
     */
    isInsideQuotes() {
        var currentLine = this.currentLine;
        var position = this.currentPosition;
        var quotes = {
            single: 0,
            double: 0,
            backtick: 0
        };
        // check if we are inside quotes
        for (var i = 0; i < position; i++) {
            if (currentLine.charAt(i) == "'" && currentLine.charAt(i - 1) != '\\') {
                quotes.single += quotes.single > 0 ? -1 : 1;
            }
            if (currentLine.charAt(i) == '"' && currentLine.charAt(i - 1) != '\\') {
                quotes.double += quotes.double > 0 ? -1 : 1;
            }
            if (currentLine.charAt(i) == '`' && currentLine.charAt(i - 1) != '\\') {
                quotes.backtick += quotes.backtick > 0 ? -1 : 1;
            }
        }
        return !!(quotes.single || quotes.double || quotes.backtick);
    }
    /**
     * Filter for the suggested items
     */
    filter(file) {
        // no options configured
        if (!configuration.data.excludedItems || typeof configuration.data.excludedItems != 'object') {
            return true;
        }
        var currentFile = this.currentFile;
        var valid = true;
        Object.keys(configuration.data.excludedItems).forEach(function (item) {
            var rule = configuration.data.excludedItems[item].when;
            if (minimatch(currentFile, rule) && minimatch(file.getPath(), item)) {
                valid = false;
            }
        });
        return valid;
    }
}
exports.PathAutocomplete = PathAutocomplete;
//# sourceMappingURL=PathAutocompleteProvider.js.map