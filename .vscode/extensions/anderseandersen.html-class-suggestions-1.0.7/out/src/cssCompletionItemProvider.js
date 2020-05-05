'use strict';
var vscode = require('vscode');
var cssAggregator_1 = require('./cssAggregator');
var CssCompletionItemProvider = (function () {
    function CssCompletionItemProvider() {
        this.refreshCompletionItems();
    }
    CssCompletionItemProvider.prototype.provideCompletionItems = function (document, position, token) {
        var lineUntilPosition = document.getText(new vscode.Range(position.with(undefined, 0), position));
        var textAfterClassAttributeStart = lineUntilPosition.substr(lineUntilPosition.lastIndexOf('class='));
        var attributeClosed = textAfterClassAttributeStart.search(/class=(?:\"[a-zA-Z0-9-\s]*\"|\'[a-zA-Z0-9-\s]*\'|.*[=>])/);
        if (textAfterClassAttributeStart.length > 1 && attributeClosed === -1) {
            return this.completionItems;
        }
        else {
            return Promise.reject("Not inside html class attribute.");
        }
    };
    CssCompletionItemProvider.prototype.refreshCompletionItems = function () {
        this.completionItems = cssAggregator_1.default().then(function (cssClasses) { return cssClasses.map(function (cssClass) { return new vscode.CompletionItem(cssClass); }); });
    };
    return CssCompletionItemProvider;
}());
exports.CssCompletionItemProvider = CssCompletionItemProvider;
;
//# sourceMappingURL=cssCompletionItemProvider.js.map