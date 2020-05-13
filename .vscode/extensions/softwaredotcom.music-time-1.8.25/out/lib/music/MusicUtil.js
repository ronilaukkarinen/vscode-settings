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
const vscode_1 = require("vscode");
const MusicManager_1 = require("./MusicManager");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const MusicDataManager_1 = require("./MusicDataManager");
// duplicate music time playlists names:
// "My AI Top 40", "My Custom Top 40", "Custom Top 40", "AI-generated Custom Top 40", "Software Top 40"
const codyPlaylistNames = [
    "My AI Top 40",
    "Custom Top 40",
    "My Custom Top 40",
    "AI-generated Custom Top 40",
    "Software Top 40"
];
let completedDupCheck = false;
function checkForDups(playlists) {
    return __awaiter(this, void 0, void 0, function* () {
        if (completedDupCheck) {
            return;
        }
        let hasDups = false;
        if (playlists && playlists.length > 0) {
            for (let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i];
                if (codyPlaylistNames.includes(playlist.name) &&
                    playlist.duplicateIds &&
                    playlist.duplicateIds.length > 0) {
                    hasDups = true;
                    break;
                }
            }
        }
        if (hasDups) {
            // prompt to ask if they would like to start deleting all of the dups
            const selectedLabel = yield vscode_1.window.showInformationMessage(`We found duplicate 'Music Time' generated playlist names. Would you like to unfollow those?`, ...[Constants_1.NOT_NOW_LABEL, Constants_1.OK_LABEL]);
            if (selectedLabel && selectedLabel === Constants_1.OK_LABEL) {
                yield deleteDuplicateSpotifyPlaylists(playlists);
            }
        }
    });
}
exports.checkForDups = checkForDups;
function deleteDuplicateSpotifyPlaylists(playlists) {
    return __awaiter(this, void 0, void 0, function* () {
        if (playlists && playlists.length > 0) {
            for (let i = 0; i < playlists.length; i++) {
                const playlist = playlists[i];
                if (codyPlaylistNames.includes(playlist.name) &&
                    playlist.duplicateIds &&
                    playlist.duplicateIds.length > 0) {
                    for (let x = 0; x < playlist.duplicateIds.length; x++) {
                        const playlistListId = playlist.duplicateIds[x];
                        yield cody_music_1.deletePlaylist(playlistListId);
                        console.log(`Deleted playlist '${playlist.name} with ID ${playlistListId}`);
                    }
                }
            }
        }
        // repopulate the playlists
        yield DataController_1.populateSpotifyPlaylists();
        // refresh the playlist
        vscode_1.commands.executeCommand("musictime.refreshPlaylist");
    });
}
exports.deleteDuplicateSpotifyPlaylists = deleteDuplicateSpotifyPlaylists;
function sortPlaylists(playlists) {
    if (playlists && playlists.length > 0) {
        playlists.sort((a, b) => {
            const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB)
                //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });
    }
}
exports.sortPlaylists = sortPlaylists;
function sortTracks(tracks) {
    if (tracks && tracks.length > 0) {
        tracks.sort((a, b) => {
            const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB)
                //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });
    }
}
exports.sortTracks = sortTracks;
function buildTracksForRecommendations(playlists) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
        // no need to refresh recommendations if we already have track IDs
        if (dataMgr.trackIdsForRecommendations &&
            dataMgr.trackIdsForRecommendations.length > 0) {
            return;
        }
        const musicMgr = MusicManager_1.MusicManager.getInstance();
        let trackIds = [];
        let foundTracksForRec = false;
        // build tracks for recommendations
        if (dataMgr.spotifyLikedSongs && dataMgr.spotifyLikedSongs.length) {
            trackIds = dataMgr.spotifyLikedSongs.map((track) => {
                return track.id;
            });
            foundTracksForRec = true;
        }
        else {
            // go through the found playlists and the first one that returns 3 or more wins
            if (playlists && playlists.length > 0) {
                for (let i = 0; i < playlists.length; i++) {
                    const playlist = playlists[i];
                    const playlistItems = yield musicMgr.getPlaylistItemTracksForPlaylistId(playlist.id);
                    if (playlistItems && playlistItems.length >= 3) {
                        foundTracksForRec = true;
                        trackIds = playlistItems.map((item) => {
                            return item.id;
                        });
                        break;
                    }
                }
            }
        }
        dataMgr.trackIdsForRecommendations = trackIds;
        if (foundTracksForRec) {
            // refresh the recommendations
            setTimeout(() => {
                vscode_1.commands.executeCommand("musictime.refreshRecommendations");
            }, 1000);
        }
    });
}
exports.buildTracksForRecommendations = buildTracksForRecommendations;
function requiresSpotifyAccess() {
    let spotifyAccessToken = Util_1.getItem("spotify_access_token");
    // no spotify access token then return true, the user requires spotify access
    return !spotifyAccessToken ? true : false;
}
exports.requiresSpotifyAccess = requiresSpotifyAccess;
/**
 * returns { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice }
 * Either of these values can be null
 */
function getDeviceSet() {
    const devices = MusicDataManager_1.MusicDataManager.getInstance().currentDevices || [];
    const webPlayer = devices.find((d) => d.name.toLowerCase().includes("web player"));
    const desktop = devices.find((d) => d.type.toLowerCase() === "computer" &&
        !d.name.toLowerCase().includes("web player"));
    const activeDevice = devices.find((d) => d.is_active);
    const activeComputerDevice = devices.find((d) => d.is_active && d.type.toLowerCase() === "computer");
    const activeWebPlayerDevice = devices.find((d) => d.is_active &&
        d.type.toLowerCase() === "computer" &&
        d.name.toLowerCase().includes("web player"));
    const activeDesktopPlayerDevice = devices.find((d) => d.is_active &&
        d.type.toLowerCase() === "computer" &&
        !d.name.toLowerCase().includes("web player"));
    return {
        webPlayer,
        desktop,
        activeDevice,
        activeComputerDevice,
        activeWebPlayerDevice,
        activeDesktopPlayerDevice
    };
}
exports.getDeviceSet = getDeviceSet;
function getDeviceId() {
    const { webPlayer, desktop, activeDevice } = getDeviceSet();
    const deviceId = activeDevice
        ? activeDevice.id
        : desktop
            ? desktop.id
            : webPlayer
                ? webPlayer.id
                : "";
    return deviceId;
}
exports.getDeviceId = getDeviceId;
//# sourceMappingURL=MusicUtil.js.map