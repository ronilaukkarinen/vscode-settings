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
const vscode_1 = require("vscode");
const cody_music_1 = require("cody-music");
const MusicControlManager_1 = require("./MusicControlManager");
const Util_1 = require("../Util");
const MusicUtil_1 = require("./MusicUtil");
const DataController_1 = require("../DataController");
const MusicDataManager_1 = require("./MusicDataManager");
class MusicCommandUtil {
    constructor() {
        //
    }
    static getInstance() {
        if (!MusicCommandUtil.instance) {
            MusicCommandUtil.instance = new MusicCommandUtil();
        }
        return MusicCommandUtil.instance;
    }
    runSpotifyCommand(fnc, args = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            if (args && args.length) {
                result = yield fnc(...args);
            }
            else {
                result = yield fnc();
            }
            // check to see if the access token is still valid
            yield this.checkIfAccessExpired(result);
            const error = this.getResponseError(result);
            if (this.isTooManyRequestsError(result)) {
                console.log("Currently experiencing frequent spotify requests, please try again soon.");
                return { status: 429 };
            }
            else if (error !== null) {
                vscode_1.window.showErrorMessage(error.message);
                return error;
            }
            return result;
        });
    }
    isTooManyRequestsError(result) {
        return this.getResponseStatus(result) === 429 ? true : false;
    }
    checkIfAccessExpired(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.getResponseStatus(result) === 401) {
                // check to see if they still have their access token
                const spotifyAccessToken = Util_1.getItem("spotify_access_token");
                if (spotifyAccessToken && (yield cody_music_1.accessExpired())) {
                    // populate the user information in case then check accessExpired again
                    let oauthResult = yield DataController_1.getMusicTimeUserStatus();
                    let expired = true;
                    if (oauthResult.loggedOn) {
                        // try one last time
                        expired = yield cody_music_1.accessExpired();
                    }
                    if (expired) {
                        const email = Util_1.getItem("name");
                        // remove their current spotify info and initiate the auth flow
                        yield MusicControlManager_1.disconnectSpotify(false /*confirmDisconnect*/);
                        MusicUtil_1.showReconnectPrompt(email);
                    }
                }
            }
            else {
                const error = this.getResponseError(result);
                if (error) {
                    vscode_1.window.showErrorMessage(error.message);
                    return error;
                }
            }
        });
    }
    // error.response.data.error has...
    // {message, reason, status}
    getResponseError(resp) {
        if (resp &&
            resp.error &&
            resp.error.response &&
            resp.error.response.data &&
            resp.error.response.data.error) {
            const err = resp.error.response.data.error;
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            if (!dataMgr.spotifyUser ||
                dataMgr.spotifyUser.product !== "premium") {
                return err;
            }
        }
        return null;
    }
    getResponseStatus(resp) {
        if (resp && resp.status) {
            return resp.status;
        }
        else if (resp && resp.data && resp.data.status) {
            return resp.data.status;
        }
        else if (resp &&
            resp.error &&
            resp.error.response &&
            resp.error.response.status) {
            return resp.error.response.status;
        }
        return 200;
    }
}
exports.MusicCommandUtil = MusicCommandUtil;
//# sourceMappingURL=MusicCommandUtil.js.map