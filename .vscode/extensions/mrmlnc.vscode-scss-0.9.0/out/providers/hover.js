'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const nodes_1 = require("../types/nodes");
const parser_1 = require("../services/parser");
const symbols_1 = require("../utils/symbols");
const document_1 = require("../utils/document");
const string_1 = require("../utils/string");
/**
 * Returns a colored (marked) line for Variable.
 */
function makeVariableAsMarkedString(symbol, fsPath, suffix) {
    const value = string_1.getLimitedString(symbol.value);
    if (fsPath !== 'current') {
        suffix = `\n@import "${fsPath}"` + suffix;
    }
    return {
        language: 'scss',
        value: `${symbol.name}: ${value};` + suffix
    };
}
/**
 * Returns a colored (marked) line for Mixin.
 */
function makeMixinAsMarkedString(symbol, fsPath, suffix) {
    const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
    if (fsPath !== 'current') {
        suffix = `\n@import "${fsPath}"` + suffix;
    }
    return {
        language: 'scss',
        value: '@mixin ' + symbol.name + `(${args}) {\u2026}` + suffix
    };
}
/**
 * Returns a colored (marked) line for Function.
 */
function makeFunctionAsMarkedString(symbol, fsPath, suffix) {
    const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
    if (fsPath !== 'current') {
        suffix = `\n@import "${fsPath}"` + suffix;
    }
    return {
        language: 'scss',
        value: '@function ' + symbol.name + `(${args}) {\u2026}` + suffix
    };
}
/**
 * Returns the Symbol, if it present in the documents.
 */
function getSymbol(symbolList, identifier, currentPath) {
    for (let i = 0; i < symbolList.length; i++) {
        const symbols = symbolList[i];
        const symbolsByType = symbols[identifier.type];
        const fsPath = document_1.getDocumentPath(currentPath, symbols.filepath || symbols.document);
        for (let j = 0; j < symbolsByType.length; j++) {
            if (symbolsByType[j].name === identifier.name) {
                return {
                    document: symbols.document,
                    path: fsPath,
                    info: symbolsByType[j]
                };
            }
        }
    }
    return null;
}
async function doHover(document, offset, storage) {
    const documentPath = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    if (!documentPath) {
        return null;
    }
    const resource = await parser_1.parseDocument(document, offset);
    const hoverNode = resource.node;
    if (!hoverNode || !hoverNode.type) {
        return null;
    }
    let identifier = null;
    if (hoverNode.type === nodes_1.NodeType.VariableName) {
        const parent = hoverNode.getParent();
        if (parent.type !== nodes_1.NodeType.VariableDeclaration && parent.type !== nodes_1.NodeType.FunctionParameter) {
            identifier = {
                name: hoverNode.getName(),
                type: 'variables'
            };
        }
    }
    else if (hoverNode.type === nodes_1.NodeType.Identifier) {
        let node;
        let type;
        const parent = hoverNode.getParent();
        if (parent.type === nodes_1.NodeType.Function) {
            node = parent;
            type = 'functions';
        }
        else if (parent.type === nodes_1.NodeType.MixinReference) {
            node = parent;
            type = 'mixins';
        }
        if (node) {
            identifier = {
                name: node.getName(),
                type
            };
        }
    }
    else if (hoverNode.type === nodes_1.NodeType.MixinReference) {
        identifier = {
            name: hoverNode.getName(),
            type: 'mixins'
        };
    }
    if (!identifier) {
        return null;
    }
    storage.set(documentPath, resource.symbols);
    const symbolsList = symbols_1.getSymbolsCollection(storage);
    const documentImports = resource.symbols.imports.map(x => x.filepath);
    const symbol = getSymbol(symbolsList, identifier, documentPath);
    // Content for Hover popup
    let contents = '';
    if (symbol) {
        // Add 'implicitly' suffix if the file imported implicitly
        let contentSuffix = '';
        if (symbol.path !== 'current' && documentImports.indexOf(symbol.document) === -1) {
            contentSuffix = ' (implicitly)';
        }
        if (identifier.type === 'variables') {
            contents = makeVariableAsMarkedString(symbol.info, symbol.path, contentSuffix);
        }
        else if (identifier.type === 'mixins') {
            contents = makeMixinAsMarkedString(symbol.info, symbol.path, contentSuffix);
        }
        else if (identifier.type === 'functions') {
            contents = makeFunctionAsMarkedString(symbol.info, symbol.path, contentSuffix);
        }
    }
    return {
        contents
    };
}
exports.doHover = doHover;
//# sourceMappingURL=hover.js.map