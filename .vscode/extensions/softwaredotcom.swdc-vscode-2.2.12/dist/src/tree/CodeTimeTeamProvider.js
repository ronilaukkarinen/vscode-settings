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
exports.CodeTimeTeamProvider = exports.connectCodeTimeTeamTreeView = void 0;
const vscode_1 = require("vscode");
const KpmProviderManager_1 = require("./KpmProviderManager");
const kpmProviderMgr = KpmProviderManager_1.KpmProviderManager.getInstance();
const teamCollapsedStateMap = {};
exports.connectCodeTimeTeamTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidCollapseElement((e) => __awaiter(void 0, void 0, void 0, function* () {
        const item = e.element;
        teamCollapsedStateMap[item.label] =
            vscode_1.TreeItemCollapsibleState.Collapsed;
    })), view.onDidExpandElement((e) => __awaiter(void 0, void 0, void 0, function* () {
        const item = e.element;
        teamCollapsedStateMap[item.label] =
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
class CodeTimeTeamProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        //
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
            let collasibleState = teamCollapsedStateMap[p.label];
            if (!collasibleState) {
                treeItem = createKpmTreeItem(p, vscode_1.TreeItemCollapsibleState.Collapsed);
            }
            else {
                treeItem = createKpmTreeItem(p, collasibleState);
            }
        }
        else {
            treeItem = createKpmTreeItem(p, vscode_1.TreeItemCollapsibleState.None);
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
                kpmItems = yield kpmProviderMgr.getTeamTreeParents();
            }
            return kpmItems;
        });
    }
}
exports.CodeTimeTeamProvider = CodeTimeTeamProvider;
/**
 * Create the playlist tree item (root or leaf)
 * @param p
 * @param cstate
 */
function createKpmTreeItem(p, cstate) {
    return new KpmProviderManager_1.KpmTreeItem(p, cstate);
}
//# sourceMappingURL=CodeTimeTeamProvider.js.map