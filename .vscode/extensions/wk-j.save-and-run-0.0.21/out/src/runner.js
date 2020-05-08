"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const executor_1 = require("./executor");
class RunOnSaveExtension {
    constructor(context) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel("Save and Run");
    }
    runInTerminal(command, name) {
        let editor = vscode.window.activeTextEditor;
        let column = editor.viewColumn;
        executor_1.Executor.runInTerminal(command, name);
    }
    runAllInTerminal(commands, terminalName) {
        commands.forEach(command => {
            this.runInTerminal(command, terminalName);
        });
    }
    get isEnabled() {
        return this.context.globalState.get("isEnabled", true);
    }
    set isEnabled(value) {
        this.context.globalState.update("isEnabled", value);
        this.showOutputMessage();
    }
    loadConfig() {
        let config = vscode.workspace.getConfiguration("saveAndRun");
        return config;
    }
    showOutputMessage(message) {
        message = message || `Save and Run ${this.isEnabled ? "enabled" : "disabled"}.`;
        this.outputChannel.appendLine(message);
    }
    showStatusMessage(message) {
        this.showOutputMessage(message);
        return vscode.window.setStatusBarMessage(message);
    }
    getWorkspaceFolder() {
        const editor = vscode.window.activeTextEditor;
        const resource = editor.document.uri;
        const rootFolder = vscode_1.workspace.getWorkspaceFolder(resource);
        return rootFolder;
    }
    findActiveCommands(config, document, onlyShortcut) {
        let match = (pattern) => pattern && pattern.length > 0 && new RegExp(pattern).test(document.fileName);
        let commandConfigs = config.commands
            .filter(cfg => {
            let matchPattern = cfg.match || "";
            let negatePattern = cfg.notMatch || "";
            // if no match pattern was provided, or if match pattern succeeds
            let isMatch = matchPattern.length === 0 || match(matchPattern);
            // negation has to be explicitly provided
            let isNegate = negatePattern.length > 0 && match(negatePattern);
            // negation wins over match
            return !isNegate && isMatch;
        });
        if (commandConfigs.length === 0) {
            return;
        }
        this.showStatusMessage("Running on save commands...");
        // build our commands by replacing parameters with values
        let commands = [];
        for (let cfg of commandConfigs) {
            let cmdStr = cfg.cmd;
            let extName = path.extname(document.fileName);
            const rootFolder = this.getWorkspaceFolder();
            const root = rootFolder.uri.path;
            let relativeFile = "." + document.fileName.replace(root, "");
            cmdStr = cmdStr.replace(/\${relativeFile}/g, relativeFile);
            cmdStr = cmdStr.replace(/\${workspaceFolder}/g, root);
            cmdStr = cmdStr.replace(/\${file}/g, `${document.fileName}`);
            cmdStr = cmdStr.replace(/\${workspaceRoot}/g, `${vscode.workspace.rootPath}`);
            cmdStr = cmdStr.replace(/\${fileBasename}/g, `${path.basename(document.fileName)}`);
            cmdStr = cmdStr.replace(/\${fileDirname}/g, `${path.dirname(document.fileName)}`);
            cmdStr = cmdStr.replace(/\${fileExtname}/g, `${extName}`);
            cmdStr = cmdStr.replace(/\${fileBasenameNoExt}/g, `${path.basename(document.fileName, extName)}`);
            cmdStr = cmdStr.replace(/\${cwd}/g, `${process.cwd()}`);
            // replace environment variables ${env.Name}
            cmdStr = cmdStr.replace(/\${env\.([^}]+)}/g, (sub, envName) => {
                return process.env[envName];
            });
            commands.push({
                cmd: cmdStr,
                silent: cfg.silent,
                isAsync: !!cfg.isAsync,
                useShortcut: cfg.useShortcut
            });
        }
        if (onlyShortcut) {
            return commands.filter(x => x.useShortcut === true);
        }
        else {
            return commands.filter(x => x.useShortcut !== true);
        }
    }
    runCommands(document, onlyShortcut) {
        let config = this.loadConfig();
        if (config.autoClearConsole) {
            this.outputChannel.clear();
        }
        if (!this.isEnabled || config.commands.length === 0) {
            this.showStatusMessage("");
            this.showOutputMessage();
            return;
        }
        let commands = this.findActiveCommands(config, document, onlyShortcut);
        let terminalName = this.getWorkspaceFolder().name;
        this.runAllInTerminal(commands, `Run ${terminalName}`);
        this.showStatusMessage("");
    }
}
exports.RunOnSaveExtension = RunOnSaveExtension;
//# sourceMappingURL=runner.js.map