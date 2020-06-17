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
class SvgPreviewWebviewManager {
    constructor(contentProvider, context) {
        this.contentProvider = contentProvider;
        this.context = context;
        this.previews = [];
        this.activePreview = undefined;
        this.disposables = [];
        this.disposables.push(vscode.window.registerWebviewPanelSerializer(svgPreview_1.SvgPreview.viewType, this));
    }
    dispose() {
        while (this.disposables.length) {
            const item = this.disposables.pop();
            if (item) {
                item.dispose();
            }
        }
        while (this.previews.length) {
            const item = this.previews.pop();
            if (item) {
                item.dispose();
            }
        }
    }
    refresh() {
        for (const preview of this.previews) {
            preview.refresh();
        }
    }
    preview(resource, previewSettings) {
        let preview = this.getExistingPreview(resource, previewSettings);
        if (preview) {
            preview.reveal(previewSettings.previewColumn);
        }
        else {
            preview = this.createNewPreview(resource, previewSettings);
        }
        preview.update(resource);
    }
    get activePreviewResource() {
        return this.activePreview && this.activePreview.resource;
    }
    deserializeWebviewPanel(webview, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const preview = yield svgPreview_1.SvgPreview.revive(webview, state, this.contentProvider);
            this.registerPreview(preview);
        });
    }
    getExistingPreview(resource, previewSettings) {
        return this.previews.find(preview => preview.matchesResource(resource, previewSettings.previewColumn));
    }
    createNewPreview(resource, previewSettings) {
        const preview = svgPreview_1.SvgPreview.create(resource, previewSettings.previewColumn, this.contentProvider, this.context);
        this.setPreviewActiveContext(true);
        this.activePreview = preview;
        return this.registerPreview(preview);
    }
    registerPreview(preview) {
        this.previews.push(preview);
        preview.onDispose(() => {
            const existing = this.previews.indexOf(preview);
            if (existing === -1) {
                return;
            }
            this.previews.splice(existing, 1);
            if (this.activePreview === preview) {
                this.setPreviewActiveContext(false);
                this.activePreview = undefined;
            }
        });
        preview.onDidChangeViewState(({ webviewPanel }) => {
            let tmpDispose = this.previews.filter(otherPreview => preview !== otherPreview && preview.matches(otherPreview));
            while (tmpDispose.length) {
                const item = tmpDispose.pop();
                if (item) {
                    item.dispose();
                }
            }
            this.setPreviewActiveContext(webviewPanel.active);
            this.activePreview = webviewPanel.active ? preview : undefined;
        });
        return preview;
    }
    setPreviewActiveContext(value) {
        vscode.commands.executeCommand('setContext', SvgPreviewWebviewManager.svgPreviewActiveContextKey, value);
    }
}
SvgPreviewWebviewManager.svgPreviewActiveContextKey = 'svgPreviewFocus';
exports.SvgPreviewWebviewManager = SvgPreviewWebviewManager;
//# sourceMappingURL=svgPreviewWebviewManager.js.map