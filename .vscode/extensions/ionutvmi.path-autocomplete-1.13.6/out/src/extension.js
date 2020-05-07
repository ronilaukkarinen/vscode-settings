'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const PathAutocompleteProvider_1 = require("./features/PathAutocompleteProvider");
function activate(context) {
    var selector = [{
            pattern: '**'
        }];
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(selector, new PathAutocompleteProvider_1.PathAutocomplete(), '/', '\\'));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map