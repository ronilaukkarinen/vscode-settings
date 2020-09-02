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
exports.updateAtlassianAccessInfo = exports.getAtlassianOauth = exports.refetchAtlassianOauthLazily = exports.onboardInit = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const HttpClient_1 = require("../http/HttpClient");
const AccountManager_1 = require("../menu/AccountManager");
let retry_counter = 0;
const one_min_millis = 1000 * 60;
let atlassianOauthFetchTimeout = null;
function onboardInit(ctx, callback) {
    const jwt = Util_1.getItem("jwt");
    if (jwt) {
        // we have the jwt, call the callback that anon was not created
        return callback(ctx, false /*anonCreated*/);
    }
    const windowState = vscode_1.window.state;
    if (windowState.focused) {
        // perform primary window related work
        primaryWindowOnboarding(ctx, callback);
    }
    else {
        // call the secondary onboarding logic
        secondaryWindowOnboarding(ctx, callback);
    }
}
exports.onboardInit = onboardInit;
function primaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let serverIsOnline = yield HttpClient_1.serverIsAvailable();
        if (serverIsOnline) {
            // great, it's online, create the anon user
            const jwt = yield AccountManager_1.createAnonymousUser();
            if (jwt) {
                // great, it worked. call the callback
                return callback(ctx, true /*anonCreated*/);
            }
            // else its some kind of server issue, try again in a minute
            serverIsOnline = false;
        }
        if (!serverIsOnline) {
            // not online, try again in a minute
            if (retry_counter === 0) {
                // show the prompt that we're unable connect to our app 1 time only
                Util_1.showOfflinePrompt(true);
            }
            // call activate again later
            setTimeout(() => {
                retry_counter++;
                onboardInit(ctx, callback);
            }, one_min_millis * 2);
        }
    });
}
/**
 * This is called if there's no JWT. If it reaches a
 * 6th call it will create an anon user.
 * @param ctx
 * @param callback
 */
function secondaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const serverIsOnline = yield HttpClient_1.serverIsAvailable();
        if (!serverIsOnline) {
            // not online, try again later
            setTimeout(() => {
                onboardInit(ctx, callback);
            }, one_min_millis);
        }
        else if (retry_counter < 5) {
            if (serverIsOnline) {
                retry_counter++;
            }
            // call activate again in about 6 seconds
            setTimeout(() => {
                onboardInit(ctx, callback);
            }, 1000 * 5);
        }
        // tried enough times, create an anon user
        yield AccountManager_1.createAnonymousUser();
        // call the callback
        return callback(ctx, true /*anonCreated*/);
    });
}
function refetchAtlassianOauthLazily(tryCountUntilFoundUser = 40) {
    if (atlassianOauthFetchTimeout) {
        return;
    }
    atlassianOauthFetchTimeout = setTimeout(() => {
        atlassianOauthFetchTimeout = null;
        refetchAtlassianOauthFetchHandler(tryCountUntilFoundUser);
    }, 10000);
}
exports.refetchAtlassianOauthLazily = refetchAtlassianOauthLazily;
function refetchAtlassianOauthFetchHandler(tryCountUntilFoundUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const oauth = yield getAtlassianOauth();
        if (!oauth) {
            // try again if the count is not zero
            if (tryCountUntilFoundUser > 0) {
                tryCountUntilFoundUser -= 1;
                refetchAtlassianOauthLazily(tryCountUntilFoundUser);
            }
        }
        else {
            const message = "Successfully connected to Atlassian";
            vscode_1.window.showInformationMessage(message);
        }
    });
}
function getAtlassianOauth() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let user = yield DataController_1.getUser(jwt);
            if (user && user.auths) {
                // get the one that is "slack"
                for (let i = 0; i < user.auths.length; i++) {
                    const oauthInfo = user.auths[i];
                    if (oauthInfo.type === "atlassian") {
                        updateAtlassianAccessInfo(oauthInfo);
                        return oauthInfo;
                    }
                }
            }
        }
        return null;
    });
}
exports.getAtlassianOauth = getAtlassianOauth;
function updateAtlassianAccessInfo(oauth) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * {access_token, refresh_token}
         */
        if (oauth) {
            Util_1.setItem("atlassian_access_token", oauth.access_token);
        }
        else {
            Util_1.setItem("atlassian_access_token", null);
        }
    });
}
exports.updateAtlassianAccessInfo = updateAtlassianAccessInfo;
//# sourceMappingURL=OnboardManager.js.map