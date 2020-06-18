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
const MusicDataManager_1 = require("../music/MusicDataManager");
const MusicUtil_1 = require("../music/MusicUtil");
function showDeviceSelectorMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const devices = MusicDataManager_1.MusicDataManager.getInstance().currentDevices || [];
        // list all devices that are found
        let items = [];
        if (devices && devices.length) {
            devices.forEach((d) => {
                const detail = d.is_active
                    ? `Active at ${d.volume_percent}% volume`
                    : `Inactive at ${d.volume_percent}% volume`;
                items.push({
                    label: d.name,
                    command: "musictime.transferToDevice",
                    args: d,
                    type: d.type,
                    detail,
                });
            });
        }
        // get the device set
        const { webPlayer, desktop, activeDevice, activeComputerDevice, activeWebPlayerDevice, } = MusicUtil_1.getDeviceSet();
        // show the launch desktop option if it's not already in the list
        // or if it's an active device
        if (!desktop) {
            items.push({
                label: "Launch Spotify desktop",
                command: "musictime.launchSpotifyDesktop",
            });
        }
        if (!webPlayer) {
            items.push({
                label: "Launch Spotify web player",
                command: "musictime.launchSpotify",
            });
        }
        let menuOptions = {
            items,
            placeholder: "Launch a Spotify device",
        };
        const pick = yield MenuManager_1.showQuickPick(menuOptions);
        if (pick && pick.label) {
            return pick.label;
        }
        return null;
    });
}
exports.showDeviceSelectorMenu = showDeviceSelectorMenu;
//# sourceMappingURL=SpotifyDeviceSelectorManager.js.map