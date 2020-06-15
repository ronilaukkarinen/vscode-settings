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
const git_1 = require("../git");
const helper_1 = require("../helper");
const status_bar_manager_1 = require("../status-bar-manager");
class PullRequestCommand extends command_1.TokenCommand {
    selectPullRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequests = yield this.workflowManager.listPullRequests(this.uri);
            const items = pullRequests.map(pullRequest => ({
                label: pullRequest.title,
                description: `#${pullRequest.number}`,
                pullRequest
            }));
            const selected = yield vscode.window.showQuickPick(items, {
                matchOnDescription: true
            });
            return selected ? selected.pullRequest : undefined;
        });
    }
    hasRemoteTrackingBranch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const localBranch = yield this.git.getCurrentBranch(uri);
            if (!localBranch) {
                return false;
            }
            return Boolean(yield this.git.getRemoteTrackingBranch(localBranch, uri));
        });
    }
    requireRemoteTrackingBranch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasBranch = yield this.hasRemoteTrackingBranch(uri);
            if (!hasBranch) {
                if (helper_1.getConfiguration('github', uri).autoPublish) {
                    yield vscode.commands.executeCommand('git.publish');
                    return true;
                }
                else {
                    vscode.window.showWarningMessage(`Cannot create pull request without remote branch. ` +
                        `Please push your local branch before creating pull request.`);
                }
            }
            return hasBranch;
        });
    }
    showPullRequestNotification(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield vscode.window.showInformationMessage(`Successfully created #${pullRequest.number}`, 'Open on Github');
            if (result) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(pullRequest.url));
            }
        });
    }
}
__decorate([
    tsdi_1.inject,
    __metadata("design:type", git_1.Git)
], PullRequestCommand.prototype, "git", void 0);
let BrowsePullRequest = class BrowsePullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.browserPullRequest';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const selected = yield this.selectPullRequest();
            if (selected) {
                vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(selected.url));
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowsePullRequest.prototype, "runWithToken", null);
BrowsePullRequest = __decorate([
    tsdi_1.component({ eager: true })
], BrowsePullRequest);
exports.BrowsePullRequest = BrowsePullRequest;
let BrowseSimpleRequest = class BrowseSimpleRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.browserSimplePullRequest';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(pullRequest.url));
            }
            else {
                vscode.window.showInformationMessage('No pull request for current branch found');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseSimpleRequest.prototype, "runWithToken", null);
