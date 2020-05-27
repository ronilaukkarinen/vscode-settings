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
            if (this.isTooManyRequestsError(result)) {
                vscode_1.window.showErrorMessage("Currently experiencing frequent spotify requests, please try again soon.");
                return { status: 429 };
            }
            // check to see if the access token is still valid
            yield this.checkIfAccessExpired(result);
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
                if (spotifyAccessToken && cody_music_1.accessExpired()) {
                    const email = Util_1.getItem("name");
                    // remove their current spotify info and initiate the auth flow
                    yield MusicControlManager_1.disconnectSpotify(false /*confirmDisconnect*/);
                    MusicUtil_1.showReconnectPrompt(email);
                }
            }
        });
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