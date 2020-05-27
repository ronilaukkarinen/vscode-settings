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
const DataController_1 = require("./DataController");
const Util_1 = require("./Util");
const HttpClient_1 = require("./HttpClient");
const cody_music_1 = require("cody-music");
let secondary_window_activate_counter = 0;
let retry_counter = 0;
// 10 minutes
const check_online_interval_ms = 1000 * 60 * 10;
function onboardPlugin(ctx, successFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        let windowState = vscode_1.window.state;
        // check if window state is focused or not and the
        // secondary_window_activate_counter is equal to zero
        if (!windowState.focused && secondary_window_activate_counter === 0) {
            // This window is not focused, call activate in 1 minute in case
            // there's another vscode editor that is focused. Allow that one
            // to activate right away.
            setTimeout(() => {
                secondary_window_activate_counter++;
                onboardPlugin(ctx, successFunction);
            }, 1000 * 5);
        }
        else {
            // check session.json existence
            const serverIsOnline = yield DataController_1.serverIsAvailable();
            if (!Util_1.softwareSessionFileExists() || !Util_1.jwtExists()) {
                // session file doesn't exist
                // check if the server is online before creating the anon user
                if (!serverIsOnline) {
                    if (retry_counter === 0) {
                        Util_1.showOfflinePrompt(true);
                    }
                    // call activate again later
                    setTimeout(() => {
                        retry_counter++;
                        onboardPlugin(ctx, successFunction);
                    }, check_online_interval_ms);
                }
                else {
                    // create the anon user
                    const result = yield createAnonymousUser();
                    if (!result) {
                        if (retry_counter === 0) {
                            Util_1.showOfflinePrompt(true);
                        }
                        // call activate again later
                        setTimeout(() => {
                            retry_counter++;
                            onboardPlugin(ctx, successFunction);
                        }, check_online_interval_ms);
                    }
                    else {
                        // send the song session init payload
                        yield sendBootstrapSongSession();
                        // initialize the rest of the plugin
                        successFunction(ctx);
                    }
                }
            }
            else {
                // has a session file, continue with initialization of the plugin
                successFunction(ctx);
            }
        }
    });
}
exports.onboardPlugin = onboardPlugin;
/**
 * create an anonymous user
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
                let resp = yield HttpClient_1.softwarePost("/data/onboard", {
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
function sendBootstrapSongSession() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileMetrics = DataController_1.getBootstrapFileMetrics();
        const nowTimes = Util_1.getNowTimes();
        const track = new cody_music_1.Track();
        track.id = "music-time-init";
        track.type = "music-time-init";
        track.uri = "music-time-init";
        track.name = "music-time-init";
        track.artist = "music-time-init";
        track["playlistId"] = "music-time-init";
        track["start"] = nowTimes.now_in_sec - 60;
        track["local_start"] = nowTimes.local_now_in_sec - 60;
        track["start"] = nowTimes.now_in_sec;
        track["local_start"] = nowTimes.local_now_in_sec;
        const songSession = Object.assign(Object.assign({}, track), fileMetrics);
        DataController_1.sendSessionPayload(songSession);
    });
}
exports.sendBootstrapSongSession = sendBootstrapSongSession;
//# sourceMappingURL=OnboardManager.js.map