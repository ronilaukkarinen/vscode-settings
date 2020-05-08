"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const vscode_1 = require("vscode");
const run_in_terminal_1 = require("run-in-terminal");
const tree_kill_1 = require("tree-kill");
const jsonc_parser_1 = require("jsonc-parser");
const async_1 = require("./async");
class ProcessItem {
    constructor(label, description, pid) {
        this.label = label;
        this.description = description;
        this.pid = pid;
    }
}
;
class NpmCodeActionProvider {
    provideCodeActions(document, _range, context, _token) {
        function addFixNpmInstallModule(cmds, moduleName) {
            cmds.push({
                title: `run: npm install '${moduleName}'`,
                command: 'npm-script.installInOutputWindow',
                arguments: [path.dirname(document.fileName), moduleName]
            });
        }
        function addFixNpmInstall(cmds) {
            cmds.push({
                title: `run: npm install`,
                command: 'npm-script.installInOutputWindow',
                arguments: [path.dirname(document.fileName)]
            });
        }
        function addFixValidate(cmds) {
            cmds.push({
                title: `validate installed modules`,
                command: 'npm-script.validate',
                arguments: [path.dirname(document.fileName)]
            });
        }
        function addFixNpmUninstallModule(cmds, moduleName) {
            cmds.push({
                title: `run: npm uninstall '${moduleName}'`,
                command: 'npm-script.uninstallInOutputWindow',
                arguments: [path.dirname(document.fileName), moduleName]
            });
        }
        function addFixNpmInstallModuleSave(cmds, moduleName) {
            cmds.push({
                title: `run: npm install '${moduleName}' --save`,
                command: 'npm-script.installInOutputWindow',
                arguments: [path.dirname(document.fileName), moduleName, '--save']
            });
        }
        function addFixNpmInstallModuleSaveDev(cmds, moduleName) {
            cmds.push({
                title: `run: npm install '${moduleName}' --save-dev`,
                command: 'npm-script.installInOutputWindow',
                arguments: [path.dirname(document.fileName), moduleName, '--save-dev']
            });
        }
        const cmds = [];
        context.diagnostics.forEach(diag => {
            if (diag.source === 'npm') {
                let result = /^Module '(\S*)' is not installed/.exec(diag.message);
                if (result) {
                    const moduleName = result[1];
                    addFixNpmInstallModule(cmds, moduleName);
                    addFixNpmInstall(cmds);
                    addFixValidate(cmds);
                    return;
                }
                result = /^Module '(\S*)' the installed version/.exec(diag.message);
                if (result) {
                    const moduleName = result[1];
                    addFixNpmInstallModule(cmds, moduleName);
                    addFixValidate(cmds);
                    return;
                }
                result = /^Module '(\S*)' is extraneous/.exec(diag.message);
                if (result) {
                    const moduleName = result[1];
                    addFixNpmUninstallModule(cmds, moduleName);
                    addFixNpmInstallModuleSave(cmds, moduleName);
                    addFixNpmInstallModuleSaveDev(cmds, moduleName);
                    addFixValidate(cmds);
                    return;
                }
            }
        });
        return cmds;
    }
}
const runningProcesses = new Map();
let outputChannel;
let terminal = null;
let lastScript = null;
let diagnosticCollection = null;
let delayer = null;
function activate(context) {
    registerCommands(context);
    diagnosticCollection = vscode_1.languages.createDiagnosticCollection('npm-script-runner');
    context.subscriptions.push(diagnosticCollection);
    vscode_1.workspace.onDidChangeConfiguration(_event => loadConfiguration(context), null, context.subscriptions);
    loadConfiguration(context);
    outputChannel = vscode_1.window.createOutputChannel('npm');
    context.subscriptions.push(outputChannel);
    vscode_1.window.onDidCloseTerminal((closedTerminal) => {
        if (terminal === closedTerminal) {
            terminal = null;
        }
    });
    context.subscriptions.push(vscode_1.languages.registerCodeActionsProvider('json', new NpmCodeActionProvider()));
}
exports.activate = activate;
function deactivate() {
    if (terminal) {
        terminal.dispose();
    }
}
exports.deactivate = deactivate;
function clearDiagnosticCollection() {
    if (diagnosticCollection) {
        diagnosticCollection.clear();
    }
}
function isValidationEnabled(document) {
    const section = vscode_1.workspace.getConfiguration('npm', document.uri);
    if (section) {
        return section.get('validate.enable', true);
    }
    return false;
}
function loadConfiguration(context) {
    clearDiagnosticCollection();
    vscode_1.workspace.onDidSaveTextDocument(document => {
        if (isValidationEnabled(document)) {
            validateDocument(document);
        }
    }, null, context.subscriptions);
    vscode_1.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document && isValidationEnabled(editor.document)) {
            validateDocument(editor.document);
        }
    }, null, context.subscriptions);
    // remove markers on close
    vscode_1.workspace.onDidCloseTextDocument(_document => {
        clearDiagnosticCollection();
    }, null, context.subscriptions);
    // workaround for onDidOpenTextDocument
    // workspace.onDidOpenTextDocument(document => {
    // 	console.log("onDidOpenTextDocument ", document.fileName);
    // 	validateDocument(document);
    // }, null, context.subscriptions);
    validateAllDocuments();
}
function validateDocument(document) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log('validateDocument ', document.fileName);
        // do not validate yarn managed node_modules
        if (!isValidationEnabled(document) || (yield isYarnManaged(document))) {
            clearDiagnosticCollection();
            return;
        }
        if (!isPackageJson(document)) {
            return;
        }
        // Iterate over the defined package directories to check
        // if the currently opened `package.json` is one that is included in the `includedDirectories` setting.
        const found = getAllIncludedDirectories().find(each => path.dirname(document.fileName) === each);
        if (!found) {
            return;
        }
        if (!delayer) {
            delayer = new async_1.ThrottledDelayer(200);
        }
        delayer.trigger(() => doValidate(document));
    });
}
function isPackageJson(document) {
    return document && path.basename(document.fileName) === 'package.json';
}
function isYarnManaged(document) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, _reject) => {
            const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(document.uri);
            if (workspaceFolder) {
                const root = workspaceFolder.uri.fsPath;
                if (!root) {
                    return resolve(false);
                }
                fs.stat(path.join(root, 'yarn.lock'), (err, _stat) => {
                    return resolve(err === null);
                });
            }
        });
    });
}
function validateAllDocuments() {
    // TODO: why doesn't this not work?
    //workspace.textDocuments.forEach(each => validateDocument(each));
    vscode_1.window.visibleTextEditors.forEach(each => {
        if (each.document) {
            validateDocument(each.document);
        }
    });
}
function registerCommands(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('npm-script.install', runNpmInstall), vscode_1.commands.registerCommand('npm-script.test', runNpmTest), vscode_1.commands.registerCommand('npm-script.start', runNpmStart), vscode_1.commands.registerCommand('npm-script.run', runNpmScript), vscode_1.commands.registerCommand('npm-script.showOutput', showNpmOutput), vscode_1.commands.registerCommand('npm-script.rerun-last-script', rerunLastScript), vscode_1.commands.registerCommand('npm-script.build', runNpmBuild), vscode_1.commands.registerCommand('npm-script.installInOutputWindow', runNpmInstallInOutputWindow), vscode_1.commands.registerCommand('npm-script.uninstallInOutputWindow', runNpmUninstallInOutputWindow), vscode_1.commands.registerCommand('npm-script.validate', validateAllDocuments), vscode_1.commands.registerCommand('npm-script.terminate-script', terminateScript));
}
function runNpmCommand(args, cwd, alwaysRunInputWindow = false) {
    if (runSilent()) {
        args.push('--silent');
    }
    vscode_1.workspace.saveAll().then(() => {
        if (useTerminal() && !alwaysRunInputWindow) {
            if (typeof vscode_1.window.createTerminal === 'function') {
                runCommandInIntegratedTerminal(args, cwd);
            }
            else {
                runCommandInTerminal(args, cwd);
            }
        }
        else {
            outputChannel.clear();
            runCommandInOutputWindow(args, cwd);
        }
    });
}
function createAllCommand(scriptList, isScriptCommand) {
    return {
        label: "All",
        description: "Run all " + (isScriptCommand ? "scripts" : "commands") + " listed below",
        scriptName: "Dummy",
        cwd: undefined,
        execute() {
            for (const s of scriptList) {
                // check for null ``cwd to prevent calling the function by itself.
                if (s.cwd) {
                    s.execute();
                }
            }
        }
    };
}
function isMultiRoot() {
    if (vscode_1.workspace.workspaceFolders) {
        return vscode_1.workspace.workspaceFolders.length > 1;
    }
    return false;
}
function pickScriptToExecute(descriptions, command, allowAll = false, alwaysRunInputWindow = false) {
    const scriptList = [];
    const isScriptCommand = command[0] === 'run-script';
    if (allowAll && descriptions.length > 1) {
        scriptList.push(createAllCommand(scriptList, isScriptCommand));
    }
    for (const s of descriptions) {
        let label = s.name;
        if (s.relativePath) {
            label = `${s.relativePath} - ${label}`;
        }
        if (isMultiRoot()) {
            const root = vscode_1.workspace.getWorkspaceFolder(vscode_1.Uri.file(s.absolutePath));
            if (root) {
                label = `${root.name}: ${label}`;
            }
        }
        scriptList.push({
            label: label,
            description: s.cmd,
            scriptName: s.name,
            cwd: s.absolutePath,
            execute() {
                let script = this.scriptName;
                // quote the script name, when it contains white space
                if (/\s/g.test(script)) {
                    script = `"${script}"`;
                }
                // Create copy of command to ensure that we always get the correct command when the script is rerun.
                const cmd = Array.from(command);
                if (isScriptCommand) {
                    lastScript = this;
                    //Add script name to command array
                    cmd.push(script);
                }
                runNpmCommand(cmd, this.cwd, alwaysRunInputWindow);
            }
        });
    }
    if (scriptList.length === 1) {
        scriptList[0].execute();
        return;
    }
    else if (scriptList.length === 0) {
        if (isScriptCommand) {
            vscode_1.window.showErrorMessage(`Failed to find script with "${command[1]}" command`);
        }
        else {
            vscode_1.window.showErrorMessage(`Failed to find handler for "${command[0]}" command`);
        }
        return;
    }
    vscode_1.window.showQuickPick(scriptList).then(script => {
        if (script) {
            script.execute();
        }
    });
}
/**
  * Executes an npm command in a package directory (or in all possible directories).
  * @param command Command name.
  * @param allowAll Allow to run the command in all possible directory locations, otherwise the user must pick a location.
  * @param dirs Array of directories used to determine locations for running the command.
        When no argument is passed then `getIncludedDirectories` is used to get list of directories.
  */
