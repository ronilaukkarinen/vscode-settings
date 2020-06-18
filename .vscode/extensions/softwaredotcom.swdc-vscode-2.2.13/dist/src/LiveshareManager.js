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
exports.manageLiveshareSession = void 0;
const HttpClient_1 = require("./http/HttpClient");
const Util_1 = require("./Util");
function manageLiveshareSession(session) {
    return __awaiter(this, void 0, void 0, function* () {
        HttpClient_1.softwarePost("/data/liveshare", session, Util_1.getItem("jwt"))
            .then((resp) => __awaiter(this, void 0, void 0, function* () {
            if (HttpClient_1.isResponseOk(resp)) {
                Util_1.logIt("completed liveshare sync");
            }
            else {
                Util_1.logIt(`unable to sync liveshare metrics: ${resp.message}`);
            }
        }))
            .catch(err => {
            Util_1.logIt(`unable to sync liveshare metrics: ${err.message}`);
        });
    });
}
exports.manageLiveshareSession = manageLiveshareSession;
//# sourceMappingURL=LiveshareManager.js.map