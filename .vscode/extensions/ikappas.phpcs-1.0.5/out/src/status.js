/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const timer_1 = require("./timer");
class PhpcsStatus {
    constructor() {
        this.documents = [];
        this.processing = 0;
        this.spinnerIndex = 0;
        this.spinnerSequence = ["|", "/", "-", "\\"];
    }
    startProcessing(uri) {
        this.documents.push(uri);
        this.processing += 1;
        this.getTimer().start();
        this.getStatusBarItem().show();
    }
    endProcessing(uri) {
        this.processing -= 1;
        let index = this.documents.indexOf(uri);
        if (index !== undefined) {
            this.documents.slice(index, 1);
        }
        if (this.processing === 0) {
            this.getTimer().stop();
            this.getStatusBarItem().hide();
            this.updateStatusText();
        }
    }
    updateStatusText() {
        let statusBar = this.getStatusBarItem();
        let count = this.processing;
        if (count > 0) {
            let spinner = this.getNextSpinnerChar();
            statusBar.text = count === 1 ? `$(eye) phpcs is linting 1 document ... ${spinner}` : `$(eye) phpcs is linting ${count} documents ... ${spinner}`;
        }
        else {
            statusBar.text = "";
        }
    }
    getNextSpinnerChar() {
        let spinnerChar = this.spinnerSequence[this.spinnerIndex];
        this.spinnerIndex += 1;
        if (this.spinnerIndex > this.spinnerSequence.length - 1) {
            this.spinnerIndex = 0;
        }
        return spinnerChar;
    }
    getTimer() {
        if (!this.timer) {
            this.timer = new timer_1.Timer(() => {
                this.updateStatusText();
            });
            this.timer.interval = 100;
        }
        return this.timer;
    }
    getStatusBarItem() {
        // Create as needed
        if (!this.statusBarItem) {
            this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
        }
        return this.statusBarItem;
    }
    dispose() {
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
        if (this.timer) {
            this.timer.dispose();
        }
    }
}
exports.PhpcsStatus = PhpcsStatus;
//# sourceMappingURL=status.js.map