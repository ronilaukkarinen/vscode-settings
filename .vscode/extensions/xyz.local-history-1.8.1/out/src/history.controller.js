"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const timeout_1 = require("./timeout");
const glob = require("glob");
const rimraf = require("rimraf");
// import mkdirp = require('mkdirp');
const anymatch = require("anymatch");
// node 8.5 has natively fs.copyFile
// import copyFile = require('fs-copy-file');
const history_settings_1 = require("./history.settings");
/**
 * Controller for handling history.
 */
class HistoryController {
    constructor() {
        this.pattern = '_' + ('[0-9]'.repeat(14));
        this.regExp = /_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
        this.settings = new history_settings_1.HistorySettings();
        this.saveBatch = new Map();
    }
    saveFirstRevision(document) {
        // Put a timeout of 1000 ms, cause vscode wait until a delay and then continue the saving.
        // Timeout avoid to save a wrong version, because it's to late and vscode has already saved the file.
        // (if an error occured 3 times this code will not be called anymore.)
        // cf. https://github.com/Microsoft/vscode/blob/master/src/vs/workbench/api/node/extHostDocumentSaveParticipant.ts
        return this.internalSave(document, true, new timeout_1.default(1000));
    }
    saveRevision(document) {
        return this.internalSave(document);
    }
    showAll(editor) {
        this.internalShowAll(this.actionOpen, editor, this.getSettings(editor.document.uri));
    }
    showCurrent(editor) {
        let document = (editor && editor.document);
        if (document)
            return this.internalOpen(this.findCurrent(document.fileName, this.getSettings(editor.document.uri)), editor.viewColumn);
    }
    compareToActive(editor) {
        this.internalShowAll(this.actionCompareToActive, editor, this.getSettings(editor.document.uri));
    }
    compareToCurrent(editor) {
        this.internalShowAll(this.actionCompareToCurrent, editor, this.getSettings(editor.document.uri));
    }
    compareToPrevious(editor) {
        this.internalShowAll(this.actionCompareToPrevious, editor, this.getSettings(editor.document.uri));
    }
    compare(file1, file2, column, range) {
        return this.internalCompare(file1, file2, column, range);
    }
    findAllHistory(fileName, settings, noLimit) {
        return new Promise((resolve, reject) => {
            if (!settings.enabled)
                resolve();
            let fileProperties = this.decodeFile(fileName, settings, true);
            this.getHistoryFiles(fileProperties && fileProperties.file, settings, noLimit)
                .then(files => {
                fileProperties.history = files;
                resolve(fileProperties);
            })
                .catch(err => reject(err));
        });
    }
    findGlobalHistory(find, findFile, settings, noLimit) {
        return new Promise((resolve, reject) => {
            if (!settings.enabled)
                resolve();
            if (findFile)
                this.findAllHistory(find, settings, noLimit)
                    .then(fileProperties => resolve(fileProperties && fileProperties.history));
            else
                this.getHistoryFiles(find, settings, noLimit)
                    .then(files => {
                    resolve(files);
                })
                    .catch(err => reject(err));
        });
    }
    decodeFile(filePath, settings, history) {
        return this.internalDecodeFile(filePath, settings, history);
    }
    getSettings(file) {
        return this.settings.get(file);
    }
    clearSettings() {
        this.settings.clear();
    }
    deleteFile(fileName) {
        return this.deleteFiles([fileName]);
    }
    deleteFiles(fileNames) {
        return new Promise((resolve, reject) => {
            this.internalDeleteHistory(fileNames)
                .then(() => resolve())
                .catch((err) => reject());
        });
    }
    deleteAll(fileHistoryPath) {
        return new Promise((resolve, reject) => {
            rimraf(fileHistoryPath, err => {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    }
    deleteHistory(fileName) {
        return new Promise((resolve, reject) => {
            const settings = this.getSettings(vscode.Uri.file(fileName));
            const fileProperties = this.decodeFile(fileName, settings, true);
            this.getHistoryFiles(fileProperties && fileProperties.file, settings, true)
                .then((files) => this.internalDeleteHistory(files))
                .then(() => resolve())
                .catch((err) => reject());
        });
    }
    restore(fileName) {
        const src = fileName.fsPath;
        const settings = this.getSettings(vscode.Uri.file(src));
        const fileProperties = this.decodeFile(src, settings, false);
        if (fileProperties && fileProperties.file) {
            return new Promise((resolve, reject) => {
                // Node v.8.5 has fs.copyFile
                // const fnCopy = fs.copyFile || copyFile;
                fs.copyFile(src, fileProperties.file, err => {
                    if (err)
                        return reject(err);
                    return resolve();
                });
            });
        }
    }
    /* private */
    internalSave(document, isOriginal, timeout) {
        const settings = this.getSettings(document.uri);
        if (!this.allowSave(settings, document)) {
            return Promise.resolve(undefined);
        }
        if (!isOriginal && settings.saveDelay) {
            if (!this.saveBatch.get(document.fileName)) {
                this.saveBatch.set(document.fileName, document);
                return this.timeoutPromise(this.internalSaveDocument, settings.saveDelay * 1000, [document, settings]);
            }
            else
                return Promise.reject(undefined); // waiting
        }
        return this.internalSaveDocument(document, settings, isOriginal, timeout);
    }
    timeoutPromise(f, delay, args) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                f.apply(this, args)
                    .then(value => resolve(value))
                    .catch(value => reject(value));
            }, delay);
        });
    }
    internalSaveDocument(document, settings, isOriginal, timeout) {
        return new Promise((resolve, reject) => {
            let revisionDir;
            if (!settings.absolute) {
                revisionDir = path.dirname(this.getRelativePath(document.fileName).replace(/\//g, path.sep));
            }
            else {
                revisionDir = this.normalizePath(path.dirname(document.fileName), false);
            }
            const p = path.parse(document.fileName);
            const revisionPattern = this.joinPath(settings.historyPath, revisionDir, p.name, p.ext); // toto_[0-9]...
            if (isOriginal) {
                // if already some files exists, don't save an original version (cause: the really original version is lost) !
                // (Often the case...)
                const files = glob.sync(revisionPattern, { cwd: settings.historyPath.replace(/\\/g, '/') });
                if (files && files.length > 0)
                    return resolve();
                if (timeout && timeout.isTimedOut()) {
                    vscode.window.showErrorMessage(`Timeout when internalSave: ' ${document.fileName}`);
                    return reject('timedout');
                }
            }
            else if (settings.saveDelay)
                this.saveBatch.delete(document.fileName);
            let now = new Date(), nowInfo;
            if (isOriginal) {
                // find original date (if any)
                const state = fs.statSync(document.fileName);
                if (state)
                    now = state.mtime;
            }
            // remove 1 sec to original version, to avoid same name as currently version
            now = new Date(now.getTime() - (now.getTimezoneOffset() * 60000) - (isOriginal ? 1000 : 0));
            nowInfo = now.toISOString().substring(0, 19).replace(/[-:T]/g, '');
            const revisionFile = this.joinPath(settings.historyPath, revisionDir, p.name, p.ext, `_${nowInfo}`); // toto_20151213215326.js
            if (this.mkDirRecursive(revisionFile) && this.copyFile(document.fileName, revisionFile, timeout)) {
                if (settings.daysLimit > 0 && !isOriginal)
                    this.purge(document, settings, revisionPattern);
                return resolve(document);
            }
            else
                return reject('Error occured');
        });
    }
    allowSave(settings, document) {
        if (!settings.enabled) {
            return false;
        }
        if (!(document && /*document.isDirty &&*/ document.fileName)) {
            return false;
        }
        // Use '/' with glob
        const docFile = document.fileName.replace(/\\/g, '/');
        // @ts-ignore
        if (settings.exclude && settings.exclude.length > 0 && anymatch(settings.exclude, docFile))
            return false;
        return true;
    }
    getHistoryFiles(patternFilePath, settings, noLimit) {
        return new Promise((resolve, reject) => {
            if (!patternFilePath)
                reject('no pattern path');
            // glob must use character /
            const historyPath = settings.historyPath.replace(/\\/g, '/');
            glob(patternFilePath, { cwd: historyPath, absolute: true }, (err, files) => {
                if (!err) {
                    if (files && files.length) {
                        // files are sorted in ascending order
                        // limitation
                        if (settings.maxDisplay && !noLimit)
                            files = files.slice(settings.maxDisplay * -1);
                        // files are absolute
                    }
                    resolve(files);
                }
                else
                    reject(err);
            });
        });
    }
    internalShowAll(action, editor, settings) {
        if (!settings.enabled)
            return;
        let me = this, document = (editor && editor.document);
        if (!document)
            return;
        me.findAllHistory(document.fileName, settings)
            .then(fileProperties => {
            const files = fileProperties.history;
            if (!files || !files.length) {
                return;
            }
            let displayFiles = [];
            let file, relative, properties;
            // desc order history
            for (let index = files.length - 1; index >= 0; index--) {
                file = files[index];
                relative = path.relative(settings.historyPath, file);
                properties = me.decodeFile(file, settings);
                displayFiles.push({
                    description: relative,
                    label: properties.date.toLocaleString(settings.dateLocale),
                    filePath: file,
                    previous: files[index - 1]
                });
            }
            vscode.window.showQuickPick(displayFiles)
                .then(val => {
                if (val) {
                    let actionValues = {
                        active: document.fileName,
                        selected: val.filePath,
                        previous: val.previous
                    };
                    action.apply(me, [actionValues, editor]);
                }
            });
        });
    }
    actionOpen(values, editor) {
        return this.internalOpen(vscode.Uri.file(values.selected), editor.viewColumn);
    }
    actionCompareToActive(values, editor) {
        return this.internalCompare(vscode.Uri.file(values.selected), vscode.Uri.file(values.active));
    }
    actionCompareToCurrent(values, editor, settings) {
        return this.internalCompare(vscode.Uri.file(values.selected), this.findCurrent(values.active, settings));
    }
    actionCompareToPrevious(values, editor) {
        if (values.previous)
            return this.internalCompare(vscode.Uri.file(values.selected), vscode.Uri.file(values.previous));
    }
    internalOpen(filePath, column) {
        if (filePath)
            return new Promise((resolve, reject) => {
                vscode.workspace.openTextDocument(filePath)
                    .then(d => {
                    vscode.window.showTextDocument(d, column)
                        .then(() => resolve(), (err) => reject(err));
                }, (err) => reject(err));
            });
    }
    internalCompare(file1, file2, column, range) {
        if (file1 && file2) {
            const option = {};
            if (column)
                option.viewColumn = Number.parseInt(column, 10);
            option.selection = range;
            // Diff on the active column
            let title = path.basename(file1.fsPath) + '<->' + path.basename(file2.fsPath);
            vscode.commands.executeCommand('vscode.diff', file1, file2, title, option);
        }
    }
    internalDecodeFile(filePath, settings, history) {
        let me = this, file, p, date, isHistory = false;
        p = path.parse(filePath);
        if (filePath.includes('/.history/') || filePath.includes('\\.history\\')) { //startsWith(this.settings.historyPath))
            isHistory = true;
            let index = p.name.match(me.regExp);
            if (index) {
                date = new Date(index[1], index[2] - 1, index[3], index[4], index[5], index[6]);
                p.name = p.name.substring(0, index.index);
            }
            else
                return null; // file in history with bad pattern !
        }
        if (history != null) {
            let root = '';
            if (history !== isHistory) {
                if (history === true) {
                    root = settings.historyPath;
                    if (!settings.absolute)
                        p.dir = path.relative(settings.folder.fsPath, p.dir);
                    else
                        p.dir = this.normalizePath(p.dir, false);
                }
                else { // if (history === false)
                    p.dir = path.relative(settings.historyPath, p.dir);
                    if (!settings.absolute) {
                        root = settings.folder.fsPath;
                    }
                    else {
                        root = '';
                        p.dir = this.normalizePath(p.dir, true);
                    }
                }
            }
            file = me.joinPath(root, p.dir, p.name, p.ext, history ? undefined : '');
        }
        else
            file = filePath;
        return {
            dir: p.dir,
            name: p.name,
            ext: p.ext,
            file: file,
            date: date
        };
    }
    joinPath(root, dir, name, ext, pattern = this.pattern) {
        return path.join(root, dir, name + pattern + ext);
    }
    findCurrent(activeFilename, settings) {
        if (!settings.enabled)
            return vscode.Uri.file(activeFilename);
        let fileProperties = this.decodeFile(activeFilename, settings, false);
        if (fileProperties !== null)
            return vscode.Uri.file(fileProperties.file);
        else
            return vscode.Uri.file(activeFilename);
    }
    internalDeleteFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.unlink(fileName, err => {
                if (err)
                    // Not reject to avoid Promise.All to stop
                    return resolve({ fileName: fileName, err: err });
                return resolve(fileName);
            });
        });
    }
    internalDeleteHistory(fileNames) {
        return new Promise((resolve, reject) => {
            Promise.all(fileNames.map(file => this.internalDeleteFile(file)))
                .then(results => {
                // Display 1st error
                results.some((item) => {
                    if (item.err) {
                        vscode.window.showErrorMessage(`Error when delete files history: '${item.err}' file '${item.fileName}`);
                        return true;
                    }
                });
                resolve();
            })
                .catch(() => reject());
        });
    }
    purge(document, settings, pattern) {
        let me = this;
        me.getHistoryFiles(pattern, settings, true)
            .then(files => {
            if (!files || !files.length) {
                return;
            }
            let stat, now = new Date().getTime(), endTime;
            for (let file of files) {
                stat = fs.statSync(file);
                if (stat && stat.isFile()) {
                    endTime = stat.birthtime.getTime() + settings.daysLimit * 24 * 60 * 60 * 1000;
                    if (now > endTime) {
                        fs.unlinkSync(file);
                    }
                }
            }
        });
    }
    getRelativePath(fileName) {
        let relative = vscode.workspace.asRelativePath(fileName, false);
        if (fileName !== relative) {
            return relative;
        }
        else
            return path.basename(fileName);
    }
    mkDirRecursive(fileName) {
        try {
            fs.mkdirSync(path.dirname(fileName), { recursive: true });
            // mkdirp.sync(path.dirname(fileName));
            return true;
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error with mkdir: '${err.toString()}' file '${fileName}`);
            return false;
        }
    }
    copyFile(source, target, timeout) {
        try {
            let buffer;
            buffer = fs.readFileSync(source);
            if (timeout && timeout.isTimedOut()) {
                vscode.window.showErrorMessage(`Timeout when copyFile: ' ${source} => ${target}`);
                return false;
            }
            fs.writeFileSync(target, buffer);
            return true;
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error with copyFile: '${err.toString()} ${source} => ${target}`);
            return false;
        }
    }
    normalizePath(dir, withDrive) {
        if (process.platform === 'win32') {
            if (!withDrive)
                return dir.replace(':', '');
            else
                return dir.replace('\\', ':\\');
        }
        else
            return dir;
    }
}
exports.HistoryController = HistoryController;
//# sourceMappingURL=history.controller.js.map