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
const Util_1 = require("../Util");
const cody_music_1 = require("cody-music");
const MusicManager_1 = require("./MusicManager");
const MusicUtil_1 = require("./MusicUtil");
const MusicDataManager_1 = require("./MusicDataManager");
// const songNameDisplayTimeoutMillis: number = 12000;
class MusicCommandManager {
    constructor() {
        // private to prevent non-singleton usage
    }
    static isLoading() {
        return this._isLoading;
    }
    /**
     * Initialize the music command manager.
     * Create the list of status bar buttons that will be displayed.
     */
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const musictimeMenuTooltip = this.getMusicMenuTooltip();
            // start with 100 0and go down in sequence
            this.createButton("🎧", musictimeMenuTooltip, "musictime.revealTree", 1000);
            this.createButton("$(settings) Loading", "updating", "musictime.progress", 999);
            this.createButton("Connect Spotify", "Connect Spotify to add your top productivity tracks.", "musictime.connectSpotify", 999);
            // play previous or unicode ⏪
            this.createButton("$(chevron-left)", "Previous", "musictime.previous", 999);
            // 998 buttons (play, pause)
            this.createButton("$(play)", "Play", "musictime.play", 998);
            // pause unicode ⏸
            this.createButton("$(primitive-square)", "Stop", "musictime.pause", 998);
            // play next ⏩
            this.createButton("$(chevron-right)", "Next", "musictime.next", 997);
            // 996 buttons (unlike, like)
            this.createButton("♡", "Like", "musictime.like", 996);
            this.createButton("♥", "Unlike", "musictime.unlike", 996);
            // button area for the current song name
            this.createButton("", "Click to view track", "musictime.currentSong", 995);
        });
    }
    static initiateProgress(progressLabel) {
        this.showProgress(progressLabel);
    }
    static syncControls(track, showLoading = false, statusOverride = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._hideSongTimeout) {
                clearTimeout(this._hideSongTimeout);
            }
            const trackStatus = track ? track.state : cody_music_1.TrackStatus.NotAssigned;
            const { needsSpotifyAccess, foundDevice } = yield this.getSpotifyState();
            let pauseIt = trackStatus === cody_music_1.TrackStatus.Playing;
            let playIt = trackStatus === cody_music_1.TrackStatus.Paused;
            if (statusOverride) {
                if (statusOverride === cody_music_1.TrackStatus.Playing) {
                    playIt = false;
                    pauseIt = true;
                }
                else {
                    playIt = true;
                    pauseIt = false;
                }
            }
            this._isLoading = showLoading;
            if (!needsSpotifyAccess && foundDevice && (pauseIt || playIt)) {
                if (pauseIt) {
                    this.showPauseControls(track);
                }
                else {
                    this.showPlayControls(track);
                }
            }
            else {
                this.showLaunchPlayerControls();
            }
        });
    }
    /**
     * Create a status bar button
     * @param text
     * @param tooltip
     * @param command
     * @param priority
     */
    static createButton(text, tooltip, command, priority) {
        let statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, priority);
        statusBarItem.text = text;
        statusBarItem.command = command;
        statusBarItem.tooltip = tooltip;
        let button = {
            id: command,
            statusBarItem,
            tooltip: tooltip,
        };
        this._buttons.push(button);
    }
    static showLoadingTrack() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._buttons || this._buttons.length === 0) {
                return;
            }
            this._isLoading = true;
            // hide all except for the launch player button and possibly connect spotify button
            this._buttons = this._buttons.map((button) => {
                const btnCmd = button.statusBarItem.command;
                const isMusicTimeMenuButton = btnCmd === "musictime.revealTree";
                const isProgressButton = btnCmd === "musictime.progress";
                if (isMusicTimeMenuButton || isProgressButton) {
                    if (isMusicTimeMenuButton) {
                        button.tooltip = this.getMusicMenuTooltip();
                    }
                    // always show the headphones button for the launch controls function
                    button.statusBarItem.show();
                }
                else {
                    // hide the rest
                    button.statusBarItem.hide();
                }
                return button;
            });
        });
    }
    /**
     * Show launch is when the user needs to connect to spotify
     */
    static showLaunchPlayerControls() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._buttons || this._buttons.length === 0) {
                return;
            }
            const { needsSpotifyAccess, showPremiumRequired } = yield this.getSpotifyState();
            // hide all except for the launch player button and possibly connect spotify button
            this._buttons = this._buttons.map((button) => {
                const btnCmd = button.statusBarItem.command;
                const isMusicTimeMenuButton = btnCmd === "musictime.revealTree";
                const isConnectSpotifyButton = button.statusBarItem.text === "Connect Spotify";
                if (isMusicTimeMenuButton) {
                    button.tooltip = this.getMusicMenuTooltip();
                    // always show the headphones button for the launch controls function
                    button.statusBarItem.show();
                }
                else if (isConnectSpotifyButton && needsSpotifyAccess) {
                    // show the connect button
                    button.statusBarItem.show();
                }
                else {
                    // hide the rest
                    button.statusBarItem.hide();
                }
                return button;
            });
        });
    }
    /**
     * Show the buttons to play a track
     * @param trackInfo
     */
    static showPlayControls(trackInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._buttons || this._buttons.length === 0) {
                return;
            }
            const songInfo = trackInfo ? `${trackInfo.name} (${trackInfo.artist})` : null;
            const isLiked = MusicDataManager_1.MusicDataManager.getInstance().isLikedTrack(trackInfo.id);
            this._buttons.map((button) => {
                const btnCmd = button.statusBarItem.command;
                const isMusicTimeMenuButton = btnCmd === "musictime.revealTree";
                const isPlayButton = btnCmd === "musictime.play";
                const isLikedButton = btnCmd === "musictime.like";
                const isUnLikedButton = btnCmd === "musictime.unlike";
                const currentSongButton = btnCmd === "musictime.currentSong";
                const isPrevButton = btnCmd === "musictime.previous";
                const isNextButton = btnCmd === "musictime.next";
                if (isMusicTimeMenuButton || isPrevButton || isNextButton) {
                    if (isMusicTimeMenuButton) {
                        button.tooltip = this.getMusicMenuTooltip();
                    }
                    // always show the headphones menu icon
                    button.statusBarItem.show();
                }
                else if (isLikedButton) {
                    if (isLiked) {
                        button.statusBarItem.hide();
                    }
                    else {
                        button.statusBarItem.show();
                    }
                }
                else if (isUnLikedButton) {
                    if (isLiked) {
                        button.statusBarItem.show();
                    }
                    else {
                        button.statusBarItem.hide();
                    }
                }
                else if (currentSongButton) {
                    button.statusBarItem.tooltip = `(${trackInfo.name}) ${button.tooltip}`;
                    button.statusBarItem.text = Util_1.getSongDisplayName(trackInfo.name);
                    button.statusBarItem.show();
                }
                else if (isPlayButton) {
                    if (songInfo) {
                        // show the song info over the play button
                        button.statusBarItem.tooltip = `${button.tooltip} - ${songInfo}`;
                    }
                    button.statusBarItem.show();
                }
                else {
                    button.statusBarItem.hide();
                }
            });
        });
    }
    /**
     * Show the buttons to pause a track
     * @param trackInfo
     */
    static showPauseControls(trackInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._buttons || this._buttons.length === 0) {
                return;
            }
            const songInfo = trackInfo ? `${trackInfo.name} (${trackInfo.artist})` : null;
            const isLiked = MusicDataManager_1.MusicDataManager.getInstance().isLikedTrack(trackInfo.id);
            this._buttons.map((button) => {
                const btnCmd = button.statusBarItem.command;
                const isMusicTimeMenuButton = btnCmd === "musictime.revealTree";
                const isPauseButton = btnCmd === "musictime.pause";
                const isLikedButton = btnCmd === "musictime.like";
                const isUnLikedButton = btnCmd === "musictime.unlike";
                const currentSongButton = btnCmd === "musictime.currentSong";
                const isPrevButton = btnCmd === "musictime.previous";
                const isNextButton = btnCmd === "musictime.next";
                if (isMusicTimeMenuButton || isPrevButton || isNextButton) {
                    if (isMusicTimeMenuButton) {
                        button.tooltip = this.getMusicMenuTooltip();
                    }
                    // always show the headphones menu icon
                    button.statusBarItem.show();
                }
                else if (isLikedButton) {
                    if (isLiked) {
                        button.statusBarItem.hide();
                    }
                    else {
                        button.statusBarItem.show();
                    }
                }
                else if (isUnLikedButton) {
                    if (isLiked) {
                        button.statusBarItem.show();
                    }
                    else {
                        button.statusBarItem.hide();
                    }
                }
                else if (currentSongButton) {
                    button.statusBarItem.tooltip = `(${trackInfo.name}) ${button.tooltip}`;
                    button.statusBarItem.text = Util_1.getSongDisplayName(trackInfo.name);
                    button.statusBarItem.show();
                }
                else if (isPauseButton) {
                    if (songInfo) {
                        button.statusBarItem.tooltip = `${button.tooltip} - ${songInfo}`;
                    }
                    button.statusBarItem.show();
                }
                else {
                    button.statusBarItem.hide();
                }
            });
        });
    }
    static showProgress(progressLabel) {
        this._buttons.map((button) => {
            const btnCmd = button.statusBarItem.command;
            const isMusicTimeMenuButton = btnCmd === "musictime.revealTree";
            const isMusicTimeProgress = btnCmd === "musictime.progress";
            if (isMusicTimeMenuButton || isMusicTimeProgress) {
                if (isMusicTimeMenuButton) {
                    button.tooltip = this.getMusicMenuTooltip();
                }
                // if (isMusicTimeProgress) {
                //     button.statusBarItem.text = progressLabel;
                // }
                // show progress and headphones menu buttons
                button.statusBarItem.show();
            }
            else {
                // hide the rest
                button.statusBarItem.hide();
            }
        });
    }
    static getMusicMenuTooltip() {
        const name = Util_1.getItem("name");
        const needsSpotifyAccess = MusicUtil_1.requiresSpotifyAccess();
        if (needsSpotifyAccess) {
            return "Connect Spotify";
        }
        let musicTimeTooltip = "Click to see more from Music Time";
        if (name) {
            musicTimeTooltip = `${musicTimeTooltip} (${name})`;
        }
        return musicTimeTooltip;
    }
    static getSpotifyState() {
        return __awaiter(this, void 0, void 0, function* () {
            const musicMgr = MusicManager_1.MusicManager.getInstance();
            const needsSpotifyAccess = MusicUtil_1.requiresSpotifyAccess();
            const hasSpotifyPlaybackAccess = musicMgr.hasSpotifyPlaybackAccess();
            const hasSpotifyUser = musicMgr.hasSpotifyUser();
            const foundDevice = MusicUtil_1.getDeviceId() ? true : false;
            const showPremiumRequired = Util_1.isMac() && !hasSpotifyPlaybackAccess && hasSpotifyUser;
            return {
                needsSpotifyAccess,
                showPremiumRequired,
                foundDevice,
            };
        });
    }
}
exports.MusicCommandManager = MusicCommandManager;
MusicCommandManager._buttons = [];
MusicCommandManager._hideSongTimeout = null;
MusicCommandManager._isLoading = false;
//# sourceMappingURL=MusicCommandManager.js.map