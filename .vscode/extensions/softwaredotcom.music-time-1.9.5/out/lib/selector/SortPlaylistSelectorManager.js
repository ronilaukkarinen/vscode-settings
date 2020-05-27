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
const MenuManager_1 = require("../MenuManager");
const MusicManager_1 = require("../music/MusicManager");
const MusicDataManager_1 = require("../music/MusicDataManager");
const cody_music_1 = require("cody-music");
const MusicUtil_1 = require("../music/MusicUtil");
function showSortPlaylistMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const items = getSortItems();
        let menuOptions = {
            items,
            placeholder: "Sort by",
        };
        const pick = yield MenuManager_1.showQuickPick(menuOptions);
        if (pick && pick.label) {
            return pick.label;
        }
        return null;
    });
}
exports.showSortPlaylistMenu = showSortPlaylistMenu;
function showPlaylistOptionsMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
        if (!webPlayer &&
            !desktop &&
            !activeComputerDevice &&
            !activeWebPlayerDevice) {
            return MusicManager_1.MusicManager.getInstance().showPlayerLaunchConfirmation();
        }
        /**
        context:null
        currently_playing_type:"track"
        device:Object {id: "3f0a959e218e64620d90e48ade038179d49691bb", is_active: true, is_private_session: false, …}
        id:"3f0a959e218e64620d90e48ade038179d49691bb"
        is_active:true
        is_private_session:false
        is_restricted:false
        name:"Xavier’s MacBook Pro (2)"
        type:"Computer"
        volume_percent:100
        __proto__:Object {constructor: , __defineGetter__: , __defineSetter__: , …}
        is_playing:true
        item:Object {album: Object, available_markets: Array(75), disc_number: 1, …}
        progress_ms:203031
        repeat_state:"context" | repeat_state:"off" | repeat_state:"track"
        shuffle_state:false
         */
        const currentTrack = MusicDataManager_1.MusicDataManager.getInstance().runningTrack;
        const spotifyContext = yield cody_music_1.getSpotifyPlayerContext();
        const currentVolume = spotifyContext.device.volume_percent;
        // is it currently shuffling?
        const isShuffling = spotifyContext.shuffle_state === true ? true : false;
        // is it currently on playlist repeat, song repeat, no repeat?
        // context = playlist is repeating, track = track is repeating, off = not repeating
        const isRepeatingTrack = spotifyContext.repeat_state === "track" ? true : false;
        const isRepeatingPlaylist = spotifyContext.repeat_state === "context" ? true : false;
        const isMuted = spotifyContext.device && spotifyContext.device.volume_percent === 0
            ? true
            : false;
        let msg = "";
        if (isRepeatingTrack) {
            msg += "repeating track; ";
        }
        else if (isRepeatingPlaylist) {
            msg += "repeating playlist; ";
        }
        else {
            msg += "repeat is off; ";
        }
        if (isShuffling) {
            msg += "shuffling playlist; ";
        }
        else {
            msg += "shuffle is off; ";
        }
        let isPlaying = null;
        if (currentTrack && currentTrack.id) {
            if (currentTrack.state === cody_music_1.TrackStatus.Playing) {
                msg += `playing ${currentTrack.name}; `;
                isPlaying = true;
            }
            else if (currentTrack.state === cody_music_1.TrackStatus.Paused) {
                msg += `paused ${currentTrack.name}; `;
                isPlaying = false;
            }
        }
        msg += `volume ${currentVolume}%`;
        const items = getOptionItems(isShuffling, isRepeatingPlaylist, isRepeatingTrack, isPlaying, isMuted);
        let menuOptions = {
            items,
            placeholder: msg,
        };
        const pick = yield MenuManager_1.showQuickPick(menuOptions);
        if (pick && pick.label) {
            return pick.label;
        }
        return null;
    });
}
exports.showPlaylistOptionsMenu = showPlaylistOptionsMenu;
function getOptionItems(isShuffling, isRepeatingPlaylist, isRepeatingTrack, isPlaying, isMuted) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = [];
        if (isShuffling) {
            items.push({
                label: "🔀⨯ Don't shuffle",
                command: "musictime.shuffleOff",
            });
        }
        else {
            items.push({
                label: "🔀 Shuffle",
                command: "musictime.shuffleOn",
            });
        }
        if (isRepeatingPlaylist) {
            items.push({
                label: "🔄️⨯ Don't repeat",
                command: "musictime.repeatOff",
            });
            items.push({
                label: "🔂 Repeat track",
                command: "musictime.repeatTrack",
            });
        }
        else if (isRepeatingTrack) {
            items.push({
                label: "🔄️⨯ Don't repeat",
                command: "musictime.repeatOff",
            });
            items.push({
                label: "🔄️ Repeat playlist",
                command: "musictime.repeatPlaylist",
            });
        }
        else {
            items.push({
                label: "🔄️ Repeat playlist",
                command: "musictime.repeatPlaylist",
            });
            items.push({
                label: "🔂 Repeat track",
                command: "musictime.repeatTrack",
            });
        }
        if (isPlaying !== null) {
            if (isPlaying === true) {
                items.push({
                    label: "⏹️ Pause song",
                    command: "musictime.pause",
                });
            }
            else {
                items.push({
                    label: "$(debug-start) Play song",
                    command: "musictime.play",
                });
            }
        }
        if (isMuted) {
            items.push({
                label: "🔈 Unmute song",
                command: "musictime.unMute",
            });
        }
        else {
            items.push({
                label: "🔇 Mute song",
                command: "musictime.mute",
            });
        }
        return items;
    });
}
function getSortItems() {
    const items = [
        {
            label: "Sort A-Z",
            command: "musictime.sortAlphabetically",
        },
        {
            label: "Sort by latest",
            command: "musictime.sortToOriginal",
        },
    ];
    return items;
}
//# sourceMappingURL=SortPlaylistSelectorManager.js.map