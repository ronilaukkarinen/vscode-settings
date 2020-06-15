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
const issue_1 = require("./issue");
const pull_request_1 = require("./pull-request");
const user_1 = require("./user");
class GithubRepository {
    constructor(uri, client, owner, repository, struct) {
        this.uri = uri;
        this.client = client;
        this.owner = owner;
        this.repository = repository;
        this.struct = struct;
    }
    get slug() {
        return `${this.owner}/${this.repository}`;
    }
    get name() {
        return this.struct.full_name;
    }
    get defaultBranch() {
        return this.struct.default_branch;
    }
    get allowMergeCommits() {
        return Boolean(this.struct.allow_merge_commit);
    }
    get allowSquashCommits() {
        return Boolean(this.struct.allow_squash_merge);
    }
    get allowRebaseCommits() {
        return Boolean(this.struct.allow_rebase_merge);
    }
    get parent() {
        if (!this.struct.parent) {
            return undefined;
        }
        return new GithubRepository(undefined, this.client, this.struct.parent.owner.login, this.struct.parent.name, this.struct.parent);
    }
    get url() {
        return this.struct.html_url;
    }
    get cloneUrl() {
        return this.struct.clone_url;
    }
    getPullRequests(parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.listPullRequests(this.owner, this.repository, parameters);
            const body = response.body.map(pr => new pull_request_1.GithubPullRequest(this.client, this, pr));
            return {
                body
            };
        });
    }
    getPullRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getPullRequest(this.owner, this.repository, id);
            return {
                body: new pull_request_1.GithubPullRequest(this.client, this, response.body)
            };
        });
    }
    createPullRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.createPullRequest(this.owner, this.repository, {
                head: `${this.owner}:${body.sourceBranch}`,
                base: `${body.targetBranch}`,
                title: body.title,
                body: body.body
            });
            const expr = new RegExp(`https?://[^/:]+/repos/[^/]+/[^/]+/pulls/([0-9]+)`);
            const number = expr.exec(result.headers['location'][0]);
            const response = yield this.client.getPullRequest(this.owner, this.repository, parseInt(number[1], 10));
            return {
                body: new pull_request_1.GithubPullRequest(this.client, this, response.body)
            };
        });
    }
    getIssues(parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.issues(this.owner, this.repository, {
                direction: parameters.direction,
                sort: parameters.sort,
                state: parameters.state || 'all'
            });
            return {
                body: response.body
                    .filter(issue => !Boolean(issue.pull_request))
                    .map(issue => new issue_1.GithubIssue(this.client, this, issue))
            };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.listAssignees(this.owner, this.repository);
            return {
                body: response.body.map(user => new user_1.GithubUser(this.client, user))
            };
        });
    }
}
exports.GithubRepository = GithubRepository;
//# sourceMappingURL=repository.js.map