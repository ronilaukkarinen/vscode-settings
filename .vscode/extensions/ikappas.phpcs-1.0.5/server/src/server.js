/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
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
const proto = require("./protocol");
const strings = require("./base/common/strings");
const vscode_languageserver_1 = require("vscode-languageserver");
const linter_1 = require("./linter");
const strings_1 = require("./strings");
class PhpcsServer {
    /**
     * Class constructor.
     *
     * @return A new instance of the server.
     */
    constructor() {
        // Cache the settings of all open documents
        this.hasConfigurationCapability = false;
        this.hasWorkspaceFolderCapability = false;
        this.defaultSettings = {
            enable: true,
            workspaceRoot: null,
            executablePath: null,
            composerJsonPath: null,
            standard: null,
            autoConfigSearch: true,
            showSources: false,
            showWarnings: true,
            ignorePatterns: [],
            warningSeverity: 5,
            errorSeverity: 5,
        };
        this.documentSettings = new Map();
        this.validating = new Map();
        this.connection = vscode_languageserver_1.createConnection(vscode_languageserver_1.ProposedFeatures.all, new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
        this.documents = new vscode_languageserver_1.TextDocuments();
        this.documents.listen(this.connection);
        this.connection.onInitialize(this.safeEventHandler(this.onInitialize));
        this.connection.onInitialized(this.safeEventHandler(this.onDidInitialize));
        this.connection.onDidChangeConfiguration(this.safeEventHandler(this.onDidChangeConfiguration));
        this.connection.onDidChangeWatchedFiles(this.safeEventHandler(this.onDidChangeWatchedFiles));
        this.documents.onDidChangeContent(this.safeEventHandler(this.onDidChangeDocument));
        this.documents.onDidOpen(this.safeEventHandler(this.onDidOpenDocument));
        this.documents.onDidSave(this.safeEventHandler(this.onDidSaveDocument));
        this.documents.onDidClose(this.safeEventHandler(this.onDidCloseDocument));
    }
    /**
     * Safely handle event notifications.
     * @param callback An event handler.
     */
    safeEventHandler(callback) {
        return (...args) => {
            return callback.apply(this, args).catch((error) => {
                this.connection.window.showErrorMessage(`phpcs: ${error.message}`);
            });
        };
    }
    /**
     * Handles server initialization.
     *
     * @param params The initialization parameters.
     * @return A promise of initialization result or initialization error.
     */
    onInitialize(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let capabilities = params.capabilities;
            this.hasWorkspaceFolderCapability = capabilities.workspace && !!capabilities.workspace.workspaceFolders;
            this.hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;
            return Promise.resolve({
                capabilities: {
                    textDocumentSync: this.documents.syncKind
                }
            });
        });
    }
    /**
     * Handles connection initialization completion.
     */
    onDidInitialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasWorkspaceFolderCapability) {
                this.connection.workspace.onDidChangeWorkspaceFolders((_event) => {
                    this.connection.tracer.log('Workspace folder change event received');
                });
            }
        });
    }
    /**
     * Handles configuration changes.
     *
     * @param params The changed configuration parameters.
     * @return void
     */
    onDidChangeConfiguration(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasConfigurationCapability) {
                this.documentSettings.clear();
            }
            else {
                this.globalSettings = Object.assign({}, this.defaultSettings, params.settings.phpcs);
            }
            yield this.validateMany(this.documents.all());
        });
    }
    /**
     * Handles watched files changes.
     *
     * @param params The changed watched files parameters.
     * @return void
     */
    onDidChangeWatchedFiles(_params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateMany(this.documents.all());
        });
    }
    /**
     * Handles opening of text documents.
     *
     * @param event The text document change event.
     * @return void
     */
    onDidOpenDocument({ document }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateSingle(document);
        });
    }
    /**
     * Handles saving of text documents.
     *
     * @param event The text document change event.
     * @return void
     */
    onDidSaveDocument({ document }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateSingle(document);
        });
    }
    /**
     * Handles closing of text documents.
     *
     * @param event The text document change event.
     * @return void
     */
    onDidCloseDocument({ document }) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = document.uri;
            // Clear cached document settings.
            if (this.documentSettings.has(uri)) {
                this.documentSettings.delete(uri);
            }
            // Clear validating status.
            if (this.validating.has(uri)) {
                this.validating.delete(uri);
            }
            this.clearDiagnostics(uri);
        });
    }
    /**
     * Handles changes of text documents.
     *
     * @param event The text document change event.
     * @return void
     */
    onDidChangeDocument({ document }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateSingle(document);
        });
    }
    /**
     * Start listening to requests.
     *
     * @return void
     */
    listen() {
        this.connection.listen();
    }
    /**
     * Sends diagnostics computed for a given document to VSCode to render them in the
     * user interface.
     *
     * @param params The diagnostic parameters.
     */
    sendDiagnostics(params) {
        this.connection.sendDiagnostics(params);
    }
    /**
     * Clears the diagnostics computed for a given document.
     *
     * @param uri The document uri for which to clear the diagnostics.
     */
    clearDiagnostics(uri) {
        this.connection.sendDiagnostics({ uri, diagnostics: [] });
    }
    /**
     * Sends a notification for starting validation of a document.
     *
     * @param document The text document on which validation started.
     */
    sendStartValidationNotification(document) {
        this.validating.set(document.uri, document);
        this.connection.sendNotification(proto.DidStartValidateTextDocumentNotification.type, { textDocument: vscode_languageserver_1.TextDocumentIdentifier.create(document.uri) });
        this.connection.tracer.log(strings.format(strings_1.StringResources.DidStartValidateTextDocument, document.uri));
    }
    /**
     * Sends a notification for ending validation of a document.
     *
     * @param document The text document on which validation ended.
     */
    sendEndValidationNotification(document) {
        this.validating.delete(document.uri);
        this.connection.sendNotification(proto.DidEndValidateTextDocumentNotification.type, { textDocument: vscode_languageserver_1.TextDocumentIdentifier.create(document.uri) });
        this.connection.tracer.log(strings.format(strings_1.StringResources.DidEndValidateTextDocument, document.uri));
    }
    /**
     * Validate a single text document.
     *
     * @param document The text document to validate.
     * @return void
     */
    validateSingle(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uri } = document;
            if (this.validating.has(uri) === false) {
                let settings = yield this.getDocumentSettings(document);
                if (settings.enable) {
                    let diagnostics = [];
                    this.sendStartValidationNotification(document);
                    try {
                        const phpcs = yield linter_1.PhpcsLinter.create(settings.executablePath);
                        diagnostics = yield phpcs.lint(document, settings);
                    }
                    catch (error) {
                        throw new Error(this.getExceptionMessage(error, document));
                    }
                    finally {
                        this.sendEndValidationNotification(document);
                        this.sendDiagnostics({ uri, diagnostics });
                    }
                }
            }
        });
    }
    /**
     * Validate a list of text documents.
     *
     * @param documents The list of text documents to validate.
     * @return void
     */
    validateMany(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var i = 0, len = documents.length; i < len; i++) {
                yield this.validateSingle(documents[i]);
            }
        });
    }
    /**
     * Get the settings for the specified document.
     *
     * @param document The text document for which to get the settings.
     * @return A promise of PhpcsSettings.
     */
    getDocumentSettings(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uri } = document;
            let settings;
            if (this.hasConfigurationCapability) {
                if (this.documentSettings.has(uri)) {
                    settings = this.documentSettings.get(uri);
                }
                else {
                    const configurationItem = uri.match(/^untitled:/) ? {} : { scopeUri: uri };
                    settings = this.connection.workspace.getConfiguration(configurationItem);
                    this.documentSettings.set(uri, settings);
                }
            }
            else {
                settings = Promise.resolve(this.globalSettings);
            }
            return settings;
        });
    }
    /**
     * Get the exception message from an exception object.
     *
     * @param exception The exception to parse.
     * @param document The document where the exception occurred.
     * @return string The exception message.
     */
    getExceptionMessage(exception, document) {
        let message = null;
        if (typeof exception.message === 'string' || exception.message instanceof String) {
            message = exception.message;
            message = message.replace(/\r?\n/g, ' ');
            if (/^ERROR: /.test(message)) {
                message = message.substr(5);
            }
        }
        else {
            message = strings.format(strings_1.StringResources.UnknownErrorWhileValidatingTextDocument, vscode_languageserver_1.Files.uriToFilePath(document.uri));
        }
        return message;
    }
}
let server = new PhpcsServer();
server.listen();
//# sourceMappingURL=server.js.map