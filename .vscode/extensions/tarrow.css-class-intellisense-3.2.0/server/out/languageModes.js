"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageModes = void 0;
const fs = require("fs");
const nodeURL = require("url");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
const embeddedSupport_1 = require("./embeddedSupport");
const importDocCache_1 = require("./importDocCache");
const languageModelCache_1 = require("./languageModelCache");
const cssMode_1 = require("./modes/cssMode");
const htmlMode_1 = require("./modes/htmlMode");
const remoteSupport_1 = require("./remoteSupport");
const server_1 = require("./server");
function getLanguageModes() {
    const htmlLanguageService = vscode_html_languageservice_1.getLanguageService();
    const cssLanguageService = vscode_css_languageservice_1.getCSSLanguageService();
    const documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, (document) => embeddedSupport_1.getDocumentRegions(htmlLanguageService, document));
    const documentLinks = importDocCache_1.getImportDocCache(10, 60, (uri) => __awaiter(this, void 0, void 0, function* () {
        try {
            let text;
            switch (nodeURL.parse(uri).protocol) {
                case "https:":
                    text = yield remoteSupport_1.downloadText(uri, "https");
                    break;
                case "http:":
                    text = yield remoteSupport_1.downloadText(uri, "http");
                    break;
                default:
                    text = (yield fs.promises.readFile(uri)).toString();
                    break;
            }
            if (typeof text !== "undefined") {
                return vscode_css_languageservice_1.TextDocument.create(uri, "css", 0, text);
            }
        }
        catch (err) {
            server_1.connection.window.showErrorMessage(err.message);
        }
    }));
    let modelCaches = [];
    let linksCaches = [];
    modelCaches.push(documentRegions);
    linksCaches.push(documentLinks);
    let modes = Object.create(null);
    modes["html"] = htmlMode_1.getHTMLMode(htmlLanguageService, cssLanguageService, documentRegions, documentLinks);
    modes["css"] = cssMode_1.getCSSMode(cssLanguageService, documentRegions);
    return {
        getModeAtPosition(document, position) {
            let languageId = documentRegions
                .get(document)
                .getLanguageAtPosition(position);
            if (languageId) {
                return modes[languageId];
            }
            return undefined;
        },
        getModesInRange(document, range) {
            return documentRegions
                .get(document)
                .getLanguageRanges(range)
                .map((r) => {
                return {
                    start: r.start,
                    end: r.end,
                    mode: r.languageId && modes[r.languageId],
                    attributeValue: r.attributeValue,
                };
            });
        },
        getAllModesInDocument(document) {
            let result = [];
            for (let languageId of documentRegions
                .get(document)
                .getLanguagesInDocument()) {
                let mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getAllModes() {
            let result = [];
            for (let languageId in modes) {
                let mode = modes[languageId];
                if (mode) {
                    result.push(mode);
                }
            }
            return result;
        },
        getMode(languageId) {
            return modes[languageId];
        },
        onDocumentRemoved(document) {
            modelCaches.forEach((mc) => mc.onDocumentRemoved(document));
            for (let mode in modes) {
                modes[mode].onDocumentRemoved(document);
            }
        },
        onChangeCSSDoc(doc) {
            linksCaches.forEach((lc) => lc.onChangeCSSDoc(doc));
        },
        dispose() {
            modelCaches.forEach((mc) => mc.dispose());
            linksCaches.forEach((lc) => lc.dispose());
            modelCaches = [];
            linksCaches = [];
            for (let mode in modes) {
                modes[mode].dispose();
            }
            modes = {};
        },
    };
}
exports.getLanguageModes = getLanguageModes;
//# sourceMappingURL=languageModes.js.map