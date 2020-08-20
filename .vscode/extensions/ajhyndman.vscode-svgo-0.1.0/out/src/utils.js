"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
function getFullDocumentRange(document) {
    const lastLineId = document.lineCount - 1;
    return new vscode_1.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}
exports.getFullDocumentRange = getFullDocumentRange;
function replaceSelection(editor, range, replacement) {
    const edit = vscode_1.TextEdit.replace(range, replacement);
    editor.edit(editBuilder => {
        editBuilder.replace(range, replacement);
    });
}
exports.replaceSelection = replaceSelection;
//# sourceMappingURL=utils.js.map