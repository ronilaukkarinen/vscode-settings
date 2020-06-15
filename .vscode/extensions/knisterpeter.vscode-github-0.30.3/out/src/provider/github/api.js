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
const https = require("https");
const LRUCache = require("lru-cache");
const pretend_1 = require("pretend");
function getClient(endpoint, token, logger, allowUnsafeSSL = false) {
    return pretend_1.Pretend.builder()
        .interceptor(impl.githubCache())
        .requestInterceptor(impl.githubTokenAuthenticator(token))
        .requestInterceptor(impl.githubHttpsAgent(!allowUnsafeSSL))
        .interceptor(impl.logger(logger))
        .decode(impl.githubDecoder())
        .target(impl.GitHubBlueprint, endpoint);
}
exports.getClient = getClient;
class GitHubError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}
exports.GitHubError = GitHubError;
var impl;
(function (impl) {
    function logger(logger) {
        return (chain, request) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger(`${request.options.method} ${request.url}`);
                // console.log('github-request: ', request);
                const response = yield chain(request);
                // console.log('response', response);
                return response;
            }
            catch (e) {
                if (e.response) {
                    logger(`${e.response.status} ${e.message}`);
                }
                throw e;
            }
        });
    }
    impl.logger = logger;
    function githubCache() {
        // cache at most 100 requests
        const cache = new LRUCache(100);
        return (chain, request) => __awaiter(this, void 0, void 0, function* () {
            const entry = cache.get(request.url);
            if (entry) {
                // when we have a cache hit, send etag
                request.options.headers = new Headers(request.options.headers);
                request.options.headers.set('If-None-Match', entry.etag);
            }
            const response = yield chain(request);
            if (!entry || response.status !== 304) {
                // if no cache hit or response modified, cache and respond
                cache.set(request.url, {
                    etag: response.headers.etag,
                    response
                });
                return response;
            }
            // respond from cache
            return entry.response;
        });
    }
    impl.githubCache = githubCache;
    function githubTokenAuthenticator(token) {
        return request => {
            request.options.headers = new Headers(request.options.headers);
            request.options.headers.set('Authorization', `token ${token}`);
            return request;
        };
    }
    impl.githubTokenAuthenticator = githubTokenAuthenticator;
    function githubHttpsAgent(rejectUnauthorized) {
        return request => {
            if (!request.url.startsWith('https://')) {
                return request;
            }
            request.options.agent = new https.Agent({ rejectUnauthorized });
            return request;
        };
    }
    impl.githubHttpsAgent = githubHttpsAgent;
    function githubDecoder() {
        return (response) => __awaiter(this, void 0, void 0, function* () {
            if (response.status >= 400) {
                const body = yield response.json();
                throw new GitHubError(`${body.message || response.statusText}`, response);
            }
            const headers = {};
            response.headers.forEach((value, key) => {
                headers[key] = [...(headers[key] || []), value];
            });
            return {
                status: response.status,
                headers,
                body: response.status >= 200 && response.status <= 300
                    ? yield response.json()
                    : undefined
            };
        });
    }
    impl.githubDecoder = githubDecoder;
    class GitHubBlueprint {
        getAuthenticatedUser() {
            /* */
        }
        getRepositories() {
            /* */
        }
        getRepository() {
            /* */
        }
        getPullRequest() {
            /* */
        }
        listPullRequests() {
            /* */
        }
        createPullRequest() {
            /* */
        }
        updatePullRequest() {
            /* */
        }
        getStatusForRef() {
            /* */
        }
        mergePullRequest() {
            /* */
        }
        addAssignees() {
            /* */
        }
        removeAssignees() {
            /* */
        }
        requestReview() {
            /* */
        }
        deleteReviewRequest() {
            /* */
        }
        issues() {
            /* */
        }
        getPullRequestComments() {
            /* */
        }
        editIssue() {
            /* */
        }
        getUser() {
            /* */
        }
        listAssignees() {
            /* */
        }
        getIssueComments() {
            /* */
        }
    }
    __decorate([
        pretend_1.Get('/user'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getAuthenticatedUser", null);
    __decorate([
        pretend_1.Get('/user/repos'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getRepositories", null);
    __decorate([
        pretend_1.Headers('Accept: application/vnd.github.polaris-preview'),
        pretend_1.Get('/repos/:owner/:repo'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getRepository", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/pulls/:number'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getPullRequest", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/pulls', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "listPullRequests", null);
    __decorate([
        pretend_1.Post('/repos/:owner/:repo/pulls'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "createPullRequest", null);
    __decorate([
        pretend_1.Patch('/repos/:owner/:repo/pulls/:number'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "updatePullRequest", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/commits/:ref/status'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getStatusForRef", null);
    __decorate([
        pretend_1.Headers('Accept: application/vnd.github.polaris-preview+json'),
        pretend_1.Put('/repos/:owner/:repo/pulls/:number/merge'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "mergePullRequest", null);
    __decorate([
        pretend_1.Post('/repos/:owner/:repo/issues/:number/assignees'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "addAssignees", null);
    __decorate([
        pretend_1.Delete('/repos/:owner/:repo/issues/:number/assignees', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "removeAssignees", null);
    __decorate([
        pretend_1.Post('/repos/:owner/:repo/pulls/:number/requested_reviewers'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "requestReview", null);
    __decorate([
        pretend_1.Delete('/repos/:owner/:repo/pulls/:number/requested_reviewers', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "deleteReviewRequest", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/issues', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "issues", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/pulls/:number/comments'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getPullRequestComments", null);
    __decorate([
        pretend_1.Patch('/repos/:owner/:repo/issues/:number'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "editIssue", null);
    __decorate([
        pretend_1.Get('/users/:username'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getUser", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/assignees'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "listAssignees", null);
    __decorate([
        pretend_1.Get('/repos/:owner/:repo/issues/:number/comments'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitHubBlueprint.prototype, "getIssueComments", null);
    impl.GitHubBlueprint = GitHubBlueprint;
})(impl || (impl = {}));
//# sourceMappingURL=api.js.map