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
exports.createAnonymousUser = exports.resetUserData = exports.processSwitchAccounts = exports.showSwitchAccountsMenu = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const HttpClient_1 = require("../http/HttpClient");
const MenuManager_1 = require("./MenuManager");
function showSwitchAccountsMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const items = [];
        const authType = Util_1.getItem("authType");
        const name = Util_1.getItem("name");
        let type = "email";
        if (authType === "google") {
            type = "Google";
        }
        else if (authType === "github") {
            type = "GitHub";
        }
        const placeholder = `Connected using ${type} (${name})`;
        items.push({
            label: "Switch to a different account?",
            detail: "Click to link to a different account.",
            cb: resetData,
        });
        const menuOptions = {
            items,
            placeholder,
        };
        const selection = yield MenuManager_1.showQuickPick(menuOptions);
        if (selection) {
            // show the google, github, email menu options
            showLogInMenuOptions();
        }
    });
}
exports.showSwitchAccountsMenu = showSwitchAccountsMenu;
function showLogInMenuOptions() {
    const items = [];
    const placeholder = `Log in using...`;
    items.push({
        label: "Log in with Google",
        command: "codetime.googleLogin"
    });
    items.push({
        label: "Log in with GitHub",
        command: "codetime.githubLogin"
    });
    items.push({
        label: "Log in with Email",
        command: "codetime.codeTimeLogin"
    });
    const menuOptions = {
        items,
        placeholder,
    };
    MenuManager_1.showQuickPick(menuOptions);
}
function processSwitchAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = yield vscode_1.window.showInformationMessage("Switch to a different account?", { modal: true }, ...["Yes"]);
        if (selection && selection === "Yes") {
            yield resetData();
        }
    });
}
exports.processSwitchAccounts = processSwitchAccounts;
function resetData() {
    return __awaiter(this, void 0, void 0, function* () {
        // clear the session.json
        yield resetUserData();
        // refresh the tree
        vscode_1.commands.executeCommand("codetime.refreshTreeViews");
        // delete the current JWT and call the onboard logic so that we
        // create a anon user JWT
        yield createAnonymousUser();
    });
}
function resetUserData() {
    return __awaiter(this, void 0, void 0, function* () {
        Util_1.setItem("jwt", null);
        Util_1.setItem("name", null);
    });
}
exports.resetUserData = resetUserData;
/**
 * create an anonymous user based on github email or mac addr
 */
function createAnonymousUser() {
    return __awaiter(this, void 0, void 0, function* () {
        let appJwt = yield DataController_1.getAppJwt();
        if (appJwt) {
            const jwt = Util_1.getItem("jwt");
            // check one more time before creating the anon user
            if (!jwt) {
                const creation_annotation = "NO_SESSION_FILE";
                const username = yield Util_1.getOsUsername();
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const hostname = yield Util_1.getHostname();
                const workspace_name = Util_1.getWorkspaceName();
                const resp = yield HttpClient_1.softwarePost("/data/onboard", {
                    timezone,
                    username,
                    creation_annotation,
                    hostname,
                }, appJwt);
                if (HttpClient_1.isResponseOk(resp) && resp.data && resp.data.jwt) {
                    Util_1.setItem("jwt", resp.data.jwt);
                    return resp.data.jwt;
                }
            }
        }
        return null;
    });
}
exports.createAnonymousUser = createAnonymousUser;
//# sourceMappingURL=AccountManager.js.map