"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const path_1 = require("path");
const sander = require("sander");
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const command_manager_1 = require("./command-manager");
const git_1 = require("./git");
const issues_1 = require("./issues");
const api_1 = require("./provider/github/api");
const status_bar_manager_1 = require("./status-bar-manager");
const tokens_1 = require("./tokens");
let Extension = class Extension {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reporter.sendTelemetryEvent('start');
            try {
                tokens_1.migrateToken(this.context.globalState);
                this.channel.appendLine('Visual Studio Code GitHub Extension');
                const tokens = this.context.globalState.get('tokens');
                yield this.checkVersionAndToken(this.context, tokens);
                this.tsdi.get(command_manager_1.CommandManager);
                this.tsdi.get(status_bar_manager_1.StatusBarManager);
                this.tsdi.get(issues_1.HoverProvider);
                if (!vscode.workspace.workspaceFolders) {
                    return;
                }
                if (!(yield this.git.checkExistence(vscode.Uri.file(process.cwd())))) {
                    vscode.window.showWarningMessage('No git executable found. Please install git ' +
                        "and if required set it in your path. You may also set 'gitCommand'");
                }
            }
            catch (e) {
                this.logAndShowError(e);
                throw e;
            }
        });
    }
    checkVersionAndToken(context, tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield sander.readFile(path_1.join(context.extensionPath, 'package.json'));
            const version = JSON.parse(content.toString()).version;
            const storedVersion = context.globalState.get('version-test');
            if (version !== storedVersion &&
                (!tokens || Object.keys(tokens).length === 0)) {
                context.globalState.update('version-test', version);
                vscode.window.showInformationMessage('To enable the Visual Studio Code GitHub Support, please set a Personal Access Token');
            }
        });
    }
    logAndShowError(e) {
        if (this.channel) {
            this.channel.appendLine(e.message);
            if (e.stack) {
                e.stack.split('\n').forEach(line => this.channel.appendLine(line));
            }
        }
        if (e instanceof api_1.GitHubError) {
            console.error(e.response);
            vscode.window.showErrorMessage('GitHub error: ' + e.message);
        }
        else {
            console.error(e);
            vscode.window.showErrorMessage('Error: ' + e.message);
        }
    }
    dispose() {
        //
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", tsdi_1.TSDI)
], Extension.prototype, "tsdi", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", vscode_extension_telemetry_1.default)
], Extension.prototype, "reporter", void 0);
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], Extension.prototype, "context", void 0);
__decorate([
    tsdi_1.inject('vscode.OutputChannel'),
    __metadata("design:type", Object)
], Extension.prototype, "channel", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", git_1.Git)
], Extension.prototype, "git", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Extension.prototype, "init", null);
Extension = __decorate([
    tsdi_1.component
], Extension);
exports.Extension = Extension;
//# sourceMappingURL=extension.js.map