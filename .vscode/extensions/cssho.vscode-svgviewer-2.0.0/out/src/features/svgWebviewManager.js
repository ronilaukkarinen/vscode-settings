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
const svgPreview_1 = require("./svgPreview");
const svgExport_1 = require("./svgExport");
class WebviewManager {
    constructor() {
        this.disposables = [];
    }
    refresh() {
        for (const preview of this.views) {
            preview.refresh();
        }
    }
    dispose() {
        while (this.disposables.length) {
            const item = this.disposables.pop();
            if (item) {
                item.dispose();
            }
        }
        while (this.views.length) {
            const item = this.views.pop();
            if (item) {
                item.dispose();
            }
        }
    }
}
class SvgWebviewManager extends WebviewManager {
    constructor(contentProvider) {
        super();
        this.contentProvider = contentProvider;
        this.views = [];
        this.disposables.push(vscode.window.registerWebviewPanelSerializer(svgPreview_1.SvgPreview.viewType, this));
    }
    view(resource, viewSettings) {
        let view = this.getExistingView(resource);
        if (view) {
            view.reveal();
        }
        else {
            view = this.createView(resource, viewSettings);
        }
        view.update(resource);
    }
    deserializeWebviewPanel(webview, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicate = this.getExistingView(vscode.Uri.parse(state.resource));
            if (duplicate) {
                webview.dispose();
                duplicate.update(vscode.Uri.parse(state.resource));
            }
            const preview = yield svgPreview_1.SvgPreview.revive(webview, state, this.contentProvider);
            this.registerView(preview);
        });
    }
    getExistingView(resource) {
        return this.views.find(preview => preview.matchesResource(resource));
    }
    createView(resource, previewSettings) {
        const preview = svgPreview_1.SvgPreview.create(resource, previewSettings.viewColumn, this.contentProvider);
        this.setViewActiveContext(true);
        return this.registerView(preview);
    }
    registerView(preview) {
        this.views.push(preview);
        preview.onDispose(() => {
            const existing = this.views.indexOf(preview);
            if (existing === -1) {
                return;
            }
            this.views.splice(existing, 1);
        });
        return preview;
    }
    setViewActiveContext(value) {
        vscode.commands.executeCommand('setContext', SvgWebviewManager.svgActiveContextKey, value);
    }
}
SvgWebviewManager.svgActiveContextKey = 'svgPreviewFocus';
exports.SvgWebviewManager = SvgWebviewManager;
class SvgExportWebviewManager extends WebviewManager {
    constructor(contentProvider) {
        super();
        this.contentProvider = contentProvider;
        this.views = [];
        this.disposables.push(vscode.window.registerWebviewPanelSerializer(svgExport_1.SvgExport.viewType, this));
    }
    deserializeWebviewPanel(webview, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const exp = yield svgExport_1.SvgExport.revive(webview, state, this.contentProvider);
            this.registerView(exp);
        });
    }
    view(resource, viewSettings) {
        let view = this.getExistingView(resource);
        if (view) {
            view.reveal();
        }
        else {
            view = this.createView(resource, viewSettings);
        }
        view.update(resource);
    }
    getExistingView(resource) {
        return this.views.find(preview => preview.matchesResource(resource));
    }
    registerView(view) {
        this.views.push(view);
        view.onDispose(() => {
            const existing = this.views.indexOf(view);
            if (existing === -1) {
                return;
            }
            this.views.splice(existing, 1);
        });
        return view;
    }
    createView(resource, previewSettings) {
        const preview = svgExport_1.SvgExport.create(resource, previewSettings.viewColumn, this.contentProvider);
        this.setViewActiveContext(true);
        return this.registerView(preview);
    }
    setViewActiveContext(value) {
        vscode.commands.executeCommand('setContext', SvgExportWebviewManager.svgActiveContextKey, value);
    }
}
SvgExportWebviewManager.svgActiveContextKey = 'svgExportFocus';
exports.SvgExportWebviewManager = SvgExportWebviewManager;
//# sourceMappingURL=svgWebviewManager.js.map