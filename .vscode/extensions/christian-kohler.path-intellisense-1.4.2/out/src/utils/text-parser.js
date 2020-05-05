"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
function isImportExportOrRequire(text) {
    var isImport = text.substring(0, 6) === 'import';
    var isExport = text.substring(0, 6) === 'export';
    var isRequire = text.indexOf('require(') != -1;
    return isImport || isExport || isRequire;
}
exports.isImportExportOrRequire = isImportExportOrRequire;
function getTextWithinString(text, position) {
    var textToPosition = text.substring(0, position);
    var quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''), textToPosition.lastIndexOf('\`'));
    return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
}
exports.getTextWithinString = getTextWithinString;
function importStringRange(line, position) {
    var textToPosition = line.substring(0, position.character);
    var slashPosition = textToPosition.lastIndexOf('/');
    var startPosition = new vscode_1.Position(position.line, slashPosition + 1);
    var endPosition = position;
    return new vscode_1.Range(startPosition, endPosition);
}
exports.importStringRange = importStringRange;
//# sourceMappingURL=text-parser.js.map