'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');
var path = require('path');
var childProcess = require('child_process');
var fs = require('fs');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
function exec (command, args) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let stderr = '', stdout = '';
            try {
                const batch = childProcess.spawn(command, args, { cwd });
                batch.stdout.on('data', function (data) {
                    stdout += data.toString();
                });
                batch.stderr.on('data', data => stdout += data.toString());
                batch.stderr.on('data', data => stderr += data.toString());
                batch.on('close', function () {
                    if (stderr !== '')
                        return reject(stderr.trim());
                    resolve(stdout);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    });
}

function gitReset (filesRelativePaths = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const allIndex = filesRelativePaths.indexOf('*');
        if (allIndex !== -1)
            filesRelativePaths.splice(allIndex, 1);
        const command = 'git';
        const args = ['reset'].concat(filesRelativePaths);
        return exec(command, args);
    });
}

function showOptionalMessage (message, settings, isWarning = false) {
    if (settings.prefillCommitMessage.disableOptionalMessages) {
        vscode.window.setStatusBarMessage(`${isWarning ? 'Warning: ' : ''}${message}`, 6000);
    }
    else {
        if (isWarning) {
            vscode.window.showWarningMessage(message);
        }
        else {
            vscode.window.showInformationMessage(message);
        }
    }
}

function cancelAdd (filesRelativePaths, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        showOptionalMessage(`Add & Commit canceled.`, settings, true);
        return gitReset(filesRelativePaths);
    });
}

function getCommonPathOfGitFiles (gitStatusFiles) {
    let commonPath = '';
    gitStatusFiles.forEach((gitStatusFile, index) => {
        if (index === 0) {
            commonPath = gitStatusFile.path;
            return;
        }
        if (commonPath.length === 0)
            return;
        let length = commonPath.length + 1;
        while (--length > 0) {
            if (gitStatusFile.path.substr(0, length) === commonPath.substr(0, length))
                break;
        }
        if (length === 0) {
            commonPath = '';
            return;
        }
        commonPath = commonPath.substr(0, length);
    });
    if (commonPath.length !== 0 && commonPath[commonPath.length - 1] === '/') {
        commonPath = commonPath.substr(0, commonPath.length - 1);
    }
    return commonPath;
}

function gitStatus () {
    return __awaiter(this, void 0, void 0, function* () {
        const command = 'git';
        const args = ['status', '-s'];
        return exec(command, args);
    });
}

const GIT_SHORT_ACTIONS = {
    A: 'ADDED',
    D: 'DELETED',
    M: 'MODIFIED',
    R: 'RENAMED'
};
function getGitStatusFiles () {
    return __awaiter(this, void 0, void 0, function* () {
        const workspaceRootAbsolutePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
        let gitStatusStdOut;
        try {
            gitStatusStdOut = yield gitStatus();
        }
        catch (err) {
            console.error(err);
        }
        const matches = gitStatusStdOut.match(/[^\r\n]+/g);
        return matches === null
            ? []
            : matches.reduce((linesPartial, line) => {
                if (line.length === 0)
                    return linesPartial;
                const reg = line[0] === 'R' ? /^(\w)\s+(.*)(?=\s->\s|$)(\s->\s)(.*)/ : /^(\w)\s+(.*)/;
                const regRes = line.match(reg);
                if (regRes === null || regRes.length !== 3 && regRes.length !== 5)
                    return linesPartial;
                linesPartial.push(Object.assign({
                    path: regRes[2],
                    state: GIT_SHORT_ACTIONS[regRes[1]]
                }, line[0] === 'R'
                    ? {
                        oldPath: regRes[2],
                        path: regRes[4]
                    }
                    : undefined));
                return linesPartial;
            }, []);
    });
}

function gitAdd (filesRelativePaths) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = 'git';
        const args = ['add'].concat(filesRelativePaths);
        return exec(command, args);
    });
}

function gitCommit (message) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = 'git';
        const args = ['commit', '-m', `${message}`];
        return exec(command, args);
    });
}

function guessAction (commitMessage, state, customActions) {
    const customAction = customActions.find(({ pattern: actionPattern, state: actionState }) => {
        if (actionState !== state)
            return false;
        return typeof actionPattern === 'string'
            ? commitMessage.includes(actionPattern)
            : actionPattern.test(commitMessage);
    }, customActions);
    if (customAction === undefined) {
        switch (state) {
            case 'ADDED':
                commitMessage += 'create';
                break;
            case 'DELETED':
                commitMessage += 'remove';
                break;
            case 'RENAMED':
                commitMessage += 'move';
                break;
            default:
                break;
        }
        return commitMessage;
    }
    return commitMessage += customAction.action;
}

