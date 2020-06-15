"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GitLabUser {
    constructor(_client, struct) {
        // this.client = client;
        this.struct = struct;
    }
    get id() {
        return this.struct.id;
    }
    get username() {
        return this.struct.username;
    }
}
exports.GitLabUser = GitLabUser;
//# sourceMappingURL=user.js.map