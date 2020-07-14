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
const MenuManager_1 = require("../MenuManager");
const MusicControlManager_1 = require("../music/MusicControlManager");
const SlackControlManager_1 = require("../slack/SlackControlManager");
const vscode_1 = require("vscode");
const { WebClient } = require("@slack/web-api");
let musicId = "";
let title = "";
let spotifyLinkUrl = "";
let playlistSelected = false;
class SocialShareManager {
    constructor() {
        //
    }
    static getInstance() {
        if (!SocialShareManager.instance) {
            SocialShareManager.instance = new SocialShareManager();
        }
        return SocialShareManager.instance;
    }
    shareIt(sharer, options) {
        let shareUrl = this.getShareUrl(sharer, options);
        Util_1.launchWebUrl(shareUrl);
    }
    getShareUrl(sharer, options) {
        const sharers = {
            facebook: {
                shareUrl: "https://www.facebook.com/sharer/sharer.php",
                params: {
                    u: options["url"],
                    hashtag: options["hashtag"]
                }
            },
            // linkedin: {
            //     shareUrl: "https://www.linkedin.com/shareArticle",
            //     params: {
            //         url: options["url"],
            //         mini: true
            //     }
            // },
            twitter: {
                shareUrl: "https://twitter.com/intent/tweet/",
                params: {
                    text: options["title"],
                    url: options["url"],
                    hashtags: options["hashtags"],
                    via: options["via"]
                }
            },
            tumblr: {
                shareUrl: "http://tumblr.com/widgets/share/tool",
                params: {
                    canonicalUrl: options["url"],
                    content: options["url"],
                    posttype: "link",
                    title: options["title"],
                    caption: options["caption"],
                    tags: options["tags"]
                }
            },
            whatsapp: {
                shareUrl: "https://api.whatsapp.com/send",
                params: {
                    text: `${options["title"]}: ${options["url"]}`
                },
                isLink: true
            }
        };
        const sharerObj = sharers[sharer.toLowerCase()];
        const queryStr = Util_1.buildQueryString(sharerObj.params);
        const shareUrl = `${sharerObj.shareUrl}${queryStr}`;
        return shareUrl;
    }
    showMenu(id, label, isPlaylist) {
        return __awaiter(this, void 0, void 0, function* () {
            musicId = id;
            playlistSelected = isPlaylist;
            let menuOptions = {
                items: []
            };
            const context = isPlaylist ? "Playlist" : "Song";
            title = `Check out this ${context}`;
            spotifyLinkUrl = MusicControlManager_1.buildSpotifyLink(musicId, isPlaylist);
            // facebook needs the hash
            menuOptions.items.push({
                label: "Facebook",
                detail: `Share '${label}' on Facebook.`,
                url: this.getShareUrl("facebook", {
                    url: spotifyLinkUrl,
                    hashtag: `#MusicTime`
                })
            });
            const slackAccessToken = Util_1.getItem("slack_access_token");
            if (slackAccessToken) {
                menuOptions.items.push({
                    label: "Slack",
                    detail: `Share '${label}' on Slack`,
                    cb: this.shareSlack
                });
            }
            // menuOptions.items.push({
            //     label: "LinkedIn",
            //     detail: `Share your ${context.toLowerCase()}, ${label}, on LinkedIn.`,
            //     url: this.getShareUrl("linkedin", {
            //         url: spotifyLinkUrl
            //     })
            // });
            menuOptions.items.push({
                label: "Tumblr",
                detail: `Share '${label}' on Tumblr.`,
                url: this.getShareUrl("tumblr", {
                    url: spotifyLinkUrl,
                    title,
                    tags: ["MusicTime"],
                    caption: "Software Audio Share"
                })
            });
            // twitter doesn't need the hash chars, "via" (optional: twitter username without @)
            menuOptions.items.push({
                label: "Twitter",
                detail: `Tweet '${label}' on Twitter.`,
                url: this.getShareUrl("twitter", {
                    url: spotifyLinkUrl,
                    title,
                    hashtags: ["MusicTime"]
                })
            });
            menuOptions.items.push({
                label: "WhatsApp",
                detail: `Send '${label}' through WhatsApp.`,
                url: this.getShareUrl("whatsapp", {
                    url: spotifyLinkUrl,
                    title
                })
            });
            menuOptions.items.push({
                label: `Copy ${context} Link`,
                detail: `Copy ${context.toLowerCase()} link to your clipboard.`,
                cb: this.copyLink
            });
            if (!slackAccessToken) {
                // show divider
                menuOptions.items.push({
                    label: "___________________________________________________________________",
                    cb: null,
                    url: null,
                    command: null
                });
                menuOptions.items.push({
                    label: "Connect Slack",
                    detail: "To share a playlist or track on Slack, please connect your account",
                    url: null,
                    cb: SlackControlManager_1.connectSlack
                });
            }
            MenuManager_1.showQuickPick(menuOptions);
        });
    }
    copyLink() {
        MusicControlManager_1.MusicControlManager.getInstance().copySpotifyLink(musicId, playlistSelected);
    }
    showSlackMessageInputPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInputBox({
                value: `${title}`,
                placeHolder: "Enter a message to appear in the selected channel",
                validateInput: text => {
                    return !text
                        ? "Please enter a valid message to continue."
                        : null;
                }
            });
        });
    }
    validateMessage(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // ...validate...
            yield new Promise(resolve => setTimeout(resolve, 1000));
            // return name === 'vscode' ? 'Name not unique' : undefined;
        });
    }
    shareSlack() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedChannel = yield SlackControlManager_1.showSlackChannelMenu();
            if (!selectedChannel) {
                return;
            }
            // !!! important, need to use the get instance as this
            // method may be called within a callback and "this" will be undefined !!!
            const message = yield SocialShareManager.getInstance().showSlackMessageInputPrompt();
            if (!message) {
                return;
            }
            const slackAccessToken = Util_1.getItem("slack_access_token");
            const msg = `${message}\n${spotifyLinkUrl}`;
            const web = new WebClient(slackAccessToken);
            yield web.chat
                .postMessage({
                text: msg,
                channel: selectedChannel,
                as_user: true
            })
                .catch(err => {
                // try without sending "as_user"
                web.chat
                    .postMessage({
                    text: msg,
                    channel: selectedChannel
                })
                    .catch(err => {
                    if (err.message) {
                        console.log("error posting slack message: ", err.message);
                    }
                });
            });
        });
    }
}
exports.SocialShareManager = SocialShareManager;
//# sourceMappingURL=SocialShareManager.js.map