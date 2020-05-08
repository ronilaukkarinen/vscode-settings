'use strict';
const vscode = require("vscode");
function format(lines) {
    let sectionStart = null;
    let sectionSize = 0;
    const processSection = () => {
        if (sectionStart == null || sectionSize === 0) {
            return;
        }
        let max = -1;
        for (var i = sectionStart; i < sectionStart + sectionSize; i++) {
            let line = lines[i].trim();
            let match = line.match(/^\$[\w\-]+:/);
            if (match != null) {
                let len = match[0].length + 1;
                if (len > max) {
                    max = len;
                }
            }
        }
        if (max === -1) {
            return;
        }
        for (var i = sectionStart; i < sectionStart + sectionSize; i++) {
            let line = lines[i].trim();
            let match = line.match(/^(\$[\w\-]+:)\s+(.*)/);
            if (match != null) {
                lines[i] = match[1] + (new Array(max - match[1].length).fill(' ').join('')) + match[2];
            }
        }
    };
    lines.forEach((line, i) => {
        line = line.trim();
        if (line === '') {
            processSection();
            sectionStart = null;
        }
        else {
            if (sectionStart == null) {
                sectionStart = i;
                sectionSize = 0;
            }
            sectionSize++;
        }
    });
    processSection();
    return lines;
}
function formatVariables() {
    return Promise.resolve().then(() => {
        let editor = vscode.window.activeTextEditor;
        let range;
        if (editor.selection.start.isEqual(editor.selection.end)) {
            range = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(editor.document.lineCount - 1, editor.document.lineAt(editor.document.lineCount - 1).text.length));
        }
        else {
            range = new vscode.Range(new vscode.Position(editor.selection.start.line, 0), new vscode.Position(editor.selection.end.line, editor.document.lineAt(editor.selection.end.line).text.length));
        }
        let lines = editor.document.getText(range).split(/\r?\n/);
        lines = format(lines);
        editor.edit(editBuilder => {
            editBuilder.replace(range, lines.join('\n'));
        });
    });
}
exports.formatVariables = formatVariables;
//# sourceMappingURL=format-variables.js.map