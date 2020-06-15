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
class GithubClient {
    constructor(protocol, hostname, token, logger, allowUnsafeSSL = false) {
        this.name = 'GitHub Client';
        this.repositories = new Map();
        this.client = api_1.getClient(this.getApiEndpoint(protocol, hostname), token, logger, allowUnsafeSSL);
    }
    getApiEndpoint(protocol, hostname) {
        if (hostname === 'github.com') {
            return 'https://api.github.com';
        }
        if (hostname.startsWith('http')) {
            return `${hostname}/api/v3`;
        }
        return `${protocol}//${hostname}/api/v3`;
    }
    test() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.getRepositories();
        });
    }
    getCurrentUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getAuthenticatedUser();
            return {
                body: new user_1.GithubUser(this.client, response.body)
            };
        });
    }
    getRepository(uri, rid) {
        return __awaiter(this, void 0, void 0, function* () {
            const [owner, repository] = rid.split('/');
            const cacheKey = `${uri.toString()}$$${rid}`;
            const cacheHit = this.repositories.get(cacheKey);
            if (cacheHit) {
                return {
                    body: new repository_1.GithubRepository(uri, this.client, owner, repository, cacheHit)
                };
            }
            const response = yield this.client.getRepository(owner, repository);
            this.repositories.set(cacheKey, response.body);
            return {
                body: new repository_1.GithubRepository(uri, this.client, owner, repository, response.body)
            };
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getUser(username);
            return {
                body: new user_1.GithubUser(this.client, response.body)
            };
        });
    }
}
exports.GithubClient = GithubClient;
//# sourceMappingURL=client.js.map