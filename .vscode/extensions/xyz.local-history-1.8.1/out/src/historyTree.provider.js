"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const history_settings_1 = require("./history.settings");
class HistoryTreeProvider {
    constructor(controller) {
        this.controller = controller;
        /* tslint:disable */
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        // save historyItem structure to be able to redraw
        this.tree = {}; // {yesterday: {grp: HistoryItem, items: HistoryItem[]}}
        this.noLimit = false;
        this.contentKind = 0;
        this.initLocation();
    }
    initLocation() {
        vscode.commands.executeCommand('setContext', 'local-history:treeLocation', history_settings_1.HistorySettings.getTreeLocation());
    }
    getSettingsItem() {
        // Node only for settings...
        switch (this.contentKind) {
            case 1 /* All */:
                return new HistoryItem(this, 'Search: all', 0 /* None */, null, this.currentHistoryPath);
                break;
            case 0 /* Current */:
                return new HistoryItem(this, 'Search: current', 0 /* None */, null, this.currentHistoryFile);
                break;
            case 2 /* Search */:
                return new HistoryItem(this, `Search: ${this.searchPattern}`, 0 /* None */, null, this.searchPattern);
                break;
        }
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        return new Promise(resolve => {
            // redraw
            const keys = Object.keys(this.tree);
            if (keys && keys.length) {
                if (!element) {
                    const items = [];
                    items.push(this.getSettingsItem());
                    keys.forEach(key => items.push(this.tree[key].grp));
                    return resolve(items);
                }
                else if (this.tree[element.label].items) {
                    return resolve(this.tree[element.label].items);
                }
            }
            // rebuild
            let items = [];
            if (!element) { // root
                if (!this.historyFiles) {
                    if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document)
                        return resolve(items);
                    const filename = vscode.window.activeTextEditor.document.uri;
                    const settings = this.controller.getSettings(filename);
                    this.loadHistoryFile(filename, settings)
                        .then(() => {
                        items.push(this.getSettingsItem());
                        items.push(...this.loadHistoryGroups(this.historyFiles));
                        resolve(items);
                    });
                }
                else {
                    items.push(this.getSettingsItem());
                    items.push(...this.loadHistoryGroups(this.historyFiles));
                    resolve(items);
                }
            }
            else {
                if (element.kind === 1 /* Group */) {
                    this.historyFiles[element.label].forEach((file) => {
                        items.push(new HistoryItem(this, this.format(file), 2 /* File */, vscode.Uri.file(file.file), element.label, true));
                    });
                    this.tree[element.label].items = items;
                }
                resolve(items);
            }
        });
    }
    loadHistoryFile(fileName, settings) {
        return new Promise((resolve, reject) => {
            let pattern;
            switch (this.contentKind) {
                case 1 /* All */:
                    pattern = '**/*.*';
                    break;
                case 0 /* Current */:
                    pattern = fileName.fsPath;
                    break;
                case 2 /* Search */:
                    pattern = this.searchPattern;
                    break;
            }
            this.controller.findGlobalHistory(pattern, this.contentKind === 0 /* Current */, settings, this.noLimit)
                .then(findFiles => {
                // Current file
                if (this.contentKind === 0 /* Current */) {
                    const historyFile = this.controller.decodeFile(fileName.fsPath, settings);
                    this.currentHistoryFile = historyFile && historyFile.file;
                }
                this.currentHistoryPath = settings.historyPath;
                // History files
                this.historyFiles = {};
                this.format = (file) => {
                    const result = file.date.toLocaleString(settings.dateLocale);
                    if (this.contentKind !== 0 /* Current */)
                        return `${file.name}${file.ext} (${result})`;
                    return result;
                };
                let grp = 'new';
                const files = findFiles;
                if (files && files.length)
                    files.map(file => this.controller.decodeFile(file, settings))
                        .sort((f1, f2) => {
                        if (!f1 || !f2)
                            return 0;
                        if (f1.date > f2.date)
                            return -1;
                        if (f1.date < f2.date)
                            return 1;
                        return f1.name.localeCompare(f2.name);
                    })
                        .forEach((file, index) => {
                        if (file)
                            if (grp !== 'Older') {
                                grp = this.getRelativeDate(file.date);
                                if (!this.historyFiles[grp])
                                    this.historyFiles[grp] = [file];
                                else
                                    this.historyFiles[grp].push(file);
                            }
                            else {
                                this.historyFiles[grp].push(file);
                            }
                        // else
                        // this.historyFiles['failed'].push(files[index]);
                    });
                return resolve(this.historyFiles);
            });
        });
    }
    loadHistoryGroups(historyFiles) {
        const items = [], keys = historyFiles && Object.keys(historyFiles);
        if (keys && keys.length > 0)
            keys.forEach((key) => {
                const item = new HistoryItem(this, key, 1 /* Group */);
                this.tree[key] = { grp: item };
                items.push(item);
            });
        else
            items.push(new HistoryItem(this, 'No history', 0 /* None */));
        return items;
    }
    getRelativeDate(fileDate) {
        const hour = 60 * 60, day = hour * 24, ref = fileDate.getTime() / 1000;
        if (!this.date) {
            const dt = new Date(), now = dt.getTime() / 1000, today = dt.setHours(0, 0, 0, 0) / 1000; // clear current hour
            this.date = {
                now: now,
                today: today,
                week: today - ((dt.getDay() || 7) - 1) * day,
                month: dt.setDate(1) / 1000,
                eLastMonth: dt.setDate(0) / 1000,
                lastMonth: dt.setDate(1) / 1000 // 1st day of previous month
            };
        }
        if (this.date.now - ref < hour)
            return 'In the last hour';
        else if (ref > this.date.today)
            return 'Today';
        else if (ref > this.date.today - day)
            return 'Yesterday';
        else if (ref > this.date.week)
            return 'This week';
        else if (ref > this.date.week - (day * 7))
            return 'Last week';
        else if (ref > this.date.month)
            return 'This month';
        else if (ref > this.date.lastMonth)
            return 'Last month';
        else
            return 'Older';
    }
    // private changeItemSelection(select, item) {
    //     if (select)
    //          item.iconPath = this.selectIconPath
    //      else
    //          delete item.iconPath;
    // }
    redraw() {
        this._onDidChangeTreeData.fire();
    }
    changeActiveFile() {
        if (!vscode.window.activeTextEditor)
            return;
        const filename = vscode.window.activeTextEditor.document.uri;
        const settings = this.controller.getSettings(filename);
        const prop = this.controller.decodeFile(filename.fsPath, settings, false);
        if (!prop || prop.file !== this.currentHistoryFile)
            this.refresh();
    }
    refresh(noLimit = false) {
        this.tree = {};
        delete this.selection;
        this.noLimit = noLimit;
        delete this.currentHistoryFile;
        delete this.currentHistoryPath;
        delete this.historyFiles;
        delete this.date;
        this._onDidChangeTreeData.fire();
    }
    more() {
        if (!this.noLimit) {
            this.refresh(true);
        }
    }
    deleteAll() {
        let message;
        switch (this.contentKind) {
            case 1 /* All */:
                message = `Delete all history - ${this.currentHistoryPath}?`;
                break;
            case 0 /* Current */:
                message = `Delete history for ${this.currentHistoryFile} ?`;
                break;
            case 2 /* Search */:
                message = `Delete history for ${this.searchPattern} ?`;
                break;
        }
        vscode.window.showInformationMessage(message, { modal: true }, { title: 'Yes' }, { title: 'No', isCloseAffordance: true })
            .then(sel => {
            if (sel.title === 'Yes') {
                switch (this.contentKind) {
                    case 1 /* All */:
                        // Delete all history
                        this.controller.deleteAll(this.currentHistoryPath)
                            .then(() => this.refresh())
                            .catch(err => vscode.window.showErrorMessage(`Delete failed: ${err}`));
                        break;
                    case 0 /* Current */:
                        // delete history for current file
                        this.controller.deleteHistory(this.currentHistoryFile)
                            .then(() => this.refresh())
                            .catch(err => vscode.window.showErrorMessage(`Delete failed: ${err}`));
                        break;
                    case 2 /* Search */:
                        // Delete visible history files
                        const keys = Object.keys(this.historyFiles);
                        if (keys && keys.length) {
                            const items = [];
                            keys.forEach(key => items.push(...this.historyFiles[key].map(item => item.file)));
                            this.controller.deleteFiles(items)
                                .then(() => this.refresh())
                                .catch(err => vscode.window.showErrorMessage(`Delete failed: ${err}`));
                        }
                        break;
                }
            }
        }, (err => { return; }));
    }
    show(file) {
        vscode.commands.executeCommand('vscode.open', file);
    }
    showSide(element) {
        if (element.kind === 2 /* File */)
            vscode.commands.executeCommand('vscode.open', element.file, Math.min(vscode.window.activeTextEditor.viewColumn + 1, 3));
    }
    delete(element) {
        if (element.kind === 2 /* File */)
            this.controller.deleteFile(element.file.fsPath)
                .then(() => this.refresh());
        else if (element.kind === 1 /* Group */) {
            this.controller.deleteFiles(this.historyFiles[element.label].map((value) => value.file))
                .then(() => this.refresh());
        }
    }
    compareToCurrent(element) {
        if (element.kind === 2 /* File */) {
            let currRange;
            if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document &&
                vscode.window.activeTextEditor.document.fileName === this.currentHistoryFile) {
                const currPos = vscode.window.activeTextEditor.selection.active;
                currRange = new vscode.Range(currPos, currPos);
            }
            ;
            this.controller.compare(element.file, vscode.Uri.file(this.currentHistoryFile), null, currRange);
        }
    }
    select(element) {
        if (element.kind === 2 /* File */) {
            if (this.selection)
                delete this.selection.iconPath;
            this.selection = element;
            // this.selection.iconPath = this.selectIconPath;
            this.tree[element.grp].grp.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
            this.redraw();
        }
    }
    compare(element) {
        if (element.kind === 2 /* File */) {
            if (this.selection)
                this.controller.compare(element.file, this.selection.file);
            else
                vscode.window.showErrorMessage('Select a history files to compare with');
        }
    }
    restore(element) {
        if (element.kind === 2 /* File */) {
            this.controller.restore(element.file)
                .then(() => this.refresh())
                .catch(err => vscode.window.showErrorMessage(`Restore ${element.file.fsPath} failed. Error: ${err}`));
        }
    }
    forCurrentFile() {
        this.contentKind = 0 /* Current */;
        this.refresh();
    }
    forAll() {
        this.contentKind = 1 /* All */;
        this.refresh();
    }
    forSpecificFile() {
        vscode.window.showInputBox({ prompt: 'Specify what to search:', value: '**/*myFile*.*', valueSelection: [4, 10] })
            .then(value => {
            if (value) {
                this.searchPattern = value;
                this.contentKind = 2 /* Search */;
                this.refresh();
            }
        });
    }
}
exports.default = HistoryTreeProvider;
class HistoryItem extends vscode.TreeItem {
    constructor(provider, label = '', kind, file, grp, showIcon) {
        super(label, kind === 1 /* Group */ ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        this.kind = kind;
        this.file = file;
        this.grp = this.kind !== 0 /* None */ ? grp : undefined;
        switch (this.kind) {
            case 2 /* File */:
                this.contextValue = 'localHistoryItem';
                this.tooltip = file.fsPath; // TODO remove before .history
                this.resourceUri = file;
                if (showIcon)
                    this.iconPath = false;
                break;
            case 1 /* Group */:
                this.contextValue = 'localHistoryGrp';
                break;
            default: // EHistoryTreeItem.None
                this.contextValue = 'localHistoryNone';
                this.tooltip = grp;
        }
        // TODO: if current === file
        if (provider.contentKind === 0 /* Current */) {
            this.command = this.kind === 2 /* File */ ? {
                command: 'treeLocalHistory.compareToCurrentEntry',
                title: 'Compare with current version',
                arguments: [this]
            } : undefined;
        }
        else {
            this.command = this.kind === 2 /* File */ ? {
                command: 'treeLocalHistory.showEntry',
                title: 'Open Local History',
                arguments: [file]
            } : undefined;
        }
    }
}
//# sourceMappingURL=historyTree.provider.js.map