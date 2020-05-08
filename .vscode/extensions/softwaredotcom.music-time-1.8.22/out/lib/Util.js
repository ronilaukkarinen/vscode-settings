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
const Constants_1 = require("./Constants");
const DataController_1 = require("./DataController");
const cody_music_1 = require("cody-music");
const moment = require("moment-timezone");
const open = require("open");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");
const path = require("path");
exports.alpha = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
exports.DASHBOARD_LABEL_WIDTH = 25;
exports.DASHBOARD_VALUE_WIDTH = 25;
exports.MARKER_WIDTH = 4;
const NUMBER_IN_EMAIL_REGEX = new RegExp("^\\d+\\+");
// start off as focused as the editor may have
// had that file in the tabs. any close or tab
// switch will set this to false if the file isn't CodeTime
let cachedSessionKeys = {};
let editorSessiontoken = null;
let extensionName = null;
let extensionDisplayName = null; // Code Time or Music Time
function getEditorSessionToken() {
    if (!editorSessiontoken) {
        editorSessiontoken = randomCode();
    }
    return editorSessiontoken;
}
exports.getEditorSessionToken = getEditorSessionToken;
/**
 * This will return a random whole number inclusively between the min and max
 * @param min
 * @param max
 */
function getRandomArbitrary(min, max) {
    max = max + 0.1;
    return parseInt(Math.random() * (max - min) + min, 10);
}
exports.getRandomArbitrary = getRandomArbitrary;
function getPluginId() {
    return Constants_1.MUSIC_TIME_PLUGIN_ID;
}
exports.getPluginId = getPluginId;
function getPluginName() {
    return Constants_1.MUSIC_TIME_EXT_ID;
}
exports.getPluginName = getPluginName;
function getPluginType() {
    return Constants_1.MUSIC_TIME_TYPE;
}
exports.getPluginType = getPluginType;
function getVersion() {
    const extension = vscode_1.extensions.getExtension(Constants_1.MUSIC_TIME_EXT_ID);
    return extension.packageJSON.version;
}
exports.getVersion = getVersion;
function isCodeTimeMetricsFile(fileName) {
    fileName = fileName || "";
    if (fileName.includes(".software") && fileName.includes("CodeTime")) {
        return true;
    }
    return false;
}
exports.isCodeTimeMetricsFile = isCodeTimeMetricsFile;
function codeTimeExtInstalled() {
    const codeTimeExt = vscode_1.extensions.getExtension(Constants_1.CODE_TIME_EXT_ID);
    return codeTimeExt ? true : false;
}
exports.codeTimeExtInstalled = codeTimeExtInstalled;
function musicTimeExtInstalled() {
    const musicTimeExt = vscode_1.extensions.getExtension(Constants_1.MUSIC_TIME_EXT_ID);
    return musicTimeExt ? true : false;
}
exports.musicTimeExtInstalled = musicTimeExtInstalled;
function getSessionFileCreateTime() {
    let sessionFile = getSoftwareSessionFile();
    const stat = fs.statSync(sessionFile);
    if (stat.birthtime) {
        return stat.birthtime;
    }
    return stat.ctime;
}
exports.getSessionFileCreateTime = getSessionFileCreateTime;
/**
 * This method is sync, no need to await on it.
 * @param file
 */
