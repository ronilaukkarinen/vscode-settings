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
class GitLabMergeRequest {
    constructor(client, repository, mergeRequest) {
        this.client = client;
        this.repository = repository;
        this.mergeRequest = mergeRequest;
    }
    get id() {
        return this.mergeRequest.id;
    }
    get number() {
        return this.mergeRequest.iid;
    }
    get state() {
        switch (this.mergeRequest.state) {
            case 'opened':
                return 'open';
            case 'closed':
            case 'merged':
                return 'closed';
        }
    }
    get title() {
        return this.mergeRequest.title;
    }
    get body() {
        return this.mergeRequest.description;
    }
    get url() {
        return this.mergeRequest.web_url;
    }
    get sourceBranch() {
        return this.mergeRequest.source_branch;
    }
    get targetBranch() {
        return this.mergeRequest.target_branch;
    }
    get mergeable() {
        switch (this.mergeRequest.merge_status) {
            case 'can_be_merged':
                return true;
        }
    }
    get head() {
        throw new Error('not implemented');
    }
    get base() {
        throw new Error('not implemented');
    }
    update(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const gitlabBody = {};
            if (body.title) {
                gitlabBody.title = body.title;
            }
            if (body.body) {
                gitlabBody.description = body.body;
            }
            if (body.state) {
                const mapState = (state) => {
                    switch (state) {
                        case 'open':
                            return 'reopen';
                        case 'closed':
                            return 'close';
                        default:
                            return undefined;
                    }
                };
                gitlabBody.state_event = mapState(body.state);
            }
            yield this.client.updateMergeRequest(encodeURIComponent(this.repository.pathWithNamespace), this.mergeRequest.iid, gitlabBody);
        });
    }
    getComments() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    merge(_body) {
        return __awaiter(this, void 0, void 0, function* () {
            const removeSourceBranch = this.repository.uri
                ? helper_1.getConfiguration('gitlab', this.repository.uri).removeSourceBranch
                : false;
            const response = yield this.client.acceptMergeRequest(encodeURIComponent(this.repository.pathWithNamespace), this.mergeRequest.iid, {
                should_remove_source_branch: removeSourceBranch
            });
            return {
                body: {
                    message: response.body.title,
                    merged: response.body.state === 'merged',
                    sha: response.body.sha
                }
            };
        });
    }
    assign(assignees) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.updateMergeRequest(encodeURIComponent(this.repository.pathWithNamespace), this.mergeRequest.iid, {
                assignee_id: assignees[0].id
            });
        });
    }
    unassign() {
        return __awaiter(this, void 0, void 0, function* () {
            // note: assign to '0'
            yield this.client.updateMergeRequest(encodeURIComponent(this.repository.pathWithNamespace), this.mergeRequest.iid, {
                assignee_id: 0
            });
        });
    }
    requestReview(_body) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    cancelReview(_body) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
}
exports.GitLabMergeRequest = GitLabMergeRequest;
//# sourceMappingURL=merge-request.js.map