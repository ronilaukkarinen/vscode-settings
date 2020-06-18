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
const MusicControlManager_1 = require("./music/MusicControlManager");
const Util_1 = require("./Util");
const KpmController_1 = require("./KpmController");
const MusicPlaylistProvider_1 = require("./music/MusicPlaylistProvider");
const cody_music_1 = require("cody-music");
const SocialShareManager_1 = require("./social/SocialShareManager");
const SlackControlManager_1 = require("./slack/SlackControlManager");
const MusicManager_1 = require("./music/MusicManager");
const MusicRecommendationProvider_1 = require("./music/MusicRecommendationProvider");
const RecTypeSelectorManager_1 = require("./selector/RecTypeSelectorManager");
const SortPlaylistSelectorManager_1 = require("./selector/SortPlaylistSelectorManager");
const DataController_1 = require("./DataController");
const SpotifyDeviceSelectorManager_1 = require("./selector/SpotifyDeviceSelectorManager");
const MusicRecommendationManager_1 = require("./music/MusicRecommendationManager");
const MusicCommandUtil_1 = require("./music/MusicCommandUtil");
const SearchSelectorManager_1 = require("./selector/SearchSelectorManager");
const MusicUtil_1 = require("./music/MusicUtil");
/**
 * add the commands to vscode....
 */
