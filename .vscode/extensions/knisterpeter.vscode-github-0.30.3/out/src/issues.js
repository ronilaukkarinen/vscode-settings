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
const common_tags_1 = require("common-tags");
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const workflow_manager_1 = require("./workflow-manager");
let HoverProvider = class HoverProvider {
    constructor() {
        this.hoverContent = {};
    }
    init() {
        // fixme #443: This provider causes high cpu load and
        // is annoying to users. This need to be reimplemented
        return;
        this.context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('*', this), vscode.languages.registerHoverProvider('*', this));
        vscode.window.onDidChangeActiveTextEditor(() => (this.hoverContent = {}));
    }
    provideDocumentLinks(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = vscode.workspace.getWorkspaceFolder(document.uri);
            if (!folder) {
                return [];
            }
            const lines = document.getText().split('\n');
            return (yield Promise.all(lines.map((line, no) => __awaiter(this, void 0, void 0, function* () { return this.getMatchesOnLine(folder.uri, line, no); })))).reduce((akku, links) => [...akku, ...links], []);
        });
    }
    getMatchesOnLine(uri, line, lineNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const expr = new RegExp(`#\\d+`, 'gi');
            let match;
            const matches = [];
            while (true) {
                match = expr.exec(line);
                if (match === null) {
                    break;
                }
                const range = new vscode.Range(new vscode.Position(lineNo, match.index), new vscode.Position(lineNo, match.index + match[0].length));
                const url = yield this.workflowManager.getIssueUrl(uri, match[0].substr(1));
                if (url) {
                    matches.push({
                        range,
                        target: vscode.Uri.parse(url)
                    });
                }
            }
            return matches;
        });
    }
    provideHover(document, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = vscode.workspace.getWorkspaceFolder(document.uri);
            if (!folder) {
                return undefined;
            }
            const links = yield this.provideDocumentLinks(document);
            const link = links.find(link => link.range.contains(position));
            if (!link || !link.target) {
                return undefined;
            }
            const target = link.target.toString();
            if (this.hoverContent[target]) {
                return new vscode.Hover(this.hoverContent[target], link.range);
            }
            const issues = yield this.workflowManager.issues(folder.uri);
            const issue = issues.find(issue => issue.url === target);
            if (!issue) {
                return undefined;
            }
            const comments = yield this.workflowManager.getIssueComments(issue);
            const content = common_tags_1.stripIndents `

    ## ${issue.title}

    ${issue.body}

    ---

    ${comments.map(comment => comment.body).join('\n\n---\n\n')}
    `;
            this.hoverContent[target] = content;
            return new vscode.Hover(content, link.range);
        });
    }
};
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], HoverProvider.prototype, "context", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], HoverProvider.prototype, "workflowManager", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HoverProvider.prototype, "init", null);
HoverProvider = __decorate([
    tsdi_1.component
], HoverProvider);
exports.HoverProvider = HoverProvider;
//# sourceMappingURL=issues.js.map