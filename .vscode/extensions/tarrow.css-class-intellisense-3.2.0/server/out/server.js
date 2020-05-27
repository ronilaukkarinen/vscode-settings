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
exports.globalSettings = exports.connection = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const languageModes_1 = require("./languageModes");
exports.connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all);
const documents = new vscode_languageserver_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let languageModes;
let hasConfigurationCapability = false;
const defaultSettings = {
    silentDownload: false,
    remoteCSSCachePath: "",
};
exports.globalSettings = defaultSettings;
exports.connection.onInitialize((params) => {
    languageModes = languageModes_1.getLanguageModes();
    documents.onDidClose((e) => {
        languageModes.onDocumentRemoved(e.document);
    });
    documents.onDidChangeContent((e) => {
        languageModes.onChangeCSSDoc(e.document);
    });
    exports.connection.onShutdown(() => {
        languageModes.dispose();
    });
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    const result = {
        capabilities: {
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Full,
            completionProvider: {
                resolveProvider: false,
                triggerCharacters: [".", "#"],
            },
        },
    };
    return result;
});
exports.connection.onInitialized(() => __awaiter(void 0, void 0, void 0, function* () {
    if (hasConfigurationCapability) {
        exports.globalSettings = yield exports.connection.workspace.getConfiguration({
            section: "cssClassIntellisense",
        });
        exports.connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, {
            section: "cssClassIntellisense",
        });
    }
}));
exports.connection.onDidChangeConfiguration(() => __awaiter(void 0, void 0, void 0, function* () {
    exports.globalSettings = yield exports.connection.workspace.getConfiguration({
        section: "cssClassIntellisense",
    });
}));
exports.connection.onCompletion((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    if (!document) {
        return null;
    }
    const mode = languageModes.getModeAtPosition(document, textDocumentPosition.position);
    if (!mode || !mode.doComplete) {
        return [];
    }
    const doComplete = mode.doComplete;
    return doComplete(document, textDocumentPosition.position);
});
documents.listen(exports.connection);
exports.connection.listen();
//# sourceMappingURL=server.js.map