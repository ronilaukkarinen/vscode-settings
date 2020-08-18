/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhpcsPathResolverBase {
    constructor() {
        let extension = /^win/.test(process.platform) ? ".bat" : "";
        this.phpcsExecutableFile = `phpcs${extension}`;
    }
}
exports.PhpcsPathResolverBase = PhpcsPathResolverBase;
//# sourceMappingURL=path-resolver-base.js.map