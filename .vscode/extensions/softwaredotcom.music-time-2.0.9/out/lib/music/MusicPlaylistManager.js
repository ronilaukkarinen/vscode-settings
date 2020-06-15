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
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
class MusicPlaylistManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!MusicPlaylistManager.instance) {
            MusicPlaylistManager.instance = new MusicPlaylistManager();
        }
        return MusicPlaylistManager.instance;
    }
    createPlaylist(playlistName, playlistTrackItems) {
        return __awaiter(this, void 0, void 0, function* () {
            // create the playlist
            const playlistResult = yield cody_music_1.createPlaylist(playlistName, true);
            let playlistId = null;
            const errMsg = Util_1.getCodyErrorMessage(playlistResult);
            if (errMsg) {
                vscode_1.window.showErrorMessage(`There was an unexpected error adding tracks to the playlist. ${errMsg} Refresh the playlist and try again if you feel the problem has been resolved.`, ...[Constants_1.OK_LABEL]);
                return;
            }
            // successfully created it
            playlistId = playlistResult.data.id;
            // create the tracks to add list
            const tracksToAdd = playlistTrackItems.map((item) => {
                if (item.uri) {
                    return item.uri;
                }
                return item.id;
            });
            this.addTracks(playlistId, playlistName, tracksToAdd);
        });
    }
    addTracks(playlist_id, name, tracksToAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (playlist_id) {
                // create the playlist_id in software
                const addTracksResult = yield cody_music_1.addTracksToPlaylist(playlist_id, tracksToAdd);
                if (addTracksResult.state === cody_music_1.CodyResponseType.Success) {
                    vscode_1.window.showInformationMessage(`Successfully created ${name} and added tracks.`);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        // repopulate the playlists
                        if (playlist_id === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
                            yield DataController_1.populateLikedSongs();
                        }
                        else {
                            yield DataController_1.populateSpotifyPlaylists();
                        }
                        vscode_1.commands.executeCommand("musictime.refreshPlaylist");
                    }), 1000);
                }
                else {
                    vscode_1.window.showErrorMessage(`There was an unexpected error adding tracks to the playlist. ${addTracksResult.message}`, ...[Constants_1.OK_LABEL]);
                }
            }
        });
    }
}
exports.MusicPlaylistManager = MusicPlaylistManager;
//# sourceMappingURL=MusicPlaylistManager.js.map