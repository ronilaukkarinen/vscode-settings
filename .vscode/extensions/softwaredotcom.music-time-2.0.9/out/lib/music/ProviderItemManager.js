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
const Constants_1 = require("../Constants");
const MusicUtil_1 = require("./MusicUtil");
const MusicDataManager_1 = require("./MusicDataManager");
const MusicManager_1 = require("./MusicManager");
const Util_1 = require("../Util");
class ProviderItemManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!ProviderItemManager.instance) {
            ProviderItemManager.instance = new ProviderItemManager();
        }
        return ProviderItemManager.instance;
    }
    getSpotifyLikedPlaylistFolder() {
        const item = new cody_music_1.PlaylistItem();
        item.type = "playlist";
        item.id = Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME;
        item.tracks = new cody_music_1.PlaylistTrackInfo();
        // set set a number so it shows up
        item.tracks.total = 1;
        item.playerType = cody_music_1.PlayerType.WebSpotify;
        item.tag = "spotify-liked-songs";
        item.itemType = "playlist";
        item.name = Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME;
        item["icon"] = "heart-filled.svg";
        return item;
    }
    getActiveSpotifyDevicesButton() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
            const devices = dataMgr.currentDevices;
            let msg = "";
            let tooltip = "Listening on a Spotify device";
            if (activeDevice) {
                // found an active device
                msg = `Listening on ${activeDevice.name}`;
            }
            else if (Util_1.isMac() && desktop) {
                // show that the desktop player is an active device
                msg = `Listening on ${desktop.name}`;
            }
            else if (webPlayer) {
                // show that the web player is an active device
                msg = `Listening on ${webPlayer.name}`;
            }
            else if (desktop) {
                // show that the desktop player is an active device
                msg = `Listening on ${desktop.name}`;
            }
            else if (devices.length) {
                // no active device but found devices
                const names = devices.map((d) => d.name);
                msg = `Spotify devices available`;
                tooltip = `Multiple devices available: ${names.join(", ")}`;
            }
            else if (devices.length === 0) {
                // no active device and no devices
                msg = "Connect to a Spotify device";
                tooltip = "Click to launch the web or desktop player";
            }
            return this.createSpotifyDevicesButton(msg, tooltip, true, "musictime.deviceSelector");
        });
    }
    getSpotifyPremiumAccountRequiredButton() {
        return this.buildActionItem("spotifypremium", "action", "musictime.switchSpotifyAccount", cody_music_1.PlayerType.NotAssigned, "Spotify Free", "Connect to your premium Spotify account to enable web playback controls");
    }
    getItunesConnectedButton() {
        return this.buildActionItem("itunesconnected", "connected", null, cody_music_1.PlayerType.MacItunesDesktop, "iTunes Connected", "You've connected iTunes");
    }
    getLoadingButton() {
        return this.buildActionItem("loading", "action", null, cody_music_1.PlayerType.NotAssigned, "Loading...", "please wait", null, "action", "audio.svg");
    }
    getConnectToSpotifyButton() {
        const requiresReAuth = MusicUtil_1.requiresSpotifyReAuthentication();
        const action = requiresReAuth ? "Reconnect" : "Connect";
        return this.buildActionItem("connectspotify", "spotify", "musictime.connectSpotify", cody_music_1.PlayerType.WebSpotify, `${action} Spotify`, "Connect Spotify to view your playlists");
    }
    getRecommendationConnectToSpotifyButton() {
        // Connect Spotify to see recommendations
        const requiresReAuth = MusicUtil_1.requiresSpotifyReAuthentication();
        const action = requiresReAuth ? "Reconnect" : "Connect";
        return this.buildActionItem("connectspotify", "spotify", "musictime.connectSpotify", cody_music_1.PlayerType.WebSpotify, `${action} Spotify to see recommendations`, "Connect Spotify to see your playlist and track recommendations");
    }
    getSwitchToSpotifyButton() {
        return this.buildActionItem("title", "spotify", "musictime.launchSpotifyDesktop", cody_music_1.PlayerType.WebSpotify, "Launch Spotify");
    }
    getSwitchToItunesButton() {
        return this.buildActionItem("title", "itunes", "musictime.launchItunes", cody_music_1.PlayerType.MacItunesDesktop, "Launch iTunes");
    }
    // readme button
    getReadmeButton() {
        return this.buildActionItem("title", "action", "musictime.displayReadme", null, "Learn more", "View the Music Time Readme to learn more", "", null, "readme.svg");
    }
    getGenerateDashboardButton() {
        return this.buildActionItem("title", "action", "musictime.displayDashboard", null, "Open dashboard", "View your latest music metrics right here in your editor", "", null, "dashboard.svg");
    }
    createSpotifyDevicesButton(title, tooltip, loggedIn, command = null) {
        const button = this.buildActionItem("title", "spotify", command, cody_music_1.PlayerType.WebSpotify, title, tooltip);
        button.tag = loggedIn ? "active" : "disabled";
        return button;
    }
    getLineBreakButton() {
        return this.buildActionItem("title", "divider", null, cody_music_1.PlayerType.NotAssigned, "", "");
    }
    buildActionItem(id, type, command, playerType, name, tooltip = "", itemType = "", callback = null, icon = "") {
        let item = new cody_music_1.PlaylistItem();
        item.tracks = new cody_music_1.PlaylistTrackInfo();
        item.type = type;
        item.id = id;
        item.command = command;
        item["cb"] = callback;
        item.playerType = playerType;
        item.name = name;
        item.tooltip = tooltip;
        item.itemType = itemType;
        item["icon"] = icon;
        return item;
    }
    getWebAnalyticsButton() {
        // See web analytics
        let listItem = new cody_music_1.PlaylistItem();
        listItem.tracks = new cody_music_1.PlaylistTrackInfo();
        listItem.type = "action";
        listItem.tag = "paw";
        listItem.id = "launchmusicanalytics";
        listItem.command = "musictime.launchAnalytics";
        listItem.playerType = cody_music_1.PlayerType.WebSpotify;
        listItem.name = "See web analytics";
        listItem.tooltip = "See music analytics in the web app";
        return listItem;
    }
    getNoTracksFoundButton() {
        return this.buildActionItem("title", "message", null, cody_music_1.PlayerType.NotAssigned, "Your tracks will appear here");
    }
    getSwitchToThisDeviceButton() {
        return __awaiter(this, void 0, void 0, function* () {
            const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
            if (activeDevice && !webPlayer && !desktop) {
                // return a button to switch to this computer if we have devices
                // and none of them are of type "Computer"
                const button = this.buildActionItem("title", "action", "musictime.switchToThisDevice", cody_music_1.PlayerType.MacSpotifyDesktop, "Switch To This Device");
                return button;
            }
            return null;
        });
    }
    // get the custom playlist button by checkinf if the custom playlist
    // exists or not. if it doesn't exist then it will show the create label,
    // otherwise, it will show the refresh label
    getCustomPlaylistButton() {
        // update the existing playlist that matches the personal playlist with a paw if found
        const customPlaylist = MusicDataManager_1.MusicDataManager.getInstance().getMusicTimePlaylistByTypeId(Constants_1.PERSONAL_TOP_SONGS_PLID);
        const personalPlaylistLabel = !customPlaylist
            ? Constants_1.GENERATE_CUSTOM_PLAYLIST_TITLE
            : Constants_1.REFRESH_CUSTOM_PLAYLIST_TITLE;
        const personalPlaylistTooltip = !customPlaylist
            ? Constants_1.GENERATE_CUSTOM_PLAYLIST_TOOLTIP
            : Constants_1.REFRESH_CUSTOM_PLAYLIST_TOOLTIP;
        if (MusicDataManager_1.MusicDataManager.getInstance().currentPlayerName !==
            cody_music_1.PlayerName.ItunesDesktop &&
            !MusicUtil_1.requiresSpotifyAccess()) {
            // add the connect spotify link
            let listItem = new cody_music_1.PlaylistItem();
            listItem.tracks = new cody_music_1.PlaylistTrackInfo();
            listItem.type = "action";
            listItem.tag = "action";
            listItem.id = "codingfavorites";
            listItem.command = "musictime.generateWeeklyPlaylist";
            listItem.playerType = cody_music_1.PlayerType.WebSpotify;
            listItem.name = personalPlaylistLabel;
            listItem.tooltip = personalPlaylistTooltip;
            listItem["icon"] = "generate.svg";
            return listItem;
        }
        return null;
    }
    getInactiveDevices(devices) {
        return __awaiter(this, void 0, void 0, function* () {
            let inactive_devices = [];
            if (devices && devices.length > 0) {
                for (let i = 0; i < devices.length; i++) {
                    const device = devices[i];
                    if (!device.is_active) {
                        inactive_devices.push(device);
                    }
                }
            }
            return inactive_devices;
        });
    }
    convertTracksToPlaylistItems(tracks) {
        let items = [];
        if (!MusicUtil_1.requiresSpotifyAccess()) {
            const labelButton = this.buildActionItem("label", "label", null, cody_music_1.PlayerType.NotAssigned, MusicDataManager_1.MusicDataManager.getInstance().recommendationLabel, "");
            labelButton.tag = "paw";
            if (tracks && tracks.length > 0) {
                // since we have recommendations, show the label button
                items.push(labelButton);
                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i];
                    const item = MusicManager_1.MusicManager.getInstance().createPlaylistItemFromTrack(track, 0);
                    item.tag = "spotify";
                    item.type = "recommendation";
                    item["icon"] = "track.svg";
                    items.push(item);
                }
            }
        }
        else {
            // create the connect button
            items.push(this.getRecommendationConnectToSpotifyButton());
        }
        return items;
    }
}
exports.ProviderItemManager = ProviderItemManager;
//# sourceMappingURL=ProviderItemManager.js.map