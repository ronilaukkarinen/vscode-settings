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
const variables_manager_1 = require("./lib/variables/variables-manager");
const editor_manager_1 = require("./lib/editor-manager");
const array_1 = require("./lib/util/array");
const mut_edited_line_1 = require("./lib/util/mut-edited-line");
const extension_1 = require("./extension");
function updatePositionsDeletion(range, positions) {
    let rangeLength = range.end.line - range.start.line;
    positions.forEach(position => {
        if (position.newPosition === null) {
            return;
        }
        if (position.oldPosition > range.start.line && position.oldPosition <= range.end.line) {
            position.newPosition = null;
            return;
        }
        if (position.oldPosition >= range.end.line) {
            position.newPosition = position.newPosition - rangeLength;
        }
        if (position.newPosition < 0) {
            position.newPosition = 0;
        }
    });
    return positions;
}
function handleLineRemoved(editedLine, positions, context) {
    editedLine.reverse();
    editedLine.forEach((line) => {
        for (let i = line.range.start.line; i <= line.range.end.line; i++) {
            // ?
            // for (let i = line.range.start.line; i <= context.editor.document.lineCount; i++) {
            variables_manager_1.default.deleteVariableInLine(extension_1.extension.editor.document.fileName, i);
        }
        positions = updatePositionsDeletion(line.range, positions);
    });
    return editedLine;
}
function handleLineAdded(editedLine, position, context) {
    editedLine = mut_edited_line_1.mutEditedLIne(editedLine);
    editedLine.forEach((line) => {
        position.forEach(position => {
            if (position.newPosition >= line.range.start.line) {
                position.newPosition = position.newPosition + 1;
            }
        });
    });
    return editedLine;
}
function filterPositions(position, deco, diffLine) {
    if (position.newPosition === null) {
        deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
        return false;
    }
    if (position.newPosition === 0 && extension_1.extension.editor.document.lineCount === 1 && extension_1.extension.editor.document.lineAt(0).text === '') {
        deco.get(position.oldPosition).forEach(decoration => decoration.dispose());
        return false;
    }
    if (Math.abs(position.oldPosition - position.newPosition) > Math.abs(diffLine)) {
        position.newPosition = position.oldPosition + diffLine;
    }
    return true;
}
function handleLineDiff(editedLine, context, diffLine) {
    let positions = array_1.mapKeysToArray(context.deco).map(position => Object({
        oldPosition: position,
        newPosition: position
    }));
    if (diffLine < 0) {
        editedLine = handleLineRemoved(editedLine, positions, context);
    }
    else {
        editedLine = handleLineAdded(editedLine, positions, context);
    }
    positions = positions.filter(position => filterPositions(position, context.deco, diffLine));
    context.deco = positions.reduce((decorations, position) => {
        if (decorations.has(position.newPosition)) {
            const decos = decorations.get(position.newPosition).concat(context.deco.get(position.oldPosition));
            decos.forEach(deco => deco.generateRange(position.newPosition));
            return decorations.set(position.newPosition, decos);
        }
        const decos = context.deco.get(position.oldPosition);
        decos.forEach(deco => deco.generateRange(position.newPosition));
        return decorations.set(position.newPosition, context.deco.get(position.oldPosition));
    }, new Map());
    return editedLine;
}
exports.handleLineDiff = handleLineDiff;
function updateDecorations(editedLine, context, cb) {
    let diffLine = context.editor.document.lineCount - context.nbLine;
    if (diffLine !== 0) {
        editedLine = handleLineDiff(editedLine, context, diffLine);
        context.nbLine = context.editor.document.lineCount;
    }
    checkDecorationForUpdate(editedLine, context, cb);
}
function disposeDecorationsForEditedLines(editedLine, context) {
    editedLine.map(({ range }) => {
        const line = range.start.line;
        if (context.deco.has(line)) {
            context.deco.get(line).forEach(decoration => {
                decoration.dispose();
            });
        }
    });
}
exports.disposeDecorationsForEditedLines = disposeDecorationsForEditedLines;
function getTextForEditedLines(editedLine, context) {
    const text = context.editor.document.getText().split(/\n/);
    return editedLine.map(({ range: { start: { line } } }) => Object({ line, text: text[line] }));
}
function checkDecorationForUpdate(editedLine, context, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        disposeDecorationsForEditedLines(editedLine, context);
        const fileLines = getTextForEditedLines(editedLine, context);
        try {
            let variables = [];
            const lines = color_util_1.default.textToFileLines(context.editor.document.getText());
            variables_manager_1.default.removeVariablesDeclarations(context.editor.document.fileName);
            yield variables_manager_1.default.findVariablesDeclarations(context.editor.document.fileName, lines);
            variables = yield variables_manager_1.default.findVariables(context.editor.document.fileName, lines);
            const colors = yield color_util_1.default.findColors(fileLines, context.editor.document.fileName);
            const decorations = extension_1.generateDecorations(colors, variables, new Map());
            extension_1.removeDuplicateDecorations(context);
            editor_manager_1.default.decorate(context.editor, decorations, context.currentSelection);
            extension_1.updateContextDecorations(decorations, context);
            extension_1.removeDuplicateDecorations(context);
        }
        catch (error) {
        }
        return cb();
    });
}
function handleChangeTextDocument(event) {
    if (extension_1.extension.editor && event.document.fileName === extension_1.extension.editor.document.fileName) {
        extension_1.extension.editor = vscode_1.window.activeTextEditor;
        const editedLine = event.contentChanges.map(_ => _);
        extension_1.q.push((cb) => updateDecorations(editedLine, extension_1.extension, cb));
        extension_1.q.push((cb) => extension_1.cleanDecorationList(extension_1.extension, cb));
    }
}
function setupEventListeners(context) {
    // window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);
    vscode_1.workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
}
exports.default = { setupEventListeners };
//# sourceMappingURL=listeners_old.js.map