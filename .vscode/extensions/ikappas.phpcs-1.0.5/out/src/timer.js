/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    /**
     * Class constructor.
     * @param tick The function to execute on set interval.
     */
    constructor(tick) {
        /**
         * Frequency of elapse event of the timer in millisecond
         */
        this.interval = 1000;
        /**
         * A boolean flag indicating whether the timer is enabled.
         */
        this.enable = false;
        this.tick = tick;
    }
    /**
     * Start the timer.
     */
    start() {
        this.enable = true;
        if (this.enable) {
            this.handle = setInterval(this.tick, this.interval);
        }
    }
    /**
     * Stop the timer.
     */
    stop() {
        this.enable = false;
        if (this.handle) {
            clearInterval(this.handle);
        }
    }
    /**
     * Dispose the timer.
     */
    dispose() {
        if (this.handle) {
            clearInterval(this.handle);
        }
    }
}
exports.Timer = Timer;
//# sourceMappingURL=timer.js.map