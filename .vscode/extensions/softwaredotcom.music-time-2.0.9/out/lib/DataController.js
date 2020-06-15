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
const HttpClient_1 = require("./HttpClient");
const Util_1 = require("./Util");
const cody_music_1 = require("cody-music");
const MusicManager_1 = require("./music/MusicManager");
const MusicDataManager_1 = require("./music/MusicDataManager");
const CacheManager_1 = require("./cache/CacheManager");
const MusicCommandUtil_1 = require("./music/MusicCommandUtil");
const MusicCommandManager_1 = require("./music/MusicCommandManager");
const MusicStateManager_1 = require("./music/MusicStateManager");
const MusicUtil_1 = require("./music/MusicUtil");
const moment = require("moment-timezone");
const cacheMgr = CacheManager_1.CacheManager.getInstance();
let loggedInCacheState = null;
let toggleFileEventLogging = null;
let slackFetchTimeout = null;
let spotifyFetchTimeout = null;
let currentDayHour = null;
function isNewHour() {
    const dayHr = moment().format("YYYY-MM-DD-HH");
    if (!currentDayHour || dayHr !== currentDayHour) {
        currentDayHour = dayHr;
        return true;
    }
    return false;
}
exports.isNewHour = isNewHour;
function getLoggedInCacheState() {
    return loggedInCacheState;
}
exports.getLoggedInCacheState = getLoggedInCacheState;
function getToggleFileEventLoggingState() {
    if (toggleFileEventLogging === null) {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
    }
    return toggleFileEventLogging;
}
exports.getToggleFileEventLoggingState = getToggleFileEventLoggingState;
function serverIsAvailable() {
    return __awaiter(this, void 0, void 0, function* () {
        let serverAvailable = cacheMgr.get("serverAvailable") || null;
        if (serverAvailable === null) {
            serverAvailable = yield HttpClient_1.softwareGet("/ping", null)
                .then((result) => {
                return HttpClient_1.isResponseOk(result);
            })
                .catch((e) => {
                return false;
            });
        }
        if (serverAvailable !== null) {
            cacheMgr.set("serverAvailable", serverAvailable);
        }
        return serverAvailable;
    });
}
exports.serverIsAvailable = serverIsAvailable;
function sendBatchPayload(batch) {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient_1.softwarePost("/data/batch", batch, Util_1.getItem("jwt")).catch((e) => {
            Util_1.logIt(`Unable to send plugin data batch, error: ${e.message}`);
        });
    });
}
exports.sendBatchPayload = sendBatchPayload;
/**
 * send any music tracks
 */
function sendMusicData(trackData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (trackData.available_markets) {
            delete trackData.available_markets;
        }
        if (trackData.images) {
            delete trackData.images;
        }
        if (trackData.external_urls) {
            delete trackData.external_urls;
        }
        if (trackData.href) {
            delete trackData.href;
        }
        Util_1.logIt(`sending song session {song: ${trackData.name}, start: ${trackData.start}, end: ${trackData.end}}`);
        // add the "local_start", "start", and "end"
        // POST the kpm to the PluginManager
        sendSessionPayload(trackData);
    });
}
exports.sendMusicData = sendMusicData;
/**
 * get the app jwt
 */
