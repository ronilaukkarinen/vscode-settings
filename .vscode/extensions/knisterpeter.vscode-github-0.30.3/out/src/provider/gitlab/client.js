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
const api_1 = require("./api");
const repository_1 = require("./repository");
const user_1 = require("./user");
class GitLabClient {
    constructor(protocol, hostname, token, logger, allowUnsafeSSL) {
        this.name = 'GitLab Client';
        this.client = api_1.getClient(this.getApiEndpoint(protocol, hostname), token, logger, allowUnsafeSSL);
    }
    getApiEndpoint(protocol, hostname) {
        return `${protocol}//${hostname}/api/v4`;
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.getProjects();
        });
    }
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getAuthenticatedUser();
            return {
                body: new user_1.GitLabUser(this.client, response.body)
            };
        });
    }
    getRepository(uri, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (yield this.client.getProject(encodeURIComponent(rid)))
                .body;
            return {
                body: new repository_1.GitLabRepository(uri, this.client, response)
            };
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.searchUser({
                username
            });
            return {
                body: new user_1.GitLabUser(this.client, response.body[0])
            };
        });
    }
}
exports.GitLabClient = GitLabClient;
//# sourceMappingURL=client.js.map