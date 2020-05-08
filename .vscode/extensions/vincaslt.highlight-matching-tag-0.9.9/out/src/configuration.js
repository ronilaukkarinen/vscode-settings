"use strict";
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
const vscode = require("vscode");
const extensionId = 'highlight-matching-tag';
const defaultEmptyElements = [
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
];
exports.defaultEmptyElements = defaultEmptyElements;
class Configuration {
    constructor() {
        this.deleteSetting = (section) => {
            this.config.update(section, undefined, vscode.ConfigurationTarget.WorkspaceFolder);
            this.config.update(section, undefined, vscode.ConfigurationTarget.Workspace);
            this.config.update(section, undefined, vscode.ConfigurationTarget.Global);
        };
    }
    get config() {
        const editor = vscode.window.activeTextEditor;
        return vscode.workspace.getConfiguration(extensionId, editor && editor.document.uri);
    }
    get isEnabled() {
        return !!this.config.get('enabled');
    }
    get highlightSelfClosing() {
        return !!this.config.get('highlightSelfClosing');
    }
    get highlightFromContent() {
        return !!this.config.get('highlightFromContent');
    }
    get highlightFromName() {
        return !!this.config.get('highlightFromName');
    }
    get highlightFromAttributes() {
        return !!this.config.get('highlightFromAttributes');
    }
    get showPath() {
        return !!this.config.get('showPath');
    }
    get showRuler() {
        return !!this.config.get('showRuler');
    }
    get emptyElements() {
        const defaultEmptyTags = this.config.get('noDefaultEmptyElements') ? [] : defaultEmptyElements;
        const customEmptyTags = this.config.get('customEmptyElements') || [];
        return [...defaultEmptyTags, ...customEmptyTags];
    }
    get styles() {
        return this.config.get('styles');
    }
    get hasOldSettings() {
        return !!(this.config.get('style') ||
            this.config.get('leftStyle') ||
            this.config.get('rightStyle') ||
            this.config.get('beginningStyle') ||
            this.config.get('endingStyle'));
    }
    configure({ context, onEditorChange }) {
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(onEditorChange, this));
    }
    /**
     * Migrates styling settings from version 0.7.1 -> 0.8.0
     */
    migrate(keepSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (keepSettings) {
                this.migrateStyle('style', 'full');
                this.migrateStyle('leftStyle', 'left');
                this.migrateStyle('rightStyle', 'right');
                this.migrateStyle('beginningStyle', 'full');
                this.migrateStyle('endingStyle', 'full');
            }
            this.deleteSetting('style');
            this.deleteSetting('leftStyle');
            this.deleteSetting('rightStyle');
            this.deleteSetting('beginningStyle');
            this.deleteSetting('endingStyle');
        });
    }
    migrateStyle(oldSection, newOpeningSection) {
        const old = this.config.inspect(oldSection);
        const current = this.config.inspect('styles');
        if (!old || !current) {
            return;
        }
        if (old.workspaceFolderValue) {
            const newValue = current.workspaceFolderValue || { opening: {} };
            newValue.opening[newOpeningSection] = { custom: old.workspaceFolderValue };
            this.config.update('styles', newValue, vscode.ConfigurationTarget.WorkspaceFolder);
        }
        if (old.workspaceValue) {
            const newValue = current.workspaceValue || { opening: {} };
            newValue.opening[newOpeningSection] = { custom: old.workspaceValue };
            this.config.update('styles', newValue, vscode.ConfigurationTarget.Workspace);
        }
        if (old.globalValue) {
            const newValue = current.globalValue || { opening: {} };
            newValue.opening[newOpeningSection] = { custom: old.globalValue };
            this.config.update('styles', newValue, vscode.ConfigurationTarget.Global);
        }
    }
}
const configuration = new Configuration();
exports.default = configuration;
//# sourceMappingURL=configuration.js.map