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
const client_1 = require("./provider/client");
const api_1 = require("./provider/github/api");
const tokens_1 = require("./tokens");
let WorkflowManager = class WorkflowManager {
    constructor() {
        this.providers = {};
    }
    connect(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = (message) => this.log(message);
            const provider = yield client_1.createClient(this.git, tokens_1.getTokens(this.context.globalState), uri, logger);
            try {
                yield provider.test();
            }
            catch (e) {
                throw new Error(`Connection with ${provider.name} failed. Please make sure your git executable` +
                    `is setup correct, and your token has enought access rights.`);
            }
            this.log(`Connected with provider ${provider.name}`);
            return provider;
        });
    }
    getProvider(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.providers[uri.fsPath]) {
                this.providers[uri.fsPath] = yield this.connect(uri);
            }
            return this.providers[uri.fsPath];
        });
    }
    resetProviders() {
        this.providers = {};
    }
    log(message, obj) {
        const formatted = `${message} ` + (obj ? JSON.stringify(obj, undefined, ' ') : '');
        this.channel.appendLine(formatted);
        console.log(formatted);
    }
    canConnect(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getProvider(uri);
                return true;
            }
            catch (e) {
                this.log(`Failed to connect to provider`, e.message);
                return e;
            }
        });
    }
    getRepository(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const [owner, repository] = yield this.git.getGitProviderOwnerAndRepository(uri);
            const provider = yield this.getProvider(uri);
            return (yield provider.getRepository(uri, `${owner}/${repository}`)).body;
        });
    }
    getDefaultBranch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getRepository(uri)).defaultBranch;
        });
    }
    getEnabledMergeMethods(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = yield this.getRepository(uri);
            const set = new Set();
            if (repo.allowMergeCommits) {
                set.add('merge');
            }
            if (repo.allowSquashCommits) {
                set.add('squash');
            }
            if (repo.allowRebaseCommits) {
                set.add('rebase');
            }
            return set;
        });
    }
    getPullRequestForCurrentBranch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const branch = yield this.git.getCurrentBranch(uri);
            const list = (yield this.listPullRequests(uri)).filter(pr => pr.sourceBranch === branch);
            if (list.length !== 1) {
                return undefined;
            }
            const repository = yield this.getRepository(uri);
            return (yield repository.getPullRequest(list[0].number)).body;
        });
    }
    hasPullRequestForCurrentBranch(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.getPullRequestForCurrentBranch(uri));
        });
    }
    createPullRequest(uri, upstream) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasPullRequestForCurrentBranch(uri)) {
                return undefined;
            }
            const branch = yield this.git.getCurrentBranch(uri);
            if (!branch) {
                throw new Error('No current branch');
            }
            const defaultBranch = yield this.getDefaultBranch(uri);
            this.log(`Create pull request on branch '${branch}'`);
            const firstCommit = yield this.git.getFirstCommitOnBranch(branch, defaultBranch, uri);
            this.log(`First commit on branch '${firstCommit}'`);
            const requestBody = yield this.git.getPullRequestBody(firstCommit, uri);
            if (requestBody === undefined) {
                vscode.window.showWarningMessage(`For some unknown reason no pull request body could be build; Aborting operation`);
                return undefined;
            }
            const requestTitle = yield this.getTitle(firstCommit, uri);
            if (requestTitle === undefined) {
                this.channel.appendLine(`No pull request title created; Aborting operation`);
                return undefined;
            }
            return this.createPullRequestFromData({
                upstream,
                sourceBranch: branch,
                targetBranch: upstream ? upstream.branch : defaultBranch,
                title: requestTitle,
                body: requestBody
            }, uri);
        });
    }
    getTitle(firstCommit, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const customTitle = helper_1.getConfiguration('github', uri).customPullRequestTitle;
            if (customTitle) {
                const title = yield vscode.window.showInputBox({
                    prompt: 'Pull request title'
                });
                if (!title) {
                    return undefined;
                }
                return title;
            }
            return this.git.getCommitMessage(firstCommit, uri);
        });
    }
    createPullRequestFromData({ upstream, sourceBranch, targetBranch, title, body }, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasPullRequestForCurrentBranch(uri)) {
                return undefined;
            }
            this.log(`Create pull request on branch '${sourceBranch}'`);
            const pullRequestBody = {
                sourceBranch,
                targetBranch,
                title,
                body
            };
            this.log('pull request body:', pullRequestBody);
            const getRepository = () => __awaiter(this, void 0, void 0, function* () {
                if (upstream) {
                    const provider = yield this.getProvider(uri);
                    return (yield provider.getRepository(uri, `${upstream.owner}/${upstream.repository}`)).body;
                }
                else {
                    return this.getRepository(uri);
                }
            });
            return this.doCreatePullRequest(yield getRepository(), pullRequestBody);
        });
    }
    doCreatePullRequest(repository, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return (yield repository.createPullRequest(body)).body;
            }
            catch (e) {
                if (e instanceof api_1.GitHubError) {
                    this.log('Create pull request error:', e.response);
                }
                throw e;
            }
        });
    }
    updatePullRequest(pullRequest, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.hasPullRequestForCurrentBranch(uri)) {
                return undefined;
            }
            const branch = yield this.git.getCurrentBranch(uri);
            if (!branch) {
                throw new Error('No current branch');
            }
            this.log(`Update pull request on branch '${branch}'`);
            const firstCommit = yield this.git.getFirstCommitOnBranch(branch, pullRequest.targetBranch, uri);
            this.log(`First commit on branch '${firstCommit}'`);
            const requestBody = yield this.git.getPullRequestBody(firstCommit, uri);
            if (requestBody === undefined) {
                vscode.window.showWarningMessage(`For some unknown reason no pull request body could be build; Aborting operation`);
                return undefined;
            }
            if (requestBody !== pullRequest.body) {
                yield pullRequest.update({
                    title: yield this.git.getCommitMessage(firstCommit, uri),
                    body: requestBody
                });
            }
        });
    }
    listPullRequests(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            const parameters = {
                state: 'open'
            };
            return (yield repository.getPullRequests(parameters)).body;
        });
    }
    mergePullRequest(pullRequest, method) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (pullRequest.mergeable) {
                    const body = {
                        mergeMethod: method
                    };
                    const result = yield pullRequest.merge(body);
                    return result.body.merged;
                }
                return undefined;
            }
            catch (e) {
                if (!(e instanceof api_1.GitHubError)) {
                    throw e;
                }
                this.log('Error while merging:', yield e.response.json());
                // status 405 (method not allowed)
                // tslint:disable-next-line:comment-format
                // TODO...
                return false;
            }
        });
    }
    getRepositoryUrl(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            return repository.url;
        });
    }
    getIssueUrl(uri, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const hostname = yield this.git.getGitHostname(uri);
            const [owner, repo] = yield this.git.getGitProviderOwnerAndRepository(uri);
            return `https://${hostname}/${owner}/${repo}/issues/${id}`;
        });
    }
    getGithubFileUrl(uri, file, line = 0, endLine = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const hostname = yield this.git.getGitHostname(uri);
            const [owner, repo] = yield this.git.getGitProviderOwnerAndRepository(uri);
            const branch = yield this.git.getCurrentBranch(uri);
            const currentFile = file.replace(/^\//, '');
            return `https://${hostname}/${owner}/${repo}/blob/${branch}/${currentFile}#L${line +
                1}:L${endLine + 1}`;
        });
    }
    getAssignees(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            try {
                return (yield repository.getUsers()).body;
            }
            catch (e) {
                this.log(e.message);
                return [];
            }
        });
    }
    addAssignee(pullRequest, name, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Add assignee', { pullRequest, name });
            const provider = yield this.getProvider(uri);
            const user = yield provider.getUserByUsername(name);
            yield pullRequest.assign([user.body]);
        });
    }
    removeAssignee(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Remove assignee', { pullRequest });
            yield pullRequest.unassign();
        });
    }
    requestReview(issue, name, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            const pullRequest = yield repository.getPullRequest(issue);
            yield pullRequest.body.requestReview({
                reviewers: [name]
            });
        });
    }
    deleteReviewRequest(issue, name, uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            const pullRequest = yield repository.getPullRequest(issue);
            yield pullRequest.body.cancelReview({
                reviewers: [name]
            });
        });
    }
    issues(uri, state = 'all') {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = yield this.getRepository(uri);
            const result = yield repository.getIssues({
                sort: 'updated',
                direction: 'desc',
                state
            });
            return result.body;
        });
    }
    getPullRequestReviewComments(pullRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield pullRequest.getComments()).body;
        });
    }
    getIssueComments(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield issue.comments()).body;
        });
    }
};
__decorate([
    tsdi_1.inject({ name: 'vscode.ExtensionContext' }),
    __metadata("design:type", Object)
], WorkflowManager.prototype, "context", void 0);
__decorate([
    tsdi_1.inject('vscode.OutputChannel'),
    __metadata("design:type", Object)
], WorkflowManager.prototype, "channel", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", git_1.Git)
], WorkflowManager.prototype, "git", void 0);
WorkflowManager = __decorate([
    tsdi_1.component
], WorkflowManager);
exports.WorkflowManager = WorkflowManager;
//# sourceMappingURL=workflow-manager.js.map