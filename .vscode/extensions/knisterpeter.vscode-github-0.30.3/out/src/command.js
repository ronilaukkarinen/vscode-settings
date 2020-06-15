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
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const api_1 = require("./provider/github/api");
const workflow_manager_1 = require("./workflow-manager");
class Command {
    track(message) {
        const properties = {
            id: this.id.replace('vscode-github.', ''),
            message
        };
        this.reporter.sendTelemetryEvent('vscode-github.command', properties);
    }
    getProjectFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = vscode.workspace.workspaceFolders;
            if (!folders) {
                return undefined;
            }
            if (folders.length === 1) {
                return folders[0].uri;
            }
            const folder = yield vscode.window.showWorkspaceFolderPick();
            if (!folder) {
                return undefined;
            }
            return folder.uri;
        });
    }
}
__decorate([
    tsdi_1.inject,
    __metadata("design:type", vscode_extension_telemetry_1.default)
], Command.prototype, "reporter", void 0);
exports.Command = Command;
class TokenCommand extends Command {
    constructor() {
        super(...arguments);
        this.requireProjectFolder = true;
    }
    run(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.requireProjectFolder) {
                const uri = yield this.getProjectFolder();
                if (!uri) {
                    return;
                }
                this.uri = uri;
                if (!this.workflowManager ||
                    !Boolean(yield this.workflowManager.canConnect(this.uri))) {
                    this.track('execute without token');
                    vscode.window.showWarningMessage('Please setup your Github Personal Access Token ' +
                        'and open a GitHub project in your workspace');
                    return;
                }
            }
            try {
                this.track('execute');
                try {
                    yield this.runWithToken(...args);
                }
                catch (e) {
                    this.logAndShowError(e);
                }
            }
            finally {
                this.uri = undefined;
            }
        });
    }
    logAndShowError(e) {
        this.track('failed');
        if (this.channel) {
            this.channel.appendLine(e.message);
            if (e.stack) {
                e.stack.split('\n').forEach(line => this.channel.appendLine(line));
            }
        }
        if (e instanceof api_1.GitHubError) {
            console.error(e.response);
            vscode.window.showErrorMessage('GitHub error: ' + e.message);
        }
        else {
            console.error(e);
            vscode.window.showErrorMessage('Error: ' + e.message);
        }
    }
}
__decorate([
    tsdi_1.inject,
    __metadata("design:type", workflow_manager_1.WorkflowManager)
], TokenCommand.prototype, "workflowManager", void 0);
__decorate([
    tsdi_1.inject('vscode.OutputChannel'),
    __metadata("design:type", Object)
], TokenCommand.prototype, "channel", void 0);
exports.TokenCommand = TokenCommand;
//# sourceMappingURL=command.js.map