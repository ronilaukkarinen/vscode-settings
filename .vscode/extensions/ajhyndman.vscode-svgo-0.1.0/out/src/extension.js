'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const resolveModule_1 = require("./resolveModule");
const utils_1 = require("./utils");
function activate(context) {
    // Attempt to load the SVGO module.
    let svgo;
    try {
        const SVGO = resolveModule_1.default('svgo', vscode.workspace.rootPath);
        svgo = new SVGO();
    }
    catch (e) {
        // This error will generally be too low level to be useful to users.
        // We log it for debugging purposes, anyway.
        console.log(e);
    }
    // Register VS Code commands.
    const disposable1 = vscode.commands.registerCommand('extension.optimizeActiveFile', () => {
        if (svgo == null) {
            vscode.window.showErrorMessage('The svgo package is not available. Please install it locally or globally, and reload VS Code.');
            return;
        }
        // Get active editor contents.
        const activeEditorContents = vscode.window.activeTextEditor.document.getText();
        try {
            svgo.optimize(activeEditorContents, ({ data }) => {
                // Replace entire active editor contents
                utils_1.replaceSelection(vscode.window.activeTextEditor, utils_1.getFullDocumentRange(vscode.window.activeTextEditor.document), data);
            });
        }
        catch (e) {
            vscode.window.showErrorMessage(e.toString());
        }
    });
    const disposable2 = vscode.commands.registerCommand('extension.optimizeSelection', () => {
        if (svgo == null) {
            vscode.window.showErrorMessage('The svgo package is not available. Please install it locally or globally, and reload VS Code.');
            return;
        }
        // Iterate over all active selections.
        vscode.window.activeTextEditor.selections.forEach(selection => {
            // Get text in current selection
            const selectedText = vscode.window.activeTextEditor.document.getText(selection);
            try {
                svgo.optimize(selectedText, ({ data }) => {
                    // Replace selection contents
                    utils_1.replaceSelection(vscode.window.activeTextEditor, selection, data);
                });
            }
            catch (e) {
                vscode.window.showErrorMessage(e.toString());
            }
        });
    });
    context.subscriptions.push(disposable1, disposable2);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map