function runNpmCommandInPackages(command, allowAll = false, alwaysRunInputWindow = false, dirs) {
    const descriptions = commandsDescriptions(command, dirs);
    pickScriptToExecute(descriptions, command, allowAll, alwaysRunInputWindow);
}
/**
  * The first argument in `args` must be the path to the directory where the command will be executed.
  */
function runNpmCommandWithArguments(cmd, args) {
    const [dir, ...args1] = args;
    runNpmCommand([cmd, ...args1], dir);
}
function runNpmInstall(arg) {
    let dirs = [];
    // Is the command executed from the context menu?
    if (arg && arg.fsPath) {
        dirs.push(path.dirname(arg.fsPath));
    }
    else {
        dirs = getAllIncludedDirectories();
    }
    runNpmCommandInPackages(['install'], true, false, dirs);
}
function runNpmInstallInOutputWindow(...args) {
    runNpmCommandWithArguments('install', args);
}
function runNpmUninstallInOutputWindow(...args) {
    runNpmCommandWithArguments('uninstall', args);
}
function runNpmTest() {
    runNpmCommandInPackages(['test'], true);
}
function runNpmStart() {
    runNpmCommandInPackages(['start'], true);
}
function runNpmBuild() {
    runNpmCommandInPackages(['build'], true);
}
function runNpmScript() {
    runNpmCommandInPackages(['run-script'], false);
}
;
function rerunLastScript() {
    if (lastScript) {
        lastScript.execute();
    }
    else {
        runNpmScript();
    }
}
/**
 * Adds entries to the `description` argument based on the passed command and the package path.
 * The function has two scenarios (based on a given command name):
 *  - Adds entry with the command, it's name and paths (absolute and relative to workspace).
 *  - When the command equals to 'run-script' it reads the `package.json` and generates entries:
 *    - with all script names (when there is no script name defined),
 *    - with scripts that match the name.
 */
