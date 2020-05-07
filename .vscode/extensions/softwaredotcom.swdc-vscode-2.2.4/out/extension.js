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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const DataController_1 = require("./lib/DataController");
const OnboardManager_1 = require("./lib/user/OnboardManager");
const Util_1 = require("./lib/Util");
const HttpClient_1 = require("./lib/http/HttpClient");
const KpmRepoManager_1 = require("./lib/repo/KpmRepoManager");
const LiveshareManager_1 = require("./lib/LiveshareManager");
const vsls = require("vsls/vscode");
const command_helper_1 = require("./lib/command-helper");
const KpmManager_1 = require("./lib/managers/KpmManager");
const SummaryManager_1 = require("./lib/managers/SummaryManager");
const SessionSummaryData_1 = require("./lib/storage/SessionSummaryData");
const WallClockManager_1 = require("./lib/managers/WallClockManager");
const EventManager_1 = require("./lib/managers/EventManager");
const FileManager_1 = require("./lib/managers/FileManager");
let TELEMETRY_ON = true;
let statusBarItem = null;
let _ls = null;
let fifteen_minute_interval = null;
let twenty_minute_interval = null;
let thirty_minute_interval = null;
let hourly_interval = null;
let liveshare_update_interval = null;
const one_min_millis = 1000 * 60;
const thirty_min_millis = one_min_millis * 30;
const one_hour_millis = one_min_millis * 60;
//
// Add the keystroke controller to the ext ctx, which
// will then listen for text document changes.
//
const kpmController = KpmManager_1.KpmManager.getInstance();
function isTelemetryOn() {
    return TELEMETRY_ON;
}
exports.isTelemetryOn = isTelemetryOn;
function getStatusBarItem() {
    return statusBarItem;
}
exports.getStatusBarItem = getStatusBarItem;
function deactivate(ctx) {
    // store the deactivate event
    EventManager_1.EventManager.getInstance().createCodeTimeEvent("resource", "unload", "EditorDeactivate");
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
    // dispose the new day timer
    SummaryManager_1.SummaryManager.getInstance().dispose();
    clearInterval(fifteen_minute_interval);
    clearInterval(twenty_minute_interval);
    clearInterval(thirty_minute_interval);
    clearInterval(hourly_interval);
    clearInterval(liveshare_update_interval);
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
        // add the code time commands
        ctx.subscriptions.push(command_helper_1.createCommands(kpmController));
        const workspace_name = Util_1.getWorkspaceName();
        const eventName = `onboard-${workspace_name}`;
        // onboard the user as anonymous if it's being installed
        if (vscode_1.window.state.focused) {
            EventManager_1.EventManager.getInstance().createCodeTimeEvent("focused_onboard", eventName, "onboarding");
            OnboardManager_1.onboardInit(ctx, intializePlugin /*successFunction*/);
        }
        else {
            // 10 to 15 second delay
            const secondDelay = getRandomArbitrary(10, 15);
            const nonFocusedEventType = `nonfocused_onboard-${secondDelay}`;
            // initialize in 5 seconds if this is the secondary window
            setTimeout(() => {
                EventManager_1.EventManager.getInstance().createCodeTimeEvent(nonFocusedEventType, eventName, "onboarding");
                OnboardManager_1.onboardInit(ctx, intializePlugin /*successFunction*/);
            }, 1000 * secondDelay);
        }
    });
}
exports.activate = activate;
function getRandomArbitrary(min, max) {
    max = max + 0.1;
    return parseInt(Math.random() * (max - min) + min, 10);
}
function intializePlugin(ctx, createdAnonUser) {
    return __awaiter(this, void 0, void 0, function* () {
        Util_1.logIt(`Loaded ${Util_1.getPluginName()} v${Util_1.getVersion()}`);
        // store the activate event
        EventManager_1.EventManager.getInstance().createCodeTimeEvent("resource", "load", "EditorActivate");
        // initialize the wall clock timer
        WallClockManager_1.WallClockManager.getInstance();
        // load the last payload into memory
        FileManager_1.getLastSavedKeystrokesStats();
        const serverIsOnline = yield HttpClient_1.serverIsAvailable();
        // get the user preferences whether it's music time or code time
        // this will also fetch the user and update loggedInCacheState if it's found
        yield DataController_1.initializePreferences(serverIsOnline);
        // add the interval jobs
        initializeIntervalJobs();
        // in 30 seconds
        setTimeout(() => {
            vscode_1.commands.executeCommand("codetime.sendOfflineData");
        }, 1000 * 30);
        // in 2 minutes task
        setTimeout(() => {
            KpmRepoManager_1.getHistoricalCommits(serverIsOnline);
        }, one_min_millis * 2);
        // in 4 minutes task
        setTimeout(() => {
            FileManager_1.sendOfflineEvents();
        }, one_min_millis * 3);
        initializeLiveshare();
        // get the login status
        // {loggedIn: true|false}
        yield DataController_1.isLoggedIn();
        const initializedVscodePlugin = Util_1.getItem("vscode_CtInit");
        if (!initializedVscodePlugin) {
            Util_1.setItem("vscode_CtInit", true);
            // send a bootstrap kpm payload
            kpmController.buildBootstrapKpmPayload();
            // send a heartbeat that the plugin as been installed
            // (or the user has deleted the session.json and restarted the IDE)
            DataController_1.sendHeartbeat("INSTALLED", serverIsOnline);
            setTimeout(() => {
                vscode_1.commands.executeCommand("codetime.displayTree");
            }, 1200);
        }
        // initialize the day check timer
        SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
        // show the readme if it doesn't exist
        Util_1.displayReadmeIfNotExists();
        // show the status bar text info
        setTimeout(() => {
            statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 10);
            // add the name to the tooltip if we have it
            const name = Util_1.getItem("name");
            let tooltip = "Click to see more from Code Time";
            if (name) {
                tooltip = `${tooltip} (${name})`;
            }
            statusBarItem.tooltip = tooltip;
            // statusBarItem.command = "codetime.softwarePaletteMenu";
            statusBarItem.command = "codetime.displayTree";
            statusBarItem.show();
            // update the status bar
            SessionSummaryData_1.updateStatusBarWithSummaryData();
        }, 0);
    });
}
exports.intializePlugin = intializePlugin;
// add the interval jobs
function initializeIntervalJobs() {
    hourly_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const isonline = yield HttpClient_1.serverIsAvailable();
        DataController_1.sendHeartbeat("HOURLY", isonline);
    }), one_hour_millis);
    thirty_minute_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        const isonline = yield HttpClient_1.serverIsAvailable();
        yield KpmRepoManager_1.getHistoricalCommits(isonline);
    }), thirty_min_millis);
    twenty_minute_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        yield FileManager_1.sendOfflineEvents();
        // this will get the login status if the window is focused
        // and they're currently not a logged in
        if (vscode_1.window.state.focused) {
            const name = Util_1.getItem("name");
            // but only if checkStatus is true
            if (!name) {
                DataController_1.isLoggedIn();
            }
        }
    }), one_min_millis * 20);
    // every 15 minute tasks
    fifteen_minute_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        vscode_1.commands.executeCommand("codetime.sendOfflineData");
    }), one_min_millis * 15);
    // update liveshare in the offline kpm data if it has been initiated
    liveshare_update_interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.window.state.focused) {
            updateLiveshareTime();
        }
    }), one_min_millis);
}
function handlePauseMetricsEvent() {
    TELEMETRY_ON = false;
    Util_1.showStatus("Code Time Paused", "Enable metrics to resume");
}
function handleEnableMetricsEvent() {
    TELEMETRY_ON = true;
    Util_1.showStatus("Code Time", null);
}
function updateLiveshareTime() {
    if (_ls) {
        let nowSec = Util_1.nowInSecs();
        let diffSeconds = nowSec - parseInt(_ls["start"], 10);
        SessionSummaryData_1.setSessionSummaryLiveshareMinutes(diffSeconds * 60);
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