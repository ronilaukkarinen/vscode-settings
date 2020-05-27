/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/htmlhint/htmlhint.d.ts" />
const path = require("path");
const server = require("vscode-languageserver");
const htmlhint = require("htmlhint");
const fs = require("fs");
let stripJsonComments = require('strip-json-comments');
let settings = null;
let linter = null;
/**
 * This variable is used to cache loaded htmlhintrc objects.  It is a dictionary from path -> config object.
 * A value of null means a .htmlhintrc object didn't exist at the given path.
 * A value of undefined means the file at this path hasn't been loaded yet, or should be reloaded because it changed
 */
let htmlhintrcOptions = {};
/**
 * Given an htmlhint Error object, approximate the text range highlight
 */
function getRange(error, lines) {
    let line = lines[error.line - 1];
    var isWhitespace = false;
    var curr = error.col;
    while (curr < line.length && !isWhitespace) {
        var char = line[curr];
        isWhitespace = (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '<');
        ++curr;
    }
    if (isWhitespace) {
        --curr;
    }
    return {
        start: {
            line: error.line - 1,
            character: error.col - 1
        },
        end: {
            line: error.line - 1,
            character: curr
        }
    };
}
/**
 * Given an htmlhint.Error type return a VS Code server Diagnostic object
 */
function makeDiagnostic(problem, lines) {
    return {
        severity: server.DiagnosticSeverity.Warning,
        message: problem.message,
        range: getRange(problem, lines),
        code: problem.rule.id
    };
}
/**
 * Get the html-hint configuration settings for the given html file.  This method will take care of whether to use
 * VS Code settings, or to use a .htmlhintrc file.
 */
function getConfiguration(filePath) {
    var options;
    if (settings.htmlhint) {
        if (settings.htmlhint.configFile && settings.htmlhint.options && Object.keys(settings.htmlhint.options).length > 0) {
            throw new Error(`The configuration settings for HTMLHint are invalid. Please specify either 'htmlhint.configFile' or 'htmlhint.options', but not both.`);
        }
        if (settings.htmlhint.configFile) {
            if (fs.existsSync(settings.htmlhint.configFile)) {
                options = loadConfigurationFile(settings.htmlhint.configFile);
            }
            else {
                const configFileHint = !path.isAbsolute(settings.htmlhint.configFile) ? ` (resolves to '${path.resolve(settings.htmlhint.configFile)}')` : '';
                throw new Error(`The configuration settings for HTMLHint are invalid. The file '${settings.htmlhint.configFile}'${configFileHint} specified in 'htmlhint.configFile' could not be found.`);
            }
        }
        else if (settings.htmlhint.options && Object.keys(settings.htmlhint.options).length > 0) {
            options = settings.htmlhint.options;
        }
    }
    else {
        options = findConfigForHtmlFile(filePath);
    }
    options = options || {};
    return options;
}
/**
 * Given the path of an html file, this function will look in current directory & parent directories
 * to find a .htmlhintrc file to use as the linter configuration.  The settings are
 */
function findConfigForHtmlFile(base) {
    var options;
    if (fs.existsSync(base)) {
        // find default config file in parent directory
        if (fs.statSync(base).isDirectory() === false) {
            base = path.dirname(base);
        }
        while (base && !options) {
            var tmpConfigFile = path.resolve(base + path.sep, '.htmlhintrc');
            // undefined means we haven't tried to load the config file at this path, so try to load it.
            if (htmlhintrcOptions[tmpConfigFile] === undefined) {
                htmlhintrcOptions[tmpConfigFile] = loadConfigurationFile(tmpConfigFile);
            }
            // defined, non-null value means we found a config file at the given path, so use it.
            if (htmlhintrcOptions[tmpConfigFile]) {
                options = htmlhintrcOptions[tmpConfigFile];
                break;
            }
            base = base.substring(0, base.lastIndexOf(path.sep));
        }
    }
    return options;
}
/**
 * Given a path to a .htmlhintrc file, load it into a javascript object and return it.
 */
