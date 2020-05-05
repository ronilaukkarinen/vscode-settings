"use strict";
/*! server.ts
* Flamingos are pretty badass!
* Copyright (c) 2018 Max van der Schee; Licensed MIT */
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
const server = require("vscode-languageserver");
const pattern = require("./accessibilityPatterns");
let connection = server.createConnection(server.ProposedFeatures.all);
let documents = new server.TextDocuments();
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
connection.onInitialize((params) => {
    let capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
        }
    };
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(server.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
const defaultSettings = { maxNumberOfProblems: 100, semanticExclude: false };
let globalSettings = defaultSettings;
let documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.webAccessibility || defaultSettings));
    }
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'webAccessibility'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
    connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] });
});
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
// Only this part is interesting.
function validateTextDocument(textDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let settings = yield getDocumentSettings(textDocument.uri);
        let text = textDocument.getText();
        let problems = 0;
        let m;
        let diagnostics = [];
        while ((m = pattern.pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
            if (m != null) {
                let el = m[0].slice(0, 5);
                connection.console.log(el);
                switch (true) {
                    // ID
                    // case (/id="/i.test(el)):
                    // 	let resultId = await pattern.validateId(m);
                    // 	if (resultId) {
                    // 		problems++;
                    // 		_diagnostics(resultId.meta, resultId.mess);
                    // 	}
                    // 	break;
                    // Div
                    case (/<div/i.test(el)):
                        if (settings.semanticExclude === false) {
                            let resultDiv = yield pattern.validateDiv(m);
                            if (resultDiv) {
                                problems++;
                                _diagnostics(resultDiv.meta, resultDiv.mess, resultDiv.severity);
                            }
                        }
                        break;
                    // Span
                    case (/<span/i.test(el)):
                        if (settings.semanticExclude === false) {
                            let resultSpan = yield pattern.validateSpan(m);
                            if (resultSpan) {
                                problems++;
                                _diagnostics(resultSpan.meta, resultSpan.mess, resultSpan.severity);
                            }
                        }
                        break;
                    // Links
                    case (/<a\s/i.test(el)):
                        let resultA = yield pattern.validateA(m);
                        if (resultA) {
                            problems++;
                            _diagnostics(resultA.meta, resultA.mess, resultA.severity);
                        }
                        break;
                    // Images
                    case (/<img/i.test(el)):
                        let resultImg = yield pattern.validateImg(m);
                        if (resultImg) {
                            problems++;
                            _diagnostics(resultImg.meta, resultImg.mess, resultImg.severity);
                        }
                        break;
                    // input
                    case (/<inpu/i.test(el)):
                        let resultInput = yield pattern.validateInput(m);
                        if (resultInput) {
                            problems++;
                            _diagnostics(resultInput.meta, resultInput.mess, resultInput.severity);
                        }
                        break;
                    // Head, title and meta
                    case (/<head/i.test(el)):
                        if (/<meta(?:.+?)viewport(?:.+?)>/i.test(m[0])) {
                            let resultMeta = yield pattern.validateMeta(m);
                            if (resultMeta) {
                                problems++;
                                _diagnostics(resultMeta.meta, resultMeta.mess, resultMeta.severity);
                            }
                        }
                        if (!/<title>/i.test(m[0]) || /<title>/i.test(m[0])) {
                            let resultTitle = yield pattern.validateTitle(m);
                            if (resultTitle) {
                                problems++;
                                _diagnostics(resultTitle.meta, resultTitle.mess, resultTitle.severity);
                            }
                        }
                        break;
                    // HTML
                    case (/<html/i.test(el)):
                        let resultHtml = yield pattern.validateHtml(m);
                        if (resultHtml) {
                            problems++;
                            _diagnostics(resultHtml.meta, resultHtml.mess, resultHtml.severity);
                        }
                        break;
                    // Tabindex
                    case (/tabin/i.test(el)):
                        let resultTab = yield pattern.validateTab(m);
                        if (resultTab) {
                            problems++;
                            _diagnostics(resultTab.meta, resultTab.mess, resultTab.severity);
                        }
                        break;
                    // iframe and frame
                    case (/(<fram|<ifra)/i.test(el)):
                        let resultFrame = yield pattern.validateFrame(m);
                        if (resultFrame) {
                            problems++;
                            _diagnostics(resultFrame.meta, resultFrame.mess, resultFrame.severity);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        function _diagnostics(regEx, diagnosticsMessage, severityNumber) {
            return __awaiter(this, void 0, void 0, function* () {
                let severity;
                switch (severityNumber) {
                    case 1:
                        severity = server.DiagnosticSeverity.Error;
                        break;
                    case 2:
                        severity = server.DiagnosticSeverity.Warning;
                        break;
                    case 3:
                        severity = server.DiagnosticSeverity.Information;
                        break;
                    case 4:
                        severity = server.DiagnosticSeverity.Hint;
                        break;
                }
                let diagnostic = {
                    severity,
                    message: diagnosticsMessage,
                    range: {
                        start: textDocument.positionAt(regEx.index),
                        end: textDocument.positionAt(regEx.index + regEx[0].length),
                    },
                    code: 0,
                    source: 'web accessibility'
                };
                diagnostics.push(diagnostic);
            });
        }
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    });
}
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map