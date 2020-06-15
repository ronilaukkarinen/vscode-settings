"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const command_1 = require("../command");
const git_1 = require("../git");
const helper_1 = require("../helper");
let BrowseProject = class BrowseProject extends command_1.TokenCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.browseProject';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const url = yield this.workflowManager.getRepositoryUrl(this.uri);
            yield vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseProject.prototype, "runWithToken", null);
BrowseProject = __decorate([
    tsdi_1.component({ eager: true })
], BrowseProject);
exports.BrowseProject = BrowseProject;
let BrowseOpenIssues = class BrowseOpenIssues extends command_1.TokenCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.browseOpenIssue';
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.uri) {
                throw new Error('uri is undefined');
            }
            const issues = yield this.workflowManager.issues(this.uri, 'open');
            if (issues.length > 0) {
                const selected = yield vscode.window.showQuickPick(issues.map(issue => ({
                    label: `${issue.title}`,
                    description: `#${issue.number}`,
                    issue
                })));
                if (selected) {
                    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(selected.issue.url));
                }
            }
            else {
                vscode.window.showInformationMessage(`No open issues found`);
            }
        });
    }
};
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseOpenIssues.prototype, "runWithToken", null);
BrowseOpenIssues = __decorate([
    tsdi_1.component({ eager: true })
], BrowseOpenIssues);
exports.BrowseOpenIssues = BrowseOpenIssues;
let BrowseCurrentFile = class BrowseCurrentFile extends command_1.TokenCommand {
    constructor() {
        super(...arguments);
        this.id = 'vscode-github.browseCurrentFile';
        this.requireProjectFolder = false;
    }
    runWithToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = vscode.window.activeTextEditor;
            if (vscode.workspace.workspaceFolders && editor) {
                const folder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
                if (!folder) {
                    return;
                }
                const root = yield this.git.getGitRoot(folder.uri);
                const file = editor.document.fileName.substring(root.length);
                const line = editor.selection.active.line;
                const endLine = editor.selection.end.line;
                const uri = vscode.Uri.parse(yield this.workflowManager.getGithubFileUrl(folder.uri, file, line, endLine));
                vscode.commands.executeCommand('vscode.open', uri);
            }
        });
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", git_1.Git)
], BrowseCurrentFile.prototype, "git", void 0);
__decorate([
    helper_1.showProgress,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrowseCurrentFile.prototype, "runWithToken", null);
BrowseCurrentFile = __decorate([
    tsdi_1.component({ eager: true })
], BrowseCurrentFile);
exports.BrowseCurrentFile = BrowseCurrentFile;
//# sourceMappingURL=browse.js.map