'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const color_util_1 = require("./lib/util/color-util");
const queue_1 = require("./lib/queue");
const variables_manager_1 = require("./lib/variables/variables-manager");
const cache_manager_1 = require("./lib/cache-manager");
const editor_manager_1 = require("./lib/editor-manager");
const globToRegexp = require("glob-to-regexp");
const colorize_config_1 = require("./lib/colorize-config");
const listeners_old_1 = require("./listeners_old");
const listeners_new_1 = require("./listeners_new");
let config = {
    languages: [],
    filesExtensions: [],
    isHideCurrentLineDecorations: true,
    colorizedVariables: [],
    colorizedColors: [],
    filesToExcludes: [],
    filesToIncludes: [],
    inferedFilesToInclude: [],
    searchVariables: false,
    betaCWYS: false
};
exports.config = config;
let extension = {
    editor: vscode_1.window.activeTextEditor,
    nbLine: 0,
    deco: new Map(),
    currentSelection: null
};
exports.extension = extension;
const q = new queue_1.default();
exports.q = q;
function initDecorations(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!context.editor) {
            return;
        }
        let text = context.editor.document.getText();
        const fileLines = color_util_1.default.textToFileLines(text);
        let lines = [];
        if (config.betaCWYS) {
            context.editor.visibleRanges.forEach((range) => {
                lines = lines.concat(fileLines.slice(range.start.line, range.end.line + 2));
            });
        }
        else {
            lines = fileLines;
        }
        // removeDuplicateDecorations(context);
        yield variables_manager_1.default.findVariablesDeclarations(context.editor.document.fileName, fileLines);
        let variables = yield variables_manager_1.default.findVariables(context.editor.document.fileName, lines);
        const colors = yield color_util_1.default.findColors(lines);
        generateDecorations(colors, variables, context.deco);
        return editor_manager_1.default.decorate(context.editor, context.deco, context.currentSelection);
    });
}
function updateContextDecorations(decorations, context) {
    let it = decorations.entries();
    let tmp = it.next();
    while (!tmp.done) {
        let line = tmp.value[0];
        if (context.deco.has(line)) {
            context.deco.set(line, context.deco.get(line).concat(decorations.get(line)));
        }
        else {
            context.deco.set(line, decorations.get(line));
        }
        tmp = it.next();
    }
}
exports.updateContextDecorations = updateContextDecorations;
function removeDuplicateDecorations(context) {
    let it = context.deco.entries();
    let m = new Map();
    let tmp = it.next();
    while (!tmp.done) {
        let line = tmp.value[0];
        let decorations = tmp.value[1];
        let newDecorations = [];
        decorations.forEach((deco, i) => {
            deco.generateRange(line);
            const exist = newDecorations.findIndex((_) => deco.currentRange.isEqual(_.currentRange));
            if (exist !== -1) {
                newDecorations[exist].dispose();
                newDecorations = newDecorations.filter((_, i) => i !== exist);
            }
            newDecorations.push(deco);
        });
        m.set(line, newDecorations);
        tmp = it.next();
    }
    context.deco = m;
}
exports.removeDuplicateDecorations = removeDuplicateDecorations;
function updateDecorationMap(map, line, decoration) {
    if (map.has(line)) {
        map.set(line, map.get(line).concat([decoration]));
    }
    else {
        map.set(line, [decoration]);
    }
}
function generateDecorations(colors, variables, decorations) {
    colors.map(({ line, colors }) => colors.forEach((color) => {
        const decoration = color_util_1.default.generateDecoration(color, line);
        updateDecorationMap(decorations, line, decoration);
    }));
    variables.map(({ line, colors }) => colors.forEach((variable) => {
        const decoration = variables_manager_1.default.generateDecoration(variable, line);
        updateDecorationMap(decorations, line, decoration);
    }));
    return decorations;
}
exports.generateDecorations = generateDecorations;
/**
 * Check if COLORIZE support a language
 *
 * @param {string} languageId A valid languageId
 * @returns {boolean}
 */
function isLanguageSupported(languageId) {
    return config.languages.indexOf(languageId) !== -1;
}
/**
 * Check if COLORIZE support a file extension
 *
 * @param {string} fileName A valid filename (path to the file)
 * @returns {boolean}
 */
function isFileExtensionSupported(fileName) {
    return config.filesExtensions.some((ext) => ext.test(fileName));
}
/**
 * Check if the file is the `colorize.include` setting
 *
 * @param {string} fileName A valid filename (path to the file)
 * @returns {boolean}
 */
function isIncludedFile(fileName) {
    return config.filesToIncludes.find((globPattern) => globToRegexp(globPattern).test(fileName)) !== undefined;
}
/**
 * Check if a file can be colorized by COLORIZE
 *
 * @param {TextDocument} document The document to test
 * @returns {boolean}
 */
