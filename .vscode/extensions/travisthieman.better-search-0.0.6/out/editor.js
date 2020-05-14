"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWordAtPoint(editor) {
    if (!editor.selection.isEmpty) {
        return;
    }
    const currentPosition = editor.selection.active;
    const wordRange = editor.document.getWordRangeAtPosition(currentPosition);
    if (wordRange !== undefined) {
        return editor.document.getText(wordRange);
    }
}
exports.getWordAtPoint = getWordAtPoint;
//# sourceMappingURL=editor.js.map