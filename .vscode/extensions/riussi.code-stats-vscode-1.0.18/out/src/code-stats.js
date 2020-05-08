"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xp_counter_1 = require("./xp-counter");
function activate(context) {
    let controller = new xp_counter_1.XpCounter(context);
    context.subscriptions.push(controller);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=code-stats.js.map