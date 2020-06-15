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
const git_1 = require("./git");
const helper_1 = require("./helper");
const api_1 = require("./provider/github/api");
const workflow_manager_1 = require("./workflow-manager");
const colors = {
    none: '#ffffff',
    success: '#56e39f',
    failure: '#f24236',
    pending: '#f6f5ae'
};
const githubPullRequestIcon = '$(git-pull-request)';
let StatusBarManager = class StatusBarManager {
    get enabled() {
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return true;
        }
        return helper_1.getConfiguration('github', uri).statusbar.enabled;
    }
    get customStatusBarCommand() {
        // #202: migrate from statusBarCommand to statusbar.command
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return null;
        }
        return (helper_1.getConfiguration('github', uri).statusBarCommand ||
            helper_1.getConfiguration('github', uri).statusbar.command);
    }
    get refreshInterval() {
        // #202: migrate from refreshPullRequestStatus to statusbar.refresh
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return 0;
        }
        return ((helper_1.getConfiguration('github', uri).refreshPullRequestStatus ||
            helper_1.getConfiguration('github', uri).statusbar.refresh) * 1000);
    }
    get colored() {
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return true;
        }
        return helper_1.getConfiguration('github', uri).statusbar.color;
    }
    get successText() {
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return undefined;
        }
        return helper_1.getConfiguration('github', uri).statusbar.successText;
    }
    get pendingText() {
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return undefined;
        }
        return helper_1.getConfiguration('github', uri).statusbar.pendingText;
    }
    get failureText() {
        const uri = this.getActiveWorkspaceFolder();
        if (!uri) {
            return undefined;
        }
        return helper_1.getConfiguration('github', uri).statusbar.failureText;
    }
    init() {
        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10);
        this.statusBar.command = this.customStatusBarCommand || '';
        this.statusBar.text = `${githubPullRequestIcon} ...`;
        if (this.colored) {
            this.statusBar.color = colors.none;
        }
        else {
            this.statusBar.color = undefined;
        }
        this.context.subscriptions.push(this.statusBar);
        this.refreshStatus().catch(() => {
            /* drop error (handled in refreshStatus) */
        });
        if (!this.enabled) {
            this.statusBar.hide();
        }
    }
    refreshStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uri = this.getActiveWorkspaceFolder();
                if (uri) {
                    const connect = yield this.workflowManager.canConnect(uri);
                    if (!connect) {
                        throw connect;
                    }
                    yield this.updateStatus();
                    setTimeout(() => {
                        this.refreshStatus().catch(() => {
                            /* drop error (handled below) */
                        });
                    }, this.refreshInterval);
                }
            }
            catch (e) {
                if (e instanceof api_1.GitHubError) {
                    console.log(e);
                    this.channel.appendLine('Failed to update pull request status:');
                    this.channel.appendLine(JSON.stringify(e.response, undefined, ' '));
                }
                else {
                    throw e;
                }
            }
        });
    }
    getActiveWorkspaceFolder() {
        if (!vscode.workspace.workspaceFolders) {
            // no workspace open
            return undefined;
        }
        if (vscode.workspace.workspaceFolders.length === 1) {
            // just one workspace open
            return vscode.workspace.workspaceFolders[0].uri;
        }
        // check which workspace status should be visible
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return undefined;
        }
        const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
        if (!folder) {
            return undefined;
        }
        return folder.uri;
    }
    updateStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.enabled) {
                return;
            }
            const uri = this.getActiveWorkspaceFolder();
            if (uri) {
                const branch = yield this.git.getCurrentBranch(uri);
                if (branch !== (yield this.workflowManager.getDefaultBranch(uri))) {
                    return this.updatePullRequestStatus(uri);
                }
            }
            this.statusBar.show();
            if (this.colored) {
                this.statusBar.color = colors.none;
            }
            else {
                this.statusBar.color = undefined;
            }
            this.statusBar.text = `${githubPullRequestIcon}`;
            if (!this.customStatusBarCommand) {
                this.statusBar.tooltip =
                    'Not on a pull request branch. Click to checkout pull request';
                this.statusBar.command = 'vscode-github.checkoutPullRequests';
            }
        });
    }
    updatePullRequestStatus(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(uri);
                this.statusBar.show();
                if (pullRequest) {
                    yield this.showPullRequestStauts(pullRequest);
                }
                else {
                    this.showCreatePullRequestStatus();
                }
            }
            catch (e) {
                if (e instanceof api_1.GitHubError) {
                    console.log(e);
                    this.channel.appendLine('Update pull request status error:');
                    this.channel.appendLine(JSON.stringify(e.response, undefined, ' '));
                }
                throw e;
            }
        });
    }
    showPullRequestStauts(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.calculateMergableStatus(pullRequest);
            if (this.colored) {
                this.statusBar.color = colors[status];
            }
            else {
                this.statusBar.color = undefined;
            }
            this.statusBar.text = this.getPullRequestStautsText(pullRequest, status);
            if (!this.customStatusBarCommand) {
                this.statusBar.tooltip =
                    status === 'success' ? `Merge pull-request #${pullRequest.number}` : '';
                this.statusBar.command =
                    status === 'success' ? 'vscode-github.mergePullRequest' : '';
            }
        });
    }
    // tslint:disable-next-line:cyclomatic-complexity
    getPullRequestStautsText(pullRequest, status) {
        let text = '${icon} #${prNumber} ${status}';
        switch (status) {
            case 'success':
                text = this.successText || text;
                break;
            case 'pending':
                text = this.pendingText || text;
                break;
            case 'failure':
                text = this.failureText || text;
                break;
        }
        return text
            .replace('${icon}', githubPullRequestIcon)
            .replace('${prNumber}', String(pullRequest.number))
            .replace('${status}', status);
    }
    showCreatePullRequestStatus() {
        if (this.colored) {
            this.statusBar.color = colors.none;
        }
        else {
            this.statusBar.color = undefined;
        }
        this.statusBar.text = `${githubPullRequestIcon} Create PR`;
        if (!this.customStatusBarCommand) {
            this.statusBar.tooltip = 'Create pull-request for current branch';
            this.statusBar.command = 'vscode-github.createPullRequest';
        }
    }
    calculateMergableStatus(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = 'pending';
            if (typeof pullRequest.mergeable === 'undefined') {
                status = 'failure';
            }
            else {
                if (pullRequest.mergeable) {
                    status = 'success';
                }
                else {
                    status = 'failure';
                }
            }
            return status;
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], StatusBarManager.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", git_1.Git)
], StatusBarManager.prototype, "git", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], StatusBarManager.prototype, "workflowManager", void 0);
__decorate([
    tsdi_1.inject('vscode.OutputChannel'),
    __metadata("design:type", Object)
], StatusBarManager.prototype, "channel", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StatusBarManager.prototype, "init", null);
StatusBarManager = __decorate([
    tsdi_1.component
], StatusBarManager);
exports.StatusBarManager = StatusBarManager;
//# sourceMappingURL=status-bar-manager.js.map