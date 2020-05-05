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
const path_resolver_base_1 = require("./path-resolver-base");
const composer_path_resolver_1 = require("./composer-path-resolver");
const global_path_resolver_1 = require("./global-path-resolver");
class PhpcsPathResolver extends path_resolver_base_1.PhpcsPathResolverBase {
    constructor(options) {
        super();
        this.resolvers = [];
        if (options.workspaceRoot !== null) {
            this.resolvers.push(new composer_path_resolver_1.ComposerPhpcsPathResolver(options.workspaceRoot, options.composerJsonPath));
        }
        this.resolvers.push(new global_path_resolver_1.GlobalPhpcsPathResolver());
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            let resolvedPath = null;
            for (var i = 0, len = this.resolvers.length; i < len; i++) {
                let resolverPath = yield this.resolvers[i].resolve();
                if (resolvedPath !== resolverPath) {
                    resolvedPath = resolverPath;
                    break;
                }
            }
            if (resolvedPath === null) {
                throw new Error('Unable to locate phpcs. Please add phpcs to your global path or use composer dependency manager to install it in your project locally.');
            }
            return resolvedPath;
        });
    }
}
exports.PhpcsPathResolver = PhpcsPathResolver;
//# sourceMappingURL=path-resolver.js.map