function loadConfigurationFile(configFile) {
    var ruleset = null;
    if (fs.existsSync(configFile)) {
        var config = fs.readFileSync(configFile, 'utf8');
        try {
            ruleset = JSON.parse(stripJsonComments(config));
        }
        catch (e) { }
    }
    return ruleset;
}
function getErrorMessage(err, document) {
    let result = null;
    if (typeof err.message === 'string' || err.message instanceof String) {
        result = err.message;
    }
    else {
        result = `An unknown error occured while validating file: ${server.Files.uriToFilePath(document.uri)}`;
    }
    return result;
}
function validateAllTextDocuments(connection, documents) {
    let tracker = new server.ErrorMessageTracker();
    documents.forEach(document => {
        try {
            validateTextDocument(connection, document);
        }
        catch (err) {
            tracker.add(getErrorMessage(err, document));
        }
    });
    tracker.sendErrors(connection);
}
function validateTextDocument(connection, document) {
    try {
        doValidate(connection, document);
    }
    catch (err) {
        connection.window.showErrorMessage(getErrorMessage(err, document));
    }
}
let connection = server.createConnection(process.stdin, process.stdout);
let documents = new server.TextDocuments();
documents.listen(connection);
function trace(message, verbose) {
    connection.tracer.log(message, verbose);
}
connection.onInitialize((params, token) => {
    let rootFolder = params.rootPath;
    let initOptions = params.initializationOptions;
    let nodePath = initOptions ? (initOptions.nodePath ? initOptions.nodePath : undefined) : undefined;
    const result = server.Files.resolveModule2(rootFolder, 'htmlhint', nodePath, trace).
        then((value) => {
        linter = value.default || value.HTMLHint || value;
        //connection.window.showInformationMessage(`onInitialize() - found local htmlhint (version ! ${value.HTMLHint.version})`);
        let result = { capabilities: { textDocumentSync: documents.syncKind } };
        return result;
    }, (error) => {
        // didn't find htmlhint in project or global, so use embedded version.
        linter = htmlhint.default || htmlhint.HTMLHint || htmlhint;
        //connection.window.showInformationMessage(`onInitialize() using embedded htmlhint(version ! ${linter.version})`);
        let result = { capabilities: { textDocumentSync: documents.syncKind } };
        return result;
    });
    return result;
});
function doValidate(connection, document) {
    try {
        let uri = document.uri;
        let fsPath = server.Files.uriToFilePath(uri);
        let contents = document.getText();
        let lines = contents.split('\n');
        let config = getConfiguration(fsPath);
        let errors = linter.verify(contents, config);
        let diagnostics = [];
        if (errors.length > 0) {
            errors.forEach(each => {
                diagnostics.push(makeDiagnostic(each, lines));
            });
        }
        connection.sendDiagnostics({ uri, diagnostics });
    }
    catch (err) {
        let message = null;
        if (typeof err.message === 'string' || err.message instanceof String) {
            message = err.message;
            throw new Error(message);
        }
        throw err;
    }
}
// A text document has changed. Validate the document.
documents.onDidChangeContent((event) => {
    // the contents of a text document has changed
    validateTextDocument(connection, event.document);
});
// The VS Code htmlhint settings have changed. Revalidate all documents.
connection.onDidChangeConfiguration((params) => {
    settings = params.settings;
    validateAllTextDocuments(connection, documents.all());
});
// The watched .htmlhintrc has changed. Clear out the last loaded config, and revalidate all documents.
connection.onDidChangeWatchedFiles((params) => {
    for (var i = 0; i < params.changes.length; i++) {
        htmlhintrcOptions[server.Files.uriToFilePath(params.changes[i].uri)] = undefined;
    }
    validateAllTextDocuments(connection, documents.all());
});
connection.listen();
//# sourceMappingURL=server.js.map