"use strict";
// Copyright (c) 2018 Software. All Rights Reserved.
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
const OnboardManager_1 = require("./lib/OnboardManager");
const Util_1 = require("./lib/Util");
const LiveshareManager_1 = require("./lib/LiveshareManager");
const vsls = require("vsls/vscode");
const MusicStateManager_1 = require("./lib/music/MusicStateManager");
const command_helper_1 = require("./lib/command-helper");
const OfflineManager_1 = require("./lib/OfflineManager");
const MusicManager_1 = require("./lib/music/MusicManager");
const KpmController_1 = require("./lib/KpmController");
const Constants_1 = require("./lib/Constants");
let _ls = null;
let liveshare_update_interval = null;
let gather_music_interval = null;
let check_track_end_interval = null;
let offline_data_interval = null;
function deactivate(ctx) {
    if (_ls && _ls.id) {
        // the IDE is closing, send this off
        let nowSec = Util_1.nowInSecs();
        let offsetSec = Util_1.getOffsetSeconds();
        let localNow = nowSec - offsetSec;
        // close the session on our end
        _ls["end"] = nowSec;
        _ls["local_end"] = localNow;
        LiveshareManager_1.manageLiveshareSession(_ls);
        _ls = null;
    }
    clearInterval(liveshare_update_interval);
    clearInterval(offline_data_interval);
    clearInterval(gather_music_interval);
    clearInterval(check_track_end_interval);
    // softwareDelete(`/integrations/${PLUGIN_ID}`, getItem("jwt")).then(resp => {
    //     if (isResponseOk(resp)) {
    //         if (resp.data) {
    //             console.log(`Uninstalled plugin`);
    //         } else {
    //             console.log(
    //                 "Failed to update Code Time about the uninstall event"
    //             );
    //         }
    //     }
    // });
}
exports.deactivate = deactivate;
function activate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        // has a session file, continue with initialization of the plugin
        OnboardManager_1.onboardPlugin(ctx, intializePlugin);
    });
}
exports.activate = activate;
function intializePlugin(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        Util_1.logIt(`Loaded ${Util_1.getPluginName()} v${Util_1.getVersion()}`);
        //
        // add the player commands before we show the playlist
        //
        ctx.subscriptions.push(command_helper_1.createCommands());
        // init the music manager and cody config
        const musicMgr = MusicManager_1.MusicManager.getInstance();
        // This will initialize the user and spotify
        // this needs to happen first to enable spotify playlist and control logic
        yield musicMgr.initializeSpotify();
        // check if the user has a slack integration already connected
        yield musicMgr.initializeSlack();
        // every half hour, send offline data
        const hourly_interval_ms = 1000 * 60 * 60;
        const half_hour_ms = hourly_interval_ms / 2;
        offline_data_interval = setInterval(() => {
            if (!Util_1.codeTimeExtInstalled()) {
                // send the offline code time data
                KpmController_1.KpmController.getInstance().processOfflineKeystrokes();
            }
        }, half_hour_ms / 2);
        const musicStateMgr = MusicStateManager_1.MusicStateManager.getInstance();
        // interval to check music info
        gather_music_interval = setInterval(() => {
            musicStateMgr.gatherMusicInfo();
        }, 1000 * Constants_1.DEFAULT_CURRENTLY_PLAYING_TRACK_CHECK_SECONDS);
        check_track_end_interval = setInterval(() => {
            musicStateMgr.trackEndCheck();
        }, 5000);
        setTimeout(() => {
            if (!Util_1.codeTimeExtInstalled()) {
                // send the offline code time data
                KpmController_1.KpmController.getInstance().processOfflineKeystrokes();
            }
        }, 5000);
        // show the readme if it doesn't exist
        Util_1.displayReadmeIfNotExists();
        initializeLiveshare();
    });
}
exports.intializePlugin = intializePlugin;
function updateLiveshareTime() {
    if (_ls) {
        let nowSec = Util_1.nowInSecs();
        let diffSeconds = nowSec - parseInt(_ls["start"], 10);
        OfflineManager_1.setSessionSummaryLiveshareMinutes(diffSeconds * 60);
    }
}
function initializeLiveshare() {
    return __awaiter(this, void 0, void 0, function* () {
        const liveshare = yield vsls.getApi();
        if (liveshare) {
            // {access: number, id: string, peerNumber: number, role: number, user: json}
            Util_1.logIt(`liveshare version - ${liveshare["apiVersion"]}`);
            liveshare.onDidChangeSession((event) => __awaiter(this, void 0, void 0, function* () {
                let nowSec = Util_1.nowInSecs();
                let offsetSec = Util_1.getOffsetSeconds();
                let localNow = nowSec - offsetSec;
                if (!_ls) {
                    _ls = Object.assign({}, event.session);
                    _ls["apiVesion"] = liveshare["apiVersion"];
                    _ls["start"] = nowSec;
                    _ls["local_start"] = localNow;
                    _ls["end"] = 0;
                    yield LiveshareManager_1.manageLiveshareSession(_ls);
                }
                else if (_ls && (!event || !event["id"])) {
                    updateLiveshareTime();
                    // close the session on our end
                    _ls["end"] = nowSec;
                    _ls["local_end"] = localNow;
                    yield LiveshareManager_1.manageLiveshareSession(_ls);
                    _ls = null;
                }
            }));
        }
    });
}
//# sourceMappingURL=extension.js.map