"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const getText = function () {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No text editor active');
        return null;
    }
    const selection = editor.selection;
    if (!selection) {
        vscode.window.showErrorMessage('Nothing is selected');
        return null;
    }
    const selectedText = editor.document.getText(selection);
    if (!selectedText) {
        vscode.window.showErrorMessage('No selected text found');
        return null;
    }
    return selectedText;
};
exports.default = {
    getText
};
//# sourceMappingURL=selection.js.map