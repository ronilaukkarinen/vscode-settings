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
const configuration_1 = require("../configuration");
const svgProvider_1 = require("../svgProvider");
function showPreview(webviewManager, uri) {
    return __awaiter(this, void 0, void 0, function* () {
        let resource = uri;
        if (!(resource instanceof vscode.Uri)) {
            if (vscode.window.activeTextEditor) {
                resource = vscode.window.activeTextEditor.document.uri;
            }
            if (!(resource instanceof vscode.Uri))
                return;
        }
        const textDocument = yield vscode.workspace.openTextDocument(resource);
        if (svgProvider_1.SvgDocumentContentProvider.checkNoSvg(textDocument))
            return;
        const resourceColumn = (vscode.window.activeTextEditor && vscode.window.activeTextEditor.viewColumn) || vscode.ViewColumn.One;
        webviewManager.view(resource, {
            resourceColumn: resourceColumn,
            viewColumn: configuration_1.Configuration.viewColumn()
        });
    });
}
class ShowPreviewCommand {
    constructor(webviewManager) {
        this.webviewManager = webviewManager;
        this.id = 'svgviewer.open';
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (configuration_1.Configuration.enableAutoPreview()
                && editor && !svgProvider_1.SvgDocumentContentProvider.checkNoSvg(editor.document, false)) {
                vscode.commands.executeCommand(this.id, editor.document.uri);
            }
        });
    }
    execute(mainUri, allUris) {
        for (const uri of Array.isArray(allUris) ? allUris : [mainUri]) {
            showPreview(this.webviewManager, uri);
        }
    }
}
exports.ShowPreviewCommand = ShowPreviewCommand;
//# sourceMappingURL=showPreview.js.map