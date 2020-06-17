'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const svgProvider_1 = require("./svgProvider");
const commandManager_1 = require("./commandManager");
const showPreview_1 = require("./commands/showPreview");
const exec = require("sync-exec");
const fs = require("pn/fs");
const path = require("path");
const phantomjs = require("phantomjs-prebuilt");
const svgWebviewManager_1 = require("./features/svgWebviewManager");
const saveFile_1 = require("./commands/saveFile");
const exportProvider_1 = require("./exportProvider");
const exportByCanvas_1 = require("./commands/exportByCanvas");
function activate(context) {
    const previewProvider = new svgProvider_1.SvgDocumentContentProvider(context);
    const webviewManager = new svgWebviewManager_1.SvgWebviewManager(previewProvider);
    context.subscriptions.push(webviewManager);
    const exportProvider = new exportProvider_1.ExportDocumentContentProvider(context);
    const expWebviewManager = new svgWebviewManager_1.SvgExportWebviewManager(exportProvider);
    context.subscriptions.push(expWebviewManager);
    const commandManager = new commandManager_1.CommandManager();
    commandManager.register(new showPreview_1.ShowPreviewCommand(webviewManager));
    commandManager.register(new exportByCanvas_1.ShowExportCommand(expWebviewManager));
    commandManager.register(new saveFile_1.SaveAsCommand());
    commandManager.register(new saveFile_1.SaveAsSizeCommand());
    commandManager.register(new saveFile_1.CopyDataUriCommand());
    context.subscriptions.push(commandManager);
    // Check PhantomJS Binary
    if (!fs.existsSync(phantomjs.path)) {
        exec('npm rebuild', { cwd: context.extensionPath });
        process.env.PHANTOMJS_PLATFORM = process.platform;
        process.env.PHANTOMJS_ARCH = process.arch;
        phantomjs.path = process.platform === 'win32' ?
            path.join(path.dirname(phantomjs.path), 'phantomjs.exe') :
            path.join(path.dirname(phantomjs.path), 'phantom', 'bin', 'phantomjs');
    }
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map