function replaceStringWith(str, patterns) {
    return patterns.reduce((reducedStr, { pattern, with: val }) => {
        return reducedStr.replace(pattern, val);
    }, str);
}

function validateCommitMessage(message) {
    return message !== undefined && message !== null && message.trim() !== '';
}

function addAndCommitFiles(filesRelativePaths, settings) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield gitAdd(filesRelativePaths);
        }
        catch (err) {
            if (typeof err !== 'string' || !/^warning/i.test(err)) {
                vscode.window.showErrorMessage(err);
                console.error(err);
                return;
            }
        }
        let commitMessage = '';
        let commonFilePath;
        try {
            const gitStatusFiles = yield getGitStatusFiles();
            if (gitStatusFiles.length === 0) {
                showOptionalMessage(`Nothing to commit, did you save your changes ?.`, settings, true);
                return;
            }
            if (gitStatusFiles.length === 1) {
                commonFilePath = gitStatusFiles[0].path;
            }
            else {
                commonFilePath = getCommonPathOfGitFiles(gitStatusFiles);
            }
            if (commonFilePath.length !== 0) {
                if (settings.prefillCommitMessage.withFileWorkspacePath) {
                    commitMessage += commonFilePath + ': ';
                    if (settings.prefillCommitMessage.ignoreFileExtension) {
                        const matches = commitMessage.match(/[^\/](\.\w+):/);
                        if (matches !== null && matches.length === 2) {
                            commitMessage = commitMessage.replace(matches[1], '');
                        }
                    }
                }
                if (settings.prefillCommitMessage.forceLowerCase) {
                    commitMessage = commitMessage.toLocaleLowerCase();
                }
                if (gitStatusFiles.length === 1) {
                    commitMessage = guessAction(commitMessage, gitStatusFiles[0].state, settings.prefillCommitMessage.withGuessedCustomActions);
                }
                commitMessage = replaceStringWith(commitMessage, settings.prefillCommitMessage.replacePatternWith);
            }
            commitMessage = yield vscode.window.showInputBox({
                ignoreFocusOut: true,
                prompt: 'Git commit message ?',
                validateInput: commitMessage => !validateCommitMessage(commitMessage)
                    ? `You can't commit with an empty commit message. Write something or press ESC to cancel.`
                    : undefined,
                value: commitMessage
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(err);
            console.error(err);
            return cancelAdd(filesRelativePaths, settings);
        }
        if (!validateCommitMessage(commitMessage)) {
            showOptionalMessage(`You can't commit with an empty commit message.`, settings, true);
            return cancelAdd(filesRelativePaths, settings);
        }
        try {
            yield gitCommit(commitMessage);
        }
        catch (err) {
            if (typeof err !== 'string' || !/^warning/i.test(err)) {
                vscode.window.showErrorMessage(err);
                console.error(err);
                return cancelAdd(filesRelativePaths, settings);
            }
        }
        showOptionalMessage(`File(s) committed to Git with the message: "${commitMessage}".`, settings);
    });
}

function isFile (fileAbsolutePath) {
    try {
        if (fs.lstatSync(fileAbsolutePath).isFile()) {
            return true;
        }
        return false;
    }
    catch (err) {
        return false;
    }
}

function isNonNullObject(value) {
    return !!value && typeof value === 'object';
}
function isSpecial(value) {
    const stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
}
const canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
}
function isMergeableObject (value) {
    return isNonNullObject(value) && !isSpecial(value);
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value) {
    return isMergeableObject(value) ? deepmerge(emptyTarget(value), value) : value;
}
function arrayMerge(target, source) {
    return target.concat(source).map(element => cloneUnlessOtherwiseSpecified(element));
}
function mergeObject(target, source) {
    const destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(key => destination[key] = cloneUnlessOtherwiseSpecified(target[key]));
    }
    Object.keys(source).forEach(key => {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key]);
        }
        else {
            destination[key] = deepmerge(target[key], source[key]);
        }
    });
    return destination;
}
function deepmerge(target, source) {
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
    if (!sourceAndTargetTypesMatch) {
        return cloneUnlessOtherwiseSpecified(source);
    }
    else if (sourceIsArray) {
        return arrayMerge(target, source);
    }
    else {
        return mergeObject(target, source);
    }
}

