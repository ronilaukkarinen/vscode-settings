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
const cody_music_1 = require("cody-music");
const vscode_1 = require("vscode");
const MusicCommandManager_1 = require("./MusicCommandManager");
const MenuManager_1 = require("../MenuManager");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const HttpClient_1 = require("../HttpClient");
const Constants_1 = require("../Constants");
const MusicStateManager_1 = require("./MusicStateManager");
const SocialShareManager_1 = require("../social/SocialShareManager");
const os_1 = require("os");
const SlackControlManager_1 = require("../slack/SlackControlManager");
const MusicManager_1 = require("./MusicManager");
const MusicPlaylistManager_1 = require("./MusicPlaylistManager");
const MusicUtil_1 = require("./MusicUtil");
const MusicDataManager_1 = require("./MusicDataManager");
const MusicCommandUtil_1 = require("./MusicCommandUtil");
const moment = require("moment-timezone");
const clipboardy = require("clipboardy");
const fs = require("fs");
const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
const NO_DATA = "MUSIC TIME\n\nNo data available\n";
let lastDayOfMonth = -1;
let fetchingMusicTimeMetrics = false;
class MusicControlManager {
    constructor() {
        this.currentTrackToAdd = null;
        this.musicCmdUtil = MusicCommandUtil_1.MusicCommandUtil.getInstance();
        this.stateMgr = MusicStateManager_1.MusicStateManager.getInstance();
        //
    }
    static getInstance() {
        if (!MusicControlManager.instance) {
            MusicControlManager.instance = new MusicControlManager();
        }
        return MusicControlManager.instance;
    }
    isLikedSongPlaylist() {
        return dataMgr.selectedPlaylist &&
            dataMgr.selectedPlaylist.id == Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME
            ? true
            : false;
    }
    nextSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasSpotifyPlaybackAccess = MusicManager_1.MusicManager.getInstance().hasSpotifyPlaybackAccess();
            if (hasSpotifyPlaybackAccess) {
                if (this.isLikedSongPlaylist()) {
                    yield MusicManager_1.MusicManager.getInstance().playNextLikedSong();
                }
                else {
                    const playerName = MusicManager_1.MusicManager.getInstance().getPlayerNameForPlayback();
                    yield cody_music_1.next(playerName);
                }
            }
            else {
                if (this.isLikedSongPlaylist()) {
                    yield MusicManager_1.MusicManager.getInstance().playNextLikedSong();
                }
                else {
                    yield cody_music_1.next(cody_music_1.PlayerName.SpotifyDesktop);
                }
            }
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    previousSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasSpotifyPlaybackAccess = MusicManager_1.MusicManager.getInstance().hasSpotifyPlaybackAccess();
            if (hasSpotifyPlaybackAccess) {
                if (this.isLikedSongPlaylist()) {
                    yield MusicManager_1.MusicManager.getInstance().playPreviousLikedSong();
                }
                else {
                    const playerName = MusicManager_1.MusicManager.getInstance().getPlayerNameForPlayback();
                    yield this.musicCmdUtil.runSpotifyCommand(cody_music_1.previous, [playerName]);
                }
            }
            else {
                if (this.isLikedSongPlaylist()) {
                    yield MusicManager_1.MusicManager.getInstance().playPreviousLikedSong();
                }
                else {
                    yield cody_music_1.previous(cody_music_1.PlayerName.SpotifyDesktop);
                }
            }
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    /**
     * {status, state, statusText, message, data.status, error}
     */
    playSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const musicMgr = MusicManager_1.MusicManager.getInstance();
            const hasSpotifyPlaybackAccess = musicMgr.hasSpotifyPlaybackAccess();
            const isMacDesktopEnabled = musicMgr.isMacDesktopEnabled();
            let result = null;
            if (isMacDesktopEnabled || !hasSpotifyPlaybackAccess) {
                result = yield cody_music_1.play(cody_music_1.PlayerName.SpotifyDesktop);
            }
            else {
                result = yield cody_music_1.play(cody_music_1.PlayerName.SpotifyWeb);
            }
            if (result && (result.status < 300 || result === "ok")) {
                MusicCommandManager_1.MusicCommandManager.syncControls(dataMgr.runningTrack, true, cody_music_1.TrackStatus.Playing);
            }
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    pauseSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const musicMgr = MusicManager_1.MusicManager.getInstance();
            const hasSpotifyPlaybackAccess = musicMgr.hasSpotifyPlaybackAccess();
            const isMacDesktopEnabled = musicMgr.isMacDesktopEnabled();
            let result = null;
            if (isMacDesktopEnabled || !hasSpotifyPlaybackAccess) {
                result = yield cody_music_1.pause(cody_music_1.PlayerName.SpotifyDesktop);
            }
            else {
                result = yield cody_music_1.pause(cody_music_1.PlayerName.SpotifyWeb);
            }
            if (result && (result.status < 300 || result === "ok")) {
                MusicCommandManager_1.MusicCommandManager.syncControls(dataMgr.runningTrack, true, cody_music_1.TrackStatus.Paused);
            }
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setShuffleOn() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            yield cody_music_1.setShuffle(cody_music_1.PlayerName.SpotifyWeb, true, deviceId);
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setShuffleOff() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            yield cody_music_1.setShuffle(cody_music_1.PlayerName.SpotifyWeb, false, deviceId);
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setRepeatTrackOn() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            yield cody_music_1.setRepeatTrack(cody_music_1.PlayerName.SpotifyWeb, deviceId);
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setRepeatPlaylistOn() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            yield cody_music_1.setRepeatPlaylist(cody_music_1.PlayerName.SpotifyWeb, deviceId);
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setRepeatOnOff(setToOn) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = null;
            if (setToOn) {
                result = yield cody_music_1.repeatOn(cody_music_1.PlayerName.SpotifyWeb);
            }
            else {
                result = yield cody_music_1.repeatOff(cody_music_1.PlayerName.SpotifyWeb);
            }
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 500);
        });
    }
    setMuteOn() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            // todo: implement
        });
    }
    setMuteOff() {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            // todo: implement
        });
    }
    /**
     * Launch and play a spotify track via the web player.
     * @param isTrack boolean
     */
    playSpotifyWebPlaylistTrack(isTrack, devices) {
        return __awaiter(this, void 0, void 0, function* () {
            const trackRepeating = yield MusicManager_1.MusicManager.getInstance().isTrackRepeating();
            // get the selected playlist
            const selectedPlaylist = dataMgr.selectedPlaylist;
            // get the selected track
            const selectedTrack = dataMgr.selectedTrackItem;
            const isLikedSongsPlaylist = selectedPlaylist.name === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME;
            const playlistId = isLikedSongsPlaylist ? "" : selectedPlaylist.id;
            if (isLikedSongsPlaylist) {
                yield this.playSpotifyByTrack(selectedTrack, devices);
            }
            else if (isTrack) {
                yield this.playSpotifyByTrackAndPlaylist(playlistId, selectedTrack.id);
            }
            else {
                // play the playlist
                yield this.playSpotifyByTrackAndPlaylist(playlistId, "");
            }
            setTimeout(() => {
                if (trackRepeating) {
                    // make sure it set to repeat
                    vscode_1.commands.executeCommand("musictime.repeatOn");
                }
                else {
                    // set it to not repeat
                    vscode_1.commands.executeCommand("musictime.repeatOff");
                }
                setTimeout(() => {
                    this.stateMgr.gatherMusicInfo();
                }, 500);
            }, 2000);
        });
    }
    /**
     * Helper function to play a track or playlist if we've determined to play
     * against the mac spotify desktop app.
     */
    playSpotifyDesktopPlaylistTrack(devices) {
        return __awaiter(this, void 0, void 0, function* () {
            const trackRepeating = yield MusicManager_1.MusicManager.getInstance().isTrackRepeating();
            // get the selected playlist
            const selectedPlaylist = dataMgr.selectedPlaylist;
            const isPrem = yield MusicManager_1.MusicManager.getInstance().isSpotifyPremium();
            const isWin = Util_1.isWindows();
            // get the selected track
            const selectedTrack = dataMgr.selectedTrackItem;
            const isLikedSongsPlaylist = selectedPlaylist.name === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME;
            if (isLikedSongsPlaylist) {
                if ((!isWin || isPrem) && devices && devices.length > 0) {
                    // just play the 1st track
                    this.playSpotifyByTrack(selectedTrack, devices);
                }
                else if (!isWin) {
                    // try with the desktop app
                    cody_music_1.playSpotifyMacDesktopTrack(selectedTrack.id);
                }
                else {
                    // just try to play it since it's windows and we don't have a device
                    cody_music_1.playSpotifyTrack(selectedTrack.id, "");
                }
            }
            else {
                if (!isWin) {
                    // ex: ["spotify:track:0R8P9KfGJCDULmlEoBagcO", "spotify:playlist:6ZG5lRT77aJ3btmArcykra"]
                    // make sure the track has spotify:track and the playlist has spotify:playlist
                    cody_music_1.playSpotifyMacDesktopTrack(selectedTrack.id, selectedPlaylist.id);
                }
                else {
                    this.playSpotifyByTrackAndPlaylist(selectedPlaylist.id, selectedTrack.id);
                }
            }
            setTimeout(() => {
                if (trackRepeating) {
                    // make sure it set to repeat
                    vscode_1.commands.executeCommand("musictime.repeatOn");
                }
                else {
                    // set it to not repeat
                    vscode_1.commands.executeCommand("musictime.repeatOff");
                }
                setTimeout(() => {
                    this.stateMgr.gatherMusicInfo();
                }, 500);
            }, 2000);
        });
    }
    playSpotifyByTrackAndPlaylist(playlistId, trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
            const deviceId = activeDevice ? activeDevice.id : "";
            // just play the 1st track
            yield cody_music_1.playSpotifyPlaylist(playlistId, trackId, deviceId);
        });
    }
    playSpotifyByTrack(track, devices = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceId = MusicUtil_1.getDeviceId();
            if (deviceId) {
                cody_music_1.playSpotifyTrack(track.id, deviceId);
            }
            else if (!Util_1.isWindows()) {
                // try with the desktop app
                cody_music_1.playSpotifyMacDesktopTrack(track.id);
            }
            else {
                // just try to play it without the device
                cody_music_1.playSpotifyTrack(track.id, "");
            }
        });
    }
    setLiked(liked, overrideTrack = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverIsOnline = yield DataController_1.serverIsAvailable();
            const runningTrack = dataMgr.runningTrack;
            const track = !overrideTrack ? runningTrack : overrideTrack;
            if (!serverIsOnline || !track || !track.id) {
                vscode_1.window.showInformationMessage(`Our service is temporarily unavailable.\n\nPlease try again later.\n`);
                return;
            }
            if (track.playerType === cody_music_1.PlayerType.MacItunesDesktop) {
                // await so that the stateCheckHandler fetches
                // the latest version of the itunes track
                yield cody_music_1.setItunesLoved(liked).catch((err) => {
                    Util_1.logIt(`Error updating itunes loved state: ${err.message}`);
                });
            }
            else {
                // save the spotify track to the users liked songs playlist
                if (liked) {
                    yield cody_music_1.saveToSpotifyLiked([track.id]);
                }
                else {
                    yield cody_music_1.removeFromSpotifyLiked([track.id]);
                }
                // clear the liked songs
                MusicDataManager_1.MusicDataManager.getInstance().spotifyLikedSongs = [];
                // repopulate the liked songs
                yield DataController_1.populateLikedSongs();
            }
            runningTrack.loved = liked;
            dataMgr.runningTrack = runningTrack;
            MusicCommandManager_1.MusicCommandManager.syncControls(runningTrack, false);
            let type = "spotify";
            if (track.playerType === cody_music_1.PlayerType.MacItunesDesktop) {
                type = "itunes";
            }
            const api = `/music/liked/track/${track.id}?type=${type}`;
            const resp = yield HttpClient_1.softwarePut(api, { liked }, Util_1.getItem("jwt"));
            if (!HttpClient_1.isResponseOk(resp)) {
                Util_1.logIt(`Error updating track like state: ${resp.message}`);
            }
            // check if it's in the recommendation list
            const foundRecTrack = dataMgr.recommendationTracks.find((t) => t.id === track.id);
            if (foundRecTrack) {
                dataMgr.removeTrackFromRecommendations(track.id);
                vscode_1.commands.executeCommand("musictime.refreshRecommendationsTree");
            }
            // refresh
            vscode_1.commands.executeCommand("musictime.refreshPlaylist");
            setTimeout(() => {
                this.stateMgr.gatherMusicInfo();
            }, 1000);
        });
    }
    copySpotifyLink(id, isPlaylist) {
        return __awaiter(this, void 0, void 0, function* () {
            let link = buildSpotifyLink(id, isPlaylist);
            if (id === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
                link = "https://open.spotify.com/collection/tracks";
            }
            let messageContext = "";
            if (isPlaylist) {
                messageContext = "playlist";
            }
            else {
                messageContext = "track";
            }
            try {
                clipboardy.writeSync(link);
                vscode_1.window.showInformationMessage(`Spotify ${messageContext} link copied to clipboard.`);
            }
            catch (err) {
                Util_1.logIt(`Unable to copy to clipboard, error: ${err.message}`);
            }
        });
    }
    copyCurrentTrackLink() {
        // example: https://open.spotify.com/track/7fa9MBXhVfQ8P8Df9OEbD8
        // get the current track
        const selectedItem = dataMgr.selectedTrackItem;
        this.copySpotifyLink(selectedItem.id, false);
    }
    copyCurrentPlaylistLink() {
        // example: https://open.spotify.com/playlist/0mwG8hCL4scWi8Nkt7jyoV
        const selectedItem = dataMgr.selectedPlaylist;
        this.copySpotifyLink(selectedItem.id, true);
    }
    shareCurrentPlaylist() {
        const socialShare = SocialShareManager_1.SocialShareManager.getInstance();
        const selectedItem = dataMgr.selectedPlaylist;
        const url = buildSpotifyLink(selectedItem.id, true);
        socialShare.shareIt("facebook", { u: url, hashtag: "OneOfMyFavs" });
    }
    showMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            let serverIsOnline = yield DataController_1.serverIsAvailable();
            let menuOptions = {
                items: [],
            };
            // check if they need to connect to spotify
            const needsSpotifyAccess = MusicUtil_1.requiresSpotifyAccess();
            // check to see if they have the slack access token
            const slackAccessToken = Util_1.getItem("slack_access_token");
            if (!needsSpotifyAccess) {
                // check if we already have a playlist
                const savedPlaylists = dataMgr.savedPlaylists;
                // check if they've generated a playlist yet
                const customPlaylist = dataMgr.getMusicTimePlaylistByTypeId(Constants_1.PERSONAL_TOP_SONGS_PLID);
                let personalPlaylistLabel = !customPlaylist
                    ? Constants_1.GENERATE_CUSTOM_PLAYLIST_TITLE
                    : Constants_1.REFRESH_CUSTOM_PLAYLIST_TITLE;
                const personalPlaylistTooltip = !customPlaylist
                    ? Constants_1.GENERATE_CUSTOM_PLAYLIST_TOOLTIP
                    : Constants_1.REFRESH_CUSTOM_PLAYLIST_TOOLTIP;
                if (!savedPlaylists || savedPlaylists.length === 0) {
                    // show the generate playlist menu item
                    menuOptions.items.push({
                        label: personalPlaylistLabel,
                        detail: personalPlaylistTooltip,
                        cb: MusicManager_1.MusicManager.getInstance().generateUsersWeeklyTopSongs,
                    });
                }
            }
            if (!needsSpotifyAccess) {
                menuOptions.items.push({
                    label: "Open dashboard",
                    detail: "View your latest music metrics right here in your editor",
                    cb: displayMusicTimeMetricsMarkdownDashboard,
                });
            }
            menuOptions.items.push({
                label: "Submit an issue on GitHub",
                detail: "Encounter a bug? Submit an issue on our GitHub page",
                url: "https://github.com/swdotcom/swdc-vscode/issues",
            });
            menuOptions.items.push({
                label: "Submit feedback",
                detail: "Send us an email at cody@software.com",
                url: "mailto:cody@software.com",
            });
            if (!needsSpotifyAccess) {
                menuOptions.items.push({
                    label: "See web analytics",
                    detail: "See music analytics in the web app",
                    command: "musictime.launchAnalytics",
                });
            }
            if (serverIsOnline) {
                // show divider
                menuOptions.items.push({
                    label: "___________________________________________________________________",
                    cb: null,
                    url: null,
                    command: null,
                });
                if (needsSpotifyAccess) {
                    menuOptions.items.push({
                        label: "Connect Spotify",
                        detail: "To see your Spotify playlists in Music Time, please connect your account",
                        url: null,
                        cb: connectSpotify,
                    });
                }
                else {
                    menuOptions.items.push({
                        label: "Disconnect Spotify",
                        detail: "Disconnect your Spotify oauth integration",
                        url: null,
                        command: "musictime.disconnectSpotify",
                    });
                    if (!slackAccessToken) {
                        menuOptions.items.push({
                            label: "Connect Slack",
                            detail: "To share a playlist or track on Slack, please connect your account",
                            url: null,
                            cb: SlackControlManager_1.connectSlack,
                        });
                    }
                    else {
                        menuOptions.items.push({
                            label: "Disconnect Slack",
                            detail: "Disconnect your Slack oauth integration",
                            url: null,
                            command: "musictime.disconnectSlack",
                        });
                    }
                }
            }
            MenuManager_1.showQuickPick(menuOptions);
        });
    }
    showCreatePlaylistInputPrompt(placeHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInputBox({
                value: placeHolder,
                placeHolder: "New Playlist",
                validateInput: (text) => {
                    return !text || text.trim().length === 0
                        ? "Please enter a playlist name to continue."
                        : null;
                },
            });
        });
    }
    createNewPlaylist() {
        return __awaiter(this, void 0, void 0, function* () {
            const musicControlMgr = MusicControlManager.getInstance();
            // !!! important, need to use the get instance as this
            // method may be called within a callback and "this" will be undefined !!!
            const hasPlaylistItemToAdd = musicControlMgr.currentTrackToAdd ? true : false;
            const placeholder = hasPlaylistItemToAdd
                ? `${musicControlMgr.currentTrackToAdd.artist} - ${musicControlMgr.currentTrackToAdd.name}`
                : "New Playlist";
            let playlistName = yield musicControlMgr.showCreatePlaylistInputPrompt(placeholder);
            if (playlistName && playlistName.trim().length === 0) {
                vscode_1.window.showInformationMessage("Please enter a playlist name to continue.");
                return;
            }
            if (!playlistName) {
                return;
            }
            const playlistItems = hasPlaylistItemToAdd
                ? [musicControlMgr.currentTrackToAdd]
                : [];
            MusicPlaylistManager_1.MusicPlaylistManager.getInstance().createPlaylist(playlistName, playlistItems);
        });
    }
    addToPlaylistMenu(playlistItem) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentTrackToAdd = playlistItem;
            let menuOptions = {
                items: [
                    {
                        label: "New Playlist",
                        cb: this.createNewPlaylist,
                    },
                ],
                placeholder: "Select or Create a playlist",
            };
            let playlists = MusicManager_1.MusicManager.getInstance().currentPlaylists;
            // filter out the ones with itemType = playlist
            playlists = playlists
                .filter((n) => n.itemType === "playlist" && n.name !== "Software Top 40")
                .map((n) => n);
            MusicUtil_1.sortPlaylists(playlists);
            playlists.forEach((item) => {
                menuOptions.items.push({
                    label: item.name,
                    cb: null,
                });
            });
            const pick = yield MenuManager_1.showQuickPick(menuOptions);
            if (pick && pick.label) {
                // add it to this playlist
                const matchingPlaylists = playlists
                    .filter((n) => n.name === pick.label)
                    .map((n) => n);
                if (matchingPlaylists.length) {
                    const matchingPlaylist = matchingPlaylists[0];
                    if (matchingPlaylist) {
                        const playlistName = matchingPlaylist.name;
                        let errMsg = null;
                        const trackUri = playlistItem.uri || Util_1.createUriFromTrackId(playlistItem.id);
                        const trackId = playlistItem.id;
                        if (matchingPlaylist.name !== "Liked Songs") {
                            // it's a non-liked songs playlist update
                            // uri:"spotify:track:2JHCaLTVvYjyUrCck0Uvrp" or id
                            const codyResponse = yield cody_music_1.addTracksToPlaylist(matchingPlaylist.id, [trackUri]);
                            errMsg = Util_1.getCodyErrorMessage(codyResponse);
                            // populate the spotify playlists
                            yield DataController_1.populateSpotifyPlaylists();
                        }
                        else {
                            // it's a liked songs playlist update
                            let track = dataMgr.runningTrack;
                            if (track.id !== trackId) {
                                track = new cody_music_1.Track();
                                track.id = playlistItem.id;
                                track.playerType = playlistItem.playerType;
                                track.state = playlistItem.state;
                            }
                            yield this.setLiked(true, track);
                            // add to the trackIdsForRecommendations
                            dataMgr.trackIdsForRecommendations.push(trackId);
                        }
                        if (!errMsg) {
                            vscode_1.window.showInformationMessage(`Added ${playlistItem.name} to ${playlistName}`);
                            // refresh the playlist and clear the current recommendation metadata
                            dataMgr.removeTrackFromRecommendations(trackId);
                            vscode_1.commands.executeCommand("musictime.refreshPlaylist");
                            vscode_1.commands.executeCommand("musictime.refreshRecommendationsTree");
                        }
                        else {
                            if (errMsg) {
                                vscode_1.window.showErrorMessage(`Failed to add '${playlistItem.name}' to '${playlistName}'. ${errMsg}`, ...[Constants_1.OK_LABEL]);
                            }
                        }
                    }
                }
            }
        });
    }
}
exports.MusicControlManager = MusicControlManager;
function buildSpotifyLink(id, isPlaylist) {
    let link = "";
    id = Util_1.createSpotifyIdFromUri(id);
    if (isPlaylist) {
        link = `https://open.spotify.com/playlist/${id}`;
    }
    else {
        link = `https://open.spotify.com/track/${id}`;
    }
    return link;
}
exports.buildSpotifyLink = buildSpotifyLink;
function displayMusicTimeMetricsMarkdownDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        if (fetchingMusicTimeMetrics) {
            vscode_1.window.showInformationMessage(`Still generating Music Time dashboard, please wait...`);
            return;
        }
        fetchingMusicTimeMetrics = true;
        vscode_1.window.showInformationMessage(`Generating Music Time dashboard, please wait...`);
        const musicTimeFile = Util_1.getMusicTimeMarkdownFile();
        yield fetchMusicTimeMetricsMarkdownDashboard();
        const viewOptions = {
            viewColumn: vscode_1.ViewColumn.One,
            preserveFocus: false,
        };
        const localResourceRoots = [vscode_1.Uri.file(Util_1.getSoftwareDir()), vscode_1.Uri.file(os_1.tmpdir())];
        const panel = vscode_1.window.createWebviewPanel("music-time-preview", `Music Time Dashboard`, viewOptions, {
            enableFindWidget: true,
            localResourceRoots,
            enableScripts: true,
        });
        const content = fs.readFileSync(musicTimeFile, { encoding: "utf8" }).toString();
        panel.webview.html = content;
        vscode_1.window.showInformationMessage(`Completed building Music Time dashboard.`);
        fetchingMusicTimeMetrics = false;
    });
}
exports.displayMusicTimeMetricsMarkdownDashboard = displayMusicTimeMetricsMarkdownDashboard;
function connectSpotify() {
    return __awaiter(this, void 0, void 0, function* () {
        let serverIsOnline = yield DataController_1.serverIsAvailable();
        if (!serverIsOnline) {
            vscode_1.window.showInformationMessage(`Our service is temporarily unavailable.\n\nPlease try again later.\n`);
            return;
        }
        let jwt = Util_1.getItem("jwt");
        if (!jwt) {
            // no jwt, get the app jwt
            jwt = yield DataController_1.getAppJwt(true);
            yield Util_1.setItem("jwt", jwt);
        }
        // check if they're already connected, if so then ask if they would
        // like to continue as we'll need to disconnect the current connection
        const needsSpotifyAccess = MusicUtil_1.requiresSpotifyAccess();
        if (!needsSpotifyAccess) {
            // disconnectSpotify
            const selection = yield vscode_1.window.showInformationMessage(`Connect with a different Spotify account?`, ...[Constants_1.YES_LABEL]);
            if (!selection || selection !== Constants_1.YES_LABEL) {
                return;
            }
            // disconnect the current connection
            yield disconnectSpotify(false /*confirmDisconnect*/);
        }
        const encodedJwt = encodeURIComponent(jwt);
        const mac = Util_1.isMac() ? "true" : "false";
        const qryStr = `token=${encodedJwt}&mac=${mac}`;
        const endpoint = `${Constants_1.api_endpoint}/auth/spotify?${qryStr}`;
        Util_1.launchWebUrl(endpoint);
        DataController_1.refetchSpotifyConnectStatusLazily();
    });
}
exports.connectSpotify = connectSpotify;
function disconnectSpotify(confirmDisconnect = true) {
    return __awaiter(this, void 0, void 0, function* () {
        yield disconnectOauth("Spotify", confirmDisconnect);
    });
}
exports.disconnectSpotify = disconnectSpotify;
function disconnectSlack(confirmDisconnect = true) {
    return __awaiter(this, void 0, void 0, function* () {
        yield disconnectOauth("Slack", confirmDisconnect);
    });
}
exports.disconnectSlack = disconnectSlack;
function disconnectOauth(type, confirmDisconnect = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = confirmDisconnect
            ? yield vscode_1.window.showInformationMessage(`Are you sure you would like to disconnect ${type}?`, ...[Constants_1.YES_LABEL])
            : Constants_1.YES_LABEL;
        if (selection === Constants_1.YES_LABEL) {
            let serverIsOnline = yield DataController_1.serverIsAvailable();
            if (serverIsOnline) {
                const type_lc = type.toLowerCase();
                let result = yield HttpClient_1.softwarePut(`/auth/${type_lc}/disconnect`, {}, Util_1.getItem("jwt"));
                // oauth is not null, initialize spotify
                if (type_lc === "slack") {
                    yield MusicManager_1.MusicManager.getInstance().updateSlackAccessInfo(null);
                }
                else if (type_lc === "spotify") {
                    yield MusicManager_1.MusicManager.getInstance().updateSpotifyAccessInfo(null);
                    // clear the spotify playlists
                    dataMgr.spotifyPlaylists = [];
                    dataMgr.spotifyLikedSongs = [];
                    vscode_1.commands.executeCommand("musictime.refreshPlaylist");
                    vscode_1.commands.executeCommand("musictime.refreshRecommendations");
                }
                vscode_1.window.showInformationMessage(`Successfully disconnected your ${type} connection.`);
            }
            else {
                vscode_1.window.showInformationMessage(`Our service is temporarily unavailable.\n\nPlease try again later.\n`);
            }
        }
    });
}
exports.disconnectOauth = disconnectOauth;
function fetchMusicTimeMetricsMarkdownDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        let file = Util_1.getMusicTimeMarkdownFile();
        const dayOfMonth = moment().startOf("day").date();
        if (!fs.existsSync(file) || lastDayOfMonth !== dayOfMonth) {
            lastDayOfMonth = dayOfMonth;
            yield fetchDashboardData(file, true);
        }
    });
}
exports.fetchMusicTimeMetricsMarkdownDashboard = fetchMusicTimeMetricsMarkdownDashboard;
function fetchMusicTimeMetricsDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        let file = Util_1.getMusicTimeFile();
        const dayOfMonth = moment().startOf("day").date();
        if (fs.existsSync(file) || lastDayOfMonth !== dayOfMonth) {
            lastDayOfMonth = dayOfMonth;
            yield fetchDashboardData(file, false);
        }
    });
}
exports.fetchMusicTimeMetricsDashboard = fetchMusicTimeMetricsDashboard;
function fetchDashboardData(fileName, isHtml) {
    return __awaiter(this, void 0, void 0, function* () {
        const musicSummary = yield HttpClient_1.softwareGet(`/dashboard/music?linux=${Util_1.isLinux()}&html=${isHtml}`, Util_1.getItem("jwt"));
        // get the content
        let content = musicSummary && musicSummary.data ? musicSummary.data : NO_DATA;
        fs.writeFileSync(fileName, content, (err) => {
            if (err) {
                Util_1.logIt(`Error writing to the Software dashboard file: ${err.message}`);
            }
        });
    });
}
//# sourceMappingURL=MusicControlManager.js.map