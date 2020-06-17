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
const path = require("path");
const svgPreview_1 = require("./svgPreview");
const fs = require("pn/fs");
class SvgExport extends svgPreview_1.SvgView {
    constructor(webview, resource, contentProvider) {
        super(webview, resource, contentProvider);
        this.contentProvider = contentProvider;
        this.editor.webview.onDidReceiveMessage((e) => {
            if (e.body.resource !== this._resource.toString()) {
                return;
            }
            switch (e.command) {
                case 'exportData':
                    let data = Buffer.from(e.body.dataUrl.split(',')[1], 'base64');
                    fs.writeFileSync(e.body.output, data);
                    vscode.window.showInformationMessage('export done. ' + e.body.output);
                    break;
            }
        }, null, super.disposables);
    }
    static viewTitle(resource) {
        return `Export ${path.basename(resource.fsPath)}`;
    }
    static revive(webview, state, contentProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = vscode.Uri.parse(state.resource);
            const exp = new SvgExport(webview, resource, contentProvider);
            exp.editor.webview.options = svgPreview_1.SvgView.getWebviewOptions(contentProvider);
            yield exp.doUpdate();
            return exp;
        });
    }
    get state() {
        return {
            resource: this.resource.toString()
        };
    }
    doUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = this._resource;
            clearTimeout(this.throttleTimer);
            this.throttleTimer = undefined;
            const document = yield vscode.workspace.openTextDocument(resource);
            const content = yield this.contentProvider.provideTextDocumentContent(document.uri, this.state);
            if (this._resource === resource) {
                this.editor.title = SvgExport.viewTitle(this._resource);
                this.editor.webview.options = svgPreview_1.SvgPreview.getWebviewOptions(this.contentProvider);
                this.editor.webview.html = content;
            }
        });
    }
    static create(resource, previewColumn, contentProvider) {
        const webview = vscode.window.createWebviewPanel(SvgExport.viewType, SvgExport.viewTitle(resource), previewColumn, {
            enableFindWidget: true,
            localResourceRoots: contentProvider.localResourceRoots
        });
        return new SvgExport(webview, resource, contentProvider);
    }
}
SvgExport.viewType = 'svg.export';
exports.SvgExport = SvgExport;
//# sourceMappingURL=svgExport.js.map