function normalizePattern(pattern) {
    let normalizedPattern = pattern;
    if (pattern.length > 1
        && pattern.substr(0, 1) === '/'
        && pattern.substr(pattern.length - 1, 1) === '/') {
        normalizedPattern = new RegExp(pattern.substr(1, pattern.length - 2));
    }
    return normalizedPattern;
}

function loadLocalConfig (workspaceRootAbsolutePath) {
    const workspaceSettingsAbsolutePath = path.resolve(workspaceRootAbsolutePath, '.vscode', 'vscode-git-add-and-commit.json');
    const defaultSettings = { prefillCommitMessage: vscode.workspace.getConfiguration('gaac') };
    let userSettings = {};
    if (isFile(workspaceSettingsAbsolutePath)) {
        try {
            const settingsSource = fs.readFileSync(workspaceSettingsAbsolutePath, 'utf8');
            userSettings = JSON.parse(settingsSource);
        }
        catch (err) {
            vscode.window.showWarningMessage(`
        Can't load ".vscode/vscode-git-add-and-commit.json".
        Please check the file content format.
      `);
            console.error(err);
        }
    }
    const normalizedSettings = deepmerge(defaultSettings, userSettings);
    normalizedSettings.prefillCommitMessage.replacePatternWith =
        normalizedSettings.prefillCommitMessage.replacePatternWith
            .map(settingsPattern => ({
            pattern: normalizePattern(settingsPattern.pattern),
            with: settingsPattern.with
        }));
    normalizedSettings.prefillCommitMessage.withGuessedCustomActions =
        normalizedSettings.prefillCommitMessage.withGuessedCustomActions
            .map(settingsPattern => ({
            action: settingsPattern.action,
            pattern: normalizePattern(settingsPattern.pattern),
            state: settingsPattern.state
        }));
    return normalizedSettings;
}

/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
function to(promise, errorExt) {
    return promise
        .then(function (data) { return [null, data]; })
        .catch(function (err) {
        if (errorExt) {
            Object.assign(err, errorExt);
        }
        return [err, undefined];
    });
}

function gitPush () {
    return __awaiter(this, void 0, void 0, function* () {
        const command = 'git';
        const args = ['push', 'origin', 'HEAD'];
        return exec(command, args);
    });
}

function showProgressNotification(message, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        yield vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: message }, () => __awaiter(this, void 0, void 0, function* () {
            res = yield cb();
        }));
        return res;
    });
}

function pushLocalCommits(settings) {
    return __awaiter(this, void 0, void 0, function* () {
        const [err] = yield to(showProgressNotification('Pushing your local commits...', gitPush));
        if (typeof err !== 'string' || !(/^to\s/i.test(err) && !/!\s\[rejected\]/i.test(err))) {
            const errMessage = typeof err !== 'string' ? err.message : err;
            if (errMessage === 'Everything up-to-date') {
                vscode.window.showInformationMessage(errMessage);
            }
            else {
                vscode.window.showErrorMessage(errMessage);
                console.error(err);
                return;
            }
        }
        showOptionalMessage(`Local commit(s) pushed.`, settings);
    });
}

const workspaceRootAbsolutePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
function activate(context) {
    const settings = loadLocalConfig(workspaceRootAbsolutePath);
    const addAndCommitAllFilesDisposable = vscode.commands.registerCommand('extension.vscode-git-automator.addAndCommitAllFiles', () => addAndCommitFiles(['*'], settings));
    const addAndCommitCurrentFileDisposable = vscode.commands.registerCommand('extension.vscode-git-automator.addAndCommitCurrentFile', () => addAndCommitFiles([
        path.relative(workspaceRootAbsolutePath, vscode.window.activeTextEditor.document.fileName)
    ], settings));
    const pushLocalCommitsDisposable = vscode.commands.registerCommand('extension.vscode-git-automator.pushLocalCommits', () => pushLocalCommits(settings));
    context.subscriptions.push(addAndCommitAllFilesDisposable, addAndCommitCurrentFileDisposable, pushLocalCommitsDisposable);
}
function deactivate() { }

exports.activate = activate;
exports.deactivate = deactivate;
