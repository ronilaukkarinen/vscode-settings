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
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const HttpClient_1 = require("../HttpClient");
const MusicCommandManager_1 = require("./MusicCommandManager");
const MusicControlManager_1 = require("./MusicControlManager");
const ProviderItemManager_1 = require("./ProviderItemManager");
const MusicUtil_1 = require("./MusicUtil");
const MusicDataManager_1 = require("./MusicDataManager");
const MusicCommandUtil_1 = require("./MusicCommandUtil");
class MusicManager {
    constructor() {
        this.playMusicSelection = () => __awaiter(this, void 0, void 0, function* () {
            const musicCommandUtil = MusicCommandUtil_1.MusicCommandUtil.getInstance();
            // get the playlist id, track id, and device id
            const playlistId = this.dataMgr.selectedPlaylist
                ? this.dataMgr.selectedPlaylist.id
                : null;
            let trackId = this.dataMgr.selectedTrackItem
                ? this.dataMgr.selectedTrackItem.id
                : null;
            const deviceId = MusicUtil_1.getDeviceId();
            const isLikedSong = this.dataMgr.selectedPlaylist &&
                this.dataMgr.selectedPlaylist.name ===
                    Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME
                ? true
                : false;
            const isRecommendationTrack = this.dataMgr.selectedTrackItem.type === "recommendation"
                ? true
                : false;
            const musicMgr = MusicManager.getInstance();
            const hasSpotifyPlaybackAccess = musicMgr.hasSpotifyPlaybackAccess();
            const isMacDesktopEnabled = musicMgr.isMacDesktopEnabled();
            if (isRecommendationTrack || isLikedSong) {
                if (hasSpotifyPlaybackAccess || !Util_1.isMac()) {
                    // it's a liked song or recommendation track play request
                    this.playRecommendationsOrLikedSongsByPlaylist(this.dataMgr.selectedTrackItem, deviceId);
                }
                else {
                    // play it using applescript
                    const trackUri = Util_1.createUriFromTrackId(this.dataMgr.selectedTrackItem.id);
                    const params = [trackUri];
                    yield cody_music_1.playTrackInContext(cody_music_1.PlayerName.SpotifyDesktop, params);
                }
            }
            else if (playlistId) {
                if (isMacDesktopEnabled || !hasSpotifyPlaybackAccess) {
                    // play it using applescript
                    const trackUri = Util_1.createUriFromTrackId(trackId);
                    const playlistUri = Util_1.createUriFromPlaylistId(playlistId);
                    const params = [trackUri, playlistUri];
                    yield cody_music_1.playTrackInContext(cody_music_1.PlayerName.SpotifyDesktop, params);
                }
                else {
                    // NORMAL playlist request
                    // play a playlist
                    yield musicCommandUtil.runSpotifyCommand(cody_music_1.playSpotifyPlaylist, [
                        playlistId,
                        trackId,
                        deviceId,
                    ]);
                }
            }
            else {
                if (hasSpotifyPlaybackAccess || !Util_1.isMac()) {
                    // else it's not a liked or recommendation play request, just play the selected track
                    yield musicCommandUtil.runSpotifyCommand(cody_music_1.playSpotifyTrack, [
                        trackId,
                        deviceId,
                    ]);
                }
                else {
                    // play it using applescript
                    const trackUri = Util_1.createUriFromTrackId(trackId);
                    const params = [trackUri];
                    yield cody_music_1.playTrackInContext(cody_music_1.PlayerName.SpotifyDesktop, params);
                }
            }
        });
        this.playRecommendationsOrLikedSongsByPlaylist = (playlistItem, deviceId) => __awaiter(this, void 0, void 0, function* () {
            const trackId = playlistItem.id;
            const isRecommendationTrack = playlistItem.type === "recommendation" ? true : false;
            let offset = 0;
            let track_ids = [];
            if (isRecommendationTrack) {
                // RECOMMENDATION track request
                // get the offset of this track
                offset = this.dataMgr.recommendationTracks.findIndex((t) => trackId === t.id);
                // play the list of recommendation tracks
                track_ids = this.dataMgr.recommendationTracks.map((t) => t.id);
                // make it a list of 50, so get the rest from trackIdsForRecommendations
                const otherTrackIds = this.dataMgr.trackIdsForRecommendations.filter((t) => !track_ids.includes(t));
                const spliceLimit = 50 - track_ids.length;
                const addtionalTrackIds = otherTrackIds.splice(0, spliceLimit);
                track_ids.push(...addtionalTrackIds);
            }
            else {
                offset = this.dataMgr.spotifyLikedSongs.findIndex((t) => trackId === t.id);
                // play the list of recommendation tracks
                track_ids = this.dataMgr.spotifyLikedSongs.map((t) => t.id);
                // trim it down to 50
                track_ids = track_ids.splice(0, 50);
            }
            const result = MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.play, [
                cody_music_1.PlayerName.SpotifyWeb,
                {
                    track_ids,
                    device_id: deviceId,
                    offset,
                },
            ]);
            return result;
        });
        this.providerItemMgr = ProviderItemManager_1.ProviderItemManager.getInstance();
        this.dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
    }
    static getInstance() {
        if (!MusicManager.instance) {
            MusicManager.instance = new MusicManager();
        }
        return MusicManager.instance;
    }
    get currentPlaylists() {
        if (this.dataMgr.currentPlayerName === cody_music_1.PlayerName.ItunesDesktop) {
            // go through each playlist and find out it's state
            if (this.dataMgr.itunesPlaylists &&
                this.dataMgr.itunesPlaylists.length) {
                this.dataMgr.itunesPlaylists.forEach((item) => {
                    if (item.type === "playlist") {
                        this.dataMgr.playlistMap[item.id] = item;
                    }
                });
            }
            return this.dataMgr.itunesPlaylists;
        }
        if (this.dataMgr.spotifyPlaylists &&
            this.dataMgr.spotifyPlaylists.length) {
            this.dataMgr.spotifyPlaylists.forEach((item) => {
                if (item.type === "playlist") {
                    this.dataMgr.playlistMap[item.id] = item;
                }
            });
        }
        return this.dataMgr.spotifyPlaylists;
    }
    //
    // Clear all of the playlists and tracks
    //
    clearPlaylists() {
        this.dataMgr.playlistMap = {};
        this.dataMgr.playlistTrackMap = {};
    }
    updateSort(sortAlpha) {
        if (!MusicUtil_1.requiresSpotifyAccess()) {
            this.dataMgr.rawPlaylists = [...this.dataMgr.origRawPlaylistOrder];
            this.dataMgr.sortAlphabetically = sortAlpha;
            vscode_1.commands.executeCommand("musictime.refreshPlaylist");
        }
    }
    refreshPlaylists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dataMgr.buildingPlaylists) {
                console.log("currently building the playlist, waiting on that job to complete");
                return;
            }
            this.dataMgr.buildingPlaylists = true;
            let serverIsOnline = yield DataController_1.serverIsAvailable();
            if (this.dataMgr.currentPlayerName === cody_music_1.PlayerName.ItunesDesktop) {
                yield this.refreshPlaylistForPlayer(serverIsOnline);
            }
            else {
                yield this.refreshPlaylistForPlayer(serverIsOnline);
            }
            yield MusicCommandManager_1.MusicCommandManager.syncControls(this.dataMgr.runningTrack);
            this.dataMgr.buildingPlaylists = false;
        });
    }
    getPlaylistById(playlist_id) {
        return this.dataMgr.playlistMap[playlist_id];
    }
    //
    // Fetch the playlist names for a specific player
    //
    refreshPlaylistForPlayer(serverIsOnline) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerName = this.dataMgr.currentPlayerName;
            let items = [];
            // states: [NOT_CONNECTED, MAC_PREMIUM, MAC_NON_PREMIUM, PC_PREMIUM, PC_NON_PREMIUM]
            const CONNECTED = !MusicUtil_1.requiresSpotifyAccess() ? true : false;
            const IS_PREMIUM = this.isSpotifyPremium() ? true : false;
            let HAS_SPOTIFY_USER = this.hasSpotifyUser() ? true : false;
            const type = playerName === cody_music_1.PlayerName.ItunesDesktop ? "itunes" : "spotify";
            // ! very important !
            // We need the spotify user if we're connected
            if (CONNECTED && !HAS_SPOTIFY_USER) {
                // get it
                this.dataMgr.spotifyUser = yield cody_music_1.getUserProfile();
            }
            // ! most important part !
            let playlists = this.dataMgr.rawPlaylists || [];
            let hasPlaylists = playlists.length ? true : false;
            let hasLikedSongs = this.dataMgr.spotifyLikedSongs &&
                this.dataMgr.spotifyLikedSongs.length
                ? true
                : false;
            // fetch the playlists
            if (!hasPlaylists && CONNECTED) {
                yield DataController_1.populateSpotifyPlaylists();
                playlists = this.dataMgr.rawPlaylists;
                hasPlaylists = playlists.length > 0 ? true : false;
            }
            if (!hasLikedSongs && CONNECTED) {
                yield DataController_1.populateLikedSongs();
            }
            // sort
            if (this.dataMgr.sortAlphabetically) {
                MusicUtil_1.sortPlaylists(playlists);
            }
            // update each playlist itemType and tag
            if (hasPlaylists) {
                playlists.forEach((playlist) => {
                    this.dataMgr.playlistMap[playlist.id] = playlist;
                    playlist.itemType = "playlist";
                    playlist.tag = type;
                });
            }
            // add the no music time connection button if we're not online
            if (!serverIsOnline && CONNECTED) {
                items.push(this.providerItemMgr.getNoMusicTimeConnectionButton());
            }
            // show the spotify connect premium button if they're connected and a non-premium account
            if (CONNECTED && !IS_PREMIUM) {
                // show the spotify premium account required button
                items.push(this.providerItemMgr.getSpotifyPremiumAccountRequiredButton());
            }
            // add the connect to spotify if they still need to connect
            if (!CONNECTED) {
                items.push(this.providerItemMgr.getConnectToSpotifyButton());
            }
            if (CONNECTED) {
                items.push(this.providerItemMgr.getGenerateDashboardButton());
                items.push(this.providerItemMgr.getWebAnalyticsButton());
            }
            // add the readme button
            items.push(this.providerItemMgr.getReadmeButton());
            if (playerName === cody_music_1.PlayerName.ItunesDesktop) {
                // add the action items specific to itunes
                items.push(this.providerItemMgr.getSwitchToSpotifyButton());
                if (playlists.length > 0) {
                    items.push(this.providerItemMgr.getLineBreakButton());
                }
                playlists.forEach((item) => {
                    items.push(item);
                });
                this.dataMgr.itunesPlaylists = items;
            }
            else {
                // check to see if they have this device available, if not, show a button
                // to switch to this device
                const switchToThisDeviceButton = yield this.providerItemMgr.getSwitchToThisDeviceButton();
                if (switchToThisDeviceButton) {
                    // add it
                    items.push(switchToThisDeviceButton);
                }
                // show the devices button
                if (CONNECTED) {
                    const devicesButton = yield this.providerItemMgr.getActiveSpotifyDevicesButton();
                    items.push(devicesButton);
                }
                if (Util_1.isMac() && Constants_1.SHOW_ITUNES_LAUNCH_BUTTON) {
                    items.push(this.providerItemMgr.getSwitchToItunesButton());
                }
                // add the rest only if they don't need spotify access
                if ((serverIsOnline && CONNECTED) || hasPlaylists) {
                    // line break between actions and software playlist section
                    items.push(this.providerItemMgr.getLineBreakButton());
                    // get the custom playlist button
                    const customPlaylistButton = this.providerItemMgr.getCustomPlaylistButton();
                    if (customPlaylistButton) {
                        items.push(customPlaylistButton);
                    }
                    // get the Software Top 40 Playlist and add it to the playlist
                    const softwareTop40 = yield this.getSoftwareTop40(playlists);
                    if (softwareTop40) {
                        // add it to music time playlist
                        items.push(softwareTop40);
                    }
                    // Add the AI generated playlist
                    const aiPlaylist = this.dataMgr.getAiTopFortyPlaylist();
                    if (aiPlaylist) {
                        items.push(aiPlaylist);
                    }
                    // LIKED SONGS folder
                    // get the folder
                    const likedSongsPlaylist = this.providerItemMgr.getSpotifyLikedPlaylistFolder();
                    this.dataMgr.playlistMap[likedSongsPlaylist.id] = likedSongsPlaylist;
                    items.push(likedSongsPlaylist);
                    // build tracks for recommendations (async)
                    MusicUtil_1.buildTracksForRecommendations(playlists);
                    // line break between software playlist section and normal playlists
                    if (playlists.length > 0) {
                        items.push(this.providerItemMgr.getLineBreakButton());
                    }
                    // build the set of playlists that are not the ai, top 40, and liked songs
                    playlists.forEach((item) => {
                        // add all playlists except for the software top 40.
                        // this one will get displayed in the top section
                        if (item.id !== Constants_1.SOFTWARE_TOP_40_PLAYLIST_ID) {
                            items.push(item);
                        }
                        else if (softwareTop40) {
                            // set the top 40 playlist to loved
                            softwareTop40.loved = true;
                        }
                    });
                }
                this.dataMgr.spotifyPlaylists = items;
            }
            this.dataMgr.ready = true;
        });
    }
    getSoftwareTop40(playlists) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the Software Top 40 Playlist
            let softwareTop40 = playlists.find((n) => n.id === Constants_1.SOFTWARE_TOP_40_PLAYLIST_ID);
            if (!softwareTop40) {
                softwareTop40 = yield cody_music_1.getSpotifyPlaylist(Constants_1.SOFTWARE_TOP_40_PLAYLIST_ID);
            }
            if (softwareTop40 && softwareTop40.id) {
                softwareTop40.loved = false;
                softwareTop40.itemType = "playlist";
                softwareTop40.tag = "paw";
            }
            return softwareTop40;
        });
    }
    //
    // Fetch the playlist overall state
    //
    getPlaylistState(playlist_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let playlistState = cody_music_1.TrackStatus.NotAssigned;
            const playlistTrackItems = yield this.getPlaylistItemTracksForPlaylistId(playlist_id);
            if (playlistTrackItems && playlistTrackItems.length > 0) {
                for (let i = 0; i < playlistTrackItems.length; i++) {
                    const playlistItem = playlistTrackItems[i];
                    if (playlistItem.id === this.dataMgr.runningTrack.id) {
                        return this.dataMgr.runningTrack.state;
                    }
                    else {
                        // update theis track status to not assigned to ensure it's also updated
                        playlistItem.state = cody_music_1.TrackStatus.NotAssigned;
                    }
                }
            }
            return playlistState;
        });
    }
    clearPlaylistTracksForId(playlist_id) {
        this.dataMgr.playlistTrackMap[playlist_id] = null;
    }
    //
    // Fetch the tracks for a given playlist ID
    //
    getPlaylistItemTracksForPlaylistId(playlist_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let playlistItemTracks = this.dataMgr.playlistTrackMap[playlist_id];
            if (!playlistItemTracks || playlistItemTracks.length === 0) {
                if (this.dataMgr.currentPlayerName === cody_music_1.PlayerName.ItunesDesktop) {
                    // get the itunes tracks based on this playlist id name
                    const codyResp = yield cody_music_1.getPlaylistTracks(cody_music_1.PlayerName.ItunesDesktop, playlist_id);
                    playlistItemTracks = this.getPlaylistItemTracksFromCodyResponse(codyResp);
                }
                else {
                    // fetch from spotify web
                    if (playlist_id === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
                        playlistItemTracks = this.getPlaylistItemTracksFromTracks(this.dataMgr.spotifyLikedSongs);
                    }
                    else {
                        // get the playlist tracks from the spotify api
                        const codyResp = yield cody_music_1.getPlaylistTracks(cody_music_1.PlayerName.SpotifyWeb, playlist_id);
                        playlistItemTracks = this.getPlaylistItemTracksFromCodyResponse(codyResp);
                    }
                }
                // update the map
                this.dataMgr.playlistTrackMap[playlist_id] = playlistItemTracks;
            }
            if (playlistItemTracks && playlistItemTracks.length > 0) {
                for (let i = 0; i < playlistItemTracks.length; i++) {
                    const track = playlistItemTracks[i];
                    // check to see if this track is the current track
                    if (this.dataMgr.runningTrack.id === track.id) {
                        playlistItemTracks[i].state = this.dataMgr.runningTrack.state;
                    }
                    else {
                        playlistItemTracks[i].state = cody_music_1.TrackStatus.NotAssigned;
                    }
                    playlistItemTracks[i]["playlist_id"] = playlist_id;
                }
            }
            return playlistItemTracks;
        });
    }
    //
    // Build the playlist items from the list of tracks
    //
    getPlaylistItemTracksFromTracks(tracks) {
        let playlistItems = [];
        if (tracks && tracks.length > 0) {
            for (let i = 0; i < tracks.length; i++) {
                let track = tracks[i];
                const position = i + 1;
                let playlistItem = this.createPlaylistItemFromTrack(track, position);
                playlistItems.push(playlistItem);
            }
        }
        return playlistItems;
    }
    getPlaylistItemTracksFromCodyResponse(codyResponse) {
        let playlistItems = [];
        if (codyResponse && codyResponse.state === cody_music_1.CodyResponseType.Success) {
            let paginationItem = codyResponse.data;
            if (paginationItem && paginationItem.items) {
                playlistItems = paginationItem.items.map((track, idx) => {
                    const position = idx + 1;
                    let playlistItem = this.createPlaylistItemFromTrack(track, position);
                    return playlistItem;
                });
            }
        }
        return playlistItems;
    }
    getArtist(track) {
        if (!track) {
            return null;
        }
        if (track.artist) {
            return track.artist;
        }
        if (track.artists && track.artists.length > 0) {
            const trackArtist = track.artists[0];
            return trackArtist.name;
        }
        return null;
    }
    createPlaylistItemFromTrack(track, position) {
        const popularity = track.popularity ? track.popularity : null;
        const artistName = this.getArtist(track);
        let tooltip = track.name;
        if (artistName) {
            tooltip += ` - ${artistName}`;
        }
        if (popularity) {
            tooltip += ` (Popularity: ${popularity})`;
        }
        let playlistItem = new cody_music_1.PlaylistItem();
        playlistItem.type = "track";
        playlistItem.name = track.name;
        playlistItem.tooltip = tooltip;
        playlistItem.id = track.id;
        playlistItem.uri = track.uri;
        playlistItem.popularity = track.popularity;
        playlistItem.position = position;
        playlistItem.artist = artistName;
        playlistItem.playerType = track.playerType;
        playlistItem.itemType = "track";
        playlistItem["icon"] = "track.svg";
        delete playlistItem.tracks;
        if (track.id === this.dataMgr.runningTrack.id) {
            playlistItem.state = this.dataMgr.runningTrack.state;
            this.dataMgr.selectedTrackItem = playlistItem;
        }
        else {
            playlistItem.state = cody_music_1.TrackStatus.NotAssigned;
        }
        return playlistItem;
    }
    playNextLikedSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasSpotifyPlaybackAccess = MusicManager.getInstance().hasSpotifyPlaybackAccess();
            const deviceId = MusicUtil_1.getDeviceId();
            // play the next song
            const nextTrack = this.getNextSpotifyLikedSong();
            if (nextTrack) {
                let playlistItem = this.createPlaylistItemFromTrack(nextTrack, 0);
                this.dataMgr.selectedTrackItem = playlistItem;
                if (hasSpotifyPlaybackAccess) {
                    // play the next track
                    yield MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.playSpotifyTrack, [playlistItem.id, deviceId]);
                }
                else {
                    // play it using the track id
                    const trackUri = Util_1.createUriFromTrackId(playlistItem.id);
                    const params = [trackUri];
                    yield cody_music_1.playTrackInContext(cody_music_1.PlayerName.SpotifyDesktop, params);
                }
            }
        });
    }
    playPreviousLikedSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const hasSpotifyPlaybackAccess = MusicManager.getInstance().hasSpotifyPlaybackAccess();
            const deviceId = MusicUtil_1.getDeviceId();
            // play the next song
            const prevTrack = this.getPreviousSpotifyLikedSong();
            if (prevTrack) {
                let playlistItem = this.createPlaylistItemFromTrack(prevTrack, 0);
                this.dataMgr.selectedTrackItem = playlistItem;
                if (hasSpotifyPlaybackAccess) {
                    // launch and play the next track
                    yield MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.playSpotifyTrack, [playlistItem.id, deviceId]);
                }
                else {
                    // play it using the track id
                    const trackUri = Util_1.createUriFromTrackId(playlistItem.id);
                    const params = [trackUri];
                    yield cody_music_1.playTrackInContext(cody_music_1.PlayerName.SpotifyDesktop, params);
                }
            }
        });
    }
    /**
     * Return the next Spotify Track from the Liked Songs list.
     * It will return null if the Liked Songs list doesn't exist or the current track ID is not assigned.
     * It will return the 1st track if the current track ID is not assigned and the Liked Songs list exists.
     */
    getNextSpotifyLikedSong() {
        const currentTrackId = this.dataMgr.selectedTrackItem.id;
        const hasLikedSongs = this.dataMgr.spotifyLikedSongs &&
            this.dataMgr.spotifyLikedSongs.length > 0;
        if (currentTrackId && hasLikedSongs) {
            let currTrackIndex = this.dataMgr.spotifyLikedSongs.findIndex((i) => i.id === currentTrackId);
            if (currTrackIndex !== -1) {
                // if the curr track index is the last element, return zero, else return the next one
                if (currTrackIndex + 1 <
                    this.dataMgr.spotifyLikedSongs.length) {
                    return this.dataMgr.spotifyLikedSongs[currTrackIndex + 1];
                }
                else {
                    return this.dataMgr.spotifyLikedSongs[0];
                }
            }
        }
        else if (!currentTrackId && hasLikedSongs) {
            return this.dataMgr.spotifyLikedSongs[0];
        }
        return null;
    }
    getPreviousSpotifyLikedSong() {
        const currentTrackId = this.dataMgr.selectedTrackItem.id;
        const hasLikedSongs = this.dataMgr.spotifyLikedSongs &&
            this.dataMgr.spotifyLikedSongs.length > 0;
        if (currentTrackId && hasLikedSongs) {
            const currTrackIndex = this.dataMgr.spotifyLikedSongs.findIndex((i) => i.id === currentTrackId);
            if (currTrackIndex !== -1) {
                // if the curr track index is the last element, return zero, else return the next one
                if (currTrackIndex - 1 >= 0) {
                    return this.dataMgr.spotifyLikedSongs[currTrackIndex - 1];
                }
                else {
                    return this.dataMgr.spotifyLikedSongs[this.dataMgr.spotifyLikedSongs.length - 1];
                }
            }
        }
        return null;
    }
    /**
     * These are the top productivity songs for this user
     */
    syncUsersWeeklyTopSongs() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield HttpClient_1.softwareGet("/music/recommendations?limit=40", Util_1.getItem("jwt"));
            if (HttpClient_1.isResponseOk(response) && response.data.length > 0) {
                this.dataMgr.userTopSongs = response.data;
            }
            else {
                // clear the favorites
                this.dataMgr.userTopSongs = [];
            }
        });
    }
    generateUsersWeeklyTopSongs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dataMgr.buildingCustomPlaylist) {
                return;
            }
            const serverIsOnline = yield DataController_1.serverIsAvailable();
            if (!serverIsOnline) {
                vscode_1.window.showInformationMessage("Our service is temporarily unavailable, please try again later.");
                return;
            }
            if (MusicUtil_1.requiresSpotifyAccess()) {
                // don't create or refresh, no spotify access provided
                return;
            }
            this.dataMgr.buildingCustomPlaylist = true;
            let customPlaylist = this.dataMgr.getMusicTimePlaylistByTypeId(Constants_1.PERSONAL_TOP_SONGS_PLID);
            const infoMsg = !customPlaylist
                ? `Creating and populating the ${Constants_1.PERSONAL_TOP_SONGS_NAME} playlist, please wait.`
                : `Refreshing the ${Constants_1.PERSONAL_TOP_SONGS_NAME} playlist, please wait.`;
            vscode_1.window.showInformationMessage(infoMsg);
            let playlistId = null;
            if (!customPlaylist) {
                const playlistResult = yield cody_music_1.createPlaylist(Constants_1.PERSONAL_TOP_SONGS_NAME, true);
                const errMsg = Util_1.getCodyErrorMessage(playlistResult);
                if (errMsg) {
                    vscode_1.window.showErrorMessage(`There was an unexpected error adding tracks to the playlist. ${errMsg} Refresh the playlist and try again if you feel the problem has been resolved.`, ...[Constants_1.OK_LABEL]);
                    this.dataMgr.buildingCustomPlaylist = false;
                    return;
                }
                playlistId = playlistResult.data.id;
                yield this.updateSavedPlaylists(playlistId, Constants_1.PERSONAL_TOP_SONGS_PLID, Constants_1.PERSONAL_TOP_SONGS_NAME).catch((err) => {
                    Util_1.logIt("Error updating music time with generated playlist ID");
                });
            }
            else {
                // get the spotify playlist id from the app's existing playlist info
                playlistId = customPlaylist.id;
            }
            // get the spotify track ids and create the playlist
            if (playlistId) {
                // sync the user's weekly top songs
                yield this.syncUsersWeeklyTopSongs();
                // add the tracks
                // list of [{trackId, artist, name}...]
                if (this.dataMgr.userTopSongs &&
                    this.dataMgr.userTopSongs.length > 0) {
                    let tracksToAdd = this.dataMgr.userTopSongs.map((item) => {
                        if (item.uri) {
                            return item.uri;
                        }
                        else if (item.trackId) {
                            return item.trackId;
                        }
                        return item.id;
                    });
                    if (!customPlaylist) {
                        yield this.addTracks(playlistId, Constants_1.PERSONAL_TOP_SONGS_NAME, tracksToAdd);
                    }
                    else {
                        yield cody_music_1.replacePlaylistTracks(playlistId, tracksToAdd).catch((err) => {
                            Util_1.logIt(`Error replacing tracks: ${err.message}`);
                        });
                        vscode_1.window.showInformationMessage(`Successfully refreshed ${Constants_1.PERSONAL_TOP_SONGS_NAME}.`);
                    }
                }
                else {
                    vscode_1.window.showInformationMessage(`Successfully created ${Constants_1.PERSONAL_TOP_SONGS_NAME}, but we're unable to add any songs at the moment.`, ...[Constants_1.OK_LABEL]);
                }
            }
            // repopulate the spotify playlists
            yield DataController_1.populateSpotifyPlaylists();
            vscode_1.commands.executeCommand("musictime.refreshPlaylist");
            // update building custom playlist to false
            this.dataMgr.buildingCustomPlaylist = false;
        });
    }
    addTracks(playlist_id, name, tracksToAdd) {
        return __awaiter(this, void 0, void 0, function* () {
            if (playlist_id) {
                // create the playlist_id in software
                const addTracksResult = yield cody_music_1.addTracksToPlaylist(playlist_id, tracksToAdd);
                if (addTracksResult.state === cody_music_1.CodyResponseType.Success) {
                    vscode_1.window.showInformationMessage(`Successfully created ${name} and added tracks.`);
                }
                else {
                    vscode_1.window.showErrorMessage(`There was an unexpected error adding tracks to the playlist. ${addTracksResult.message}`, ...[Constants_1.OK_LABEL]);
                }
            }
        });
    }
    updateSavedPlaylists(playlist_id, playlistTypeId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            // playlistTypeId 1 = personal custom top 40
            const payload = {
                playlist_id,
                playlistTypeId,
                name,
            };
            let jwt = Util_1.getItem("jwt");
            let createResult = yield HttpClient_1.softwarePost("/music/playlist/generated", payload, jwt);
            return createResult;
        });
    }
    initializeSlack() {
        return __awaiter(this, void 0, void 0, function* () {
            const serverIsOnline = yield DataController_1.serverIsAvailable();
            if (serverIsOnline) {
                const slackOauth = yield DataController_1.getSlackOauth(serverIsOnline);
                if (slackOauth) {
                    // update the CodyMusic credentials
                    this.updateSlackAccessInfo(slackOauth);
                }
                else {
                    Util_1.setItem("slack_access_token", null);
                }
            }
        });
    }
    updateSlackAccessInfo(slackOauth) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * {access_token, refresh_token}
             */
            if (slackOauth) {
                Util_1.setItem("slack_access_token", slackOauth.access_token);
            }
            else {
                Util_1.setItem("slack_access_token", null);
            }
        });
    }
    updateSpotifyAccessInfo(spotifyOauth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (spotifyOauth && spotifyOauth.access_token) {
                // update the CodyMusic credentials
                Util_1.setItem("spotify_access_token", spotifyOauth.access_token);
                Util_1.setItem("spotify_refresh_token", spotifyOauth.refresh_token);
                // update cody config
                this.dataMgr.updateCodyConfig();
            }
            else {
                Util_1.setItem("spotify_access_token", null);
                Util_1.setItem("spotify_refresh_token", null);
                // update cody config
                this.dataMgr.updateCodyConfig();
                // update the spotify user to null
                this.dataMgr.spotifyUser = null;
            }
        });
    }
    initializeSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            const serverIsOnline = yield DataController_1.serverIsAvailable();
            // get the client id and secret
            let clientId;
            let clientSecret;
            if (serverIsOnline) {
                let jwt = Util_1.getItem("jwt");
                if (!jwt) {
                    jwt = yield DataController_1.getAppJwt(serverIsOnline);
                }
                const resp = yield HttpClient_1.softwareGet("/auth/spotify/clientInfo", jwt);
                if (HttpClient_1.isResponseOk(resp)) {
                    // get the clientId and clientSecret
                    clientId = resp.data.clientId;
                    clientSecret = resp.data.clientSecret;
                }
            }
            this.dataMgr.spotifyClientId = clientId;
            this.dataMgr.spotifyClientSecret = clientSecret;
            this.dataMgr.updateCodyConfig();
            // update the user info
            yield DataController_1.getMusicTimeUserStatus(serverIsOnline);
            // initialize the status bar music controls
            MusicCommandManager_1.MusicCommandManager.initialize();
        });
    }
    launchTrackPlayer(playerName = null, callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
            // if the player name is null, definitely check if there's an active or available device
            if (!playerName) {
                if (!activeDevice) {
                    if (webPlayer) {
                        playerName = cody_music_1.PlayerName.SpotifyWeb;
                    }
                }
                else if (activeDevice && activeWebPlayerDevice) {
                    // it's an active web player device
                    playerName = cody_music_1.PlayerName.SpotifyWeb;
                }
            }
            if (!playerName) {
                playerName = cody_music_1.PlayerName.SpotifyDesktop;
            }
            // spotify device launch error would look like this...
            // error:"Command failed: open -a spotify\nUnable to find application named 'spotify'\n"
            let result = yield cody_music_1.launchPlayer(playerName, { quietly: false });
            // test if there was an error, fallback to the web player
            if (playerName === cody_music_1.PlayerName.SpotifyDesktop &&
                result &&
                result.error &&
                result.error.includes("failed")) {
                // start the process of launching the web player
                playerName = cody_music_1.PlayerName.SpotifyWeb;
                yield cody_music_1.launchPlayer(playerName, { quietly: false });
            }
            setTimeout(() => {
                this.checkDeviceLaunch(playerName, 7, callback);
            }, 1500);
        });
    }
    checkDeviceLaunch(playerName, tries = 5, callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield DataController_1.populateSpotifyDevices();
                const devices = this.dataMgr.currentDevices;
                if ((!devices || devices.length == 0) && tries > 0) {
                    tries--;
                    this.checkDeviceLaunch(playerName, tries, callback);
                }
                else {
                    // it should only have either the desktop or web device available
                    // since this is part of the check device launch path
                    const deviceId = MusicUtil_1.getDeviceId();
                    const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
                    if (!activeComputerDevice && !activeWebPlayerDevice) {
                        // transfer to the device
                        yield cody_music_1.transferSpotifyDevice(deviceId, false);
                    }
                    vscode_1.commands.executeCommand("musictime.refreshDeviceInfo");
                    if (callback) {
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            callback();
                        }), 1000);
                    }
                }
            }), 1500);
        });
    }
    isLikedSong() {
        return __awaiter(this, void 0, void 0, function* () {
            const playlistId = this.dataMgr.selectedPlaylist
                ? this.dataMgr.selectedPlaylist.id
                : null;
            const isLikedSong = playlistId === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME ? true : false;
            return isLikedSong;
        });
    }
    isMacDesktopEnabled() {
        const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, activeDesktopPlayerDevice, } = MusicUtil_1.getDeviceSet();
        return Util_1.isMac() && activeDesktopPlayerDevice ? true : false;
    }
    hasSpotifyPlaybackAccess() {
        return this.dataMgr.spotifyUser &&
            this.dataMgr.spotifyUser.product === "premium"
            ? true
            : false;
    }
    hasSpotifyUser() {
        return this.dataMgr.spotifyUser && this.dataMgr.spotifyUser.product
            ? true
            : false;
    }
    isSpotifyPremium() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.hasSpotifyUser() &&
                this.dataMgr.spotifyUser.product === "premium"
                ? true
                : false;
        });
    }
    getPlayerNameForPlayback() {
        // if you're offline you may still have spotify desktop player abilities.
        // check if the current player is spotify and we don't have web access.
        // if no web access, then use the desktop player
        if (this.dataMgr.currentPlayerName !== cody_music_1.PlayerName.ItunesDesktop &&
            Util_1.isMac() &&
            !this.hasSpotifyPlaybackAccess()) {
            return cody_music_1.PlayerName.SpotifyDesktop;
        }
        return this.dataMgr.currentPlayerName;
    }
    showPlayerLaunchConfirmation(callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasSpotifyPlaybackAccess = MusicManager.getInstance().hasSpotifyPlaybackAccess();
            const buttons = hasSpotifyPlaybackAccess
                ? ["Web Player", "Desktop Player"]
                : ["Desktop Player"];
            // no devices found at all OR no active devices and a computer device is not found in the list
            const selectedButton = yield vscode_1.window.showInformationMessage(`Music Time requires a running Spotify player. Choose a player to launch.`, ...buttons);
            if (selectedButton === "Desktop Player" ||
                selectedButton === "Web Player") {
                const playerName = selectedButton === "Desktop Player"
                    ? cody_music_1.PlayerName.SpotifyDesktop
                    : cody_music_1.PlayerName.SpotifyWeb;
                // start the launch process and pass the callback when complete
                return this.launchTrackPlayer(playerName, callback);
            }
            else {
                // operation cancelled
                return;
            }
        });
    }
    playInitialization(callback = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = this.dataMgr.currentDevices;
            const deviceSet = MusicUtil_1.getDeviceSet();
            const no_devices = !devices || devices.length === 0 ? true : false;
            let hasSpotifyUser = MusicManager.getInstance().hasSpotifyUser();
            if (!hasSpotifyUser) {
                // try again
                yield DataController_1.populateSpotifyUser();
                hasSpotifyUser = MusicManager.getInstance().hasSpotifyUser();
            }
            if (no_devices ||
                (!deviceSet.webPlayer &&
                    !deviceSet.desktop &&
                    !deviceSet.activeDevice)) {
                return yield this.showPlayerLaunchConfirmation(callback);
            }
            // we have a device, continue to the callback if we have it
            if (callback) {
                callback();
            }
        });
    }
    followSpotifyPlaylist(playlist) {
        return __awaiter(this, void 0, void 0, function* () {
            const codyResp = yield cody_music_1.followPlaylist(playlist.id);
            if (codyResp.state === cody_music_1.CodyResponseType.Success) {
                vscode_1.window.showInformationMessage(`Successfully following the '${playlist.name}' playlist.`);
                // repopulate the playlists since we've changed the state of the playlist
                yield DataController_1.populateSpotifyPlaylists();
                vscode_1.commands.executeCommand("musictime.refreshPlaylist");
            }
            else {
                vscode_1.window.showInformationMessage(`Unable to follow ${playlist.name}. ${codyResp.message}`, ...[Constants_1.OK_LABEL]);
            }
        });
    }
    removeTrackFromPlaylist(trackItem) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the playlist it's in
            const currentPlaylistId = trackItem["playlist_id"];
            const foundPlaylist = yield this.getPlaylistById(currentPlaylistId);
            if (foundPlaylist) {
                // if it's the liked songs, then send it to the setLiked(false) api
                if (foundPlaylist.id === Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
                    const buttonSelection = yield vscode_1.window.showInformationMessage(`Are you sure you would like to remove ${trackItem.name} from your '${Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME}' playlist`, ...[Constants_1.YES_LABEL]);
                    if (buttonSelection === Constants_1.YES_LABEL) {
                        let track = new cody_music_1.Track();
                        track.id = trackItem.id;
                        track.playerType = cody_music_1.PlayerType.WebSpotify;
                        track.state = cody_music_1.TrackStatus.NotAssigned;
                        yield MusicControlManager_1.MusicControlManager.getInstance().setLiked(false, track);
                        vscode_1.commands.executeCommand("musictime.refreshPlaylist");
                    }
                }
            }
        });
    }
    /**
     * Transfer to this device
     * @param computerDevice
     */
    transferToComputerDevice(computerDevice = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = yield this.dataMgr.currentDevices;
            if (!computerDevice) {
                computerDevice =
                    devices && devices.length > 0
                        ? devices.find((d) => d.type.toLowerCase() === "computer")
                        : null;
            }
            if (computerDevice) {
                yield cody_music_1.playSpotifyDevice(computerDevice.id);
            }
        });
    }
    isTrackRepeating() {
        return __awaiter(this, void 0, void 0, function* () {
            // get the current repeat state
            const spotifyContext = this.dataMgr.spotifyContext;
            // "off", "track", "context", ""
            const repeatState = spotifyContext ? spotifyContext.repeat_state : "";
            console.log("repeat state: ", repeatState);
            return repeatState && repeatState === "track" ? true : false;
        });
    }
    getPlaylistTrackState(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            let playlistItemTracks = this.dataMgr.playlistTrackMap[playlistId];
            if (!playlistItemTracks || playlistItemTracks.length === 0) {
                playlistItemTracks = yield this.getPlaylistItemTracksForPlaylistId(playlistId);
            }
            if (playlistItemTracks && playlistItemTracks.length > 0) {
                for (let i = 0; i < playlistItemTracks.length; i++) {
                    const track = playlistItemTracks[i];
                    // check to see if this track is the current track
                    if (this.dataMgr.runningTrack.id === track.id) {
                        return this.dataMgr.runningTrack.state;
                    }
                }
            }
            return cody_music_1.TrackStatus.NotAssigned;
        });
    }
    playSelectedItem(playlistItem) {
        return __awaiter(this, void 0, void 0, function* () {
            // set the selected track and/or playlist
            if (playlistItem.type !== "playlist") {
                this.dataMgr.selectedTrackItem = playlistItem;
                const currentPlaylistId = playlistItem["playlist_id"];
                const playlist = yield this.getPlaylistById(currentPlaylistId);
                this.dataMgr.selectedPlaylist = playlist;
            }
            else {
                // set the selected playlist
                this.dataMgr.selectedPlaylist = playlistItem;
            }
            // ask to launch web or desktop if neither are running
            yield this.playInitialization(this.playMusicSelection);
        });
    }
}
exports.MusicManager = MusicManager;
//# sourceMappingURL=MusicManager.js.map