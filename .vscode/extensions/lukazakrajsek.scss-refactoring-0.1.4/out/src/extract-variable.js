'use strict';
const vscode = require("vscode");
function getVariableName(text, defaultName, auto) {
    if (auto) {
        return Promise.resolve(defaultName);
    }
    else {
        return vscode.window.showInputBox({
            prompt: `Variable name for '${text}':`,
            value: defaultName,
        });
    }
}
function extractVariable(auto = false) {
    return Promise.resolve().then(() => {
        let editor = vscode.window.activeTextEditor;
        let oldSelection = editor.selection;
        if (editor.selection.start.isEqual(editor.selection.end)) {
            const validChars = /[#\w\-]+/;
            const line = editor.selection.start.line;
            const lineText = editor.document.lineAt(line).text;
            const char = editor.selection.start.character;
            const before = lineText.substring(0, char);
            if (!validChars.test(lineText[char])) {
                return;
            }
            const colonPos = before.indexOf(':');
            if (colonPos === -1) {
                return;
            }
            let startChar = char;
            let endChar = char + 1;
            while (startChar > colonPos + 1) {
                if (validChars.test(lineText[startChar - 1])) {
                    startChar--;
                }
                else {
                    break;
                }
            }
            while (endChar < lineText.length - 1) {
                if (validChars.test(lineText[endChar])) {
                    endChar++;
                }
                else {
                    break;
                }
            }
            editor.selection = oldSelection = new vscode.Selection(new vscode.Position(line, startChar), new vscode.Position(line, endChar));
        }
        else if (oldSelection.start.character !== 0) {
            let prevCharPosition = new vscode.Position(oldSelection.start.line, oldSelection.start.character - 1);
            let withPrevChar = editor.document.getText(new vscode.Range(prevCharPosition, oldSelection.end));
            if (withPrevChar[0] === '#') {
                editor.selection = oldSelection = new vscode.Selection(prevCharPosition, oldSelection.end);
            }
        }
        let text = editor.document.getText(oldSelection);
        let propertyMatch = editor.document.lineAt(editor.selection.start.line).text.match(/^[\s]+([\w\-]+):/);
        let property = propertyMatch != null ? propertyMatch[1] : null;
        let isColor = text.startsWith('#');
        let variableLine = 0;
        let lastVariableLine = -1;
        let lastImportLine = -1;
        let namesDepths = [];
        let depth = 0;
        for (let i = 0; i < oldSelection.start.line; i++) {
            let line = editor.document.lineAt(i);
            let lineText = line.text;
            if (/^\$/.test(lineText)) {
                if (i > lastVariableLine) {
                    lastVariableLine = i;
                }
                continue;
            }
            if (/^\@import/.test(lineText)) {
                if (i > lastImportLine) {
                    lastImportLine = i;
                }
                continue;
            }
            lineText.trim().split(' ').forEach(part => {
                if (/^#/.test(part)) {
                    let match = part.match(/^#([\w+\-]+)/);
                    if (match != null) {
                        namesDepths.push([match[1], depth]);
                    }
                }
                else if (/^\./.test(part)) {
                    let match = part.match(/^\.([\w+\-]+)/);
                    if (match != null) {
                        namesDepths.push([match[1], depth]);
                    }
                }
                else if (/^&\./.test(part)) {
                    let match = part.match(/^&\.([\w+\-]+)/);
                    if (match != null) {
                        namesDepths.push([match[1], depth]);
                    }
                }
                else if (/^&__/.test(part)) {
                    let match = part.match(/^&__([\w+\-]+)/);
                    if (match != null) {
                        namesDepths.push([match[1], depth]);
                    }
                }
                else if (/^&--/.test(part)) {
                    let match = part.match(/^&--([\w+\-]+)/);
                    if (match != null) {
                        namesDepths.push([match[1], depth]);
                    }
                }
                else if (/^a\b/.test(part)) {
                    namesDepths.push(['link', depth]);
                }
                if (/:([\w]+)/.test(part)) {
                    namesDepths.push([part.match(/:([\w]+)/)[1], depth]);
                }
            });
            for (let j = 0; j < lineText.length; j++) {
                if (lineText[j] === '{') {
                    depth++;
                }
                else if (lineText[j] === '}') {
                    depth--;
                }
            }
            while (namesDepths.length > 0 && namesDepths[namesDepths.length - 1][1] >= depth) {
                namesDepths.pop();
            }
        }
        let names = [];
        const pushName = (name) => {
            name.split('-').forEach(part => {
                if (names.length > 0 && names[names.length - 1] === part) {
                    return;
                }
                if (part === '') {
                    return;
                }
                if (part === 'background') {
                    part = 'bg';
                }
                names.push(part);
            });
        };
        namesDepths.forEach(([name, depth]) => {
            if (/^l-/.test(name)) {
                name = name.slice(2);
            }
            pushName(name);
        });
        if (property != null) {
            if (property === 'color') {
                pushName('text-color');
            }
            else {
                pushName(property);
            }
        }
        if ((property == null || !/color/.test(property)) && isColor) {
            pushName('color');
        }
        let defaultVariableName = names.join('-');
        return getVariableName(text, defaultVariableName, auto).then(variableName => {
            if (!variableName) {
                return;
            }
            let variableFullName = `$${variableName}`;
            let variableText = `${variableFullName}: ${text};\n`;
            editor.edit(editBuilder => {
                editBuilder.replace(oldSelection, variableFullName);
                let extraLines = 0;
                if (lastVariableLine > -1) {
                    editBuilder.insert(new vscode.Position(lastVariableLine + 1, 0), variableText);
                    extraLines = 1;
                }
                else if (lastImportLine > -1) {
                    editBuilder.insert(new vscode.Position(lastImportLine + 1, 0), '\n' + variableText);
                    extraLines = 3;
                }
                else {
                    editBuilder.insert(new vscode.Position(0, 0), variableText + '\n');
                    extraLines = 2;
                }
            });
        });
    });
}
exports.extractVariable = extractVariable;
//# sourceMappingURL=extract-variable.js.map