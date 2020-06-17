'use strict';
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
const svgProvider_1 = require("./svgProvider");
class ExportDocumentContentProvider extends svgProvider_1.BaseContentProvider {
    constructor() {
        super(...arguments);
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent(uri, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield vscode.workspace.openTextDocument(uri);
            return this.snippet(document, state);
        });
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
    snippet(document, state) {
        let showTransGrid = vscode.workspace.getConfiguration('svgviewer').get('transparencygrid');
        let css = `<link rel="stylesheet" type="text/css" href="${this.getPath('media/export.css')}">`;
        let jquery = `<script src="${this.getPath('node_modules/jquery/dist/jquery.js')}"></script>`;
        let exportjs = `<script src="${this.getPath('media/export.js')}"></script>`;
        let output = document.uri.fsPath.replace('.svg', '.png');
        let exportButton = `<a id="export" data-output="${encodeURIComponent(output)}" href="#" class="button">Export PNG</a>`;
        let canvas = `<canvas id="canvas" class="svgbg" data-showtransgrid="${showTransGrid}"></canvas>`;
        let svg = document.getText();
        let image = `<img id="image" src="${'data:image/svg+xml,' + encodeURIComponent(document.getText())}" alt="svg image" />`;
        let width = `<div class="wrapper"><label for="width" class="label-name">Width</label><input id="width" type="number" placeholder="width"><label for="width"> px</label></div>`;
        let height = `<div class="wrapper"><label for="height" class="label-name">Height</label><input id="height" type="number" placeholder="height"><label for="height"> px</label></div>`;
        let options = `<h1>Options</h1><div class="form">${width}${height}${exportButton}</div>`;
        let stateMeta = `<meta id="vscode-svg-preview-data" data-state="${JSON.stringify(state || {}).replace(/"/g, '&quot;')}">`;
        return `<!DOCTYPE html><html><head>${stateMeta}${css}${jquery}${exportjs}</head><body>${options}<h1>Preview</h1><div>${svg}${image}${canvas}</div></body></html>`;
    }
    get localResourceRoots() {
        return [vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
            vscode.Uri.file(path.join(this.context.extensionPath, 'node_modules/jquery/dist'))];
    }
}
exports.ExportDocumentContentProvider = ExportDocumentContentProvider;
//# sourceMappingURL=exportProvider.js.map