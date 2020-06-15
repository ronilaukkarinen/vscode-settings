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
const Util_1 = require("../Util");
const MusicManager_1 = require("./MusicManager");
const MusicDataManager_1 = require("./MusicDataManager");
const ProviderItemManager_1 = require("./ProviderItemManager");
/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
const createPlaylistTreeItem = (p, cstate) => {
    return new PlaylistTreeItem(p, cstate);
};
const playRecommendationTrack = (playlistItem) => __awaiter(void 0, void 0, void 0, function* () {
    // play it
    MusicManager_1.MusicManager.getInstance().playSelectedItem(playlistItem);
});
/**
 * Handles the playlist onDidChangeSelection event
 */
exports.connectRecommendationPlaylistTreeView = (view) => {
    // view is {selection: Array[n], visible, message}
    return vscode_1.Disposable.from(
    // e is {selection: Array[n]}
    view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        let playlistItem = e.selection[0];
        if (playlistItem.command) {
            // run the command
            vscode_1.commands.executeCommand(playlistItem.command);
            return;
        }
        else if (playlistItem["cb"]) {
            const cbFunc = playlistItem["cb"];
            cbFunc();
            return;
        }
        yield playRecommendationTrack(playlistItem);
    })), view.onDidChangeVisibility((e) => {
        if (e.visible) {
            //
        }
    }));
};
class MusicRecommendationProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        //
    }
    bindView(view) {
        this.view = view;
    }
    getParent(_p) {
        return void 0; // all playlists are in root
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    refreshParent(parent) {
        this._onDidChangeTreeData.fire(parent);
    }
    isTrackInPlaylistRunning(p) {
        return false;
    }
    getTreeItem(p) {
        const treeItem = createPlaylistTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
        return treeItem;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const recTrackPlaylistItems = ProviderItemManager_1.ProviderItemManager.getInstance().convertTracksToPlaylistItems(MusicDataManager_1.MusicDataManager.getInstance().recommendationTracks);
            return recTrackPlaylistItems;
        });
    }
}
exports.MusicRecommendationProvider = MusicRecommendationProvider;
/**
 * The TreeItem contains the "contextValue", which is represented as the "viewItem"
 * from within the package.json when determining if there should be decoracted context
 * based on that value.
 */
class PlaylistTreeItem extends vscode_1.TreeItem {
    constructor(treeItem, collapsibleState, command) {
        super(treeItem.name, collapsibleState);
        this.treeItem = treeItem;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: "",
            dark: "",
        };
        this.contextValue = "playlistItem";
        this.description = treeItem.itemType === "track" ? treeItem.artist : "";
        const { lightPath, darkPath, contextValue } = Util_1.getPlaylistIcon(treeItem);
        if (lightPath && darkPath) {
            this.iconPath.light = lightPath;
            this.iconPath.dark = darkPath;
        }
        else {
            // no matching tag, remove the tree item icon path
            delete this.iconPath;
        }
        this.contextValue = contextValue;
    }
    get tooltip() {
        if (!this.treeItem) {
            return "";
        }
        if (this.treeItem.tooltip) {
            return `${this.treeItem.tooltip}`;
        }
        else {
            return `${this.treeItem.name}`;
        }
    }
}
exports.PlaylistTreeItem = PlaylistTreeItem;
//# sourceMappingURL=MusicRecommendationProvider.js.map