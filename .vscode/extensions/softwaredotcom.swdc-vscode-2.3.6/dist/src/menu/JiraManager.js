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
exports.JiraManager = void 0;
const vscode_1 = require("vscode");
const MenuManager_1 = require("./MenuManager");
class JiraManager {
    constructor() {
        this._snippet = "";
        //
    }
    static getInstance() {
        if (!JiraManager.instance) {
            JiraManager.instance = new JiraManager();
        }
        return JiraManager.instance;
    }
    showJiraTicketMenu(snippet) {
        return __awaiter(this, void 0, void 0, function* () {
            this._snippet = snippet;
            let menuOptions = {
                items: [],
                placeholder: "Select a ticket",
            };
            // get the user's tickets
            // const channelNames = await getChannelNames();
            // channelNames.sort();
            // channelNames.forEach(channelName => {
            //     menuOptions.items.push({
            //         label: channelName
            //     });
            // });
            const pick = yield MenuManager_1.showQuickPick(menuOptions);
            if (pick && pick.label) {
                return pick.label;
            }
            return null;
        });
    }
    showInputBox(value, placeHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInputBox({
                value,
                placeHolder,
                validateInput: (text) => {
                    return !text
                        ? "Please enter a valid message to continue."
                        : null;
                },
            });
        });
    }
}
exports.JiraManager = JiraManager;
//# sourceMappingURL=JiraManager.js.map