function getFileAgeInDays(file) {
    if (!fs.existsSync(file)) {
        return 0;
    }
    const stat = fs.statSync(file);
    let creationTimeSec = stat.birthtimeMs || stat.ctimeMs;
    // convert to seconds
    creationTimeSec /= 1000;
    const daysDiff = moment
        .duration(moment().diff(moment.unix(creationTimeSec)))
        .asDays();
    // if days diff is 0 then use 200, otherwise 100 per day, which is equal to a 9000 limit for 90 days
    return daysDiff > 1 ? parseInt(daysDiff, 10) : 1;
}
exports.getFileAgeInDays = getFileAgeInDays;
function getRootPaths() {
    let paths = [];
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            let folderUri = workspaceFolder.uri;
            if (folderUri && folderUri.fsPath) {
                paths.push(folderUri.fsPath);
            }
        }
    }
    return paths;
}
exports.getRootPaths = getRootPaths;
function getNumberOfTextDocumentsOpen() {
    return vscode_1.workspace.textDocuments ? vscode_1.workspace.textDocuments.length : 0;
}
exports.getNumberOfTextDocumentsOpen = getNumberOfTextDocumentsOpen;
function isFileOpen(fileName) {
    if (getNumberOfTextDocumentsOpen() > 0) {
        // check if the .software/CodeTime has already been opened
        for (let i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
            let docObj = vscode_1.workspace.textDocuments[i];
            if (docObj.fileName && docObj.fileName === fileName) {
                return true;
            }
        }
    }
    return false;
}
exports.isFileOpen = isFileOpen;
function getRootPathForFile(fileName) {
    let folder = getProjectFolder(fileName);
    if (folder) {
        return folder.uri.fsPath;
    }
    return null;
}
exports.getRootPathForFile = getRootPathForFile;
function getProjectFolder(fileName) {
    let liveshareFolder = null;
    if (vscode_1.workspace.workspaceFolders && vscode_1.workspace.workspaceFolders.length > 0) {
        for (let i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
            let workspaceFolder = vscode_1.workspace.workspaceFolders[i];
            if (workspaceFolder.uri) {
                let isVslsScheme = workspaceFolder.uri.scheme === "vsls" ? true : false;
                if (isVslsScheme) {
                    liveshareFolder = workspaceFolder;
                }
                let folderUri = workspaceFolder.uri;
                if (folderUri &&
                    folderUri.fsPath &&
                    !isVslsScheme &&
                    fileName.includes(folderUri.fsPath)) {
                    return workspaceFolder;
                }
            }
        }
    }
    // wasn't found but if liveshareFolder was found, return that
    if (liveshareFolder) {
        return liveshareFolder;
    }
    return null;
}
exports.getProjectFolder = getProjectFolder;
function validateEmail(email) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
}
exports.validateEmail = validateEmail;
function setItem(key, value) {
    // update the cached session key map
    cachedSessionKeys[key] = value;
    const jsonObj = getSoftwareSessionAsJson();
    jsonObj[key] = value;
    const content = JSON.stringify(jsonObj);
    const sessionFile = getSoftwareSessionFile();
    fs.writeFileSync(sessionFile, content, (err) => {
        if (err)
            logIt(`Error writing to the Software session file: ${err.message}`);
    });
}
exports.setItem = setItem;
function getItem(key) {
    let cachedVal = cachedSessionKeys[key];
    if (cachedVal) {
        return cachedVal;
    }
    const jsonObj = getSoftwareSessionAsJson();
    let val = jsonObj[key] || null;
    // update the cache map
    cachedSessionKeys[key] = val;
    return val;
}
exports.getItem = getItem;
function isEmptyObj(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObj = isEmptyObj;
function isLinux() {
    return isWindows() || isMac() ? false : true;
}
exports.isLinux = isLinux;
// process.platform return the following...
//   -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
function isWindows() {
    return process.platform.indexOf("win32") !== -1;
}
exports.isWindows = isWindows;
function isMac() {
    return process.platform.indexOf("darwin") !== -1;
}
exports.isMac = isMac;
function getHostname() {
    return __awaiter(this, void 0, void 0, function* () {
        let hostname = yield getCommandResult("hostname", 1);
        return hostname;
    });
}
exports.getHostname = getHostname;
function getOs() {
    let parts = [];
    let osType = os.type();
    if (osType) {
        parts.push(osType);
    }
    let osRelease = os.release();
    if (osRelease) {
        parts.push(osRelease);
    }
    let platform = os.platform();
    if (platform) {
        parts.push(platform);
    }
    if (parts.length > 0) {
        return parts.join("_");
    }
    return "";
}
exports.getOs = getOs;
function getCommandResult(cmd, maxLines = -1) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield wrapExecPromise(`${cmd}`, null);
        if (!result) {
            return "";
        }
        let contentList = result
            .replace(/\r\n/g, "\r")
            .replace(/\n/g, "\r")
            .split(/\r/);
        if (contentList && contentList.length > 0) {
            let len = maxLines !== -1
                ? Math.min(contentList.length, maxLines)
                : contentList.length;
            for (let i = 0; i < len; i++) {
                let line = contentList[i];
                if (line && line.trim().length > 0) {
                    result = line.trim();
                    break;
                }
            }
        }
        return result;
    });
}
exports.getCommandResult = getCommandResult;
function getOsUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = os.userInfo().username;
        if (!username || username.trim() === "") {
            username = yield getCommandResult("whoami", 1);
        }
        return username;
    });
}
exports.getOsUsername = getOsUsername;
function getDashboardFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\CodeTime.txt";
    }
    else {
        file += "/CodeTime.txt";
    }
    return file;
}
exports.getDashboardFile = getDashboardFile;
function getSummaryInfoFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\SummaryInfo.txt";
    }
    else {
        file += "/SummaryInfo.txt";
    }
    return file;
}
exports.getSummaryInfoFile = getSummaryInfoFile;
function getMusicTimeFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\MusicTime.txt";
    }
    else {
        file += "/MusicTime.txt";
    }
    return file;
}
exports.getMusicTimeFile = getMusicTimeFile;
function getMusicTimeMarkdownFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\MusicTime.html";
    }
    else {
        file += "/MusicTime.html";
    }
    return file;
}
exports.getMusicTimeMarkdownFile = getMusicTimeMarkdownFile;
function getSongSessionDataFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\songSessionData.json";
    }
    else {
        file += "/songSessionData.json";
    }
    return file;
}
exports.getSongSessionDataFile = getSongSessionDataFile;
function getSoftwareDir(autoCreate = true) {
    const homedir = os.homedir();
    let softwareDataDir = homedir;
    if (isWindows()) {
        softwareDataDir += "\\.software";
    }
    else {
        softwareDataDir += "/.software";
    }
    if (autoCreate && !fs.existsSync(softwareDataDir)) {
        fs.mkdirSync(softwareDataDir);
    }
    return softwareDataDir;
}
exports.getSoftwareDir = getSoftwareDir;
function softwareSessionFileExists() {
    // don't auto create the file
    const file = getSoftwareSessionFile(false);
    // check if it exists
    return fs.existsSync(file);
}
exports.softwareSessionFileExists = softwareSessionFileExists;
function jwtExists() {
    let jwt = getItem("jwt");
    return !jwt ? false : true;
}
exports.jwtExists = jwtExists;
function getSoftwareSessionFile(autoCreate = true) {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\session.json";
    }
    else {
        file += "/session.json";
    }
    return file;
}
exports.getSoftwareSessionFile = getSoftwareSessionFile;
function getSoftwareDataStoreFile() {
    let file = getSoftwareDir();
    if (isWindows()) {
        file += "\\data.json";
    }
    else {
        file += "/data.json";
    }
    return file;
}
exports.getSoftwareDataStoreFile = getSoftwareDataStoreFile;
function getLocalREADMEFile() {
    let file = __dirname;
    if (isWindows()) {
        file += "\\README.md";
    }
    else {
        file += "/README.md";
    }
    return file;
}
exports.getLocalREADMEFile = getLocalREADMEFile;
function getImagesDir() {
    let dir = __dirname;
    if (isWindows()) {
        dir += "\\images";
    }
    else {
        dir += "/images";
    }
    return dir;
}
exports.getImagesDir = getImagesDir;
function displayReadmeIfNotExists(override = false) {
    const displayedReadme = getItem("displayedMtReadme");
    if (!displayedReadme || override) {
        setTimeout(() => {
            vscode_1.commands.executeCommand("musictime.revealTree");
        }, 1000);
        const readmeUri = vscode_1.Uri.file(getLocalREADMEFile());
        vscode_1.commands.executeCommand("markdown.showPreview", readmeUri, vscode_1.ViewColumn.One);
        setItem("displayedMtReadme", true);
    }
}
exports.displayReadmeIfNotExists = displayReadmeIfNotExists;
function getExtensionDisplayName() {
    if (extensionDisplayName) {
        return extensionDisplayName;
    }
    let extInfoFile = __dirname;
    if (isWindows()) {
        extInfoFile += "\\extensioninfo.json";
    }
    else {
        extInfoFile += "/extensioninfo.json";
    }
    if (fs.existsSync(extInfoFile)) {
        const content = fs.readFileSync(extInfoFile).toString();
        if (content) {
            try {
                const data = JSON.parse(content);
                if (data) {
                    extensionDisplayName = data.displayName;
                }
            }
            catch (e) {
                logIt(`unable to read ext info name: ${e.message}`);
            }
        }
    }
    if (!extensionDisplayName) {
        extensionDisplayName = "Music Time";
    }
    return extensionDisplayName;
}
exports.getExtensionDisplayName = getExtensionDisplayName;
function getExtensionName() {
    if (extensionName) {
        return extensionName;
    }
    let extInfoFile = __dirname;
    if (isWindows()) {
        extInfoFile += "\\extensioninfo.json";
    }
    else {
        extInfoFile += "/extensioninfo.json";
    }
    if (fs.existsSync(extInfoFile)) {
        const content = fs.readFileSync(extInfoFile).toString();
        if (content) {
            try {
                const data = JSON.parse(content);
                if (data) {
                    extensionName = data.name;
                }
            }
            catch (e) {
                logIt(`unable to read ext info name: ${e.message}`);
            }
        }
    }
    if (!extensionName) {
        extensionName = "music-time";
    }
    return extensionName;
}
exports.getExtensionName = getExtensionName;
function logEvent(message) {
    const logEvents = DataController_1.getToggleFileEventLoggingState();
    if (logEvents) {
        console.log(`${getExtensionName()}: ${message}`);
    }
}
exports.logEvent = logEvent;
function logIt(message) {
    console.log(`${getExtensionName()}: ${message}`);
}
exports.logIt = logIt;
function getSoftwareSessionAsJson() {
    let data = null;
    const sessionFile = getSoftwareSessionFile();
    if (fs.existsSync(sessionFile)) {
        const content = fs.readFileSync(sessionFile).toString();
        if (content) {
            try {
                data = JSON.parse(content);
            }
            catch (e) {
                logIt(`unable to read session info: ${e.message}`);
                // error trying to read the session file, delete it
                deleteFile(sessionFile);
                data = {};
            }
        }
    }
    return data ? data : {};
}
exports.getSoftwareSessionAsJson = getSoftwareSessionAsJson;
function showOfflinePrompt(addReconnectMsg = false) {
    return __awaiter(this, void 0, void 0, function* () {
        // shows a prompt that we're not able to communicate with the app server
        let infoMsg = "Our service is temporarily unavailable. ";
        if (addReconnectMsg) {
            infoMsg +=
                "We will try to reconnect again in 10 minutes. Your status bar will not update at this time.";
        }
        else {
            infoMsg += "Please try again later.";
        }
        // set the last update time so we don't try to ask too frequently
        vscode_1.window.showInformationMessage(infoMsg, ...["OK"]);
    });
}
exports.showOfflinePrompt = showOfflinePrompt;
function nowInSecs() {
    return Math.round(Date.now() / 1000);
}
exports.nowInSecs = nowInSecs;
function getOffsetSecends() {
    let d = new Date();
    return d.getTimezoneOffset() * 60;
}
exports.getOffsetSecends = getOffsetSecends;
function getNowTimes() {
    let d = new Date();
    d = new Date(d.getTime());
    // offset is the minutes from GMT.
    // it's positive if it's before, and negative after
    const offset = d.getTimezoneOffset();
    const offset_sec = offset * 60;
    let now_in_sec = Math.round(d.getTime() / 1000);
    // subtract the offset_sec (it'll be positive before utc and negative after utc)
    return {
        now_in_sec,
        local_now_in_sec: now_in_sec - offset_sec,
        offset_sec,
    };
}
exports.getNowTimes = getNowTimes;
function storePayload(payload) {
    // store the payload into the data.json file
    const file = getSoftwareDataStoreFile();
    // also store the payload into the data.json file
    try {
        fs.appendFileSync(file, JSON.stringify(payload) + os.EOL);
    }
    catch (err) {
        logIt(`Error appending to the code time data store file: ${err.message}`);
    }
}
exports.storePayload = storePayload;
function storeMusicSessionPayload(songSession) {
    // store the payload into the data.json file
    const file = getSongSessionDataFile();
    // also store the payload into the songSessionData.json file
    try {
        fs.appendFileSync(file, JSON.stringify(songSession) + os.EOL);
    }
    catch (err) {
        logIt(`Error appending to the music session data store file: ${err.message}`);
    }
}
exports.storeMusicSessionPayload = storeMusicSessionPayload;
function randomCode() {
    return crypto
        .randomBytes(16)
        .map((value) => exports.alpha.charCodeAt(Math.floor((value * exports.alpha.length) / 256)))
        .toString();
}
exports.randomCode = randomCode;
function deleteFile(file) {
    // if the file exists, get it
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}
exports.deleteFile = deleteFile;
/**
 * Format pathString if it is on Windows. Convert `c:\` like string to `C:\`
 * @param pathString
 */
