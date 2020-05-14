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
const querystring = require("querystring");
const vscode_1 = require("vscode");
const search = require("./search");
const LANGUAGE_EXTENSIONS = {
    ts: "typescript",
    js: "javascript",
    py: "python",
    java: "java",
    clj: "clojure",
    go: "go",
    html: "html",
    md: "markdown",
    r: "r",
    sql: "sql",
    c: "c",
    h: "h",
    cpp: "cpp",
    hpp: "cpp",
    lua: "lua",
    rs: "rust",
};
class BetterSearchProvider {
    constructor() {
        this._languages = {};
        this._links = {};
        this._highlights = {};
        this._queries = {};
        this._queryRegexes = {};
        this._readyToDispose = {};
        this._subscriptions = vscode_1.workspace.onDidCloseTextDocument(doc => {
            if (this._readyToDispose[doc.uri.toString()]) {
                delete this._languages[doc.uri.toString()];
                this._links[doc.uri.toString()] = [];
                this._highlights[doc.uri.toString()] = [];
                delete this._queries[doc.uri.toString()];
                for (let key in this._queryRegexes) {
                    delete this._queryRegexes[key];
                }
                this._readyToDispose[doc.uri.toString()] = false;
            }
        });
    }
    dispose() {
        this._subscriptions.dispose();
    }
    static get scheme() {
        return "BetterSearch";
    }
    uniqueFiles(results) {
        const files = {};
        for (let resultUnion of results) {
            if (search.isResultSeparator(resultUnion)) {
                continue;
            }
            const r = resultUnion;
            files[r.filePath] = null;
        }
        return files;
    }
    detectLanguage(results) {
        return __awaiter(this, void 0, void 0, function* () {
            const extensions = {};
            for (let filePath in this.uniqueFiles(results)) {
                let parts = filePath.split(".");
                const extension = parts[parts.length - 1];
                extensions[extension] =
                    extensions[extension] === undefined ? 1 : extensions[extension] + 1;
            }
            // TODO: I couldn't find a way to get VSCode to tell you about the
            // file extensions it knows about targeting its installed languages.
            // Hard-coding some of the major ones here now, can flesh it out later
            // or find a better way to do it if VSCode ships an API.
            let match = undefined;
            let highestCount = 0;
            for (let extension in extensions) {
                const count = extensions[extension];
                if (count > highestCount &&
                    LANGUAGE_EXTENSIONS[extension] !== undefined) {
                    highestCount = count;
                    match = LANGUAGE_EXTENSIONS[extension];
                }
            }
            return match;
        });
    }
    renderSeparator(state) {
        state.line++;
        return "- - - - - - - - - - - - - - - - - - - - - - - - - - -";
    }
    renderDocumentHeader(docUriString, state, results) {
        const files = this.uniqueFiles(results);
        let hits = 0;
        for (let r of results) {
            if (!search.isResultSeparator(r)) {
                const result = r;
                if (!result.isContext) {
                    hits += 1;
                }
            }
        }
        state.line += 4;
        return `Search Query${state.searchOptions.queryRegex ? ' (RegEx):' : ':'} ${this._queries[docUriString]}
Containing Folder: ${state.searchOptions.location}
Total Results: ${hits}
Total Files: ${Object.keys(files).length}\n`;
    }
    renderResultHeader(docUriString, state, result) {
        const range = new vscode_1.Range(state.line + 1, 0, state.line + 1, result.filePath.length + 6);
        const uri = vscode_1.Uri.file(`${state.searchOptions.location}/${result.filePath}`);
        this._links[docUriString].push(new vscode_1.DocumentLink(range, uri));
        state.line += 2;
        state.filePath = result.filePath;
        return `\nFile: ${result.filePath}`;
    }
    renderContext(docUriString, state, result) {
        const range = new vscode_1.Range(state.line, 0, state.line, result.line.toString().length);
        let uri = vscode_1.Uri.file(`${state.searchOptions.location}/${result.filePath}`);
        uri = vscode_1.Uri.parse(`${uri.toString()}#L${result.line}`);
        this._links[docUriString].push(new vscode_1.DocumentLink(range, uri));
        state.line++;
        return `${result.line}   ${result.content}`;
    }
    renderMatch(docUriString, state, result) {
        const linkRange = new vscode_1.Range(state.line, 0, state.line, result.line.toString().length);
        let uri = vscode_1.Uri.file(`${state.searchOptions.location}/${result.filePath}`);
        uri = vscode_1.Uri.parse(`${uri.toString()}#L${result.line}`);
        this._links[docUriString].push(new vscode_1.DocumentLink(linkRange, uri));
        // BUG: Only highlights the first match. Too frustrated with JS regexes to fix right now
        const regexMatch = result.content.match(this._queryRegexes[docUriString]);
        if (regexMatch !== null) {
            const padding = result.line.toString().length + 3;
            const highlightRange = new vscode_1.Range(state.line, padding + regexMatch.index, state.line, padding + regexMatch.index + regexMatch[0].length);
            this._highlights[docUriString].push(new vscode_1.DocumentHighlight(highlightRange, vscode_1.DocumentHighlightKind.Read));
        }
        state.line++;
        return `${result.line}   ${result.content}`;
    }
    formatResults(rawResults) {
        return rawResults.join("\n");
    }
    provideTextDocumentContent(uri, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = querystring.parse(uri.query);
            opts.queryRegex = opts.queryRegex === 'y';
            const uriString = uri.toString();
            this._links[uriString] = [];
            this._highlights[uriString] = [];
            this._queries[uriString] = opts.query;
            this._queryRegexes[uriString] = new RegExp(`(${opts.query})`);
            const results = yield search.runSearch(opts);
            const language = yield this.detectLanguage(results);
            this._languages[uriString] = language;
            let state = { line: 0, filePath: "", searchOptions: opts };
            const documentHeader = this.renderDocumentHeader(uriString, state, results);
            let addSeparatorOnNext = false;
            const rawResults = results.map(function (resultUnion) {
                if (search.isResultSeparator(resultUnion)) {
                    addSeparatorOnNext = true;
                    return null;
                }
                // Compiler is freaking out if I try to do this in an else, not sure why
                let result = resultUnion;
                const thisResult = [];
                if (addSeparatorOnNext && result.filePath === state.filePath) {
                    thisResult.push(this.renderSeparator(state));
                }
                addSeparatorOnNext = false;
                if (state.filePath !== result.filePath) {
                    thisResult.push(this.renderResultHeader(uriString, state, result));
                }
                if (result.isContext) {
                    thisResult.push(this.renderContext(uriString, state, result));
                }
                else {
                    thisResult.push(this.renderMatch(uriString, state, result));
                }
                return thisResult.join("\n");
            }.bind(this));
            return (documentHeader +
                this.formatResults(rawResults.filter(elem => elem !== null)));
        });
    }
    provideDocumentLinks(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            // Hack, not sure where the best place is to run this. Can't run it
            // in the content provider since I don't have an actual TextDocument yet
            const language = this._languages[document.uri.toString()];
            if (language !== undefined) {
                yield vscode_1.languages.setTextDocumentLanguage(document, language);
            }
            this._readyToDispose[document.uri.toString()] = true;
            // End hack
            return this._links[document.uri.toString()];
        });
    }
    provideDocumentHighlights(document, position, token) {
        return this._highlights[document.uri.toString()];
    }
}
exports.BetterSearchProvider = BetterSearchProvider;
//# sourceMappingURL=providers.js.map