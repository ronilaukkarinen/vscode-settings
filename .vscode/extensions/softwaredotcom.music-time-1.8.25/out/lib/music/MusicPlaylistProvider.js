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
const MusicManager_1 = require("./MusicManager");
const Util_1 = require("../Util");
const ProviderItemManager_1 = require("./ProviderItemManager");
const MusicDataManager_1 = require("./MusicDataManager");
const DataController_1 = require("../DataController");
const dataMgr = MusicDataManager_1.MusicDataManager.getInstance();
/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
const createPlaylistTreeItem = (p, cstate) => {
    return new PlaylistTreeItem(p, cstate);
};
exports.refreshPlaylistViewIfRequired = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!dataMgr.spotifyPlaylists || dataMgr.spotifyPlaylists.length === 0) {
        yield MusicManager_1.MusicManager.getInstance().refreshPlaylists();
    }
    vscode_1.commands.executeCommand("musictime.revealTree");
});
/**
 * Handles the playlist onDidChangeSelection event
 */
exports.connectPlaylistTreeView = (view) => {
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
        if (playlistItem.type !== "track") {
            // play it if it's a track, otherwise return out since there
            // are no functions associated with it
            return;
        }
        const musicMgr = MusicManager_1.MusicManager.getInstance();
        // set the selected playlist
        const currentPlaylistId = playlistItem["playlist_id"];
        const selectedPlaylist = yield musicMgr.getPlaylistById(currentPlaylistId);
        dataMgr.selectedPlaylist = selectedPlaylist;
        // play it
        musicMgr.playSelectedItem(playlistItem);
    })), view.onDidChangeVisibility(e => {
        if (e.visible) {
            exports.refreshPlaylistViewIfRequired();
        }
    }));
};
class MusicPlaylistProvider {
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
    selectTrack(p, select = true) {
        // reveal the track state if it's playing or paused
        try {
            // don't "select" it though. that will invoke the pause/play action
            this.view.reveal(p, {
                focus: true,
                select
            });
        }
        catch (err) {
            Util_1.logIt(`Unable to select track: ${err.message}`);
        }
    }
    revealTree() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataMgr.spotifyPlaylists ||
                dataMgr.spotifyPlaylists.length === 0) {
                yield MusicManager_1.MusicManager.getInstance().refreshPlaylists();
            }
            this.refresh();
            const item = ProviderItemManager_1.ProviderItemManager.getInstance().getReadmeButton();
            try {
                // select the readme item
                this.view.reveal(item, {
                    focus: true,
                    select: false
                });
            }
            catch (err) {
                Util_1.logIt(`Unable to select track: ${err.message}`);
            }
        });
    }
    getTreeItem(p) {
        let treeItem = null;
        if (p.type === "playlist") {
            // it's a track parent (playlist)
            if (p && p.tracks && p.tracks["total"] && p.tracks["total"] > 0) {
                // in the future we can use TreeItemCollapsibleState.Expanded
                // if we have a clean way of check that a track is playing when the
                // playlist folders are loaded, but currently the tracks load after you
                // open the playlist so we don't know if it's playing or not
                return createPlaylistTreeItem(p, vscode_1.TreeItemCollapsibleState.Collapsed);
            }
            treeItem = createPlaylistTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
        }
        else {
            // it's a track or a title
            treeItem = createPlaylistTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
        }
        return treeItem;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const musicMgr = MusicManager_1.MusicManager.getInstance();
            const providerItemMgr = ProviderItemManager_1.ProviderItemManager.getInstance();
            if (dataMgr.ready) {
                if (element) {
                    // return the playlist tracks
                    let tracks = yield musicMgr.getPlaylistItemTracksForPlaylistId(element.id);
                    if (!tracks || tracks.length === 0) {
                        // create an item that shows there are no tracks for this playlist
                        tracks = [providerItemMgr.getNoTracksFoundButton()];
                    }
                    return tracks;
                }
                else {
                    // get the top level playlist parents
                    return musicMgr.currentPlaylists;
                }
            }
            else {
                if (!musicMgr.hasSpotifyUser()) {
                    yield DataController_1.populateSpotifyUser();
                }
                const loadingItem = providerItemMgr.getLoadingButton();
                return [loadingItem];
            }
        });
    }
}
exports.MusicPlaylistProvider = MusicPlaylistProvider;
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
            dark: ""
        };
        this.contextValue = "playlistItem";
        this.description = treeItem.type === "track" ? treeItem.artist : "";
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
//# sourceMappingURL=MusicPlaylistProvider.js.map