function formatPathIfNecessary(pathString) {
    if (process.platform === "win32") {
        pathString = pathString.replace(/^([a-zA-Z])\:\\/, (_, $1) => `${$1.toUpperCase()}:\\`);
    }
    return pathString;
}
exports.formatPathIfNecessary = formatPathIfNecessary;
function execPromise(command, opts) {
    return new Promise(function (resolve, reject) {
        exec(command, opts, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
function normalizeGithubEmail(email) {
    if (email) {
        email = email.replace("users.noreply.", "");
        if (NUMBER_IN_EMAIL_REGEX.test(email)) {
            // take out the 1st part
            email = email.substring(email.indexOf("+") + 1);
        }
    }
    return email;
}
exports.normalizeGithubEmail = normalizeGithubEmail;
function getSongDisplayName(name) {
    if (!name) {
        return "";
    }
    let displayName = "";
    name = name.trim();
    if (name.length > 14) {
        const parts = name.split(" ");
        for (let i = 0; i < parts.length; i++) {
            displayName = `${displayName} ${parts[i]}`;
            if (displayName.length >= 12) {
                if (displayName.length > 14) {
                    // trim it down to at least 14
                    displayName = `${displayName.substring(0, 14)}`;
                }
                displayName = `${displayName}..`;
                break;
            }
        }
    }
    else {
        displayName = name;
    }
    return displayName.trim();
}
exports.getSongDisplayName = getSongDisplayName;
function getGitEmail() {
    return __awaiter(this, void 0, void 0, function* () {
        let projectDirs = getRootPaths();
        if (!projectDirs || projectDirs.length === 0) {
            return null;
        }
        for (let i = 0; i < projectDirs.length; i++) {
            let projectDir = projectDirs[i];
            let email = yield wrapExecPromise("git config user.email", projectDir);
            if (email) {
                /**
                 * // normalize the email, possible github email types
                 * shupac@users.noreply.github.com
                 * 37358488+rick-software@users.noreply.github.com
                 */
                email = normalizeGithubEmail(email);
                return email;
            }
        }
        return null;
    });
}
exports.getGitEmail = getGitEmail;
function wrapExecPromise(cmd, projectDir = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = null;
        try {
            let opts = projectDir !== undefined && projectDir !== null
                ? { cwd: projectDir }
                : {};
            result = yield execPromise(cmd, opts).catch((e) => {
                if (e.message) {
                    console.log("task error: ", e.message);
                }
                return null;
            });
        }
        catch (e) {
            if (e.message) {
                console.log("task error: ", e.message);
            }
            result = null;
        }
        return result;
    });
}
exports.wrapExecPromise = wrapExecPromise;
function launchWebUrl(url) {
    open(url);
}
exports.launchWebUrl = launchWebUrl;
function launchMusicAnalytics() {
    open(`${Constants_1.launch_url}/music`);
}
exports.launchMusicAnalytics = launchMusicAnalytics;
/**
 * humanize the minutes
 */
function humanizeMinutes(min) {
    min = parseInt(min, 0) || 0;
    let str = "";
    if (min === 60) {
        str = "1 hr";
    }
    else if (min > 60) {
        let hrs = parseFloat(min) / 60;
        if (hrs % 1 === 0) {
            str = hrs.toFixed(0) + " hrs";
        }
        else {
            str = (Math.round(hrs * 10) / 10).toFixed(1) + " hrs";
        }
    }
    else if (min === 1) {
        str = "1 min";
    }
    else {
        // less than 60 seconds
        str = min.toFixed(0) + " min";
    }
    return str;
}
exports.humanizeMinutes = humanizeMinutes;
function showInformationMessage(message) {
    return vscode_1.window.showInformationMessage(`${message}`);
}
exports.showInformationMessage = showInformationMessage;
function showWarningMessage(message) {
    return vscode_1.window.showWarningMessage(`${message}`);
}
exports.showWarningMessage = showWarningMessage;
function getDashboardRow(label, value) {
    let content = `${getDashboardLabel(label)} : ${getDashboardValue(value)}\n`;
    return content;
}
exports.getDashboardRow = getDashboardRow;
function getSectionHeader(label) {
    let content = `${label}\n`;
    // add 3 to account for the " : " between the columns
    let dashLen = exports.DASHBOARD_LABEL_WIDTH + exports.DASHBOARD_VALUE_WIDTH + 15;
    for (let i = 0; i < dashLen; i++) {
        content += "-";
    }
    content += "\n";
    return content;
}
exports.getSectionHeader = getSectionHeader;
function buildQueryString(obj) {
    let params = [];
    if (obj) {
        let keys = Object.keys(obj);
        if (keys && keys.length > 0) {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let val = obj[key];
                if (val && val !== undefined) {
                    let encodedVal = encodeURIComponent(val);
                    params.push(`${key}=${encodedVal}`);
                }
            }
        }
    }
    if (params.length > 0) {
        return "?" + params.join("&");
    }
    else {
        return "";
    }
}
exports.buildQueryString = buildQueryString;
function getDashboardLabel(label, width = exports.DASHBOARD_LABEL_WIDTH) {
    return getDashboardDataDisplay(width, label);
}
function getDashboardValue(value) {
    let valueContent = getDashboardDataDisplay(exports.DASHBOARD_VALUE_WIDTH, value);
    let paddedContent = "";
    for (let i = 0; i < 11; i++) {
        paddedContent += " ";
    }
    paddedContent += valueContent;
    return paddedContent;
}
function getDashboardDataDisplay(widthLen, data) {
    let len = data.constructor === String
        ? widthLen - data.length
        : widthLen - String(data).length;
    let content = "";
    for (let i = 0; i < len; i++) {
        content += " ";
    }
    return `${content}${data}`;
}
function createUriFromTrackId(track_id) {
    if (track_id && !track_id.includes("spotify:track:")) {
        track_id = `spotify:track:${track_id}`;
    }
    return track_id;
}
exports.createUriFromTrackId = createUriFromTrackId;
function createUriFromPlaylistId(playlist_id) {
    if (playlist_id && !playlist_id.includes("spotify:playlist:")) {
        playlist_id = `spotify:playlist:${playlist_id}`;
    }
    return playlist_id;
}
exports.createUriFromPlaylistId = createUriFromPlaylistId;
function createSpotifyIdFromUri(id) {
    if (id && id.indexOf("spotify:") === 0) {
        return id.substring(id.lastIndexOf(":") + 1);
    }
    return id;
}
exports.createSpotifyIdFromUri = createSpotifyIdFromUri;
function isValidJson(val) {
    if (val === null || val === undefined) {
        return false;
    }
    if (typeof val === "string" || typeof val === "number") {
        return false;
    }
    try {
        const stringifiedVal = JSON.stringify(val);
        JSON.parse(stringifiedVal);
        return true;
    }
    catch (e) {
        //
    }
    return false;
}
exports.isValidJson = isValidJson;
function getFileType(fileName) {
    let fileType = "";
    const lastDotIdx = fileName.lastIndexOf(".");
    const len = fileName.length;
    if (lastDotIdx !== -1 && lastDotIdx < len - 1) {
        fileType = fileName.substring(lastDotIdx + 1);
    }
    return fileType;
}
exports.getFileType = getFileType;
const resourcePath = path.join(__filename, "..", "..", "resources");
function getPlaylistIcon(treeItem) {
    const stateVal = treeItem.state !== cody_music_1.TrackStatus.Playing ? "notplaying" : "playing";
    let contextValue = "";
    // itemType will be either: track | playlist
    // type will be either: connected | action | recommendation | label | track | playlist | itunes | spotify
    // tag will be either: action | paw | spotify | spotify-liked-songs | active
    // track/playlist/action hover contextValue matching...
    // musictime.sharePlaylist =~ /spotify-playlist-item.*/
    // musictime.shareTrack =~ /track-item.*/ || /spotify-recommendation.*/
    // musictime.addToPlaylist =~ /spotify-recommendation.*/
    // musictime.highPopularity =~ /.*-highpopularity/
    if (treeItem.tag === "action") {
        this.contextValue = "treeitem-action";
    }
    else if (treeItem["itemType"] === "track" ||
        treeItem["itemType"] === "playlist") {
        if (treeItem.tag === "paw") {
            // we use the paw to show as the music time playlist, but
            // make sure the contextValue has spotify in it
            contextValue = `spotify-${treeItem.type}-item-${stateVal}`;
        }
        else {
            if (treeItem.tag) {
                contextValue = `${treeItem.tag}-${treeItem.type}-item-${stateVal}`;
            }
            else {
                contextValue = `${treeItem.type}-item-${stateVal}`;
            }
        }
    }
    if (treeItem.id === Constants_1.SOFTWARE_TOP_40_PLAYLIST_ID && !treeItem.loved) {
        contextValue += "-softwaretop40";
    }
    else if (treeItem["playlist_id"] == Constants_1.SPOTIFY_LIKED_SONGS_PLAYLIST_NAME) {
        contextValue += "-isliked";
    }
    let lightPath = null;
    let darkPath = null;
    if (treeItem["icon"]) {
        lightPath = path.join(resourcePath, "light", treeItem["icon"]);
        darkPath = path.join(resourcePath, "dark", treeItem["icon"]);
    }
    else if (treeItem.type.includes("spotify") ||
        (treeItem.tag.includes("spotify") && treeItem.itemType !== "playlist")) {
        const spotifySvg = treeItem.tag === "disabled"
            ? "spotify-disconnected.svg"
            : "spotify-logo.svg";
        lightPath = path.join(resourcePath, "light", spotifySvg);
        darkPath = path.join(resourcePath, "dark", spotifySvg);
    }
    else if (treeItem.itemType === "playlist" && treeItem.tag !== "paw") {
        const playlistSvg = "playlist.svg";
        lightPath = path.join(resourcePath, "light", playlistSvg);
        darkPath = path.join(resourcePath, "dark", playlistSvg);
    }
    else if (treeItem.tag === "itunes" || treeItem.type === "itunes") {
        lightPath = path.join(resourcePath, "light", "itunes-logo.svg");
        darkPath = path.join(resourcePath, "dark", "itunes-logo.svg");
    }
    else if (treeItem.tag === "paw") {
        lightPath = path.join(resourcePath, "light", "paw.svg");
        darkPath = path.join(resourcePath, "dark", "paw.svg");
    }
    else if (treeItem.type === "connected") {
        lightPath = path.join(resourcePath, "light", "radio-tower.svg");
        darkPath = path.join(resourcePath, "dark", "radio-tower.svg");
    }
    else if (treeItem.type === "offline") {
        lightPath = path.join(resourcePath, "light", "nowifi.svg");
        darkPath = path.join(resourcePath, "dark", "nowifi.svg");
    }
    else if (treeItem.type === "action" || treeItem.tag === "action") {
        lightPath = path.join(resourcePath, "light", "gear.svg");
        darkPath = path.join(resourcePath, "dark", "gear.svg");
    }
    else if (treeItem.type === "login" || treeItem.tag === "login") {
        lightPath = path.join(resourcePath, "light", "sign-in.svg");
        darkPath = path.join(resourcePath, "dark", "sign-in.svg");
    }
    else if (treeItem.type === "divider") {
        lightPath = path.join(resourcePath, "light", "blue-line-96.png");
        darkPath = path.join(resourcePath, "dark", "blue-line-96.png");
    }
    return { lightPath, darkPath, contextValue };
}
exports.getPlaylistIcon = getPlaylistIcon;
function getCodyErrorMessage(response) {
    let errMsg = null;
    if (response.state === cody_music_1.CodyResponseType.Failed) {
        // format the message
        errMsg = "";
        if (response.message) {
            errMsg = response.message;
            var hasEndingPeriod = errMsg.lastIndexOf(".") === errMsg.length - 1;
            if (!hasEndingPeriod) {
                errMsg = `${errMsg}.`;
            }
        }
    }
    return errMsg;
}
exports.getCodyErrorMessage = getCodyErrorMessage;
//# sourceMappingURL=Util.js.map