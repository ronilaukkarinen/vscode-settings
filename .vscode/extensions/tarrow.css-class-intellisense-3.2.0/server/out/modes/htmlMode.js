"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHTMLMode = void 0;
const nodeURL = require("url");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const languageModelCache_1 = require("../languageModelCache");
function getHTMLMode(htmlLanguageService, cssLanguageService, documentRegions, documentLinks) {
    const htmlDocuments = languageModelCache_1.getLanguageModelCache(10, 60, (document) => htmlLanguageService.parseHTMLDocument(document));
    const embeddedCSSDocuments = languageModelCache_1.getLanguageModelCache(10, 60, (document) => documentRegions.get(document).getEmbeddedDocument("css"));
    const urls = languageModelCache_1.getLanguageModelCache(10, 60, (document) => documentRegions.get(document).getLinkingCSSUrl());
    const cssStylesheets = languageModelCache_1.getLanguageModelCache(10, 60, (document) => cssLanguageService.parseStylesheet(document));
    return {
        getId() {
            return "html";
        },
        doComplete(document, position) {
            const offset = document.offsetAt(position);
            const node = htmlDocuments.get(document).findNodeAt(offset);
            if (node.attributes && node.attributes["class"]) {
                const scanner = htmlLanguageService.createScanner(document.getText(), node.start);
                let tokenType = scanner.scan();
                let lastAttributeName = undefined;
                while (tokenType !== vscode_html_languageservice_1.TokenType.EOS &&
                    offset >= scanner.getTokenEnd()) {
                    tokenType = scanner.scan();
                    if (tokenType === vscode_html_languageservice_1.TokenType.AttributeName) {
                        lastAttributeName = scanner.getTokenText();
                    }
                    else if (tokenType === vscode_html_languageservice_1.TokenType.AttributeValue &&
                        lastAttributeName === "class" &&
                        offset > scanner.getTokenOffset() &&
                        offset < scanner.getTokenEnd()) {
                        const embedded = embeddedCSSDocuments.get(document);
                        let completionItems = parse(cssStylesheets.get(embedded), "Embedded");
                        for (let url of urls.get(document)) {
                            if (!nodeURL.parse(url).protocol) {
                                url = nodeURL.fileURLToPath(nodeURL.resolve(document.uri, url));
                            }
                            const linked = documentLinks.get(url);
                            if (linked) {
                                completionItems = completionItems.concat(parse(cssStylesheets.get(linked.doc), linked.info));
                            }
                        }
                        return completionItems;
                    }
                }
            }
            return [];
        },
        onDocumentRemoved(document) {
            htmlDocuments.onDocumentRemoved(document);
            embeddedCSSDocuments.onDocumentRemoved(document);
            urls.onDocumentRemoved(document);
            cssStylesheets.onDocumentRemoved(document);
        },
        dispose() {
            htmlDocuments.dispose();
            embeddedCSSDocuments.dispose();
            urls.dispose();
            cssStylesheets.dispose();
        },
    };
}
exports.getHTMLMode = getHTMLMode;
function parse(cssStylesheets, info) {
    const completionItems = [];
    const completionItemsCache = {};
    cssStylesheets.accept((node) => {
        if (node.type === 14) {
            const label = node.getText().substr(1);
            if (!completionItemsCache[label]) {
                completionItemsCache[label] = {
                    label: label,
                    kind: vscode_css_languageservice_1.CompletionItemKind.Class,
                    detail: info,
                };
            }
            return false;
        }
        return true;
    });
    for (const label in completionItemsCache) {
        const item = completionItemsCache[label];
        completionItems.push(item);
    }
    return completionItems;
}
//# sourceMappingURL=htmlMode.js.map