function canColorize(document) {
    return isLanguageSupported(document.languageId) || isFileExtensionSupported(document.fileName) || isIncludedFile(document.fileName);
}
exports.canColorize = canColorize;
function handleTextSelectionChange(event, cb) {
    if (!config.isHideCurrentLineDecorations || event.textEditor !== extension.editor) {
        return cb();
    }
    if (extension.currentSelection.length !== 0) {
        extension.currentSelection.forEach(line => {
            const decorations = extension.deco.get(line);
            if (decorations !== undefined) {
                editor_manager_1.default.decorateOneLine(extension.editor, decorations, line);
            }
        });
    }
    extension.currentSelection = [];
    event.selections.forEach((selection) => {
        let decorations = extension.deco.get(selection.active.line);
        if (decorations) {
            decorations.forEach(_ => _.hide());
        }
    });
    extension.currentSelection = event.selections.map((selection) => selection.active.line);
    return cb();
}
function handleCloseOpen(document) {
    q.push((cb) => {
        if (extension.editor && extension.editor.document.fileName === document.fileName) {
            cache_manager_1.default.saveDecorations(document, extension.deco);
            return cb();
        }
        return cb();
    });
}
function colorize(editor, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        extension.editor = null;
        extension.deco = new Map();
        if (!editor || !canColorize(editor.document)) {
            return cb();
        }
        extension.editor = editor;
        extension.currentSelection = editor.selections.map((selection) => selection.active.line);
        const deco = cache_manager_1.default.getCachedDecorations(editor.document);
        if (deco) {
            extension.deco = deco;
            extension.nbLine = editor.document.lineCount;
            editor_manager_1.default.decorate(extension.editor, extension.deco, extension.currentSelection);
        }
        else {
            extension.nbLine = editor.document.lineCount;
            try {
                yield initDecorations(extension);
            }
            finally {
                cache_manager_1.default.saveDecorations(extension.editor.document, extension.deco);
            }
        }
        return cb();
    });
}
exports.colorize = colorize;
function handleChangeActiveTextEditor(editor) {
    if (extension.editor !== undefined && extension.editor !== null) {
        extension.deco.forEach(decorations => decorations.forEach(deco => deco.hide()));
        cache_manager_1.default.saveDecorations(extension.editor.document, extension.deco);
    }
    getVisibleFileEditors().filter(e => e !== editor).forEach(e => {
        q.push(cb => colorize(e, cb));
    });
    q.push(cb => colorize(editor, cb));
}
function cleanDecorationList(context, cb) {
    let it = context.deco.entries();
    let tmp = it.next();
    while (!tmp.done) {
        let line = tmp.value[0];
        let decorations = tmp.value[1];
        context.deco.set(line, decorations.filter(decoration => !decoration.disposed));
        tmp = it.next();
    }
    return cb();
}
exports.cleanDecorationList = cleanDecorationList;
// function handleChangeTextDocument(event: TextDocumentChangeEvent) {
//   if (extension.editor && event.document.fileName === extension.editor.document.fileName) {
//     extension.editor = window.activeTextEditor;
//     q.push((cb) => updateDecorations(event.contentChanges, extension, cb));
//     q.push((cb) => cleanDecorationList(extension, cb));
//   }
// }
function clearCache() {
    extension.deco.clear();
    extension.deco = new Map();
    cache_manager_1.default.clearCache();
}
function handleConfigurationChanged() {
    const newConfig = colorize_config_1.getColorizeConfig();
    clearCache();
    // delete current decorations then regenerate decorations
    color_util_1.default.setupColorsExtractors(newConfig.colorizedColors);
    q.push((cb) => __awaiter(this, void 0, void 0, function* () {
        // remove event listeners?
        variables_manager_1.default.setupVariablesExtractors(newConfig.colorizedVariables);
        if (newConfig.searchVariables) {
            yield variables_manager_1.default.getWorkspaceVariables(newConfig.filesToIncludes.concat(newConfig.inferedFilesToInclude), newConfig.filesToExcludes); // 👍
        }
        return cb();
    }));
    exports.config = config = newConfig;
    colorizeVisibleTextEditors();
}
function initEventListeners(context) {
    // workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
    vscode_1.window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);
    vscode_1.workspace.onDidCloseTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.workspace.onDidSaveTextDocument(handleCloseOpen, null, context.subscriptions);
    vscode_1.window.onDidChangeActiveTextEditor(handleChangeActiveTextEditor, null, context.subscriptions);
    vscode_1.workspace.onDidChangeConfiguration(handleConfigurationChanged, null, context.subscriptions);
    if (config.betaCWYS) {
        listeners_new_1.default.setupEventListeners(context);
    }
    else {
        listeners_old_1.default.setupEventListeners(context);
    }
}
function getVisibleFileEditors() {
    return vscode_1.window.visibleTextEditors.filter(editor => editor.document.uri.scheme === 'file');
}
function colorizeVisibleTextEditors() {
    getVisibleFileEditors().forEach(editor => {
        q.push(cb => colorize(editor, cb));
    });
}
function activate(context) {
    exports.config = config = colorize_config_1.getColorizeConfig();
    color_util_1.default.setupColorsExtractors(config.colorizedColors);
    variables_manager_1.default.setupVariablesExtractors(config.colorizedVariables);
    q.push((cb) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (config.searchVariables) {
                yield variables_manager_1.default.getWorkspaceVariables(config.filesToIncludes.concat(config.inferedFilesToInclude), config.filesToExcludes); // 👍
            }
            initEventListeners(context);
        }
        catch (error) { }
        return cb();
    }));
    colorizeVisibleTextEditors();
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    extension.nbLine = null;
    extension.editor = null;
    extension.deco.clear();
    extension.deco = null;
    cache_manager_1.default.clearCache();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map