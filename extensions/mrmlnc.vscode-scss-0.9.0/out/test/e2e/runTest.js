"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const cp = require("child_process");
const vscode_test_1 = require("vscode-test");
async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const workspaceDir = path.resolve(__dirname, '../../../fixtures/e2e');
        // Download VS Code, unzip it and run the integration test
        const vscodeExecutablePath = await vscode_test_1.downloadAndUnzipVSCode('1.40.0');
        const cliPath = vscode_test_1.resolveCliPathFromVSCodeExecutablePath(vscodeExecutablePath);
        cp.spawnSync(cliPath, ['--install-extension', 'octref.vetur'], {
            encoding: 'utf-8',
            stdio: 'inherit'
        });
        await vscode_test_1.runTests({
            vscodeExecutablePath,
            version: '1.40.0',
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [workspaceDir]
        });
    }
    catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=runTest.js.map