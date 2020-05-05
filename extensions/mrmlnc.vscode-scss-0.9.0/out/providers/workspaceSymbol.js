'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const symbols_1 = require("../utils/symbols");
async function searchWorkspaceSymbol(query, storage, root) {
    const workspaceSymbols = [];
    symbols_1.getSymbolsCollection(storage).forEach(symbols => {
        const documentUri = vscode_uri_1.URI.file(symbols.filepath);
        if (!documentUri.fsPath.includes(root)) {
            return;
        }
        ['variables', 'mixins', 'functions'].forEach(type => {
            let kind = vscode_languageserver_1.SymbolKind.Variable;
            if (type === 'mixins') {
                kind = vscode_languageserver_1.SymbolKind.Function;
            }
            else if (type === 'functions') {
                kind = vscode_languageserver_1.SymbolKind.Interface;
            }
            symbols[type].forEach(symbol => {
                if (!symbol.name.includes(query)) {
                    return;
                }
                workspaceSymbols.push({
                    name: symbol.name,
                    kind,
                    location: {
                        uri: documentUri.toString(),
                        range: {
                            start: symbol.position,
                            end: {
                                line: symbol.position.line,
                                character: symbol.position.character + symbol.name.length
                            }
                        }
                    }
                });
            });
        });
    });
    return workspaceSymbols;
}
exports.searchWorkspaceSymbol = searchWorkspaceSymbol;
//# sourceMappingURL=workspaceSymbol.js.map