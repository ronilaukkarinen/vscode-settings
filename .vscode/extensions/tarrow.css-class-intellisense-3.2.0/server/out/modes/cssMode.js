"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCSSMode = void 0;
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const languageModelCache_1 = require("../languageModelCache");
function getCSSMode(cssLanguageService, documentRegions) {
    const embeddedCSSDocuments = languageModelCache_1.getLanguageModelCache(10, 60, (document) => documentRegions.get(document).getEmbeddedDocument("css"));
    const cssStylesheets = languageModelCache_1.getLanguageModelCache(10, 60, (document) => cssLanguageService.parseStylesheet(document));
    const htmlClasses = languageModelCache_1.getLanguageModelCache(10, 60, (document) => documentRegions.get(document).getHTMLClass());
    const htmlID = languageModelCache_1.getLanguageModelCache(10, 60, (document) => documentRegions.get(document).getHTMLID());
    return {
        getId() {
            return "css";
        },
        doComplete(document, position) {
            var _a;
            const completionItems = [];
            const embedded = embeddedCSSDocuments.get(document);
            const offset = embedded.offsetAt(position);
            const stylesheeat = cssStylesheets.get(embedded);
            let node = getNodeAtOffset(stylesheeat, offset);
            if (!!((_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.declarations)) {
                return completionItems;
            }
            if ((node === null || node === void 0 ? void 0 : node.type) === 1) {
                node = node.parent;
            }
            const completionItemsClassCache = {};
            for (const selector of htmlClasses.get(document)) {
                if (!completionItemsClassCache[selector]) {
                    completionItemsClassCache[selector] = {
                        label: "." + selector,
                        textEdit: vscode_css_languageservice_1.TextEdit.replace(editRange(node, embedded, position), "." + selector),
                        kind: vscode_css_languageservice_1.CompletionItemKind.Color,
                        detail: "Embedded",
                    };
                }
            }
            for (const selector in completionItemsClassCache) {
                completionItems.push(completionItemsClassCache[selector]);
            }
            const completionItemsIDCache = {};
            for (const selector of htmlID.get(document)) {
                if (!completionItemsIDCache[selector]) {
                    completionItemsIDCache[selector] = {
                        label: "#" + selector,
                        kind: vscode_css_languageservice_1.CompletionItemKind.EnumMember,
                        detail: "Embedded",
                    };
                }
            }
            for (const selector in completionItemsIDCache) {
                completionItems.push(completionItemsIDCache[selector]);
            }
            return completionItems;
        },
        onDocumentRemoved(document) {
            embeddedCSSDocuments.onDocumentRemoved(document);
            cssStylesheets.onDocumentRemoved(document);
            htmlClasses.onDocumentRemoved(document);
            htmlID.onDocumentRemoved(document);
        },
        dispose() {
            embeddedCSSDocuments.dispose();
            cssStylesheets.dispose();
            htmlClasses.dispose();
            htmlID.dispose();
        },
    };
}
exports.getCSSMode = getCSSMode;
function getNodeAtOffset(node, offset) {
    let candidate = null;
    if (!node || offset < node.offset || offset > node.end) {
        return null;
    }
    node.accept((n) => {
        if (n.offset === -1 && n.length === -1) {
            return true;
        }
        if (n.offset <= offset && n.end >= offset) {
            if (!candidate) {
                candidate = n;
            }
            else if (n.length <= candidate.length) {
                candidate = n;
            }
            return true;
        }
        return false;
    });
    return candidate;
}
function editRange(node, textDocument, position) {
    if (node) {
        var end = node.end !== -1 ? textDocument.positionAt(node.end) : position;
        var start = textDocument.positionAt(node.offset);
        if (start.line === end.line) {
            return vscode_css_languageservice_1.Range.create(start, end);
        }
    }
    return vscode_css_languageservice_1.Range.create(position, position);
}
//# sourceMappingURL=cssMode.js.map