function commandDescriptionsInPackage(param, packagePath, descriptions) {
    var absolutePath = packagePath;
    const fileUri = vscode_1.Uri.file(absolutePath);
    const workspaceFolder = vscode_1.workspace.getWorkspaceFolder(fileUri);
    let rootUri = undefined;
    let relativePath = undefined;
    if (workspaceFolder) {
        rootUri = workspaceFolder.uri;
        relativePath = absolutePath.substring(rootUri.fsPath.length + 1);
    }
    const cmd = param[0];
    const name = param[1];
    if (cmd === 'run-script') {
        try {
            const fileName = path.join(packagePath, 'package.json');
            const contents = fs.readFileSync(fileName).toString();
            const json = JSON.parse(contents);
            if (json.scripts) {
                var jsonScripts = json.scripts;
                Object.keys(jsonScripts).forEach(key => {
                    if (!name || key === name) {
                        descriptions.push({
                            absolutePath: absolutePath,
                            relativePath: relativePath,
                            name: `${key}`,
                            cmd: `${cmd} ${jsonScripts[key]}`
                        });
                    }
                });
            }
        }
        catch (e) {
        }
    }
    else {
        descriptions.push({
            absolutePath: absolutePath,
            relativePath: relativePath,
            name: `${cmd}`,
            cmd: `npm ${cmd}`
        });
    }
}
function commandsDescriptions(command, dirs) {
    if (!dirs) {
        dirs = getAllIncludedDirectories();
    }
    const descriptions = [];
    dirs.forEach(dir => commandDescriptionsInPackage(command, dir, descriptions));
    return descriptions;
}
function doValidate(document) {
    return __awaiter(this, void 0, void 0, function* () {
        let report = null;
        let documentWasClosed = false; // track whether the document was closed while getInstalledModules/'npm ls' runs
        const listener = vscode_1.workspace.onDidCloseTextDocument(doc => {
            if (doc.uri === document.uri) {
                documentWasClosed = true;
            }
        });
        try {
            report = yield getInstalledModules(path.dirname(document.fileName));
        }
        catch (e) {
            listener.dispose();
            return;
        }
        try {
            clearDiagnosticCollection();
            if (report.invalid && report.invalid === true) {
                return;
            }
            if (!anyModuleErrors(report)) {
                return;
            }
            if (documentWasClosed || !document.getText()) {
                return;
            }
            const sourceRanges = parseSourceRanges(document.getText());
            const dependencies = report.dependencies;
            if (!dependencies) {
                return;
            }
            const diagnostics = [];
            for (var moduleName in dependencies) {
                if (dependencies.hasOwnProperty(moduleName)) {
                    const diagnostic = getDiagnostic(document, report, moduleName, sourceRanges);
                    if (diagnostic) {
                        diagnostic.source = 'npm';
                        diagnostics.push(diagnostic);
                    }
                }
            }
            //console.log("diagnostic count ", diagnostics.length, " ", document.uri.fsPath);
            diagnosticCollection.set(document.uri, diagnostics);
        }
        catch (e) {
            vscode_1.window.showInformationMessage(`[npm-script-runner] Cannot validate the package.json ` + e);
            console.log(`npm-script-runner: 'error while validating package.json stacktrace: ${e.stack}`);
        }
    });
}
function parseSourceRanges(text) {
    const definedDependencies = {};
    const properties = {};
    const errors = [];
    const node = jsonc_parser_1.parseTree(text, errors);
    if (node.children) {
        node.children.forEach(child => {
            const children = child.children;
            if (children) {
                const property = children[0];
                properties[property.value] = {
                    name: {
                        offset: property.offset,
                        length: property.length
                    }
                };
                if (children && children.length === 2 && isDependency(children[0].value)) {
                    collectDefinedDependencies(definedDependencies, children[1]);
                }
            }
        });
    }
    return {
        dependencies: definedDependencies,
        properties: properties
    };
}
function getDiagnostic(document, report, moduleName, ranges) {
    let diagnostic = null;
    // npm list only reports errors against 'dependencies' and not against 'devDependencies'
    if (report.dependencies && report.dependencies[moduleName]) {
        if (report.dependencies[moduleName]['missing'] === true) {
            if (ranges.dependencies[moduleName]) {
                const source = ranges.dependencies[moduleName].name;
                const range = new vscode_1.Range(document.positionAt(source.offset), document.positionAt(source.offset + source.length));
                diagnostic = new vscode_1.Diagnostic(range, `Module '${moduleName}' is not installed`, vscode_1.DiagnosticSeverity.Warning);
            }
            else {
                console.log(`[npm-script] Could not locate "missing" dependency '${moduleName}' in package.json`);
            }
        }
        else if (report.dependencies[moduleName]['invalid'] === true) {
            if (ranges.dependencies[moduleName]) {
                const source = ranges.dependencies[moduleName].version;
                const installedVersion = report.dependencies[moduleName]['version'];
                const range = new vscode_1.Range(document.positionAt(source.offset), document.positionAt(source.offset + source.length));
                const message = installedVersion ?
                    `Module '${moduleName}' the installed version '${installedVersion}' is invalid` :
                    `Module '${moduleName}' the installed version is invalid or has errors`;
                diagnostic = new vscode_1.Diagnostic(range, message, vscode_1.DiagnosticSeverity.Warning);
            }
            else {
                console.log(`[npm-script] Could not locate "invalid" dependency '${moduleName}' in package.json`);
            }
        }
        else if (report.dependencies[moduleName]['extraneous'] === true) {
            const source = findAttributeRange(ranges);
            const range = new vscode_1.Range(document.positionAt(source.offset), document.positionAt(source.offset + source.length));
            diagnostic = new vscode_1.Diagnostic(range, `Module '${moduleName}' is extraneous`, vscode_1.DiagnosticSeverity.Warning);
        }
    }
    return diagnostic;
}
function findAttributeRange(ranges) {
    let source = null;
    if (ranges.properties['dependencies']) {
        source = ranges.properties['dependencies'].name;
    }
    else if (ranges.properties['devDependencies']) {
        source = ranges.properties['devDependencies'].name;
    }
    else if (ranges.properties['name']) {
        source = ranges.properties['name'].name;
    }
    else {
        // no attribute found in the package.json to attach the diagnostic, therefore just attach the diagnostic to the top of the file
        source = { offset: 0, length: 1 };
    }
    return source;
}
function anyModuleErrors(report) {
    const problems = report['problems'];
    if (problems) {
        return problems.find(each => {
            return each.startsWith('missing:') || each.startsWith('invalid:') || each.startsWith('extraneous:');
        }) !== undefined;
    }
    return false;
}
function collectDefinedDependencies(dependencies, node) {
    if (!node || !node.children) {
        return;
    }
    node.children.forEach(child => {
        if (child.type === 'property' && child.children && child.children.length === 2) {
            const dependencyName = child.children[0];
            const version = child.children[1];
            dependencies[dependencyName.value] = {
                name: {
                    offset: dependencyName.offset,
                    length: dependencyName.length
                },
                version: {
                    offset: version.offset,
                    length: version.length
                }
            };
        }
    });
}
function isDependency(value) {
    return value === 'dependencies' || value === 'devDependencies';
}
function showNpmOutput() {
    outputChannel.show(vscode_1.ViewColumn.Three);
}
function terminateScript() {
    if (useTerminal()) {
        vscode_1.window.showInformationMessage('Killing is only supported when the setting "runInTerminal" is "false"');
    }
    else {
        const items = [];
        runningProcesses.forEach((value) => {
            items.push(new ProcessItem(value.cmd, `kill the process ${value.process.pid}`, value.process.pid));
        });
        vscode_1.window.showQuickPick(items).then((value) => {
            if (value) {
                outputChannel.appendLine('');
                outputChannel.appendLine(`Killing process ${value.label} (pid: ${value.pid})`);
                outputChannel.appendLine('');
                tree_kill_1.kill(value.pid, 'SIGTERM');
            }
        });
    }
}
function getInstalledModules(package_dir) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const cmd = getNpmBin() + ' ' + 'ls --depth 0 --json';
            let jsonResult = '';
            let errors = '';
            const p = cp.exec(cmd, { cwd: package_dir, env: process.env });
            p.stderr.on('data', (chunk) => errors += chunk);
            p.stdout.on('data', (chunk) => jsonResult += chunk);
            p.on('close', (_code, _signal) => {
                try {
                    const resp = JSON.parse(jsonResult);
                    resolve(resp);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    });
}
function runCommandInOutputWindow(args, cwd) {
    const cmd = getNpmBin() + ' ' + args.join(' ');
    const p = cp.exec(cmd, { cwd: cwd, env: process.env });
    runningProcesses.set(p.pid, { process: p, cmd: cmd });
    p.stderr.on('data', (data) => {
        outputChannel.append(data);
    });
    p.stdout.on('data', (data) => {
        outputChannel.append(data);
    });
    p.on('exit', (_code, signal) => {
        runningProcesses.delete(p.pid);
        if (signal === 'SIGTERM') {
            outputChannel.appendLine('Successfully killed process');
            outputChannel.appendLine('-----------------------');
            outputChannel.appendLine('');
        }
        else {
            outputChannel.appendLine('-----------------------');
            outputChannel.appendLine('');
        }
        validateAllDocuments();
    });
    showNpmOutput();
}
function runCommandInTerminal(args, cwd) {
    run_in_terminal_1.runInTerminal(getNpmBin(), args, { cwd: cwd, env: process.env });
}
function runCommandInIntegratedTerminal(args, cwd) {
    const cmd_args = Array.from(args);
    if (!terminal) {
        terminal = vscode_1.window.createTerminal('npm');
    }
    terminal.show();
    if (cwd) {
        // Replace single backslash with double backslash.
        const textCwd = cwd.replace(/\\/g, '\\\\');
        terminal.sendText(['cd', `"${textCwd}"`].join(' '));
    }
    cmd_args.splice(0, 0, getNpmBin());
    terminal.sendText(cmd_args.join(' '));
}
function useTerminal() {
    return vscode_1.workspace.getConfiguration('npm')['runInTerminal'];
}
function runSilent() {
    return vscode_1.workspace.getConfiguration('npm')['runSilent'];
}
function getAllIncludedDirectories() {
    const allDirs = [];
    const folders = vscode_1.workspace.workspaceFolders;
    if (!folders) {
        return allDirs;
    }
    for (let i = 0; i < folders.length; i++) {
        if (folders[i].uri.scheme === 'file') {
            const dirs = getIncludedDirectories(folders[i].uri);
            allDirs.push(...dirs);
        }
    }
    return allDirs;
}
function getIncludedDirectories(workspaceRoot) {
    const dirs = [];
    if (vscode_1.workspace.getConfiguration('npm', workspaceRoot)['useRootDirectory'] !== false) {
        dirs.push(workspaceRoot.fsPath);
    }
    if (vscode_1.workspace.getConfiguration('npm', workspaceRoot)['includeDirectories'].length > 0) {
        for (const dir of vscode_1.workspace.getConfiguration('npm', workspaceRoot)['includeDirectories']) {
            dirs.push(path.join(workspaceRoot.fsPath, dir));
        }
    }
    return dirs;
}
function getNpmBin() {
    return vscode_1.workspace.getConfiguration('npm')['bin'] || 'npm';
}
//# sourceMappingURL=main.js.map