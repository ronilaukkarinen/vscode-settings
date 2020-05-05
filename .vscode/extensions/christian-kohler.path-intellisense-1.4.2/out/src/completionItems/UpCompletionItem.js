"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vscode_1 = require("vscode");
var config_1 = require("../utils/config");
var UpCompletionItem = (function (_super) {
    __extends(UpCompletionItem, _super);
    function UpCompletionItem() {
        var _this = _super.call(this, ".." + (config_1.getConfig().autoSlash ? '/' : '')) || this;
        _this.kind = vscode_1.CompletionItemKind.File;
        return _this;
    }
    return UpCompletionItem;
}(vscode_1.CompletionItem));
exports.UpCompletionItem = UpCompletionItem;
//# sourceMappingURL=UpCompletionItem.js.map