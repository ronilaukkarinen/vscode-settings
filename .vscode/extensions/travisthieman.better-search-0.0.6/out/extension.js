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
const commands = require("./commands");
const providers_1 = require("./providers");
const ripgrep_1 = require("./ripgrep");
function activate(providedContext) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.context = providedContext;
        yield ripgrep_1.ensureRipgrepInstalled();
        const provider = new providers_1.BetterSearchProvider();
        const providerRegistrations = vscode.Disposable.from(vscode.workspace.registerTextDocumentContentProvider(providers_1.BetterSearchProvider.scheme, provider), vscode.languages.registerDocumentLinkProvider({ scheme: providers_1.BetterSearchProvider.scheme }, provider), vscode.languages.registerDocumentHighlightProvider({ scheme: providers_1.BetterSearchProvider.scheme }, provider));
        const searchDisposable = vscode.commands.registerCommand("betterSearch.search", commands.search);
        const searchFullDisposable = vscode.commands.registerCommand("betterSearch.searchFull", commands.searchFull);
        const searchInFolderDisposable = vscode.commands.registerCommand("betterSearch.searchInFolder", commands.searchInFolder);
        const reexecuteSearchDisposable = vscode.commands.registerCommand("betterSearch.reexecute", commands.reexecuteSearch);
        exports.context.subscriptions.push(providerRegistrations, searchDisposable);
        exports.context.subscriptions.push(providerRegistrations, searchFullDisposable);
        exports.context.subscriptions.push(providerRegistrations, searchInFolderDisposable);
        exports.context.subscriptions.push(providerRegistrations, reexecuteSearchDisposable);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map