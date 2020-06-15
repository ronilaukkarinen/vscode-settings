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
const helper_1 = require("../../helper");
const issue_1 = require("./issue");
const merge_request_1 = require("./merge-request");
const user_1 = require("./user");
class GitLabRepository {
    constructor(uri, client, project) {
        this.uri = uri;
        this.client = client;
        this.project = project;
    }
    get name() {
        return this.project.name;
    }
    get pathWithNamespace() {
        return this.project.path_with_namespace;
    }
    get defaultBranch() {
        return this.project.default_branch;
    }
    get allowMergeCommits() {
        return this.project.merge_requests_enabled;
    }
    get allowSquashCommits() {
        return false;
    }
    get allowRebaseCommits() {
        return false;
    }
    get parent() {
        return undefined;
    }
    get url() {
        return this.project.web_url;
    }
    get cloneUrl() {
        throw new Error('not implemented');
    }
    getPullRequests(parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            function getState(state) {
                switch (state) {
                    case 'open':
                        return 'opened';
                    case 'close':
                        return 'closed';
                    default:
                        return undefined;
                }
            }
            function getOrderBy(orderBy) {
                switch (orderBy) {
                    case 'created':
                        return 'created_at';
                    case 'updated':
                        return 'updated_at';
                    default:
                        return undefined;
                }
            }
            const params = {};
            if (parameters.state) {
                params.state = getState(parameters.state);
            }
            if (parameters.sort) {
                params.order_by = getOrderBy(parameters.sort);
            }
            if (parameters.direction) {
                params.sort = parameters.direction;
            }
            const respose = yield this.client.getMergeRequests(encodeURIComponent(this.project.path_with_namespace), params);
            return {
                body: respose.body.map(mergeRequest => new merge_request_1.GitLabMergeRequest(this.client, this, mergeRequest))
            };
        });
    }
    getPullRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getMergeRequest(encodeURIComponent(this.project.path_with_namespace), id);
            return {
                body: new merge_request_1.GitLabMergeRequest(this.client, this, response.body)
            };
        });
    }
    createPullRequest(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const removeSourceBranch = this.uri
                ? helper_1.getConfiguration('gitlab', this.uri).removeSourceBranch
                : false;
            const gitlabBody = {
                source_branch: body.sourceBranch,
                target_branch: body.targetBranch,
                title: body.title,
                remove_source_branch: removeSourceBranch
            };
            if (body.body) {
                gitlabBody.description = body.body;
            }
            const response = yield this.client.createMergeRequest(encodeURIComponent(this.project.path_with_namespace), gitlabBody);
            return {
                body: new merge_request_1.GitLabMergeRequest(this.client, this, response.body)
            };
        });
    }
    getIssues(parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            function getState(state) {
                switch (state) {
                    case 'open':
                        return 'opened';
                    case 'closed':
                        return 'closed';
                }
                return undefined;
            }
            function getOrderBy(orderBy) {
                switch (orderBy) {
                    case 'created':
                        return 'created_at';
                    case 'updated':
                        return 'updated_at';
                    default:
                        return undefined;
                }
            }
            const body = {};
            if (parameters) {
                if (parameters.state && parameters.state !== 'all') {
                    body.state = getState(parameters.state);
                }
                if (parameters.sort) {
                    body.order_by = getOrderBy(parameters.sort);
                }
                if (parameters.direction) {
                    body.sort = parameters.direction;
                }
            }
            const response = yield this.client.getProjectIssues(encodeURIComponent(this.project.path_with_namespace), body);
            return {
                body: response.body.map(issue => new issue_1.GitLabIssue(this.client, this, issue))
            };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.searchUser();
            return {
                body: response.body.map(user => new user_1.GitLabUser(this.client, user))
            };
        });
    }
}
exports.GitLabRepository = GitLabRepository;
//# sourceMappingURL=repository.js.map