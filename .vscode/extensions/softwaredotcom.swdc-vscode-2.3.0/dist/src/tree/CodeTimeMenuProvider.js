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
exports.CodeTimeMenuProvider = exports.connectCodeTimeMenuTreeView = void 0;
const vscode_1 = require("vscode");
const KpmProviderManager_1 = require("./KpmProviderManager");
const Util_1 = require("../Util");
const kpmProviderMgr = KpmProviderManager_1.KpmProviderManager.getInstance();
const codetimeCollapsedStateMap = {};
exports.connectCodeTimeMenuTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidCollapseElement((e) => __awaiter(void 0, void 0, void 0, function* () {
        const item = e.element;
        codetimeCollapsedStateMap[item.label] =
            vscode_1.TreeItemCollapsibleState.Collapsed;
    })), view.onDidExpandElement((e) => __awaiter(void 0, void 0, void 0, function* () {
        const item = e.element;
        codetimeCollapsedStateMap[item.label] =
            vscode_1.TreeItemCollapsibleState.Expanded;
    })), view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        const item = e.selection[0];
        KpmProviderManager_1.handleKpmChangeSelection(view, item);
    })), view.onDidChangeVisibility(e => {
        if (e.visible) {
            //
        }
    }));
};
class CodeTimeMenuProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        this.initializedTree = false;
        //
    }
    revealTree() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.initializedTree) {
                yield this.refresh();
            }
            const item = KpmProviderManager_1.KpmProviderManager.getInstance().getCodeTimeDashboardButton();
            try {
                // select the readme item
                this.view.reveal(item, {
                    focus: true,
                    select: false
                });
            }
            catch (err) {
                Util_1.logIt(`Unable to select tree item: ${err.message}`);
            }
        });
    }
    bindView(kpmTreeView) {
        this.view = kpmTreeView;
    }
    getParent(_p) {
        return void 0; // all playlists are in root
    }
    refresh() {
        this._onDidChangeTreeData.fire(null);
    }
    refreshParent(parent) {
        this._onDidChangeTreeData.fire(parent);
    }
    getTreeItem(p) {
        let treeItem = null;
        if (p.children.length) {
            let collasibleState = codetimeCollapsedStateMap[p.label];
            if (!collasibleState) {
                treeItem = createKpmTreeItem(p, vscode_1.TreeItemCollapsibleState.Collapsed);
            }
            else {
                treeItem = createKpmTreeItem(p, collasibleState);
            }
        }
        else {
            treeItem = createKpmTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
            this.initializedTree = true;
        }
        return treeItem;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            let kpmItems = [];
            if (element) {
                // return the children of this element
                kpmItems = element.children;
            }
            else {
                // return the parent elements
                kpmItems = yield kpmProviderMgr.getOptionsTreeParents();
            }
            return kpmItems;
        });
    }
}
exports.CodeTimeMenuProvider = CodeTimeMenuProvider;
/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
function createKpmTreeItem(p, cstate) {
    return new KpmProviderManager_1.KpmTreeItem(p, cstate);
}
//# sourceMappingURL=CodeTimeMenuProvider.js.map