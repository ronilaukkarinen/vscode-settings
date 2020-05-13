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
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const cody_music_1 = require("cody-music");
const MusicManager_1 = require("./MusicManager");
const KpmController_1 = require("../KpmController");
const Constants_1 = require("../Constants");
const MusicCommandManager_1 = require("./MusicCommandManager");
const OfflineManager_1 = require("../OfflineManager");
const MusicDataManager_1 = require("./MusicDataManager");
const vscode_1 = require("vscode");
const MusicUtil_1 = require("./MusicUtil");
const moment = require("moment-timezone");
class MusicStateManager {
    constructor() {
        this.existingTrack = new cody_music_1.Track();
        this.lastSongSessionStart = 0;
        this.numerics = [
            "add",
            "paste",
            "delete",
            "netkeys",
            "linesAdded",
            "linesRemoved",
            "open",
            "close",
            "keystrokes",
        ];
        // private to prevent non-singleton usage
    }
    static getInstance() {
        if (!MusicStateManager.instance) {
            MusicStateManager.instance = new MusicStateManager();
        }
        return MusicStateManager.instance;
    }
    /**
     * Get the selected playlis or find it from the list of playlists
     * @param track
     */
    updateTrackPlaylistId(track) {
        const selectedPlaylist = MusicDataManager_1.MusicDataManager.getInstance().selectedPlaylist;
        if (selectedPlaylist) {
            track["playlistId"] = selectedPlaylist.id;
        }
    }
    getUtcAndLocal() {
        const utc = Util_1.nowInSecs();
        const offset_sec = this.timeOffsetSeconds();
        const local = utc - offset_sec;
        return { utc, local };
    }
    timeOffsetSeconds() {
        const d = new Date();
        // offset is the minutes from GMT. it's positive if it's before, and negative after
        const offset = d.getTimezoneOffset();
        return offset * 60;
    }
    isEndInRange(playingTrack) {
        if (!playingTrack || !playingTrack.id) {
            return false;
        }
        const buffer = playingTrack.duration_ms * 0.07;
        return playingTrack.progress_ms >= playingTrack.duration_ms - buffer;
    }
    isExistingTrackPlaying() {
        return this.existingTrack &&
            this.existingTrack.id &&
            this.existingTrack.state === cody_music_1.TrackStatus.Playing
            ? true
            : false;
    }
    /**
     * Core logic in gathering tracks. This is called every 5 seconds.
     */
    gatherMusicInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            try {
                const utcLocalTimes = this.getUtcAndLocal();
                const serverIsOnline = yield DataController_1.serverIsAvailable();
                const deviceId = MusicUtil_1.getDeviceId();
                const requiresAccess = MusicUtil_1.requiresSpotifyAccess();
                if ((!serverIsOnline && !Util_1.isMac()) || requiresAccess) {
                    // either no device ID, requires spotify connection,
                    // or it's a windows device that is not online
                    return;
                }
                // check if we've set the existing device id but don't have a device
                if ((!this.existingTrack || !this.existingTrack.id) && !deviceId) {
                    // no existing track and no device, skip checking
                    return;
                }
                let playingTrack = null;
                if (Util_1.isMac()) {
                    // fetch from the desktop
                    playingTrack = yield cody_music_1.getTrack(cody_music_1.PlayerName.SpotifyDesktop);
                    // applescript doesn't always return a name
                    if (!playingTrack || !playingTrack.name) {
                        playingTrack = yield cody_music_1.getTrack(cody_music_1.PlayerName.SpotifyWeb);
                    }
                }
                else {
                    playingTrack = yield cody_music_1.getTrack(cody_music_1.PlayerName.SpotifyWeb);
                }
                if (!playingTrack || (playingTrack && playingTrack.httpStatus >= 400)) {
                    // currently unable to fetch the track
                    return;
                }
                if (!playingTrack) {
                    // make an empty track
                    playingTrack = new cody_music_1.Track();
                }
                const isValidTrack = this.isValidTrack(playingTrack);
                // convert the playing track id to an id
                if (isValidTrack) {
                    if (!playingTrack.uri) {
                        playingTrack.uri = Util_1.createUriFromTrackId(playingTrack.id);
                    }
                    playingTrack.id = Util_1.createSpotifyIdFromUri(playingTrack.id);
                }
                const isNewTrack = this.existingTrack.id !== playingTrack.id ? true : false;
                const sendSongSession = isNewTrack && this.existingTrack.id ? true : false;
                const trackStateChanged = this.existingTrack.state !== playingTrack.state ? true : false;
                // has the existing track ended or have we started a new track?
                if (sendSongSession) {
                    // just set it to playing
                    this.existingTrack.state = cody_music_1.TrackStatus.Playing;
                    // copy the existing track to "songSession"
                    const songSession = Object.assign({}, this.existingTrack);
                    // gather coding and send the track
                    this.gatherCodingDataAndSendSongSession(songSession);
                    // clear the track.
                    this.existingTrack = null;
                    if (playingTrack) {
                        this.existingTrack = new cody_music_1.Track();
                    }
                }
                if (!this.existingTrack || this.existingTrack.id !== playingTrack.id) {
                    // update the entire object if the id's don't match
                    this.existingTrack = Object.assign({}, playingTrack);
                }
                if (this.existingTrack.state !== playingTrack.state) {
                    // update the state if the state doesn't match
                    this.existingTrack.state = playingTrack.state;
                }
                // set the start for the playing track
                if (this.existingTrack &&
                    this.existingTrack.id &&
                    !this.existingTrack["start"]) {
                    this.existingTrack["start"] = utcLocalTimes.utc;
                    this.existingTrack["local_start"] = utcLocalTimes.local;
                    this.existingTrack["end"] = 0;
                }
                // update the running track
                dataMgr.runningTrack = this.existingTrack;
                // update the music time status bar
                MusicCommandManager_1.MusicCommandManager.syncControls(dataMgr.runningTrack, false);
                if (isNewTrack) {
                    // update the playlistId
                    this.updateTrackPlaylistId(playingTrack);
                    // the player context such as player device status
                    DataController_1.populatePlayerContext();
                    if (trackStateChanged) {
                        // update the device info in case the device has changed
                        vscode_1.commands.executeCommand("musictime.refreshDeviceInfo");
                    }
                }
            }
            catch (e) {
                const errMsg = e.message || e;
                Util_1.logIt(`Unexpected track state processing error: ${errMsg}`);
            }
        });
    }
    playNextLikedSpotifyCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            const musicMgr = MusicManager_1.MusicManager.getInstance();
            // If the current playlist is the Liked Songs,
            // check if we should start the next track
            const playlistId = dataMgr.selectedPlaylist ? dataMgr.selectedPlaylist.id : "";
            if (!playlistId || playlistId !== Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
                // no need to go further, it's not the liked songs playlist
                return;
            }
            // check if we're loading, if so, bail out
            if (MusicCommandManager_1.MusicCommandManager.isLoading()) {
                return;
            }
            if (!dataMgr.currentDevices || dataMgr.currentDevices.length === 0) {
                // they've closed the player, don't try to play again
                return;
            }
            // play the next song
            yield musicMgr.playNextLikedSong();
        });
    }
    gatherCodingDataAndSendSongSession(songSession) {
        return __awaiter(this, void 0, void 0, function* () {
            const utcLocalTimes = this.getUtcAndLocal();
            if (!songSession.start) {
                // arbitrary since song session start wasn't set
                let secondsBack = 201;
                // this should have been set but use the song's duration
                if (!this.lastSongSessionStart) {
                    const diffTime = utcLocalTimes.utc - this.lastSongSessionStart;
                    secondsBack = Math.min(diffTime, secondsBack) - 1;
                }
                songSession["start"] = utcLocalTimes.utc - secondsBack;
                songSession["local_start"] = utcLocalTimes.local - secondsBack;
            }
            this.lastSongSessionStart = songSession.start;
            if (!songSession["end"]) {
                songSession["end"] = utcLocalTimes.utc;
                songSession["local_end"] = utcLocalTimes.local;
            }
            // if this track doesn't have album json data null it out
            if (songSession.album) {
                // check if it's a valid json
                if (!Util_1.isValidJson(songSession.album)) {
                    // null these out. the backend will populate these
                    songSession.album = null;
                    songSession.artists = null;
                    songSession.features = null;
                }
            }
            // make sure duration_ms is set. it may not be defined
            // if it's coming from one of the players
            if (!songSession.duration_ms && songSession.duration) {
                songSession.duration_ms = songSession.duration;
            }
            // Make sure the current keystrokes payload completes. This will save
            // the code time data for music and code time (only if code time is not installed)
            const latestPayload = yield KpmController_1.KpmController.getInstance().sendKeystrokeDataIntervalHandler();
            // get the rows from the music data file
            let payloads = yield OfflineManager_1.getDataRows(Util_1.getSoftwareDataStoreFile(), false /*deleteAfterRead*/);
            if (!payloads) {
                payloads = [];
            }
            if (latestPayload) {
                payloads.push(latestPayload);
            }
            // 10 second minimum threshold
            const isValidSession = songSession.end - songSession.start > 10;
            if (!isValidSession) {
                // the song did not play long enough to constitute as a valid session
                return;
            }
            let genre = songSession.genre;
            let genreP = null;
            let fullTrackP = null;
            // fetch the full track or genre
            if (songSession.type === "spotify") {
                // just fetch the entire track
                fullTrackP = cody_music_1.getSpotifyTrackById(songSession.id, true /*includeFullArtist*/, true /*includeAudioFeatures*/, true /*includeGenre*/);
            }
            else if (!genre) {
                // fetch the genre
                const artistName = MusicManager_1.MusicManager.getInstance().getArtist(songSession);
                const songName = songSession.name;
                const artistId = songSession.artists && songSession.artists.length
                    ? songSession.artists[0].id
                    : "";
                // async
                genreP = cody_music_1.getGenre(artistName, songName, artistId);
            }
            // add any file payloads we found
            const songSessionSource = {};
            if (payloads && payloads.length) {
                payloads.forEach((payload) => {
                    const sourceKeys = payload.source ? Object.keys(payload.source) : [];
                    sourceKeys.forEach((sourceKey) => {
                        let data = {};
                        data[sourceKey] = payload.source[sourceKey];
                        if (!data[sourceKey]["end"]) {
                            data[sourceKey]["end"] = utcLocalTimes.utc;
                            data[sourceKey]["local_end"] = utcLocalTimes.local;
                        }
                        // only add the file payload if the song session's end is after the song session start
                        if (data[sourceKey] && data[sourceKey].end > songSession.start) {
                            if (songSessionSource[sourceKey]) {
                                // aggregate it
                                const existingData = songSessionSource[sourceKey];
                                const fileData = data[sourceKey];
                                Object.keys(existingData).forEach((key) => {
                                    if (this.numerics.includes(key)) {
                                        existingData[key] += fileData[key];
                                    }
                                });
                            }
                            else {
                                // assign it
                                songSessionSource[sourceKey] = data[sourceKey];
                            }
                        }
                    });
                });
            }
            const initialValue = {
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
                offset: Util_1.getOffsetSecends() / 60,
                pluginId: Util_1.getPluginId(),
                os: Util_1.getOs(),
                version: Util_1.getVersion(),
                source: songSessionSource,
                repoFileCount: 0,
                repoContributorCount: 0,
            };
            // build the file aggregate data, but only keep the coding data
            // that match up to the song session range
            const songData = this.buildAggregateData(songSessionSource, initialValue);
            // await for either promise, whichever one is available
            const fullTrack = yield fullTrackP;
            if (fullTrack && fullTrack.album) {
                // update the tracks with the result
                songSession["album"] = fullTrack.album;
                songSession["features"] = fullTrack.features;
                songSession["artists"] = fullTrack.artists;
                if (!genre) {
                    songSession["genre"] = fullTrack.genre;
                }
            }
            if (!songSession.genre) {
                genre = yield genreP;
                if (genre) {
                    songSession["genre"] = genre;
                }
            }
            // set a convenience "spotifyTrackId" attribute based on the URI
            if (songSession.type === "spotify" && songSession.uri) {
                songSession["spotifyTrackId"] = songSession.uri;
                // make sure the trackId is the URI if it's a spotify track
                songSession["trackId"] = songSession.uri;
            }
            songSession = Object.assign(Object.assign({}, songSession), songData);
            // make sure we've set the "liked" to true if it's coming from the liked songs playlist
            if (!songSession.liked &&
                songSession.playlistId &&
                songSession.playlistId.toLowerCase === "liked songs") {
                songSession["liked"] = true;
            }
            // check pluginId, version, and os
            if (!songSession.pluginId) {
                songSession["pluginId"] = Util_1.getPluginId();
            }
            if (!songSession.os) {
                songSession["os"] = Util_1.getOs();
            }
            if (!songSession.version) {
                songSession["version"] = Util_1.getVersion();
            }
            // send the music data, if we're online
            DataController_1.sendMusicData(songSession);
        });
    }
    /**
     *
     * @param payloads
     * Should return...
     *  add: 0,
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
        offset: getOffsetSecends() / 60,
        pluginId: getPluginId(),
        os: getOs(),
        version: getVersion(),
        source: [],
        repoFileCount: 0,
        repoContributorCount: 0,
     */
    buildAggregateData(songSessionSource, initialValue) {
        let totalKeystrokes = 0;
        if (songSessionSource && Object.keys(songSessionSource).length) {
            // go through the source object
            // initialValue.source = element.source;
            const keys = Object.keys(songSessionSource);
            if (keys && keys.length > 0) {
                keys.forEach((key) => {
                    let sourceObj = songSessionSource[key];
                    const sourceObjKeys = Object.keys(sourceObj);
                    if (sourceObjKeys && sourceObjKeys.length > 0) {
                        sourceObjKeys.forEach((sourceObjKey) => {
                            const val = sourceObj[sourceObjKey];
                            if (this.numerics.includes(sourceObjKey)) {
                                // aggregate
                                initialValue[sourceObjKey] += val;
                            }
                        });
                    }
                    // set the sourceObj.keystrokes
                    sourceObj.keystrokes =
                        sourceObj.paste + sourceObj.add + sourceObj.delete;
                    // sum the keystrokes
                    totalKeystrokes += sourceObj.keystrokes;
                    if (!initialValue.syntax && sourceObj.syntax) {
                        initialValue.syntax = sourceObj.syntax;
                    }
                    if (!sourceObj.timezone) {
                        sourceObj["timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    }
                    if (!sourceObj.offset) {
                        sourceObj["offset"] = Util_1.getOffsetSecends() / 60;
                    }
                    if (!sourceObj.pluginId) {
                        sourceObj["pluginId"] = Util_1.getPluginId();
                    }
                    if (!sourceObj.os) {
                        sourceObj["os"] = Util_1.getOs();
                    }
                    if (!sourceObj.version) {
                        sourceObj["version"] = Util_1.getVersion();
                    }
                });
            }
        }
        initialValue.keystrokes = totalKeystrokes;
        return initialValue;
    }
    /**
     * This will send the keystrokes batch data along with returning all of the gathered keystrokes.
     * If track ends, it will also request to send the current keystrokes. The 30 minute timer will
     * not request to send the current keystrokes as those will be used if a track is currently playing.
     * @param sendCurrentKeystrokes
     */
    processOfflineSongSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            const payloads = yield OfflineManager_1.getDataRows(Util_1.getSongSessionDataFile());
            if (payloads && payloads.length > 0) {
                // send the offline song sessions
                for (let i = 0; i < payloads.length; i++) {
                    yield DataController_1.sendMusicData(payloads[i]);
                }
            }
        });
    }
    isValidTrack(playingTrack) {
        if (playingTrack && playingTrack.id) {
            return true;
        }
        return false;
    }
}
exports.MusicStateManager = MusicStateManager;
MusicStateManager.WINDOWS_SPOTIFY_TRACK_FIND = 'tasklist /fi "imagename eq Spotify.exe" /fo list /v | find " - "';
//# sourceMappingURL=MusicStateManager.js.map