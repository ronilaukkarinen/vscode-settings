'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const parser_1 = require("../services/parser");
const symbols_1 = require("../utils/symbols");
const document_1 = require("../utils/document");
const string_1 = require("../utils/string");
const color_1 = require("../utils/color");
// RegExp's
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /['"](?:[^'"\\]|\\.)*['"]/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^(\/(\/|\*)|\*)/;
const reQuotes = /['"]/;
/**
 * Returns `true` if the path is not present in the document.
 */
function isImplicitly(symbolsDocument, documentPath, documentImports) {
    return symbolsDocument !== documentPath && documentImports.indexOf(symbolsDocument) === -1;
}
/**
 * Return Mixin as string.
 */
function makeMixinDocumentation(symbol) {
    const args = symbol.parameters.map(item => `${item.name}: ${item.value}`).join(', ');
    return `${symbol.name}(${args}) {\u2026}`;
}
/**
 * Check context for Variables suggestions.
 */
function checkVariableContext(word, isInterpolation, isPropertyValue, isEmptyValue, isQuotes) {
    if (isPropertyValue && !isEmptyValue && !isQuotes) {
        return word.includes('$');
    }
    else if (isQuotes) {
        return isInterpolation;
    }
    return word[0] === '$' || isInterpolation || isEmptyValue;
}
/**
 * Check context for Mixins suggestions.
 */
function checkMixinContext(textBeforeWord, isPropertyValue) {
    return !isPropertyValue && reMixinReference.test(textBeforeWord);
}
/**
 * Check context for Function suggestions.
 */
function checkFunctionContext(textBeforeWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes, settings) {
    if (isPropertyValue && !isEmptyValue && !isQuotes) {
        const lastChar = textBeforeWord.substr(-2, 1);
        return settings.suggestFunctionsInStringContextAfterSymbols.indexOf(lastChar) !== -1;
    }
    else if (isQuotes) {
        return isInterpolation;
    }
    return false;
}
function isCommentContext(text) {
    return reComment.test(text.trim());
}
function isInterpolationContext(text) {
    return text.includes('#{');
}
function createCompletionContext(document, offset, settings) {
    const currentWord = string_1.getCurrentWord(document.getText(), offset);
    const textBeforeWord = string_1.getTextBeforePosition(document.getText(), offset);
    // Is "#{INTERPOLATION}"
    const isInterpolation = isInterpolationContext(currentWord);
    // Information about current position
    const isPropertyValue = rePropertyValue.test(textBeforeWord);
    const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
    const isQuotes = reQuotes.test(textBeforeWord.replace(reQuotedValueInString, ''));
    return {
        comment: isCommentContext(textBeforeWord),
        variable: checkVariableContext(currentWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes),
        function: checkFunctionContext(textBeforeWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes, settings),
        mixin: checkMixinContext(textBeforeWord, isPropertyValue)
    };
}
function createVariableCompletionItems(symbols, filepath, imports, settings) {
    const completions = [];
    symbols.forEach(symbol => {
        const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
        const fsPath = document_1.getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);
        symbol.variables.forEach(variable => {
            const color = color_1.getVariableColor(variable.value);
            const completionKind = color ? vscode_languageserver_1.CompletionItemKind.Color : vscode_languageserver_1.CompletionItemKind.Variable;
            // Add 'implicitly' prefix for Path if the file imported implicitly
            let detailPath = fsPath;
            if (isImplicitlyImport && settings.implicitlyLabel) {
                detailPath = settings.implicitlyLabel + ' ' + detailPath;
            }
            // Add 'argument from MIXIN_NAME' suffix if Variable is Mixin argument
            let detailText = detailPath;
            if (variable.mixin) {
                detailText = `argument from ${variable.mixin}, ${detailText}`;
            }
            completions.push({
                label: variable.name,
                kind: completionKind,
                detail: detailText,
                documentation: string_1.getLimitedString(color ? color.toString() : variable.value)
            });
        });
    });
    return completions;
}
function createMixinCompletionItems(symbols, filepath, imports, settings) {
    const completions = [];
    symbols.forEach(symbol => {
        const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
        const fsPath = document_1.getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);
        symbol.mixins.forEach(mixin => {
            // Add 'implicitly' prefix for Path if the file imported implicitly
            let detailPath = fsPath;
            if (isImplicitlyImport && settings.implicitlyLabel) {
                detailPath = settings.implicitlyLabel + ' ' + detailPath;
            }
            completions.push({
                label: mixin.name,
                kind: vscode_languageserver_1.CompletionItemKind.Function,
                detail: detailPath,
                documentation: makeMixinDocumentation(mixin),
                insertText: mixin.name
            });
        });
    });
    return completions;
}
function createFunctionCompletionItems(symbols, filepath, imports, settings) {
    const completions = [];
    symbols.forEach(symbol => {
        const isImplicitlyImport = isImplicitly(symbol.document, filepath, imports);
        const fsPath = document_1.getDocumentPath(filepath, isImplicitlyImport ? symbol.filepath : symbol.document);
        symbol.functions.forEach(func => {
            // Add 'implicitly' prefix for Path if the file imported implicitly
            let detailPath = fsPath;
            if (isImplicitlyImport && settings.implicitlyLabel) {
                detailPath = settings.implicitlyLabel + ' ' + detailPath;
            }
            completions.push({
                label: func.name,
                kind: vscode_languageserver_1.CompletionItemKind.Interface,
                detail: detailPath,
                documentation: makeMixinDocumentation(func),
                insertText: func.name
            });
        });
    });
    return completions;
}
async function doCompletion(document, offset, settings, storage) {
    const completions = vscode_languageserver_1.CompletionList.create([], false);
    const documentPath = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    if (!documentPath) {
        return null;
    }
    const resource = await parser_1.parseDocument(document, offset);
    storage.set(documentPath, resource.symbols);
    const symbolsList = symbols_1.getSymbolsRelatedToDocument(storage, documentPath);
    const documentImports = resource.symbols.imports.map(x => x.filepath);
    const context = createCompletionContext(document, offset, settings);
    // Drop suggestions inside `//` and `/* */` comments
    if (context.comment) {
        return completions;
    }
    if (settings.suggestVariables && context.variable) {
        const variables = createVariableCompletionItems(symbolsList, documentPath, documentImports, settings);
        completions.items = completions.items.concat(variables);
    }
    if (settings.suggestMixins && context.mixin) {
        const mixins = createMixinCompletionItems(symbolsList, documentPath, documentImports, settings);
        completions.items = completions.items.concat(mixins);
    }
    if (settings.suggestFunctions && context.function) {
        const functions = createFunctionCompletionItems(symbolsList, documentPath, documentImports, settings);
        completions.items = completions.items.concat(functions);
    }
    return completions;
}
exports.doCompletion = doCompletion;
//# sourceMappingURL=completion.js.map