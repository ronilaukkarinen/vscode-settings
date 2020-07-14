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
const Util_1 = require("../Util");
const vscode_1 = require("vscode");
const Constants_1 = require("../Constants");
const HttpClient_1 = require("../HttpClient");
class MusicDataManager {
    constructor() {
        // default to starting with spotify
        this._currentPlayerName = cody_music_1.PlayerName.SpotifyWeb;
        this.selectedTrackItem = null;
        this.selectedPlaylist = null;
        this.spotifyClientId = "";
        this.spotifyClientSecret = "";
        this.buildingCustomPlaylist = false;
        this.playlistTrackMap = {};
        this.spotifyUser = null;
        this.userTopSongs = [];
        this.sortAlphabetically = false;
        this.playlistMap = {};
        this.spotifyLikedSongs = [];
        this.generatedPlaylists = [];
        this.runningTrack = new cody_music_1.Track();
        this.savedPlaylists = [];
        this.recommendationTracks = [];
        this.trackIdsForRecommendations = [];
        this.prevRecTrackMap = {};
        this.recommendationLabel = "Familiar";
        this.currentRecMeta = {};
        this.ready = false;
        this.currentDevices = [];
        this.buildingPlaylists = false;
        this.rawPlaylists = [];
        this.origRawPlaylistOrder = [];
        this.itunesPlaylists = [];
        this.spotifyPlaylists = [];
        //
    }
    static getInstance() {
        if (!MusicDataManager.instance) {
            MusicDataManager.instance = new MusicDataManager();
        }
        return MusicDataManager.instance;
    }
    disconnect() {
        this.spotifyPlaylists = [];
        this.spotifyLikedSongs = [];
        this.origRawPlaylistOrder = [];
        this.rawPlaylists = [];
        this.spotifyUser = null;
        this.selectedTrackItem = null;
        this.selectedPlaylist = null;
        this.spotifyClientId = "";
        this.currentDevices = [];
        this.runningTrack = new cody_music_1.Track();
    }
    /**
     * Get the current player: spotify-web or itunes
     */
    get currentPlayerName() {
        return this._currentPlayerName;
    }
    set currentPlayerName(playerName) {
        // override any calls setting this to spotify desktop back to spotify-web
        if (playerName === cody_music_1.PlayerName.SpotifyDesktop) {
            playerName = cody_music_1.PlayerName.SpotifyWeb;
        }
        // check if it's change in player type
        const shouldUpdateCodyConfig = playerName !== this._currentPlayerName ? true : false;
        this._currentPlayerName = playerName;
        // if it's a player type change, update cody config so it
        // can disable the other player until it is selected
        if (shouldUpdateCodyConfig) {
            this.updateCodyConfig();
        }
    }
    /**
     * Update the cody config settings for cody-music
     */
    updateCodyConfig() {
        const accessToken = Util_1.getItem("spotify_access_token");
        const refreshToken = Util_1.getItem("spotify_refresh_token");
        const codyConfig = new cody_music_1.CodyConfig();
        codyConfig.enableItunesDesktop = false;
        codyConfig.enableItunesDesktopSongTracking = Util_1.isMac();
        codyConfig.enableSpotifyDesktop = Util_1.isMac();
        codyConfig.spotifyClientId = this.spotifyClientId;
        codyConfig.spotifyAccessToken = accessToken;
        codyConfig.spotifyRefreshToken = refreshToken;
        codyConfig.spotifyClientSecret = this.spotifyClientSecret;
        cody_music_1.setConfig(codyConfig);
    }
    removeTrackFromRecommendations(trackId) {
        let foundIdx = -1;
        for (let i = 0; i < this.recommendationTracks.length; i++) {
            if (this.recommendationTracks[i].id === trackId) {
                foundIdx = i;
                break;
            }
        }
        if (foundIdx > -1) {
            // splice it out
            this.recommendationTracks.splice(foundIdx, 1);
        }
        if (this.recommendationTracks.length < 2) {
            // refresh
            vscode_1.commands.executeCommand("musictime.refreshRecommendations");
        }
    }
    isLikedTrack(trackId) {
        const foundSong = this.spotifyLikedSongs
            ? this.spotifyLikedSongs.find((n) => n.id === trackId)
            : null;
        return foundSong ? true : false;
    }
    getAiTopFortyPlaylist() {
        // Add the AI generated playlist
        if (this.generatedPlaylists && this.generatedPlaylists.length) {
            const aiPlaylist = this.generatedPlaylists.find((e) => {
                return e.playlistTypeId === Constants_1.PERSONAL_TOP_SONGS_PLID;
            });
            return aiPlaylist;
        }
        return null;
    }
    /**
     * Checks if the user's spotify playlists contains either
     * the global top 40 or the user's coding favorites playlist.
     * The playlistTypeId is used to match the set ID from music time
     * app. 1 = user's coding favorites, 2 = global top 40
     */
    getMusicTimePlaylistByTypeId(playlistTypeId) {
        const pItem = this.generatedPlaylists.find((e) => e.playlistTypeId === playlistTypeId);
        return pItem;
    }
    fetchSavedPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            let playlists = [];
            const response = yield HttpClient_1.softwareGet("/music/playlist/generated", Util_1.getItem("jwt"));
            if (HttpClient_1.isResponseOk(response)) {
                // only return the non-deleted playlists
                for (let i = 0; i < response.data.length; i++) {
                    const savedPlaylist = response.data[i];
                    if (savedPlaylist && savedPlaylist["deleted"] !== 1) {
                        savedPlaylist.id = savedPlaylist.playlist_id;
                        savedPlaylist.playlistTypeId = savedPlaylist.playlistTypeId;
                        playlists.push(savedPlaylist);
                    }
                }
            }
            this.savedPlaylists = playlists;
        });
    }
    /**
     * Checks if the user's spotify playlists contains either
     * the global top 40 or the user's coding favorites playlist.
     * The playlistTypeId is used to match the set ID from music time
     * app. 1 = user's coding favorites, 2 = global top 40
     */
    populateGeneratedPlaylists() {
        this.generatedPlaylists = [];
        if (this.savedPlaylists.length > 0 && this.rawPlaylists.length > 0) {
            this.savedPlaylists.forEach((savedPlaylist) => {
                const savedPlaylistTypeId = savedPlaylist.playlistTypeId;
                const rawIdx = this.rawPlaylists.findIndex((n) => n.id === savedPlaylist.id);
                const origRawPlaylistOrderIdx = this.origRawPlaylistOrder.findIndex((n) => n.id === savedPlaylist.id);
                if (rawIdx !== -1) {
                    const playlist = this.rawPlaylists[rawIdx];
                    playlist.playlistTypeId = savedPlaylistTypeId;
                    playlist.tag = "paw";
                    this.generatedPlaylists.push(playlist);
                    this.rawPlaylists.splice(rawIdx, 1);
                }
                if (origRawPlaylistOrderIdx !== -1) {
                    this.origRawPlaylistOrder.splice(origRawPlaylistOrderIdx, 1);
                }
            });
        }
    }
    // reconcile. meaning the user may have deleted the lists our 2 buttons created;
    // global and custom.  We'll remove them from our db if we're unable to find a matching
    // playlist_id we have saved.
    reconcilePlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.savedPlaylists &&
                this.savedPlaylists.length &&
                this.generatedPlaylists &&
                this.generatedPlaylists.length) {
                for (let i = 0; i < this.savedPlaylists.length; i++) {
                    const savedPlaylist = this.savedPlaylists[i];
                    const foundPlaylist = this.generatedPlaylists.find((p) => (p.id = savedPlaylist.id));
                    if (!foundPlaylist) {
                        // no longer found, delete it
                        yield HttpClient_1.softwareDelete(`/music/playlist/generated/${savedPlaylist.id}`, Util_1.getItem("jwt"));
                    }
                    else if (foundPlaylist.name !== savedPlaylist.name) {
                        // update the name on the music time app
                        const payload = {
                            name: foundPlaylist.name,
                        };
                        yield HttpClient_1.softwarePut(`/music/playlist/generated/${savedPlaylist.id}`, payload, Util_1.getItem("jwt"));
                    }
                }
            }
        });
    }
}
exports.MusicDataManager = MusicDataManager;
//# sourceMappingURL=MusicDataManager.js.map