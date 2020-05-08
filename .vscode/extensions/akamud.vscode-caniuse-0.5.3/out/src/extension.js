var vscode = require('vscode');
var can_i_use_1 = require('./can-i-use');
function activate(context) {
    var disposable = vscode.commands.registerCommand('extension.canIUse', function () {
        var caniuse = new can_i_use_1.CanIUse();
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var expandedSelection = undefined;
        expandedSelection = getSelection(editor);
        if (expandedSelection) {
            var word = editor.document.getText(expandedSelection);
            if (word) {
                caniuse.retrieveInformation(caniuse.getNormalizedRule(word).toLowerCase(), showOutput);
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function getSelection(editor) {
    var selection = editor.selection;
    if (selection.isEmpty) {
        var wordRange = editor.document.getWordRangeAtPosition(selection.active);
        if (typeof wordRange != 'undefined') {
            var expandedSelection = new vscode.Selection(wordRange.start.line, wordRange.start.character, wordRange.end.line, wordRange.end.character);
            return expandedSelection;
        }
        else {
            return undefined;
        }
    }
    else {
        return selection;
    }
}
function showOutput(message) {
    vscode.window.setStatusBarMessage(message, 5000);
}
//# sourceMappingURL=extension.js.map