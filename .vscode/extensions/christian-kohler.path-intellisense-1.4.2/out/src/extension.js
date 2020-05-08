'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var PathIntellisense_1 = require("./PathIntellisense");
var fs_functions_1 = require("./utils/fs-functions");
function activate(context) {
    var provider = new PathIntellisense_1.PathIntellisense(fs_functions_1.getChildrenOfPath);
    var triggers = ['/', '"', '\''];
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider.apply(vscode_1.languages, ['*', provider].concat(triggers)));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map