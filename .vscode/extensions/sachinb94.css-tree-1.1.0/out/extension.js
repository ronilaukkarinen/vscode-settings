"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const document_tree_1 = require("document-tree");
const selection_1 = require("./selection");
const cssTree_1 = require("./cssTree");
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.generateCssTree', () => __awaiter(this, void 0, void 0, function* () {
        const selectedText = selection_1.default.getText();
        if (!selectedText) {
            return;
        }
        const userConfig = vscode.workspace
            .getConfiguration()
            .get('generateCssTree');
        const isCss = userConfig.cssFlavor.toLowerCase() === 'css';
        const tree = document_tree_1.default.generate(selectedText);
        const cssTree = cssTree_1.default(tree, { isCss });
        const doc = yield vscode.workspace.openTextDocument({
            content: cssTree,
            language: userConfig.cssFlavor
        });
        yield vscode.window.showTextDocument(doc);
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map