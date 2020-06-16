/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
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
const extfs = require("./base/node/extfs");
const mm = require("micromatch");
const os = require("os");
const path = require("path");
const semver = require("semver");
const spawn = require("cross-spawn");
const strings = require("./base/common/strings");
const charcode_1 = require("./base/common/charcode");
const vscode_languageserver_1 = require("vscode-languageserver");
const strings_1 = require("./strings");
class PhpcsLinter {
    constructor(executablePath, executableVersion) {
        this.executablePath = executablePath;
        this.executableVersion = executableVersion;
    }
    /**
     * Create an instance of the PhpcsLinter.
     */
    static create(executablePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = cp.execSync(`"${executablePath}" --version`);
                const versionPattern = /^PHP_CodeSniffer version (\d+\.\d+\.\d+)/i;
                const versionMatches = result.toString().match(versionPattern);
                if (versionMatches === null) {
                    throw new Error(strings_1.StringResources.InvalidVersionStringError);
                }
                const executableVersion = versionMatches[1];
                return new PhpcsLinter(executablePath, executableVersion);
            }
            catch (error) {
                let message = error.message ? error.message : strings_1.StringResources.CreateLinterErrorDefaultMessage;
                throw new Error(strings.format(strings_1.StringResources.CreateLinterError, message));
            }
        });
    }
    lint(document, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workspaceRoot } = settings;
            // Process linting paths.
            let filePath = vscode_languageserver_1.Files.uriToFilePath(document.uri);
            // Make sure we capitalize the drive letter in paths on Windows.
            if (filePath !== undefined && /^win/.test(process.platform)) {
                let pathRoot = path.parse(filePath).root;
                let noDrivePath = filePath.slice(Math.max(pathRoot.length - 1, 0));
                filePath = path.join(pathRoot.toUpperCase(), noDrivePath);
            }
            let fileText = document.getText();
            // Return empty on empty text.
            if (fileText === '') {
                return [];
            }
            // Process linting arguments.
            let lintArgs = ['--report=json'];
            // -q (quiet) option is available since phpcs 2.6.2
            if (semver.gte(this.executableVersion, '2.6.2')) {
                lintArgs.push('-q');
            }
            // Show sniff source codes in report output.
            if (settings.showSources === true) {
                lintArgs.push('-s');
            }
            // --encoding option is available since 1.3.0
            if (semver.gte(this.executableVersion, '1.3.0')) {
                lintArgs.push('--encoding=UTF-8');
            }
            // Check if a config file exists and handle it
            let standard;
            if (settings.autoConfigSearch && workspaceRoot !== null && filePath !== undefined) {
                const confFileNames = [
                    '.phpcs.xml', '.phpcs.xml.dist', 'phpcs.xml', 'phpcs.xml.dist',
                    'phpcs.ruleset.xml', 'ruleset.xml',
                ];
                const fileDir = path.relative(workspaceRoot, path.dirname(filePath));
                const confFile = !settings.ignorePatterns.some(pattern => this.isIgnorePatternMatch(filePath, pattern))
                    ? yield extfs.findAsync(workspaceRoot, fileDir, confFileNames)
                    : null;
                standard = confFile || settings.standard;
            }
            else {
                standard = settings.standard;
            }
            if (standard) {
                lintArgs.push(`--standard=${standard}`);
            }
            // Check if file should be ignored (Skip for in-memory documents)
            if (filePath !== undefined && settings.ignorePatterns.length) {
                if (semver.gte(this.executableVersion, '3.0.0')) {
                    // PHPCS v3 and up support this with STDIN files
                    lintArgs.push(`--ignore=${settings.ignorePatterns.join()}`);
                }
                else if (settings.ignorePatterns.some(pattern => this.isIgnorePatternMatch(filePath, pattern))) {
                    // We must determine this ourself for lower versions
                    return [];
                }
            }
            lintArgs.push(`--error-severity=${settings.errorSeverity}`);
            let warningSeverity = settings.warningSeverity;
            if (settings.showWarnings === false) {
                warningSeverity = 0;
            }
            lintArgs.push(`--warning-severity=${warningSeverity}`);
            let text = fileText;
            // Determine the method of setting the file name
            if (filePath !== undefined) {
                switch (true) {
                    // PHPCS 2.6 and above support sending the filename in a flag
                    case semver.gte(this.executableVersion, '2.6.0'):
                        lintArgs.push(`--stdin-path=${filePath}`);
                        break;
                    // PHPCS 2.x.x before 2.6.0 supports putting the name in the start of the stream
                    case semver.satisfies(this.executableVersion, '>=2.0.0 <2.6.0'):
                        // TODO: This needs to be document specific.
                        const eolChar = os.EOL;
                        text = `phpcs_input_file: ${filePath}${eolChar}${fileText}`;
                        break;
                    // PHPCS v1 supports stdin, but ignores all filenames.
                    default:
                        // Nothing to do
                        break;
                }
            }
            // Finish off the parameter list
            lintArgs.push('-');
            const forcedKillTime = 1000 * 60 * 5; // ms * s * m: 5 minutes
            const options = {
                cwd: workspaceRoot !== null ? workspaceRoot : undefined,
                env: process.env,
                encoding: "utf8",
                timeout: forcedKillTime,
                tty: true,
                input: text,
            };
            const phpcs = spawn.sync(this.executablePath, lintArgs, options);
            const stdout = phpcs.stdout.toString().trim();
            const stderr = phpcs.stderr.toString().trim();
            let match = null;
            // Determine whether we have an error in stderr.
            if (stderr !== '') {
                if (match = stderr.match(/^(?:PHP\s?)FATAL\s?ERROR:\s?(.*)/i)) {
                    let error = match[1].trim();
                    if (match = error.match(/^Uncaught exception '.*' with message '(.*)'/)) {
                        throw new Error(match[1]);
                    }
                    throw new Error(error);
                }
                throw new Error(strings.format(strings_1.StringResources.UnknownExecutionError, `${this.executablePath} ${lintArgs.join(' ')}`));
            }
            // Determine whether we have an error in stdout.
            if (match = stdout.match(/^ERROR:\s?(.*)/i)) {
                let error = match[1].trim();
                if (match = error.match(/^the \"(.*)\" coding standard is not installed\./)) {
                    throw new Error(strings.format(strings_1.StringResources.CodingStandardNotInstalledError, match[1]));
                }
                throw new Error(error);
            }
            const data = this.parseData(stdout);
            let messages;
            if (filePath !== undefined && semver.gte(this.executableVersion, '2.0.0')) {
                const fileRealPath = extfs.realpathSync(filePath);
                if (!data.files[fileRealPath]) {
                    return [];
                }
                ({ messages } = data.files[fileRealPath]);
            }
            else {
                // PHPCS v1 can't associate a filename with STDIN input
                if (!data.files.STDIN) {
                    return [];
                }
                ({ messages } = data.files.STDIN);
            }
            let diagnostics = [];
            messages.map(message => diagnostics.push(this.createDiagnostic(document, message, settings.showSources)));
            return diagnostics;
        });
    }
    parseData(text) {
        try {
            return JSON.parse(text);
        }
        catch (error) {
            throw new Error(strings_1.StringResources.InvalidJsonStringError);
        }
    }
    createDiagnostic(document, entry, showSources) {
        let lines = document.getText().split("\n");
        let line = entry.line - 1;
        let lineString = lines[line];
        // Process diagnostic start and end characters.
        let startCharacter = entry.column - 1;
        let endCharacter = entry.column;
        let charCode = lineString.charCodeAt(startCharacter);
        if (charcode_1.default.isWhiteSpace(charCode)) {
            for (let i = startCharacter + 1, len = lineString.length; i < len; i++) {
                charCode = lineString.charCodeAt(i);
                if (!charcode_1.default.isWhiteSpace(charCode)) {
                    break;
                }
                endCharacter = i;
            }
        }
        else if (charcode_1.default.isAlphaNumeric(charCode) || charcode_1.default.isSymbol(charCode)) {
            // Get the whole word
            for (let i = startCharacter + 1, len = lineString.length; i < len; i++) {
                charCode = lineString.charCodeAt(i);
                if (!charcode_1.default.isAlphaNumeric(charCode) && charCode !== 95) {
                    break;
                }
                endCharacter++;
            }
            // Move backwards
            for (let i = startCharacter, len = 0; i > len; i--) {
                charCode = lineString.charCodeAt(i - 1);
                if (!charcode_1.default.isAlphaNumeric(charCode) && !charcode_1.default.isSymbol(charCode) && charCode !== 95) {
                    break;
                }
                startCharacter--;
            }
        }
        // Process diagnostic range.
        const range = vscode_languageserver_1.Range.create(line, startCharacter, line, endCharacter);
        // Process diagnostic sources.
        let message = entry.message;
        if (showSources) {
            message += `\n(${entry.source})`;
        }
        // Process diagnostic severity.
        let severity = vscode_languageserver_1.DiagnosticSeverity.Error;
        if (entry.type === "WARNING") {
            severity = vscode_languageserver_1.DiagnosticSeverity.Warning;
        }
        return vscode_languageserver_1.Diagnostic.create(range, message, severity, null, 'phpcs');
    }
    getIgnorePatternReplacements() {
        if (!this.ignorePatternReplacements) {
            this.ignorePatternReplacements = new Map([
                [/^\*\//, '**/'],
                [/\/\*$/, '/**'],
                [/\/\*\//g, '/**/'],
            ]);
        }
        return this.ignorePatternReplacements;
    }
    isIgnorePatternMatch(path, pattern) {
        for (let [searchValue, replaceValue] of this.getIgnorePatternReplacements()) {
            pattern = pattern.replace(searchValue, replaceValue);
        }
        return mm.isMatch(path, pattern);
    }
}
exports.PhpcsLinter = PhpcsLinter;
//# sourceMappingURL=linter.js.map