BrowseSimpleRequest = __decorate([
    tsdi_1.component({ eager: true })
], BrowseSimpleRequest);
exports.BrowseSimpleRequest = BrowseSimpleRequest;
let CheckoutPullRequest = class CheckoutPullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.checkoutPullRequests';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const selected = yield this.selectPullRequest();
            if (selected) {
                if (selected.base.repository.url !== selected.head.repository.url) {
                    const question = yield vscode.window.showInformationMessage('External pull request selected. Should it be cloned into a local branch?', 'Yes', 'No');
                    if (question !== 'Yes') {
                        return;
                    }
                    if (!this.uri) {
                        throw new Error('uri is undefined');
                    }
                    yield this.git.branch(selected.sourceBranch, selected.targetBranch, this.uri);
                    yield this.git.pullExternal(selected.head.repository.cloneUrl, selected.sourceBranch, this.uri);
                }
                else {
                    yield vscode.commands.executeCommand('git.checkout', selected.sourceBranch);
                }
                yield this.statusBarManager.updateStatus();
            }
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", status_bar_manager_1.StatusBarManager)
], CheckoutPullRequest.prototype, "statusBarManager", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CheckoutPullRequest.prototype, "runWithToken", null);
CheckoutPullRequest = __decorate([
    tsdi_1.component({ eager: true })
], CheckoutPullRequest);
exports.CheckoutPullRequest = CheckoutPullRequest;
let CreatePullRequestWithParameters = class CreatePullRequestWithParameters extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.createPullRequestWithParameters';
    }
    runWithToken(sourceBranch, targetBranch, title, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            if (!this.requireRemoteTrackingBranch(this.uri)) {
                return;
            }
            const pullRequest = yield this.workflowManager.createPullRequestFromData({
                sourceBranch,
                targetBranch,
                title,
                body
            }, this.uri);
            if (pullRequest) {
                yield this.statusBarManager.updateStatus();
                yield this.showPullRequestNotification(pullRequest);
            }
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", status_bar_manager_1.StatusBarManager)
], CreatePullRequestWithParameters.prototype, "statusBarManager", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CreatePullRequestWithParameters.prototype, "runWithToken", null);
CreatePullRequestWithParameters = __decorate([
    tsdi_1.component({ eager: true })
], CreatePullRequestWithParameters);
exports.CreatePullRequestWithParameters = CreatePullRequestWithParameters;
let CreateSimplePullRequest = class CreateSimplePullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.createSimplePullRequest';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            if (!this.requireRemoteTrackingBranch(this.uri)) {
                return;
            }
            const pullRequest = yield this.workflowManager.createPullRequest(this.uri);
            if (pullRequest) {
                yield this.statusBarManager.updateStatus();
                yield this.showPullRequestNotification(pullRequest);
            }
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", status_bar_manager_1.StatusBarManager)
], CreateSimplePullRequest.prototype, "statusBarManager", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreateSimplePullRequest.prototype, "runWithToken", null);
CreateSimplePullRequest = __decorate([
    tsdi_1.component({ eager: true })
], CreateSimplePullRequest);
exports.CreateSimplePullRequest = CreateSimplePullRequest;
let CreatePullRequest = class CreatePullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.createPullRequest';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            if (!this.requireRemoteTrackingBranch(this.uri)) {
                return;
            }
            let [owner, repo] = yield this.git.getGitProviderOwnerAndRepository(this.uri);
            const selectedRepository = yield this.getRepository(this.uri);
            if (!selectedRepository) {
                return;
            }
            [owner, repo] = selectedRepository.label.split('/');
            const branch = yield this.getTargetBranch(selectedRepository.repo.defaultBranch, this.uri);
            if (!branch) {
                return;
            }
            const pullRequest = yield this.workflowManager.createPullRequest(this.uri, {
                owner,
                repository: repo,
                branch
            });
            if (pullRequest) {
                yield this.statusBarManager.updateStatus();
                yield this.showPullRequestNotification(pullRequest);
            }
        });
    }
    getRepository(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.workflowManager.getRepository(uri);
            const items = [
                {
                    label: repository.name,
                    description: '',
                    repo: repository
                }
            ];
            if (repository.parent) {
                items.push({
                    label: repository.parent.name,
                    description: '',
                    repo: repository.parent
                });
            }
            if (items.length === 1) {
                return items[0];
            }
            return vscode.window.showQuickPick(items, {
                placeHolder: 'Select a repository to create the pull request in'
            });
        });
    }
    getTargetBranch(defaultBranch, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            // sort default branch up
            const picks = (yield this.git.getRemoteBranches(uri)).sort((b1, b2) => {
                if (b1 === defaultBranch) {
                    return -1;
                }
                else if (b2 === defaultBranch) {
                    return 1;
                }
                return b1.localeCompare(b2);
            });
            return vscode.window.showQuickPick(picks, {
                ignoreFocusOut: true,
                placeHolder: 'Select a branch to create the pull request for'
            });
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", status_bar_manager_1.StatusBarManager)
], CreatePullRequest.prototype, "statusBarManager", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CreatePullRequest.prototype, "runWithToken", null);
CreatePullRequest = __decorate([
    tsdi_1.component({ eager: true })
], CreatePullRequest);
exports.CreatePullRequest = CreatePullRequest;
let MergePullRequest = class MergePullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.mergePullRequest';
    }
    getMergeMethdod(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = helper_1.getConfiguration('github', uri);
            if (config.preferedMergeMethod) {
                return config.preferedMergeMethod;
            }
            const items = [];
            const enabledMethods = yield this.workflowManager.getEnabledMergeMethods(uri);
            if (enabledMethods.has('merge')) {
                items.push({
                    label: 'Create merge commit',
                    description: '',
                    method: 'merge'
                });
            }
            if (enabledMethods.has('squash')) {
                items.push({
                    label: 'Squash and merge',
                    description: '',
                    method: 'squash'
                });
            }
            if (enabledMethods.has('rebase')) {
                items.push({
                    label: 'Rebase and merge',
                    description: '',
                    method: 'rebase'
                });
            }
            const selected = yield vscode.window.showQuickPick(items);
            return selected ? selected.method : undefined;
        });
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest && pullRequest.mergeable) {
                const method = yield this.getMergeMethdod(this.uri);
                if (method) {
                    if (yield this.workflowManager.mergePullRequest(pullRequest, method)) {
                        yield this.statusBarManager.updateStatus();
                        vscode.window.showInformationMessage(`Successfully merged`);
                    }
                    else {
                        vscode.window.showInformationMessage(`Merge failed for unknown reason`);
                    }
                }
            }
            else {
                vscode.window.showWarningMessage('Either no pull request for current brach, or the pull request is not mergable');
            }
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", status_bar_manager_1.StatusBarManager)
], MergePullRequest.prototype, "statusBarManager", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vscode.Uri]),
    __metadata("design:returntype", Promise)
], MergePullRequest.prototype, "getMergeMethdod", null);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MergePullRequest.prototype, "runWithToken", null);
MergePullRequest = __decorate([
    tsdi_1.component({ eager: true })
], MergePullRequest);
exports.MergePullRequest = MergePullRequest;
let UpdatePullRequest = class UpdatePullRequest extends PullRequestCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.updatePullRequest';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const pullRequest = yield this.workflowManager.getPullRequestForCurrentBranch(this.uri);
            if (pullRequest) {
                yield this.workflowManager.updatePullRequest(pullRequest, this.uri);
            }
            else {
                vscode.window.showInformationMessage('No pull request for current branch found');
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UpdatePullRequest.prototype, "runWithToken", null);
UpdatePullRequest = __decorate([
    tsdi_1.component({ eager: true })
], UpdatePullRequest);
exports.UpdatePullRequest = UpdatePullRequest;
//# sourceMappingURL=pull-requests.js.map