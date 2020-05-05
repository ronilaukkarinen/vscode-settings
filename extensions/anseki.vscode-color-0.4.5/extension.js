'use strict';
const
vscode = require('vscode'),
packageInfo = require('./package'),
main = require(packageInfo.extensionMain);
// [postinstall]
try {
let fs = require('fs'), pathUtil = require('path');
fs.renameSync(
pathUtil.join(__dirname, 'lib/app.asar_'),
pathUtil.join(__dirname, 'lib/app.asar'));
fs.writeFileSync(__filename,
fs.readFileSync(__filename, {encoding: 'utf8'})
.replace(/\/\/[^\n]*?\[postinstall\][\s\S]*?\/\/[^\n]*?\[\/postinstall\][^\n]*\n\s*/, ''));
} catch (error) {  }
// [/postinstall]
exports.activate = context => {
packageInfo.contributes.commands.forEach(commandReg => {
context.subscriptions.push(
vscode.commands.registerCommand(
commandReg.command, main[commandReg.command.split('.').slice(-1)]));
});
};
exports.deactivate = () => { if (main.deactivate) { main.deactivate(); } };