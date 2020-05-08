/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.md in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const path_resolver_base_1 = require("./path-resolver-base");
class GlobalPhpcsPathResolver extends path_resolver_base_1.PhpcsPathResolverBase {
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            let resolvedPath = null;
            let pathSeparator = /^win/.test(process.platform) ? ";" : ":";
            let globalPaths = process.env.PATH.split(pathSeparator);
            globalPaths.some((globalPath) => {
                let testPath = path.join(globalPath, this.phpcsExecutableFile);
                if (fs.existsSync(testPath)) {
                    resolvedPath = testPath;
                    return true;
                }
                return false;
            });
            return resolvedPath;
        });
    }
}
exports.GlobalPhpcsPathResolver = GlobalPhpcsPathResolver;
//# sourceMappingURL=global-path-resolver.js.map