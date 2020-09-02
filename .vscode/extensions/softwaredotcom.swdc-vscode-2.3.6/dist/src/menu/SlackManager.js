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
exports.showSlackChannelMenu = exports.sendSlackMessage = exports.slackContributor = exports.disconnectSlack = exports.connectSlack = exports.sendGeneratedReportReport = exports.generateSlackReport = void 0;
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const DataController_1 = require("../DataController");
const { WebClient } = require("@slack/web-api");
const MenuManager_1 = require("./MenuManager");
const HttpClient_1 = require("../http/HttpClient");
const vscode_1 = require("vscode");
const GitUtil_1 = require("../repo/GitUtil");
const fileIt = require("file-it");
//// NEW LOGIC /////
function generateSlackReport() {
    return __awaiter(this, void 0, void 0, function* () {
        const slackAccessToken = Util_1.getItem("slack_access_token");
        if (!slackAccessToken) {
            const connectConfirm = yield vscode_1.window.showInformationMessage("Connect Slack to continue", ...["Yes"]);
            if (connectConfirm && connectConfirm === "Yes") {
                connectSlack(sendGeneratedReportReport);
            }
        }
        else {
            // start the flow
            const projectDir = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
            const slackReportCommits = yield GitUtil_1.getSlackReportCommits(projectDir);
        }
    });
}
exports.generateSlackReport = generateSlackReport;
//// OLD LOGIC /////
function sendGeneratedReportReport() {
    return __awaiter(this, void 0, void 0, function* () {
        const slackAccessToken = Util_1.getItem("slack_access_token");
        if (!slackAccessToken) {
            const connectConfirm = yield vscode_1.window.showInformationMessage("Connect Slack to continue", ...["Yes"]);
            if (connectConfirm && connectConfirm === "Yes") {
                connectSlack(sendGeneratedReportReport);
            }
        }
        else {
            const filePath = Util_1.getDailyReportSummaryFile();
            const content = fileIt.readContentFileSync(filePath);
            const selectedChannel = yield showSlackChannelMenu();
            if (!selectedChannel) {
                return;
            }
            sendSlackMessage(content, selectedChannel);
        }
    });
}
exports.sendGeneratedReportReport = sendGeneratedReportReport;
/**
 * This won't be available until they've connected to spotify
 */
function connectSlack(callback = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackAccessToken = Util_1.getItem("slack_access_token");
        if (slackAccessToken) {
            vscode_1.window.showInformationMessage("Slack is already connected");
            return;
        }
        const jwt = Util_1.getItem("jwt");
        const encodedJwt = encodeURIComponent(jwt);
        const qryStr = `integrate=slack&plugin=musictime&token=${encodedJwt}`;
        // authorize the user for slack
        const endpoint = `${Constants_1.api_endpoint}/auth/slack?${qryStr}`;
        Util_1.launchWebUrl(endpoint);
        DataController_1.refetchSlackConnectStatusLazily(callback);
    });
}
exports.connectSlack = connectSlack;
function disconnectSlack() {
    return __awaiter(this, void 0, void 0, function* () {
        const selection = yield vscode_1.window.showInformationMessage(`Are you sure you would like to disconnect Slack?`, ...["Yes"]);
        if (selection === "Yes") {
            let result = yield HttpClient_1.softwarePut(`/auth/slack/disconnect`, {}, Util_1.getItem("jwt"));
            // oauth is not null, initialize spotify
            Util_1.setItem("slack_access_token", null);
            vscode_1.window.showInformationMessage(`Successfully disconnected your Slack connection.`);
        }
    });
}
exports.disconnectSlack = disconnectSlack;
function showSlackMessageInputPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield vscode_1.window.showInputBox({
            value: "",
            placeHolder: "Enter a message to appear in the selected channel",
            validateInput: (text) => {
                return !text ? "Please enter a valid message to continue." : null;
            },
        });
    });
}
function slackContributor() {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedChannel = yield showSlackChannelMenu();
        if (!selectedChannel) {
            return;
        }
        // !!! important, need to use the get instance as this
        // method may be called within a callback and "this" will be undefined !!!
        const message = yield showSlackMessageInputPrompt();
        if (!message) {
            return;
        }
        sendSlackMessage(message, selectedChannel);
    });
}
exports.slackContributor = slackContributor;
function sendSlackMessage(message, selectedChannel) {
    return __awaiter(this, void 0, void 0, function* () {
        const slackAccessToken = Util_1.getItem("slack_access_token");
        const msg = `${message}`;
        const web = new WebClient(slackAccessToken);
        yield web.chat
            .postMessage({
            text: msg,
            channel: selectedChannel,
            as_user: true,
        })
            .catch((err) => {
            // try without sending "as_user"
            web.chat
                .postMessage({
                text: msg,
                channel: selectedChannel,
            })
                .catch((err) => {
                if (err.message) {
                    console.log("error posting slack message: ", err.message);
                }
            });
        });
    });
}
exports.sendSlackMessage = sendSlackMessage;
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
            .list({ exclude_archived: true, exclude_members: false })
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
//# sourceMappingURL=SlackManager.js.map