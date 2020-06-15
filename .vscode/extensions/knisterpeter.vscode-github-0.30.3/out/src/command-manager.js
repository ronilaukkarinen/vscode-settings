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
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const command_1 = require("./command");
require("./commands/browse");
require("./commands/pull-requests");
require("./commands/token");
require("./commands/user");
let CommandManager = class CommandManager {
    init() {
        this.tsdi.addLifecycleListener(this);
    }
    onCreate(component) {
        if (component instanceof command_1.Command) {
            this.context.subscriptions.push(vscode.commands.registerCommand(component.id, (...args) => component.run(...args)));
        }
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", tsdi_1.TSDI)
], CommandManager.prototype, "tsdi", void 0);
__decorate([
    tsdi_1.inject('vscode.ExtensionContext'),
    __metadata("design:type", Object)
], CommandManager.prototype, "context", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommandManager.prototype, "init", null);
CommandManager = __decorate([
    tsdi_1.component
], CommandManager);
exports.CommandManager = CommandManager;
//# sourceMappingURL=command-manager.js.map