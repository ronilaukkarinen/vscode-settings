/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
/**
 * The document start validation notification is sent from the server to the client to signal
 * the start of the validation on text documents.
 */
var DidStartValidateTextDocumentNotification;
(function (DidStartValidateTextDocumentNotification) {
    DidStartValidateTextDocumentNotification.type = new vscode_languageserver_1.NotificationType("textDocument/didStartValidate");
})(DidStartValidateTextDocumentNotification = exports.DidStartValidateTextDocumentNotification || (exports.DidStartValidateTextDocumentNotification = {}));
/**
 * The document end validation notification is sent from the server to the client to signal
 * the end of the validation on text documents.
 */
var DidEndValidateTextDocumentNotification;
(function (DidEndValidateTextDocumentNotification) {
    DidEndValidateTextDocumentNotification.type = new vscode_languageserver_1.NotificationType("textDocument/didEndValidate");
})(DidEndValidateTextDocumentNotification = exports.DidEndValidateTextDocumentNotification || (exports.DidEndValidateTextDocumentNotification = {}));
//# sourceMappingURL=protocol.js.map