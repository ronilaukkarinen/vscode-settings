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
const MusicUtil_1 = require("./MusicUtil");
const MusicDataManager_1 = require("./MusicDataManager");
const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
function refreshRecommendations() {
    return __awaiter(this, void 0, void 0, function* () {
        if (MusicUtil_1.requiresSpotifyAccess()) {
            // update the recommended tracks to empty
            dataMgr.recommendationTracks = [];
            vscode_1.commands.executeCommand("musictime.refreshRecommendationsTree");
        }
        else if (dataMgr.currentRecMeta && dataMgr.currentRecMeta.label) {
            // use the current recommendation metadata and bump the offset
            this.updateRecommendations(dataMgr.currentRecMeta.label, dataMgr.currentRecMeta.likedSongSeedLimit, dataMgr.currentRecMeta.seed_genres, dataMgr.currentRecMeta.features, dataMgr.currentRecMeta.offset);
        }
        else {
            // default to the similar liked songs recommendations
            this.updateRecommendations("Familiar", 5);
        }
    });
}
exports.refreshRecommendations = refreshRecommendations;
function getRecommendedTracks(trackIds, seed_genres, features) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return cody_music_1.getRecommendationsForTracks(trackIds, 100, "" /*market*/, 20, 100, seed_genres, [], features);
        }
        catch (e) {
            //
        }
        return [];
    });
}
exports.getRecommendedTracks = getRecommendedTracks;
function updateRecommendations(label, likedSongSeedLimit = 5, seed_genres = [], features = {}, offset = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        dataMgr.currentRecMeta = {
            label,
            likedSongSeedLimit,
            seed_genres,
            features,
            offset
        };
        const trackIds = yield this.getTrackIdsForRecommendations(likedSongSeedLimit, offset);
        // fetch the recommendations from spotify
        const tracks = (yield this.getRecommendedTracks(trackIds, seed_genres, features)) ||
            [];
        // get the tracks that have already been recommended
        let existingTrackIds = dataMgr.prevRecTrackMap[label]
            ? dataMgr.prevRecTrackMap[label]
            : [];
        let finalTracks = [];
        if (existingTrackIds.length) {
            // filter out the ones that are already used
            tracks.forEach((track) => {
                if (!existingTrackIds.find((id) => id === track.id)) {
                    finalTracks.push(track);
                }
            });
            if (finalTracks.length < 10) {
                // use the 1st 10 from recommendations and clear out the existing track ids
                finalTracks = [];
                finalTracks.push(...tracks);
                // clear out the old
                existingTrackIds = [];
            }
        }
        else {
            // no tracks found in the existing list
            finalTracks.push(...tracks);
        }
        // trim down to 10
        finalTracks = finalTracks.splice(0, 10);
        // add these to the previously recommended tracks
        const finalTrackIds = finalTracks.map((t) => t.id);
        existingTrackIds.push(...finalTrackIds);
        // update the cache map based on this recommendation type
        dataMgr.prevRecTrackMap[label] = existingTrackIds;
        if (finalTracks.length > 0) {
            // sort them alpabeticaly
            MusicUtil_1.sortTracks(finalTracks);
        }
        // set the manager's recommendation tracks
        dataMgr.recommendationTracks = finalTracks;
        dataMgr.recommendationLabel = label;
        // refresh the rec tree
        vscode_1.commands.executeCommand("musictime.refreshRecommendationsTree");
    });
}
exports.updateRecommendations = updateRecommendations;
function getTrackIdsForRecommendations(likedSongSeedLimit = 5, offset = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        let trackIds = [];
        let trackRecs = dataMgr.trackIdsForRecommendations || [];
        if (trackRecs.length === 0) {
            // call the music util to populate the rec track ids
            yield MusicUtil_1.buildTracksForRecommendations(dataMgr.spotifyPlaylists);
            trackRecs = dataMgr.trackIdsForRecommendations || [];
        }
        if (trackRecs.length > 0) {
            for (let i = 0; i < likedSongSeedLimit; i++) {
                if (trackRecs.length > offset) {
                    // we have enough, grab the next track
                    trackIds.push(trackRecs[offset]);
                }
                else {
                    // start the offset back to the begining
                    offset = 0;
                    trackIds.push(trackRecs[offset]);
                }
                offset++;
            }
        }
        return trackIds;
    });
}
exports.getTrackIdsForRecommendations = getTrackIdsForRecommendations;
//# sourceMappingURL=MusicRecommendationManager.js.map