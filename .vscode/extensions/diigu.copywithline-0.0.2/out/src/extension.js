'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const copypaste = require("copy-paste");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "copywithline" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.copywithline', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var startLine = editor.selection.start.line + 1;
        var selection = editor.selection;
        var origText = editor.document.getText(selection);
        var copiedText = "";
        // copiedText += "\n=============\n";
        copiedText += "File: " + editor.document.fileName + "\n";
        origText.split('\n').forEach(function (v, i) {
            var curLine = startLine + i;
            copiedText += "" + curLine + ": " + v + "\n";
        });
        copypaste.copy(copiedText, res => {
            if (res != null) {
                // something went wrong...
                vscode.window.setStatusBarMessage('Could not copy: ' + res);
            }
        });
        vscode.window.setStatusBarMessage('Copied with line number done!');
        console.log(copiedText);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map