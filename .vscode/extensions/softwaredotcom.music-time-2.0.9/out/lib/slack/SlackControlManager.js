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
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const { WebClient } = require("@slack/web-api");
const MenuManager_1 = require("../MenuManager");
/**
 * This won't be available until they've connected to spotify
 */
function connectSlack() {
    return __awaiter(this, void 0, void 0, function* () {
        const jwt = Util_1.getItem("jwt");
        const encodedJwt = encodeURIComponent(jwt);
        const qryStr = `integrate=slack&plugin=musictime&token=${encodedJwt}`;
        // authorize the user for slack
        const endpoint = `${Constants_1.api_endpoint}/auth/slack?${qryStr}`;
        Util_1.launchWebUrl(endpoint);
        DataController_1.refetchSlackConnectStatusLazily();
    });
}
exports.connectSlack = connectSlack;
function showSlackChannelMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        let menuOptions = {
            items: [],
            placeholder: "Select a channel",
        };
        // get the available channels
        const channelNames = yield getChannelNames();
        channelNames.sort();
        channelNames.forEach((channelName) => {
            menuOptions.items.push({
                label: channelName,
            });
        });
        const pick = yield MenuManager_1.showQuickPick(menuOptions);
        if (pick && pick.label) {
            return pick.label;
        }
        return null;
    });
}
exports.showSlackChannelMenu = showSlackChannelMenu;
function getChannels() {
    return __awaiter(this, void 0, void 0, function* () {
        const slackAccessToken = Util_1.getItem("slack_access_token");
        const web = new WebClient(slackAccessToken);
        const result = yield web.channels
            .list({ exclude_archived: true, exclude_members: true })
            .catch((err) => {
            console.log("Unable to retrieve slack channels: ", err.message);
            return [];
        });
        if (result && result.ok) {
            return result.channels;
        }
        return [];
    });
}
function getChannelNames() {
    return __awaiter(this, void 0, void 0, function* () {
        const channels = yield getChannels();
        if (channels && channels.length > 0) {
            return channels.map((channel) => {
                return channel.name;
            });
        }
        return [];
    });
}
//# sourceMappingURL=SlackControlManager.js.map