"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const actions_json_1 = __importDefault(require("@johnbillion/wp-hooks/hooks/actions.json"));
const filters_json_1 = __importDefault(require("@johnbillion/wp-hooks/hooks/filters.json"));
function get_hook_completion(hook) {
    var completion = new vscode.CompletionItem(hook.name, vscode.CompletionItemKind.Value);
    completion.detail = hook.doc.description;
    var description = hook.doc.long_description;
    description += "\n\n";
    const params = hook.doc.tags.filter(tag => 'param' === tag.name);
    params.forEach(function (tag) {
        if (!tag.types) {
            return;
        }
        const types = tag.types.join('|');
        description += "\n\n";
        description += '_@param_' + " `" + types + " " + tag.variable + "`  \n";
        description += tag.content;
    });
    const everything_else = hook.doc.tags.filter(tag => 'param' !== tag.name);
    everything_else.forEach(function (tag) {
        description += "\n\n";
        description += '_@' + tag.name + '_' + " " + (tag.content || "") + " " + (tag.description || "");
    });
    completion.documentation = new vscode.MarkdownString(description);
    return completion;
}
function isInFilter(line) {
    return line.match(/(add|remove|has|doing)_filter\([\s]*('|")[^"|']*$/);
}
function isInAction(line) {
    return line.match(/(add|remove|has|doing|did)_action\([\s]*('|")[^"|']*$/);
}
function isInFunctionDeclaration(line) {
    return line.match(/add_(filter|action)\([\s]*['|"]([\S]+?)['|"],[\s]*[\w]*?$/);
}
function getHook(name) {
    var hooks = filters_json_1.default.filter(filter => filter.name === name);
    if (hooks.length == 0) {
        hooks = actions_json_1.default.filter(action => action.name === name);
    }
    if (hooks.length) {
        return hooks[0];
    }
}
function activate(context) {
    const hooksProvider = vscode.languages.registerCompletionItemProvider('php', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads a certain value and if so then complete
            let linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (isInAction(linePrefix)) {
                return actions_json_1.default.map(get_hook_completion);
            }
            if (isInFilter(linePrefix)) {
                return filters_json_1.default.map(get_hook_completion);
            }
            return undefined;
        }
    }, "'", '"');
    const callbackProvider = vscode.languages.registerCompletionItemProvider('php', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads a certain value and if so then complete
            let linePrefix = document.lineAt(position).text.substr(0, position.character);
            let declaration = isInFunctionDeclaration(linePrefix);
            if (declaration) {
                const hook = getHook(declaration[2]);
                if (!hook) {
                    return undefined;
                }
                let completions = [];
                const params = hook.doc.tags.filter(tag => 'param' === tag.name);
                const snippetArgsString = params.map(param => `\\${param.variable}`).join(', ');
                const docArgsString = params.map(param => param.variable).join(', ');
                const snippetClosure = 'function(' + (snippetArgsString ? ' ' + snippetArgsString + ' ' : '') + ') {\n\t${1}\n}' + (params.length > 1 ? ', 10, ' + params.length + ' ' : ' ');
                const documentationClosure = 'function(' + (docArgsString ? ' ' + docArgsString + ' ' : '') + ') {\n}' + (params.length > 1 ? ', 10, ' + params.length + ' ' : ' ');
                var completionClosure = new vscode.CompletionItem('Closure callback', vscode.CompletionItemKind.Value);
                completionClosure.insertText = new vscode.SnippetString(snippetClosure);
                completionClosure.documentation = documentationClosure;
                completions.push(completionClosure);
                if ('filter' === hook.type) {
                    const snippets = {
                        __return_true: 'Return true',
                        __return_false: 'Return false',
                        __return_zero: 'Return zero',
                        __return_null: 'Return null',
                        __return_empty_array: 'Return empty array',
                        __return_empty_string: 'Return empty string'
                    };
                    for (let [snippet, documentation] of Object.entries(snippets)) {
                        snippet = `'${snippet}' `;
                        var completionItem = new vscode.CompletionItem(documentation, vscode.CompletionItemKind.Value);
                        completionItem.insertText = new vscode.SnippetString(snippet);
                        completionItem.documentation = snippet;
                        completions.push(completionItem);
                    }
                }
                return completions;
            }
            return undefined;
        }
    }, ',', ' ');
    context.subscriptions.push(hooksProvider, callbackProvider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map