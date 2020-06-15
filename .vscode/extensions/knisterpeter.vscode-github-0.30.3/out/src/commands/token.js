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
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const command_1 = require("../command");
const helper_1 = require("../helper");
const tokens_1 = require("../tokens");
const workflow_manager_1 = require("../workflow-manager");
let SetGithubToken = class SetGithubToken extends command_1.Command {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.setGitHubToken';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.track('execute');
            const options = {
                ignoreFocusOut: true,
                password: true,
                placeHolder: 'GitHub Personal Access Token'
            };
            const input = yield vscode.window.showInputBox(options);
            if (input) {
                const tokens = tokens_1.getTokens(this.context.globalState);
                tokens['github.com'] = {
                    token: input,
                    provider: 'github'
                };
                this.context.globalState.update('tokens', tokens);
                this.workflowManager.resetProviders();
            }
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], SetGithubToken.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], SetGithubToken.prototype, "workflowManager", void 0);
SetGithubToken = __decorate([
    tsdi_1.component({ eager: true })
], SetGithubToken);
exports.SetGithubToken = SetGithubToken;
let SetGithubEnterpriseToken = class SetGithubEnterpriseToken extends command_1.Command {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.setGitHubEnterpriseToken';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.track('execute');
            const hostInput = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'GitHub Enterprise Hostname'
            });
            if (hostInput) {
                const tokenInput = yield vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    password: true,
                    placeHolder: 'GitHub Enterprise Token'
                });
                if (tokenInput) {
                    const tokens = tokens_1.getTokens(this.context.globalState);
                    tokens[helper_1.getHostname(hostInput)] = {
                        token: tokenInput,
                        provider: 'github'
                    };
                    this.context.globalState.update('tokens', tokens);
                    this.workflowManager.resetProviders();
                }
            }
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], SetGithubEnterpriseToken.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], SetGithubEnterpriseToken.prototype, "workflowManager", void 0);
SetGithubEnterpriseToken = __decorate([
    tsdi_1.component({ eager: true })
], SetGithubEnterpriseToken);
exports.SetGithubEnterpriseToken = SetGithubEnterpriseToken;
let SetGitLabToken = class SetGitLabToken extends command_1.Command {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.setGitlabToken';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.track('execute');
            const hostInput = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: 'GitLab Hostname'
            });
            if (hostInput) {
                const tokenInput = yield vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    password: true,
                    placeHolder: 'GitLab Token (Personal Access Tokens)'
                });
                if (tokenInput) {
                    const tokens = tokens_1.getTokens(this.context.globalState);
                    tokens[helper_1.getHostname(hostInput)] = {
                        token: tokenInput,
                        provider: 'gitlab'
                    };
                    this.context.globalState.update('tokens', tokens);
                    this.workflowManager.resetProviders();
                }
            }
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], SetGitLabToken.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], SetGitLabToken.prototype, "workflowManager", void 0);
SetGitLabToken = __decorate([
    tsdi_1.component({ eager: true })
], SetGitLabToken);
exports.SetGitLabToken = SetGitLabToken;
let ClearToken = class ClearToken extends command_1.Command {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.clearToken';
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.track('execute');
            const host = yield vscode.window.showQuickPick(tokens_1.listTokenHosts(this.context.globalState), {
                placeHolder: 'Token to remove'
            });
            if (host) {
                tokens_1.removeToken(this.context.globalState, host);
                this.workflowManager.resetProviders();
            }
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], ClearToken.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], ClearToken.prototype, "workflowManager", void 0);
ClearToken = __decorate([
    tsdi_1.component({ eager: true })
], ClearToken);
exports.ClearToken = ClearToken;
//# sourceMappingURL=token.js.map