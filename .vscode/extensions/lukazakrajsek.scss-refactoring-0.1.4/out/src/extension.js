'use strict';
const vscode = require("vscode");
const extract_variable_1 = require("./extract-variable");
const format_variables_1 = require("./format-variables");
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.scssRefactoringExtractVariable', () => {
        return extract_variable_1.extractVariable().catch(err => {
            vscode.window.showErrorMessage('Extract variable error: ' + err);
            console.log(err);
            console.log(err.stack);
            return Promise.reject(err);
        });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.scssRefactoringFormatVariables', () => {
        return format_variables_1.formatVariables().catch(err => {
            vscode.window.showErrorMessage('Format variables error: ' + err);
            console.log(err);
            console.log(err.stack);
            return Promise.reject(err);
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map