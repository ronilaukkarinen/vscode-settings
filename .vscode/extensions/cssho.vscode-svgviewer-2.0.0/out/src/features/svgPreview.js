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
const util_1 = require("util");
class SvgView {
    constructor(webview, resource, contentProvider) {
        this.contentProvider = contentProvider;
        this.firstUpdate = true;
        this.disposed = false;
        this.disposables = [];
        this.onDisposeEmitter = new vscode.EventEmitter();
        this.onDispose = this.onDisposeEmitter.event;
        this._resource = resource;
        this.editor = webview;
        this.editor.onDidDispose(() => {
            this.dispose();
        }, null, this.disposables);
        vscode.workspace.onDidChangeTextDocument(event => {
            if (this.isViewOf(event.document.uri)) {
                this.refresh();
            }
        }, null, this.disposables);
        this.editor.onDidChangeViewState((e) => __awaiter(this, void 0, void 0, function* () {
            e.webviewPanel.webview.html
                = yield this.contentProvider.provideTextDocumentContent(resource, this.state);
        }), null, this.disposables);
    }
    dispose() {
        if (this.disposed) {
            return;
        }
        while (this.disposables.length) {
            const item = this.disposables.pop();
            if (item) {
                item.dispose();
            }
        }
        this.disposed = true;
        this.onDisposeEmitter.fire();
        this.onDisposeEmitter.dispose();
        this.editor.dispose();
    }
    get resource() {
        return this._resource;
    }
    update(resource) {
        const isResourceChange = resource.fsPath !== this._resource.fsPath;
        if (isResourceChange) {
            clearTimeout(this.throttleTimer);
            this.throttleTimer = undefined;
        }
        this._resource = resource;
        if (!this.throttleTimer) {
            if (isResourceChange || this.firstUpdate) {
                this.doUpdate();
            }
            else {
                this.throttleTimer = setTimeout(() => this.doUpdate(), 300);
            }
        }
        this.firstUpdate = false;
    }
    refresh() {
        this.update(this._resource);
    }
    get position() {
        return this.editor.viewColumn;
    }
    matchesResource(otherResource) {
        return this.isViewOf(otherResource);
    }
    matches(otherView) {
        return this.matchesResource(otherView._resource);
    }
    reveal() {
        this.editor.reveal(this.editor.viewColumn);
    }
    isViewOf(resource) {
        return this._resource.fsPath === resource.fsPath;
    }
    static getWebviewOptions(contentProvider) {
        return {
            enableScripts: true,
            localResourceRoots: contentProvider.localResourceRoots
        };
    }
}
exports.SvgView = SvgView;
class SvgPreview extends SvgView {
    constructor(webview, resource, zoom, contentProvider) {
        super(webview, resource, contentProvider);
        this.contentProvider = contentProvider;
        this._zoom = zoom;
        this.editor.webview.onDidReceiveMessage((e) => {
            if (e.body.resource !== this._resource.toString()) {
                return;
            }
            switch (e.command) {
                case 'setState':
                    this._zoom = e.body.zoom;
            }
        }, null, super.disposables);
    }
    get zoom() {
        return this._zoom;
    }
    get state() {
        return {
            resource: this.resource.toString(),
            zoom: this.zoom
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
                this.editor.title = SvgPreview.viewTitle(this._resource);
                this.editor.webview.options = SvgPreview.getWebviewOptions(this.contentProvider);
                this.editor.webview.html = content;
            }
        });
    }
    static viewTitle(resource) {
        return `Preview ${path.basename(resource.fsPath)}`;
    }
    static revive(webview, state, contentProvider) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = vscode.Uri.parse(state.resource);
            const zoom = util_1.isNumber(state.zoom) ? state.zoom : 1.0;
            const preview = new SvgPreview(webview, resource, zoom, contentProvider);
            preview.editor.webview.options = SvgView.getWebviewOptions(contentProvider);
            yield preview.doUpdate();
            return preview;
        });
    }
    static create(resource, previewColumn, contentProvider) {
        const webview = vscode.window.createWebviewPanel(SvgPreview.viewType, SvgPreview.viewTitle(resource), previewColumn, {
            enableFindWidget: true,
            localResourceRoots: contentProvider.localResourceRoots
        });
        return new SvgPreview(webview, resource, 1.0, contentProvider);
    }
}
SvgPreview.viewType = 'svg.preview';
exports.SvgPreview = SvgPreview;
//# sourceMappingURL=svgPreview.js.map