function createCommands() {
    let cmds = [];
    const controller = MusicControlManager_1.MusicControlManager.getInstance();
    const musicMgr = MusicManager_1.MusicManager.getInstance();
    // playlist tree view
    const treePlaylistProvider = new MusicPlaylistProvider_1.MusicPlaylistProvider();
    const playlistTreeView = vscode_1.window.createTreeView("my-playlists", {
        treeDataProvider: treePlaylistProvider,
        showCollapseAll: false,
    });
    treePlaylistProvider.bindView(playlistTreeView);
    cmds.push(MusicPlaylistProvider_1.connectPlaylistTreeView(playlistTreeView));
    // recommended tracks tree view
    const recTreePlaylistProvider = new MusicRecommendationProvider_1.MusicRecommendationProvider();
    const recPlaylistTreeView = vscode_1.window.createTreeView("track-recommendations", {
        treeDataProvider: recTreePlaylistProvider,
        showCollapseAll: false,
    });
    recTreePlaylistProvider.bindView(recPlaylistTreeView);
    cmds.push(MusicRecommendationProvider_1.connectRecommendationPlaylistTreeView(recPlaylistTreeView));
    // REVEAL TREE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.revealTree", () => {
        treePlaylistProvider.revealTree();
    }));
    // DISPLAY README CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.displayReadme", () => {
        Util_1.displayReadmeIfNotExists(true /*override*/);
    }));
    // DISPLAY REPORT DASHBOARD CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.displayDashboard", () => {
        MusicControlManager_1.displayMusicTimeMetricsMarkdownDashboard();
    }));
    // PLAY NEXT CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.next", () => {
        controller.nextSong();
    }));
    // PLAY PREV CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.previous", () => {
        controller.previousSong();
    }));
    const progressCmd = vscode_1.commands.registerCommand("musictime.progress", () => {
        // do nothing for now
    });
    cmds.push(progressCmd);
    // PLAY CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.play", () => __awaiter(this, void 0, void 0, function* () {
        controller.playSong(1);
    })));
    // MUTE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.mute", () => __awaiter(this, void 0, void 0, function* () {
        controller.setMuteOn();
    })));
    // UNMUTE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.unMute", () => __awaiter(this, void 0, void 0, function* () {
        controller.setMuteOff();
    })));
    // REMOVE TRACK CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.removeTrack", (p) => __awaiter(this, void 0, void 0, function* () {
        musicMgr.removeTrackFromPlaylist(p);
    })));
    // SHARE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.shareTrack", (node) => {
        SocialShareManager_1.SocialShareManager.getInstance().showMenu(node.id, node.name, false);
    }));
    // SEARCH CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.searchTracks", () => {
        // show the search input popup
        SearchSelectorManager_1.showSearchInput();
    }));
    // PAUSE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.pause", () => {
        controller.pauseSong();
    }));
    // LIKE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.like", () => {
        controller.setLiked(true);
    }));
    // UNLIKE CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.unlike", () => {
        controller.setLiked(false);
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.shuffleOff", () => {
        controller.setShuffleOff();
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.shuffleOn", () => {
        controller.setShuffleOn();
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.muteOn", () => {
        controller.setMuteOn();
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.muteOff", () => {
        controller.setMuteOff();
    }));
    // REPEAT OFF CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.repeatOn", () => {
        controller.setRepeatOnOff(true);
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.repeatTrack", () => {
        controller.setRepeatTrackOn();
    }));
    cmds.push(vscode_1.commands.registerCommand("musictime.repeatPlaylist", () => {
        controller.setRepeatPlaylistOn();
    }));
    // REPEAT ON OFF CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.repeatOff", () => {
        controller.setRepeatOnOff(false);
    }));
    // SHOW MENU CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.menu", () => {
        controller.showMenu();
    }));
    // FOLLOW PLAYLIST CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.follow", (p) => {
        musicMgr.followSpotifyPlaylist(p);
    }));
    // DISPLAY CURRENT SONG CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.currentSong", () => {
        musicMgr.launchTrackPlayer();
    }));
    // SWITCH SPOTIFY
    cmds.push(vscode_1.commands.registerCommand("musictime.switchSpotifyAccount", () => __awaiter(this, void 0, void 0, function* () {
        MusicControlManager_1.switchSpotifyAccount();
    })));
    // CONNECT SPOTIFY CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.connectSpotify", () => __awaiter(this, void 0, void 0, function* () {
        MusicControlManager_1.connectSpotify();
    })));
    // CONNECT SLACK
    cmds.push(vscode_1.commands.registerCommand("musictime.connectSlack", () => {
        SlackControlManager_1.connectSlack();
    }));
    // DISCONNECT SPOTIFY
    cmds.push(vscode_1.commands.registerCommand("musictime.disconnectSpotify", () => {
        MusicControlManager_1.disconnectSpotify();
    }));
    // DISCONNECT SLACK
    cmds.push(vscode_1.commands.registerCommand("musictime.disconnectSlack", () => {
        MusicControlManager_1.disconnectSlack();
    }));
    // RECONCILE PLAYLIST
    // this should only be attached to the refresh button
    cmds.push(vscode_1.commands.registerCommand("musictime.refreshButton", () => __awaiter(this, void 0, void 0, function* () {
        // no devices found at all OR no active devices and a computer device is not found in the list
        const selectedButton = yield vscode_1.window.showInformationMessage(`Reload your playlists?`, ...["Yes"]);
        if (selectedButton && selectedButton === "Yes") {
            vscode_1.commands.executeCommand("musictime.hardRefreshPlaylist");
        }
    })));
    // HARD REFRESH PLAYLIST
    // this should only be attached to the refresh button
    cmds.push(vscode_1.commands.registerCommand("musictime.hardRefreshPlaylist", () => __awaiter(this, void 0, void 0, function* () {
        yield DataController_1.populateSpotifyPlaylists();
        vscode_1.commands.executeCommand("musictime.refreshPlaylist");
        setTimeout(() => {
            MusicRecommendationManager_1.refreshRecommendations();
        }, 3000);
    })));
    // this should only be attached to the refresh button
    const refreshDeviceInfoCommand = vscode_1.commands.registerCommand("musictime.refreshDeviceInfo", () => __awaiter(this, void 0, void 0, function* () {
        if (!MusicUtil_1.requiresSpotifyAccess()) {
            yield DataController_1.populateSpotifyDevices();
        }
    }));
    cmds.push(refreshDeviceInfoCommand);
    const refreshPlaylistCommand = vscode_1.commands.registerCommand("musictime.refreshPlaylist", () => __awaiter(this, void 0, void 0, function* () {
        yield musicMgr.clearPlaylists();
        yield musicMgr.refreshPlaylists();
        treePlaylistProvider.refresh();
    }));
    cmds.push(refreshPlaylistCommand);
    // SORT TITLE COMMAND
    cmds.push(vscode_1.commands.registerCommand("musictime.sortIcon", () => {
        SortPlaylistSelectorManager_1.showSortPlaylistMenu();
    }));
    // OPTIONS TITLE COMMAND
    cmds.push(vscode_1.commands.registerCommand("musictime.optionsIcon", () => {
        SortPlaylistSelectorManager_1.showPlaylistOptionsMenu();
    }));
    const sortPlaylistAlphabeticallyCommand = vscode_1.commands.registerCommand("musictime.sortAlphabetically", () => __awaiter(this, void 0, void 0, function* () {
        musicMgr.updateSort(true);
    }));
    cmds.push(sortPlaylistAlphabeticallyCommand);
    const sortPlaylistToOriginalCommand = vscode_1.commands.registerCommand("musictime.sortToOriginal", () => __awaiter(this, void 0, void 0, function* () {
        musicMgr.updateSort(false);
    }));
    cmds.push(sortPlaylistToOriginalCommand);
    const switchToThisDeviceCommand = vscode_1.commands.registerCommand("musictime.switchToThisDevice", () => __awaiter(this, void 0, void 0, function* () {
        musicMgr.launchTrackPlayer(cody_music_1.PlayerName.SpotifyDesktop);
    }));
    const launchSpotifyCommand = vscode_1.commands.registerCommand("musictime.launchSpotify", () => __awaiter(this, void 0, void 0, function* () {
        musicMgr.launchTrackPlayer(cody_music_1.PlayerName.SpotifyWeb);
    }));
    cmds.push(launchSpotifyCommand);
    const launchSpotifyDesktopCommand = vscode_1.commands.registerCommand("musictime.launchSpotifyDesktop", () => __awaiter(this, void 0, void 0, function* () {
        yield musicMgr.launchTrackPlayer(cody_music_1.PlayerName.SpotifyDesktop);
    }));
    cmds.push(launchSpotifyDesktopCommand);
    const launchSpotifyPlaylistCommand = vscode_1.commands.registerCommand("musictime.spotifyPlaylist", () => musicMgr.launchTrackPlayer(cody_music_1.PlayerName.SpotifyWeb));
    cmds.push(launchSpotifyPlaylistCommand);
    const launchItunesCommand = vscode_1.commands.registerCommand("musictime.launchItunes", () => musicMgr.launchTrackPlayer(cody_music_1.PlayerName.ItunesDesktop));
    cmds.push(launchItunesCommand);
    const launchItunesPlaylistCommand = vscode_1.commands.registerCommand("musictime.itunesPlaylist", () => musicMgr.launchTrackPlayer(cody_music_1.PlayerName.ItunesDesktop));
    cmds.push(launchItunesPlaylistCommand);
    const generateWeeklyPlaylistCommand = vscode_1.commands.registerCommand("musictime.generateWeeklyPlaylist", () => musicMgr.generateUsersWeeklyTopSongs());
    cmds.push(generateWeeklyPlaylistCommand);
    const launchMusicAnalyticsCommand = vscode_1.commands.registerCommand("musictime.launchAnalytics", () => Util_1.launchMusicAnalytics());
    cmds.push(launchMusicAnalyticsCommand);
    const addToPlaylistCommand = vscode_1.commands.registerCommand("musictime.addToPlaylist", (item) => controller.addToPlaylistMenu(item));
    cmds.push(addToPlaylistCommand);
    const deviceSelectTransferCmd = vscode_1.commands.registerCommand("musictime.transferToDevice", (d) => __awaiter(this, void 0, void 0, function* () {
        // transfer to this device
        vscode_1.window.showInformationMessage(`Connected to ${d.name}`);
        yield MusicCommandUtil_1.MusicCommandUtil.getInstance().runSpotifyCommand(cody_music_1.playSpotifyDevice, [d.id]);
        setTimeout(() => {
            // refresh the tree, no need to refresh playlists
            vscode_1.commands.executeCommand("musictime.refreshDeviceInfo");
        }, 3000);
    }));
    cmds.push(deviceSelectTransferCmd);
    const genreRecListCmd = vscode_1.commands.registerCommand("musictime.songGenreSelector", () => {
        RecTypeSelectorManager_1.showGenreSelections();
    });
    cmds.push(genreRecListCmd);
    const categoryRecListCmd = vscode_1.commands.registerCommand("musictime.songCategorySelector", () => {
        RecTypeSelectorManager_1.showCategorySelections();
    });
    cmds.push(categoryRecListCmd);
    const deviceSelectorCmd = vscode_1.commands.registerCommand("musictime.deviceSelector", () => {
        SpotifyDeviceSelectorManager_1.showDeviceSelectorMenu();
    });
    cmds.push(deviceSelectorCmd);
    cmds.push(vscode_1.commands.registerCommand("musictime.refreshRecommendations", () => __awaiter(this, void 0, void 0, function* () {
        MusicRecommendationManager_1.refreshRecommendations();
    })));
    const refreshRecPlaylistCommand = vscode_1.commands.registerCommand("musictime.refreshRecommendationsTree", () => __awaiter(this, void 0, void 0, function* () {
        recTreePlaylistProvider.refresh();
    }));
    cmds.push(refreshRecPlaylistCommand);
    // UPDATE RECOMMENDATIONS CMD
    cmds.push(vscode_1.commands.registerCommand("musictime.updateRecommendations", (args) => {
        // there's always at least 3 args
        const label = args[0];
        const likedSongSeedLimit = args[1];
        const seed_genres = args[2];
        const features = args.length > 3 ? args[3] : {};
        MusicRecommendationManager_1.updateRecommendations(label, likedSongSeedLimit, seed_genres, features);
    }));
    // initialize the kpm controller to start the listener
    KpmController_1.KpmController.getInstance();
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map