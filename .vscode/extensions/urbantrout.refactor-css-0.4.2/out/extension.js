"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode = require("vscode");
const fetcher_1 = require("./fetcher");
const util_1 = require("util");
const lineColumn = require('line-column');
let caching = false;
const documents = new Map();
const readFileAsync = util_1.promisify(fs.readFile);
function createDocument(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const text = yield readFileAsync(uri.fsPath);
            const document = {
                path: uri.fsPath,
                scheme: uri.scheme,
                getText() {
                    return text.toString();
                },
                classesWrappers: []
            };
            return document;
        }
        catch (error) {
            console.error(error);
            return;
        }
    });
}
function addDocument(uri) {
    createDocument(uri).then(document => {
        if (document) {
            getClassesFromDocument(document);
            documents.set(uri.fsPath, document);
        }
    }).catch(error => {
        console.error(error);
    });
}
function removeDocument(uri) {
    documents.delete(uri.fsPath);
}
function cache() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uris = yield fetcher_1.default.findAllParsableDocuments();
            uris.map(uri => addDocument(uri));
        }
        catch (err) {
            vscode.window.showErrorMessage(err.message);
        }
    });
}
function getClassesFromDocument(document) {
    let match;
    const regEx = /\bclass(Name)?=['"]([^'"]*)*/g;
    const text = document.getText();
    let currentClasses;
    document.classesWrappers = [];
    while (match = regEx.exec(text)) {
        // Get unique classes
        const classes = [...new Set(match[2].replace(/['"]+/g, '').match(/\S+/g))] || [];
        const startIndex = match.index + (match[0].length - match[2].length);
        const endIndex = match.index + (match[0].length - match[2].length + 1) + match[2].length - 1;
        const alreadyRegistered = document.classesWrappers.length > 0 && document.classesWrappers.some(classWrapper => classWrapper.classes.length === classes.length &&
            classWrapper.classes.every(cssClass => classes.includes(cssClass)));
        const finder = lineColumn(text);
        const startPosition = new vscode.Position(finder.fromIndex(startIndex).line - 1, finder.fromIndex(startIndex).col - 1);
        const endPosition = new vscode.Position(finder.fromIndex(endIndex).line - 1, finder.fromIndex(endIndex).col - 1);
        if (alreadyRegistered) {
            currentClasses = document.classesWrappers.find(classWrapper => classWrapper.classes.length === classes.length &&
                classWrapper.classes.every(cssClass => classes.includes(cssClass)));
            if (currentClasses) {
                currentClasses.ranges.push(new vscode.Range(startPosition, endPosition));
            }
        }
        else {
            currentClasses = {
                classes,
                ranges: [
                    new vscode.Range(startPosition, endPosition)
                ]
            };
            document.classesWrappers.push(currentClasses);
        }
    }
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = vscode.workspace.getConfiguration();
        const CLASSES_MINIMUM = configuration.get("refactor-css.highlightMinimumClasses") || 3;
        const OCCURRENCE_MINIMUM = configuration.get("refactor-css.highlightMinimumOccurrences") || 3;
        const workspaceRootPath = vscode.workspace.rootPath;
        let hoveredClasses;
        let timeout = null;
        const decorations = [];
        caching = true;
        try {
            yield cache();
        }
        catch (err) {
            vscode.window.showErrorMessage(err.message);
            caching = false;
        }
        finally {
            caching = false;
        }
        const decorationType = vscode.window.createTextEditorDecorationType({
            light: {
                border: '2px solid rgba(68, 168, 179, 0.4)'
            },
            dark: {
                border: '2px solid rgba(68, 168, 179, 0.4)'
            }
        });
        const decorationTypeSolid = vscode.window.createTextEditorDecorationType({
            light: {
                border: '2px solid rgb(68, 168, 179)',
                backgroundColor: 'rgba(68, 168, 179, 0.2)'
            },
            dark: {
                border: '2px solid rgb(68, 168, 179)',
                backgroundColor: 'rgba(68, 168, 179, 0.2)'
            }
        });
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            triggerUpdateDecorations();
        }
        vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            hoveredClasses = undefined;
            if (editor) {
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);
        vscode.workspace.onDidChangeTextDocument(event => {
            if (activeEditor && event.document === activeEditor.document) {
                const editor = activeEditor;
                const document = {
                    path: editor.document.uri.path,
                    scheme: editor.document.uri.scheme,
                    getText() {
                        return editor.document.getText();
                    },
                    classesWrappers: []
                };
                getClassesFromDocument(document);
                documents.set(editor.document.uri.fsPath, document);
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);
        function getActiveDocument() {
            if (activeEditor) {
                return documents.get(activeEditor.document.uri.path);
            }
            return;
        }
        function triggerUpdateDecorations() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(updateDecorations, 500);
        }
        function updateDecorations() {
            if (!activeEditor) {
                return;
            }
            const document = getActiveDocument();
            if (document) {
                decorations.length = 0;
                getClassesFromDocument(document);
                // Iterate over every class combination of current document.
                for (const classesWrapper of document.classesWrappers) {
                    const occurrences = Array.from(documents.entries()).reduce((prev, [path, doc]) => {
                        const equalWrapper = doc.classesWrappers.find(currentClassesWrapper => currentClassesWrapper.classes.length === classesWrapper.classes.length &&
                            currentClassesWrapper.classes.every(cssClass => {
                                return classesWrapper.classes.includes(cssClass);
                            }));
                        if (!equalWrapper) {
                            return prev;
                        }
                        return prev + equalWrapper.ranges.length;
                    }, 0);
                    if (classesWrapper.classes.length >= CLASSES_MINIMUM && occurrences >= OCCURRENCE_MINIMUM) {
                        for (const range of classesWrapper.ranges) {
                            const decoration = { range };
                            decorations.push(decoration);
                        }
                    }
                }
                activeEditor.setDecorations(decorationType, decorations);
                updateHoveredDecorations();
            }
        }
        function updateHoveredDecorations() {
            if (!activeEditor) {
                return;
            }
            if (hoveredClasses) {
                activeEditor.setDecorations(decorationTypeSolid, hoveredClasses.ranges);
            }
            else {
                activeEditor.setDecorations(decorationTypeSolid, []);
            }
        }
        const include = configuration.get("refactor-css.include");
        const exclude = configuration.get("refactor-css.exclude");
        if (include) {
            const fileWatcher = vscode.workspace.createFileSystemWatcher(include);
            fileWatcher.onDidCreate(uri => addDocument(uri));
            fileWatcher.onDidChange(uri => addDocument(uri));
            fileWatcher.onDidDelete(uri => removeDocument(uri));
        }
        vscode.languages.registerHoverProvider([
            { scheme: 'file', language: 'html', },
            { scheme: 'file', language: 'jade', },
            { scheme: 'file', language: 'razor', },
            { scheme: 'file', language: 'php', },
            { scheme: 'file', language: 'blade', },
            { scheme: 'file', language: 'twig', },
            { scheme: 'file', language: 'markdown', },
            { scheme: 'file', language: 'erb', },
            { scheme: 'file', language: 'handlebars', },
            { scheme: 'file', language: 'ejs', },
            { scheme: 'file', language: 'nunjucks', },
            { scheme: 'file', language: 'haml', },
            { scheme: 'file', language: 'leaf', },
            { scheme: 'file', language: 'vue' },
        ], {
            provideHover: (document, position) => {
                const range1 = new vscode.Range(new vscode.Position(Math.max(position.line - 5, 0), 0), position);
                const textBeforeCursor = document.getText(range1);
                if (!/\bclass(Name)?=['"][^'"]*$/.test(textBeforeCursor)) {
                    return;
                }
                const range2 = new vscode.Range(new vscode.Position(Math.max(position.line - 5, 0), 0), position.with({ line: position.line + 1 }));
                const text2 = document.getText(range2);
                const textAfterCursor = text2.substr(textBeforeCursor.length).match(/^([^"']*)/);
                if (textAfterCursor) {
                    const str = textBeforeCursor + textAfterCursor[0];
                    const matches = str.match(/\bclass(Name)?=["']([^"']*)$/);
                    const activeDocument = getActiveDocument();
                    if (activeDocument && matches && matches[2]) {
                        const classes = [...new Set(matches[2].replace(/['"]+/g, '').match(/\S+/g))] || [];
                        hoveredClasses = activeDocument.classesWrappers.find(classWrapper => classWrapper.classes.length === classes.length &&
                            classWrapper.classes.every(cssClass => classes.includes(cssClass)));
                        if (hoveredClasses) {
                            const range = new vscode.Range(new vscode.Position(position.line, position.character +
                                str.length -
                                textBeforeCursor.length -
                                matches[2].length), new vscode.Position(position.line, position.character + str.length - textBeforeCursor.length));
                            updateHoveredDecorations();
                            const hoverStr = new vscode.MarkdownString();
                            hoverStr.isTrusted = true;
                            hoverStr.appendCodeblock(`<element class="${classes.join(' ')}"/>`, 'html');
                            const positions = [];
                            let total = 0;
                            for (const [path, document] of documents.entries()) {
                                const equalWrapper = document.classesWrappers.find(classWrapper => {
                                    if (!hoveredClasses) {
                                        return false;
                                    }
                                    return classWrapper.classes.length === hoveredClasses.classes.length &&
                                        classWrapper.classes.every(cssClass => {
                                            if (!hoveredClasses) {
                                                return false;
                                            }
                                            return hoveredClasses.classes.includes(cssClass);
                                        });
                                });
                                if (equalWrapper) {
                                    const args = vscode.Uri.parse(`${document.scheme}://${document.path}`);
                                    const count = equalWrapper.ranges.length;
                                    const commandUri = vscode.Uri.parse(`command:vscode.open?${encodeURIComponent(JSON.stringify(args))}`);
                                    let line = `${count}x in [${document.path.substr(workspaceRootPath ? workspaceRootPath.length : 0)}](${commandUri})`;
                                    if (document.path === activeDocument.path) {
                                        line = `__${line}__`;
                                    }
                                    positions.push(line);
                                    total += count;
                                }
                            }
                            if (positions.length > 1) {
                                hoverStr.appendMarkdown(`Found ${total} times in ${positions.length} files:  \n\n`);
                            }
                            positions.forEach(position => {
                                hoverStr.appendMarkdown(`${position}  \n`);
                            });
                            return new vscode.Hover(hoverStr, range);
                        }
                    }
                }
                return null;
            }
        });
    });
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map