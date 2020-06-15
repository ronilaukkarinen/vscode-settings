"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GithubUser {
    constructor(_client, struct) {
        // this.client = client;
        this.struct = struct;
    }
    get id() {
        return this.struct.id;
    }
    get username() {
        return this.struct.login;
    }
}
exports.GithubUser = GithubUser;
//# sourceMappingURL=user.js.map