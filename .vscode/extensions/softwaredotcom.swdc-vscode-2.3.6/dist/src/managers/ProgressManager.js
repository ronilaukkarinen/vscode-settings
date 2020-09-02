"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressManager = void 0;
class ProgressManager {
    constructor() {
        this.doneWriting = true;
        //
    }
    static getInstance() {
        if (!ProgressManager.instance) {
            ProgressManager.instance = new ProgressManager();
        }
        return ProgressManager.instance;
    }
    reportProgress(progress, increment) {
        if (this.doneWriting) {
            return;
        }
        if (increment < 80) {
            increment += 10;
        }
        else if (increment < 90) {
            increment += 1;
        }
        increment = Math.min(90, increment);
        setTimeout(() => {
            progress.report({ increment });
            this.reportProgress(progress, increment);
        }, 450);
    }
}
exports.ProgressManager = ProgressManager;
//# sourceMappingURL=ProgressManager.js.map