function getAppJwt() {
    return __awaiter(this, void 0, void 0, function* () {
        // get the app jwt
        let resp = yield HttpClient_1.softwareGet(`/data/apptoken?token=${Util_1.nowInSecs()}`, null);
        if (HttpClient_1.isResponseOk(resp)) {
            return resp.data.jwt;
        }
        return null;
    });
}
exports.getAppJwt = getAppJwt;
function getSlackOauth() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (jwt) {
            let user = yield getUser(jwt);
            if (user && user.auths) {
                // get the one that is "slack"
                for (let i = 0; i < user.auths.length; i++) {
                    if (user.auths[i].type === "slack") {
                        yield MusicManager_1.MusicManager.getInstance().updateSlackAccessInfo(user.auths[i]);
                        return user.auths[i];
                    }
                }
            }
        }
    });
}
exports.getSlackOauth = getSlackOauth;
function getMusicTimeUserStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        // We don't have a user yet, check the users via the plugin/state
        const jwt = Util_1.getItem("jwt");
        const spotify_refresh_token = Util_1.getItem("spotify_refresh_token");
        if (jwt) {
            const api = "/users/plugin/state";
            const resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp) && resp.data) {
                // NOT_FOUND, ANONYMOUS, OK, UNKNOWN
                const state = resp.data.state ? resp.data.state : "UNKNOWN";
                if (state === "OK") {
                    /**
                     * stateData only contains:
                     * {email, jwt, state}
                     */
                    const stateData = resp.data;
                    if (stateData.email) {
                        Util_1.setItem("name", stateData.email);
                    }
                    // check the jwt
                    if (stateData.jwt) {
                        // update it
                        Util_1.setItem("jwt", stateData.jwt);
                    }
                    // get the user from the payload
                    const user = resp.data.user;
                    let foundSpotifyAuth = false;
                    const musicMgr = MusicManager_1.MusicManager.getInstance();
                    if (user.auths && user.auths.length > 0) {
                        for (let i = 0; i < user.auths.length; i++) {
                            const auth = user.auths[i];
                            // update the spotify access info if the auth matches
                            if (auth.type === "spotify" && auth.access_token) {
                                foundSpotifyAuth = true;
                                // update spotify access info
                                yield musicMgr.updateSpotifyAccessInfo(auth);
                            }
                            else if (user.auths[i].type === "slack") {
                                // update slack connection
                                yield musicMgr.updateSlackAccessInfo(auth);
                            }
                        }
                    }
                    return { loggedOn: foundSpotifyAuth, state };
                }
                // return the state that is returned
                return { loggedOn: false, state };
            }
        }
        return { loggedOn: false, state: "UNKNOWN" };
    });
}
exports.getMusicTimeUserStatus = getMusicTimeUserStatus;
function getUser(jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (jwt) {
            let api = `/users/me`;
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp)) {
                if (resp && resp.data && resp.data.data) {
                    const user = resp.data.data;
                    return user;
                }
            }
        }
        return null;
    });
}
exports.getUser = getUser;
function refetchSlackConnectStatusLazily(tryCountUntilFound = 40) {
    if (slackFetchTimeout) {
        return;
    }
    slackFetchTimeout = setTimeout(() => {
        slackFetchTimeout = null;
        slackConnectStatusHandler(tryCountUntilFound);
    }, 10000);
}
exports.refetchSlackConnectStatusLazily = refetchSlackConnectStatusLazily;
function slackConnectStatusHandler(tryCountUntilFound) {
    return __awaiter(this, void 0, void 0, function* () {
        let oauth = yield getSlackOauth();
        if (!oauth) {
            // try again if the count is not zero
            if (tryCountUntilFound > 0) {
                tryCountUntilFound -= 1;
                refetchSlackConnectStatusLazily(tryCountUntilFound);
            }
        }
        else {
            vscode_1.window.showInformationMessage(`Successfully connected to Slack`);
        }
    });
}
function refetchSpotifyConnectStatusLazily(tryCountUntilFound = 40) {
    if (spotifyFetchTimeout) {
        return;
    }
    spotifyFetchTimeout = setTimeout(() => {
        spotifyFetchTimeout = null;
        spotifyConnectStatusHandler(tryCountUntilFound);
    }, 10000);
}
exports.refetchSpotifyConnectStatusLazily = refetchSpotifyConnectStatusLazily;
function spotifyConnectStatusHandler(tryCountUntilFound) {
    return __awaiter(this, void 0, void 0, function* () {
        let oauthResult = yield getMusicTimeUserStatus();
        if (!oauthResult.loggedOn) {
            // try again if the count is not zero
            if (tryCountUntilFound > 0) {
                tryCountUntilFound -= 1;
                refetchSpotifyConnectStatusLazily(tryCountUntilFound);
            }
        }
        else {
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            Util_1.setItem("requiresSpotifyReAuth", false);
            // update the login status
            // await getUserStatus(serverIsOnline, true /*ignoreCache*/);
            vscode_1.window.showInformationMessage(`Successfully connected to Spotify. Loading playlists...`);
            // first get the spotify user
            yield populateSpotifyUser();
            // only add the "Liked Songs" playlist if there are tracks found in that playlist
            yield populateLikedSongs();
            // --async-- send the top spotify songs from the users playlists to help seed song sessions
            seedLikedSongSessions();
            // initiate the playlist build
            setTimeout(() => {
                vscode_1.commands.executeCommand("musictime.hardRefreshPlaylist");
            }, 2000);
        }
    });
}
function populateSpotifyUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
        if (!MusicUtil_1.requiresSpotifyAccess() &&
            (!dataMgr.spotifyUser || !dataMgr.spotifyUser.id)) {
            // get the user
            dataMgr.spotifyUser = yield cody_music_1.getUserProfile();
            yield MusicCommandUtil_1.MusicCommandUtil.getInstance().checkIfAccessExpired(dataMgr.spotifyUser);
        }
    });
}
exports.populateSpotifyUser = populateSpotifyUser;
function populateLikedSongs() {
    return __awaiter(this, void 0, void 0, function* () {
        MusicDataManager_1.MusicDataManager.getInstance().spotifyLikedSongs = yield cody_music_1.getSpotifyLikedSongs();
    });
}
exports.populateLikedSongs = populateLikedSongs;
function populatePlayerContext() {
    return __awaiter(this, void 0, void 0, function* () {
        const spotifyContext = yield cody_music_1.getSpotifyPlayerContext();
        MusicDataManager_1.MusicDataManager.getInstance().spotifyContext = spotifyContext;
        MusicCommandManager_1.MusicCommandManager.syncControls(MusicDataManager_1.MusicDataManager.getInstance().runningTrack, false);
    });
}
exports.populatePlayerContext = populatePlayerContext;
function populateSpotifyPlaylists() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
        // reconcile playlists
        dataMgr.reconcilePlaylists();
        // clear out the raw and orig playlists
        dataMgr.origRawPlaylistOrder = [];
        dataMgr.rawPlaylists = [];
        // fire off the populate spotify devices
        yield populateSpotifyDevices();
        // fetch music time app saved playlists
        yield dataMgr.fetchSavedPlaylists();
        // fetch the playlists from spotify
        const rawPlaylists = yield MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.getPlaylists, [
            cody_music_1.PlayerName.SpotifyWeb,
            {
                all: true,
            },
        ]);
        // set the list of playlistIds based on this current order
        if (rawPlaylists && rawPlaylists.status && rawPlaylists.status >= 400) {
            // try again in a few seconds
            setTimeout(() => {
                populateSpotifyPlaylists();
            }, 3000);
        }
        else {
            dataMgr.origRawPlaylistOrder = [...rawPlaylists];
            dataMgr.rawPlaylists = rawPlaylists;
        }
        // populate generated playlists
        yield dataMgr.populateGeneratedPlaylists();
        // populate player context
        yield populatePlayerContext();
    });
}
exports.populateSpotifyPlaylists = populateSpotifyPlaylists;
function populateSpotifyDevices(tries = 2) {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = yield MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.getSpotifyDevices);
        if (devices && devices.status && devices.status === 429) {
            // leave the current device set alone
            // but try this function again in 7 seconds
            if (tries > 0) {
                tries--;
                setTimeout(() => {
                    populateSpotifyDevices();
                }, 7000);
            }
            return;
        }
        MusicDataManager_1.MusicDataManager.getInstance().currentDevices = devices;
        // gather music to start things off
        setTimeout(() => {
            MusicStateManager_1.MusicStateManager.getInstance().gatherMusicInfoRequest();
            // refresh the playlist to show the device button update
            vscode_1.commands.executeCommand("musictime.refreshPlaylist");
        }, 1000);
    });
}
exports.populateSpotifyDevices = populateSpotifyDevices;
function getBootstrapFileMetrics() {
    const fileMetrics = {
        add: 0,
        paste: 0,
        delete: 0,
        netkeys: 0,
        linesAdded: 0,
        linesRemoved: 0,
        open: 0,
        close: 0,
        keystrokes: 0,
        syntax: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        offset: Util_1.getOffsetSeconds() / 60,
        pluginId: Util_1.getPluginId(),
        os: Util_1.getOs(),
        version: Util_1.getVersion(),
        source: [],
        repoFileCount: 0,
        repoContributorCount: 0,
    };
    return fileMetrics;
}
exports.getBootstrapFileMetrics = getBootstrapFileMetrics;
function seedLikedSongSessions() {
    return __awaiter(this, void 0, void 0, function* () {
        const pluginInfo = {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            offset_minutes: Util_1.getOffsetSeconds() / 60,
            pluginId: Util_1.getPluginId(),
            os: Util_1.getOs(),
            version: Util_1.getVersion(),
        };
        const api = `/music/onboard`;
        HttpClient_1.softwarePost(api, pluginInfo, Util_1.getItem("jwt"));
    });
}
function sendSessionPayload(songSession) {
    return __awaiter(this, void 0, void 0, function* () {
        let api = `/music/session`;
        return HttpClient_1.softwarePost(api, songSession, Util_1.getItem("jwt"))
            .then((resp) => {
            if (!HttpClient_1.isResponseOk(resp)) {
                return { status: "fail" };
            }
            return { status: "ok" };
        })
            .catch((e) => {
            return { status: "fail" };
        });
    });
}
exports.sendSessionPayload = sendSessionPayload;
function sendHeartbeat(reason, serverIsOnline) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = Util_1.getItem("jwt");
        const hostname = yield Util_1.getHostname();
        if (serverIsOnline && jwt) {
            let heartbeat = {
                pluginId: Util_1.getPluginId(),
                os: Util_1.getOs(),
                start: Util_1.nowInSecs(),
                version: Util_1.getVersion(),
                hostname,
                session_ctime: Util_1.getSessionFileCreateTime(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                trigger_annotation: reason,
                editor_token: Util_1.getEditorSessionToken(),
            };
            let api = `/data/heartbeat`;
            HttpClient_1.softwarePost(api, heartbeat, jwt).then((resp) => __awaiter(this, void 0, void 0, function* () {
                if (!HttpClient_1.isResponseOk(resp)) {
                    Util_1.logIt("unable to send heartbeat ping");
                }
            }));
        }
    });
}
exports.sendHeartbeat = sendHeartbeat;
//# sourceMappingURL=DataController.js.map