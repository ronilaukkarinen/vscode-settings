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
require("isomorphic-fetch");
const tsdi_1 = require("tsdi");
const vscode = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const command_manager_1 = require("./command-manager");
const extension_1 = require("./extension");
let tsdi;
function activate(context) {
    class ComponentFactory {
        extensionContext() {
            return context;
        }
        outputChannel() {
            const channel = vscode.window.createOutputChannel('GitHub');
            context.subscriptions.push(channel);
            return channel;
        }
        telemetryReporter() {
            const extensionId = 'vscode-github';
            const extensionVersion = vscode.extensions.getExtension('KnisterPeter.vscode-github').packageJSON.version;
            const key = '67a6da7f-d420-47bd-97d0-d1fd4b76ac55';
            const reporter = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, key);
            context.subscriptions.push(reporter);
            return reporter;
        }
    }
    __decorate([
        tsdi_1.factory({ name: 'vscode.ExtensionContext' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], ComponentFactory.prototype, "extensionContext", null);
    __decorate([
        tsdi_1.factory({ name: 'vscode.OutputChannel' }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Object)
    ], ComponentFactory.prototype, "outputChannel", null);
    __decorate([
        tsdi_1.factory,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", vscode_extension_telemetry_1.default)
    ], ComponentFactory.prototype, "telemetryReporter", null);
    tsdi = new tsdi_1.TSDI();
    tsdi.enableComponentScanner();
    tsdi.register(ComponentFactory);
    // note: trigger CommandManager creating for now
    // this could be removed when tsdi is able to defer eager creation
    tsdi.get(command_manager_1.CommandManager);
    context.subscriptions.push(tsdi.get(extension_1.Extension));
}
exports.activate = activate;
function deactivate() {
    tsdi.close();
}
exports.deactivate = deactivate;
//# sourceMappingURL=main.js.map