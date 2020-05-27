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
const vscode = require("vscode");
const editor_1 = require("./editor");
const providers_1 = require("./providers");
const url = require("url");
function sluggify(inputString) {
    return inputString.replace(/[^a-z0-9]/gi, "_");
}
function buildUri(searchOptions) {
    const { query, queryRegex, location, context, sortFiles } = searchOptions;
    // Need a nonce so we can refresh our results without hitting cache
    const date = Date.now();
    const queryRegexStr = queryRegex ? 'y' : 'n';
    return vscode.Uri.parse(`${providers_1.BetterSearchProvider.scheme}:Σ: ${sluggify(query)}?query=${query}&queryRegex=${queryRegexStr}&location=${location}&context=${context}&sortFiles=${sortFiles}&date=${date}`);
}
function optionsFromUri(docUriString) {
    const parsed = url.parse(docUriString, true);
    return parsed.query;
}
function promptForSearchTerm() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        const defaultSearch = editor ? editor_1.getWordAtPoint(editor) : undefined;
        return yield vscode.window.showInputBox({
            value: defaultSearch,
            valueSelection: [0, (defaultSearch || "").length],
            password: false,
            prompt: "Search",
            placeHolder: "Search term"
        });
    });
}
function reexecuteSearch() {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (editor !== undefined) {
            const docUri = editor.document.uri;
            if (docUri.scheme !== providers_1.BetterSearchProvider.scheme) {
                return;
            }
            // This is deprecated but I couldn't find a suitable replacement for it.
            // https://github.com/Microsoft/vscode/issues/48945
            // await editor.hide();
            yield vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            // Hack and a half, sorry
            return yield search(optionsFromUri(`nonsense://whatever?${docUri.query}`));
        }
    });
}
exports.reexecuteSearch = reexecuteSearch;
function searchInFolder(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context !== undefined && context["fsPath"] !== undefined) {
            return search({ location: context["fsPath"] });
        }
        return search({});
    });
}
exports.searchInFolder = searchInFolder;
function searchFull() {
    return __awaiter(this, void 0, void 0, function* () {
        const query = yield promptForSearchTerm();
        const isRegex = yield vscode.window.showInputBox({
            value: "n",
            prompt: "Treat this query as a regular expression? (y/n)",
        });
        const location = yield vscode.window.showInputBox({
            value: vscode.workspace.rootPath,
            valueSelection: [0, (vscode.workspace.rootPath || "").length],
            password: false,
            prompt: "Search Location"
        });
        const context = yield vscode.window.showInputBox({
            password: false,
            prompt: "Lines of Context",
            placeHolder: "Leave blank for default"
        });
        let opts = { query };
        opts.queryRegex = isRegex && isRegex.toLowerCase() === 'y' ? true : false;
        if (location) {
            opts.location = location;
        }
        if (context) {
            opts.context = parseInt(context);
        }
        return yield search(opts);
    });
}
exports.searchFull = searchFull;
function search(partialOpts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = partialOpts.query;
        if (query === undefined) {
            query = yield promptForSearchTerm();
        }
        if (query === undefined || query === '') {
            vscode.window.showErrorMessage('Better Search: Did not receive valid query, cannot perform search');
            return;
        }
        let opts = Object.assign({
            query: query,
            queryRegex: false,
            location: vscode.workspace.rootPath || "/",
            context: vscode.workspace.getConfiguration("betterSearch").context,
            sortFiles: vscode.workspace
                .getConfiguration("betterSearch")
                .sortFiles.toString()
        }, partialOpts);
        const uri = buildUri(opts);
        const doc = yield vscode.workspace.openTextDocument(uri);
        yield vscode.window.showTextDocument(doc, {
            preview: false,
            viewColumn: 1
        });
    });
}
exports.search = search;
//# sourceMappingURL=commands.js.map