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
exports.JiraClient = exports.ROOT_API = void 0;
const axios_1 = require("axios");
const Util_1 = require("../Util");
exports.ROOT_API = "https://sftwco.atlassian.net";
const jiraClient = axios_1.default.create({
    baseURL: exports.ROOT_API
});
class JiraClient {
    constructor() {
        //
    }
    static getInstance() {
        if (!JiraClient.instance) {
            JiraClient.instance = new JiraClient();
        }
        return JiraClient.instance;
    }
    apiGet(api, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            jiraClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            const resp = yield jiraClient.get(api).catch(err => {
                Util_1.logIt(`error fetching data for ${api}, message: ${err.message}`);
                return err;
            });
            return resp;
        });
    }
    fetchIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = Util_1.getItem("atlassian_access_token");
            return this.apiGet("/rest/api/3/issuetype", accessToken);
        });
    }
}
exports.JiraClient = JiraClient;
//# sourceMappingURL=JiraClient.js.map