'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const color_util_1 = require("./lib/util/color-util");
const variables_manager_1 = require("./lib/variables/variables-manager");
const editor_manager_1 = require("./lib/editor-manager");
const array_1 = require("./lib/util/array");
const tasks_runner_1 = require("./lib/tasks-runner");
const extension_1 = require("./extension");
const listeners_old_1 = require("./listeners_old");
const taskRuner = new tasks_runner_1.default();
function getDecorationsToColorize(colors, variables) {
    let decorations = extension_1.generateDecorations(colors, variables, new Map());
    function filterDuplicated(A, B) {
        return A.filter((decoration) => {
            const exist = B.findIndex((_) => {
                let position = decoration.currentRange.isEqual(_.currentRange);
                if (decoration.rgb === null && _.rgb !== null) {
                    return false;
                }
                let colors = array_1.equals(decoration.rgb, _.rgb);
                return position && colors;
            });
            return exist === -1;
        });
    }
    extension_1.extension.editor.visibleRanges.forEach(range => {
        let i = range.start.line;
        for (i; i <= range.end.line + 1; i++) {
            if (extension_1.extension.deco.has(i) === true && decorations.has(i) === true) {
                // compare and remove duplicate and remove deleted ones
                decorations.set(i, filterDuplicated(decorations.get(i), extension_1.extension.deco.get(i)));
            }
            if (extension_1.extension.deco.has(i) && !decorations.has(i)) {
                // dispose decorations
                extension_1.extension.deco.get(i).forEach(decoration => decoration.dispose());
            }
        }
    });
    cleanDecorationMap(decorations);
    return decorations;
}
function getCurrentRangeText() {
    let text = extension_1.extension.editor.document.getText();
    const fileLines = color_util_1.default.textToFileLines(text);
    let lines = [];
    extension_1.extension.editor.visibleRanges.forEach((range) => {
        let i = range.start.line;
        for (i; i <= range.end.line + 1; i++) {
            if (fileLines[i] && fileLines[i].line !== null) {
                lines.push(fileLines[i]);
            }
        }
    });
    return lines;
}
// Need to regenerate  variables decorations when base as changed
function* handleVisibleRangeEvent() {
    // trigger on ctrl + z ????
    // yield new Promise(resolve => setTimeout(resolve, 50));
    let text = extension_1.extension.editor.document.getText();
    const fileLines = color_util_1.default.textToFileLines(text);
    let lines = getCurrentRangeText();
    yield variables_manager_1.default.findVariablesDeclarations(extension_1.extension.editor.document.fileName, fileLines);
    let variables = yield variables_manager_1.default.findVariables(extension_1.extension.editor.document.fileName, lines);
    const colors = yield color_util_1.default.findColors(lines);
    let decorations = getDecorationsToColorize(colors, variables);
    editor_manager_1.default.decorate(extension_1.extension.editor, decorations, extension_1.extension.currentSelection);
    extension_1.updateContextDecorations(decorations, extension_1.extension);
    extension_1.removeDuplicateDecorations(extension_1.extension);
}
function* updateDecorations() {
    yield new Promise(resolve => setTimeout(resolve, 50));
    const fileName = extension_1.extension.editor.document.fileName;
    const fileLines = color_util_1.default.textToFileLines(extension_1.extension.editor.document.getText());
    let lines = getCurrentRangeText();
    variables_manager_1.default.removeVariablesDeclarations(extension_1.extension.editor.document.fileName);
    cleanDecorationMap(extension_1.extension.deco);
    yield variables_manager_1.default.findVariablesDeclarations(fileName, fileLines);
    const variables = yield variables_manager_1.default.findVariables(fileName, lines);
    const colors = yield color_util_1.default.findColors(lines, fileName);
    let decorations = getDecorationsToColorize(colors, variables);
    // removeDuplicateDecorations(decorations);
    // EditorManager.decorate(context.editor, decorations, context.currentSelection);
    editor_manager_1.default.decorate(extension_1.extension.editor, decorations, extension_1.extension.currentSelection);
    extension_1.updateContextDecorations(decorations, extension_1.extension);
    extension_1.removeDuplicateDecorations(extension_1.extension);
}
function cleanDecorationMap(decorations) {
    let it = decorations.entries();
    let tmp = it.next();
    while (!tmp.done) {
        let line = tmp.value[0];
        let deco = tmp.value[1];
        decorations.set(line, deco.filter(decoration => !decoration.disposed));
        tmp = it.next();
    }
}
function handleChangeTextDocument(event) {
    if (event.contentChanges.length === 0) {
        return;
    }
    if (extension_1.extension.editor && event.document.fileName === extension_1.extension.editor.document.fileName) {
        extension_1.extension.editor = vscode_1.window.activeTextEditor;
        let editedLine = event.contentChanges.map(_ => _);
        let diffLine = extension_1.extension.editor.document.lineCount - extension_1.extension.nbLine;
        if (diffLine !== 0) {
            editedLine = listeners_old_1.handleLineDiff(editedLine, extension_1.extension, diffLine);
            extension_1.extension.nbLine = extension_1.extension.editor.document.lineCount;
        }
        listeners_old_1.disposeDecorationsForEditedLines(editedLine, extension_1.extension);
        taskRuner.run(updateDecorations);
    }
}
function setupEventListeners(context) {
    // window.onDidChangeTextEditorSelection((event) => q.push((cb) => handleTextSelectionChange(event, cb)), null, context.subscriptions);
    vscode_1.workspace.onDidChangeTextDocument(handleChangeTextDocument, null, context.subscriptions);
    vscode_1.window.onDidChangeTextEditorVisibleRanges(() => taskRuner.run(handleVisibleRangeEvent), null, context.subscriptions);
    // window.onDidChangeTextEditorVisibleRanges(handleVisibleRangeEvent, null, context.subscriptions);
}
exports.default = { setupEventListeners };
//# sourceMappingURL=listeners_new.js.map