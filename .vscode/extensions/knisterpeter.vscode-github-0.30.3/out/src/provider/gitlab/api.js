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
const pretend_1 = require("pretend");
function getClient(endpoint, token, logger, allowUnsafeSSL = false) {
    return pretend_1.Pretend.builder()
        .requestInterceptor(impl.gitlabTokenAuthenticator(token))
        .requestInterceptor(impl.gitlabHttpsAgent(!allowUnsafeSSL))
        .requestInterceptor(impl.formEncoding())
        .interceptor(impl.logger(logger))
        .decode(impl.gitlabDecoder())
        .target(impl.GitLabBlueprint, endpoint);
}
exports.getClient = getClient;
class GitLabError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
    }
}
exports.GitLabError = GitLabError;
var impl;
(function (impl) {
    function logger(logger) {
        return (chain, request) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger(`${request.options.method} ${request.url}`);
                // console.log('gitlab-request: ', request);
                const response = yield chain(request);
                // console.log('response', response);
                return response;
            }
            catch (e) {
                logger(`${e.response.status} ${e.message}`);
                throw e;
            }
        });
    }
    impl.logger = logger;
    function gitlabTokenAuthenticator(token) {
        return request => {
            request.options.headers = new Headers(request.options.headers);
            request.options.headers.set('PRIVATE-TOKEN', `${token}`);
            return request;
        };
    }
    impl.gitlabTokenAuthenticator = gitlabTokenAuthenticator;
    function gitlabHttpsAgent(rejectUnauthorized) {
        return request => {
            if (!request.url.startsWith('https://')) {
                return request;
            }
            request.options.agent = new https.Agent({ rejectUnauthorized });
            return request;
        };
    }
    impl.gitlabHttpsAgent = gitlabHttpsAgent;
    function formEncoding() {
        return request => {
            if (request.options.method !== 'GET') {
                request.options.headers = new Headers(request.options.headers);
                request.options.headers.set('Content-Type', 'application/x-www-form-urlencoded');
                if (request.options.body) {
                    const body = JSON.parse(request.options.body.toString());
                    const encodedBody = Object.keys(body)
                        .reduce((query, name) => {
                        return `${query}&${name}=${encodeURIComponent(body[name])}`;
                    }, '')
                        .replace(/^&/, '');
                    request.options.body = encodedBody;
                }
            }
            return request;
        };
    }
    impl.formEncoding = formEncoding;
    function gitlabDecoder() {
        return (response) => __awaiter(this, void 0, void 0, function* () {
            if (response.status >= 400) {
                const body = yield response.json();
                throw new GitLabError(`${body.error || response.statusText}`, response);
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
    impl.gitlabDecoder = gitlabDecoder;
    class GitLabBlueprint {
        getProjects() {
            /* */
        }
        getAuthenticatedUser() {
            /* */
        }
        searchUser() {
            /* */
        }
        getProject() {
            /* */
        }
        getMergeRequests() {
            /* */
        }
        getMergeRequest() {
            /* */
        }
        createMergeRequest() {
            /* */
        }
        updateMergeRequest() {
            /* */
        }
        acceptMergeRequest() {
            /* */
        }
        getProjectIssues() {
            /* */
        }
        getIssueNotes() {
            /* */
        }
    }
    __decorate([
        pretend_1.Get('/projects'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getProjects", null);
    __decorate([
        pretend_1.Get('/user', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getAuthenticatedUser", null);
    __decorate([
        pretend_1.Get('/users', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "searchUser", null);
    __decorate([
        pretend_1.Get('/projects/:id'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getProject", null);
    __decorate([
        pretend_1.Get('/projects/:id/merge_requests', true),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getMergeRequests", null);
    __decorate([
        pretend_1.Get('/projects/:id/merge_requests/:merge_request_iid'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getMergeRequest", null);
    __decorate([
        pretend_1.Post('/projects/:id/merge_requests'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "createMergeRequest", null);
    __decorate([
        pretend_1.Put('/projects/:id/merge_requests/:merge_request_iid'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "updateMergeRequest", null);
    __decorate([
        pretend_1.Put('/projects/:id/merge_requests/:merge_request_iid/merge'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "acceptMergeRequest", null);
    __decorate([
        pretend_1.Get('/projects/:id/issues'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getProjectIssues", null);
    __decorate([
        pretend_1.Get('/projects/:id/issues/:issue_iid/notes'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], GitLabBlueprint.prototype, "getIssueNotes", null);
    impl.GitLabBlueprint = GitLabBlueprint;
})(impl || (impl = {}));
//# sourceMappingURL=api.js.map