"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const ls = vscode_css_languageservice_1.getSCSSLanguageService();
ls.configure({
    validate: false
});
function makeDocument(lines, options = {}) {
    return vscode_languageserver_1.TextDocument.create(options.uri || 'index.scss', options.languageId || 'scss', options.version || 1, Array.isArray(lines) ? lines.join('\n') : lines);
}
exports.makeDocument = makeDocument;
function makeAst(lines) {
    const document = makeDocument(lines);
    return ls.parseStylesheet(document);
}
exports.makeAst = makeAst;
function makeSameLineRange(line = 1, start = 1, end = 1) {
    return vscode_languageserver_1.Range.create(vscode_languageserver_1.Position.create(line, start), vscode_languageserver_1.Position.create(line, end));
}
exports.makeSameLineRange = makeSameLineRange;
function makeSettings(options) {
    return Object.assign({ scannerDepth: 30, scannerExclude: ['**/.git', '**/node_modules', '**/bower_components'], scanImportedFiles: true, implicitlyLabel: '(implicitly)', showErrors: false, suggestVariables: true, suggestMixins: true, suggestFunctions: true, suggestFunctionsInStringContextAfterSymbols: ' (+-*%' }, options);
}
exports.makeSettings = makeSettings;
//# sourceMappingURL=helpers.js.map