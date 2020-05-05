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
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const path_resolver_1 = require("./resolvers/path-resolver");
class PhpcsConfiguration extends vscode_1.Disposable {
    /**
     * Class constructor
     * @param client The client to use.
     */
    constructor(client) {
        super(() => {
            this.disposables.map(o => { o.dispose(); });
            this.client = null;
        });
        this.disposables = [];
        this.folderSettings = new Map();
        this.client = client;
    }
    // Convert VS Code specific settings to a format acceptable by the server. Since
    // both client and server do use JSON the conversion is trivial.
    compute(params, _token, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!params.items) {
                return null;
            }
            let result = [];
            for (let item of params.items) {
                // The server asks the client for configuration settings without a section
                // If a section is present we return null to indicate that the configuration
                // is not supported.
                if (item.section) {
                    result.push(null);
                    continue;
                }
                let config;
                let folder;
                if (item.scopeUri) {
                    let resource = this.client.protocol2CodeConverter.asUri(item.scopeUri);
                    folder = vscode_1.workspace.getWorkspaceFolder(resource);
                }
                if (folder) {
                    if (this.folderSettings.has(folder.uri)) {
                        result.push(this.folderSettings.get(folder.uri));
                        continue;
                    }
                    config = vscode_1.workspace.getConfiguration('phpcs', folder.uri);
                }
                else {
                    if (this.globalSettings) {
                        result.push(this.globalSettings);
                        continue;
                    }
                    config = vscode_1.workspace.getConfiguration('phpcs');
                }
                let settings = {
                    enable: config.get('enable'),
                    workspaceRoot: folder ? folder.uri.fsPath : null,
                    executablePath: config.get('executablePath'),
                    composerJsonPath: config.get('composerJsonPath'),
                    standard: config.get('standard'),
                    autoConfigSearch: config.get('autoConfigSearch'),
                    showSources: config.get('showSources'),
                    showWarnings: config.get('showWarnings'),
                    ignorePatterns: config.get('ignorePatterns'),
                    warningSeverity: config.get('warningSeverity'),
                    errorSeverity: config.get('errorSeverity'),
                };
                settings = yield this.resolveExecutablePath(settings);
                if (folder) {
                    this.folderSettings.set(folder.uri, settings);
                }
                else {
                    this.globalSettings = settings;
                }
                result.push(settings);
            }
            return result;
        });
    }
    resolveExecutablePath(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settings.executablePath === null) {
                let executablePathResolver = new path_resolver_1.PhpcsPathResolver(settings);
                settings.executablePath = yield executablePathResolver.resolve();
            }
            else if (!path.isAbsolute(settings.executablePath) && settings.workspaceRoot !== null) {
                settings.executablePath = path.join(settings.workspaceRoot, settings.executablePath);
            }
            return settings;
        });
    }
    initialize() {
        // VS Code currently doesn't sent fine grained configuration changes. So we
        // listen to any change. However this will change in the near future.
        this.disposables.push(vscode_1.workspace.onDidChangeConfiguration(() => {
            this.folderSettings.clear();
            this.globalSettings = null;
            this.client.sendNotification(vscode_languageclient_1.DidChangeConfigurationNotification.type, { settings: null });
        }));
    }
}
exports.PhpcsConfiguration = PhpcsConfiguration;
//# sourceMappingURL=configuration.js.map