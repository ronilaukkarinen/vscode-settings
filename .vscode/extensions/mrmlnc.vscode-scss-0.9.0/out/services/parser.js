'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const vscode_uri_1 = require("vscode-uri");
const nodes_1 = require("../types/nodes");
const ast_1 = require("../utils/ast");
const document_1 = require("../utils/document");
const language_service_1 = require("../language-service");
const reDynamicPath = /[#{}\*]/;
const ls = language_service_1.getLanguageService();
/**
 * Returns all Symbols in a single document.
 */
async function parseDocument(document, offset = null) {
    const ast = ls.parseStylesheet(document);
    const documentPath = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    const symbols = Object.assign({ document: documentPath, filepath: documentPath }, (await findDocumentSymbols(document, ast)));
    return {
        node: ast_1.getNodeAtOffset(ast, offset),
        symbols
    };
}
exports.parseDocument = parseDocument;
async function findDocumentSymbols(document, ast) {
    const symbols = ls.findDocumentSymbols(document, ast);
    const links = await findDocumentLinks(document, ast);
    const result = {
        functions: [],
        imports: convertLinksToImports(links),
        mixins: [],
        variables: []
    };
    for (const symbol of symbols) {
        const position = symbol.location.range.start;
        const offset = document.offsetAt(symbol.location.range.start);
        if (symbol.kind === vscode_css_languageservice_1.SymbolKind.Variable) {
            result.variables.push({
                name: symbol.name,
                offset,
                position,
                value: getVariableValue(ast, offset)
            });
        }
        else if (symbol.kind === vscode_css_languageservice_1.SymbolKind.Method) {
            result.mixins.push({
                name: symbol.name,
                offset,
                position,
                parameters: getMethodParameters(ast, offset)
            });
        }
        else if (symbol.kind === vscode_css_languageservice_1.SymbolKind.Function) {
            result.functions.push({
                name: symbol.name,
                offset,
                position,
                parameters: getMethodParameters(ast, offset)
            });
        }
    }
    return result;
}
async function findDocumentLinks(document, ast) {
    // The `findDocumentLinks2` method requires URI.
    const uri = document.uri.startsWith('file:') ? document.uri : vscode_uri_1.URI.file(document.uri).toString();
    const links = await ls.findDocumentLinks2(document, ast, document_1.buildDocumentContext(uri));
    return links.map(link => (Object.assign(Object.assign({}, link), { target: vscode_uri_1.URI.parse(link.target).fsPath })));
}
function getVariableValue(ast, offset) {
    var _a, _b;
    const node = ast_1.getNodeAtOffset(ast, offset);
    if (node === null) {
        return null;
    }
    const parent = ast_1.getParentNodeByType(node, nodes_1.NodeType.VariableDeclaration);
    return ((_b = (_a = parent) === null || _a === void 0 ? void 0 : _a.getValue()) === null || _b === void 0 ? void 0 : _b.getText()) || null;
}
function getMethodParameters(ast, offset) {
    const node = ast_1.getNodeAtOffset(ast, offset);
    if (node === null) {
        return [];
    }
    return node
        .getParameters()
        .getChildren()
        .map(child => {
        const defaultValueNode = child.getDefaultValue();
        const value = defaultValueNode === undefined ? null : defaultValueNode.getText();
        return {
            name: child.getName(),
            offset: child.offset,
            value
        };
    });
}
function convertLinksToImports(links) {
    return links.map(link => ({
        filepath: link.target,
        dynamic: reDynamicPath.test(link.target),
        css: link.target.endsWith('.css')
    }));
}
exports.convertLinksToImports = convertLinksToImports;
//# sourceMappingURL=parser.js.map