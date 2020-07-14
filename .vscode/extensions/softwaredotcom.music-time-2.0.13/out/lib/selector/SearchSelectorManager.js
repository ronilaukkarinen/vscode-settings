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
const MusicDataManager_1 = require("../music/MusicDataManager");
const MusicUtil_1 = require("../music/MusicUtil");
// lkjlkjlkjlkjlkjlkjljk lksjdf lkj lkj lkj lkj lkj
// lkjsdflkjsdlfk
function showSearchInput() {
    return __awaiter(this, void 0, void 0, function* () {
        if (MusicUtil_1.requiresSpotifyAccess()) {
            vscode_1.window.showInformationMessage("Spotify connection required");
            return;
        }
        const keywords = yield vscode_1.window.showInputBox({
            value: "",
            placeHolder: "Search",
            prompt: "Search for songs",
            validateInput: (text) => {
                return !text
                    ? "Please enter one more more keywords to continue."
                    : null;
            },
        });
        if (!keywords) {
            return;
        }
        // the default limit is 50, so just send in the keywords
        const result = yield cody_music_1.searchTracks(keywords);
        if (result &&
            result.tracks &&
            result.tracks.items &&
            result.tracks.items.length) {
            const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
            // populate the recommendation section with these results
            // set the manager's recommendation tracks
            dataMgr.recommendationTracks = result.tracks.items;
            dataMgr.recommendationLabel = "Top Results";
            // refresh the rec tree
            vscode_1.commands.executeCommand("musictime.refreshRecommendationsTree");
        }
        else {
            vscode_1.window.showErrorMessage(`No songs found matching '${keywords}'`);
        }
    });
}
exports.showSearchInput = showSearchInput;
//# sourceMappingURL=SearchSelectorManager.js.map