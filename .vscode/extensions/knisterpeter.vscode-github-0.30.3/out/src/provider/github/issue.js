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
const user_1 = require("./user");
class GithubIssue {
    constructor(client, repository, struct) {
        this.client = client;
        this.repository = repository;
        this.struct = struct;
    }
    get number() {
        return this.struct.number;
    }
    get title() {
        return this.struct.title;
    }
    get url() {
        return this.struct.html_url;
    }
    get body() {
        return this.struct.body;
    }
    comments() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.getIssueComments(this.repository.owner, this.repository.repository, this.number);
            return {
                body: response.body.map(comment => ({
                    body: comment.body,
                    user: new user_1.GithubUser(this.client, comment.user)
                }))
            };
        });
    }
}
exports.GithubIssue = GithubIssue;
//# sourceMappingURL=issue.js.map