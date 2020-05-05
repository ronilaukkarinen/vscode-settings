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
class ComposerPhpcsPathResolver extends path_resolver_base_1.PhpcsPathResolverBase {
    /**
     * Class constructor.
     *
     * @param workspaceRoot The workspace path.
     * @param composerJsonPath The path to composer.json.
     */
    constructor(workspaceRoot, workingPath) {
        super();
        this._workspaceRoot = workspaceRoot;
        this._workingPath = path.isAbsolute(workingPath)
            ? workingPath
            : path.join(workspaceRoot, workingPath).replace(/composer.json$/, '');
    }
    get workspaceRoot() {
        return this._workspaceRoot;
    }
    get workingPath() {
        return this._workingPath;
    }
    get composerJsonPath() {
        if (!this._composerJsonPath) {
            this._composerJsonPath = fs.realpathSync(path.join(this.workingPath, 'composer.json'));
        }
        return this._composerJsonPath;
    }
    get composerLockPath() {
        if (!this._composerLockPath) {
            this._composerLockPath = fs.realpathSync(path.join(this.workingPath, 'composer.lock'));
        }
        return this._composerLockPath;
    }
    /**
     * Determine whether composer.json exists at the root path.
     */
    hasComposerJson() {
        try {
            return fs.existsSync(this.composerJsonPath);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Determine whether composer.lock exists at the root path.
     */
    hasComposerLock() {
        try {
            return fs.existsSync(this.composerLockPath);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Determine whether phpcs is set as a composer dependency.
     */
    hasComposerDependency() {
        // Safely load composer.lock
        let dependencies = null;
        try {
            dependencies = JSON.parse(fs.readFileSync(this.composerLockPath, "utf8"));
        }
        catch (error) {
            dependencies = {};
        }
        // Determine phpcs dependency.
        let search = [];
        if (dependencies["packages-dev"]) {
            search.push(dependencies["packages-dev"]);
        }
        if (dependencies["packages"]) {
            search.push(dependencies["packages"]);
        }
        return search.some(pkgs => {
            let match = pkgs.filter((pkg) => {
                return pkg.name === "squizlabs/php_codesniffer";
            });
            return match.length !== 0;
        });
    }
    /**
     * Get the composer vendor path.
     */
    getVendorPath() {
        let basePath = path.dirname(this.composerJsonPath);
        let vendorPath = path.join(basePath, "vendor", "bin", this.phpcsExecutableFile);
        // Safely load composer.json
        let config = null;
        try {
            config = JSON.parse(fs.readFileSync(this.composerJsonPath, "utf8"));
        }
        catch (error) {
            config = {};
        }
        // Check vendor-bin configuration
        if (config["config"] && config["config"]["vendor-dir"]) {
            vendorPath = path.join(basePath, config["config"]["vendor-dir"], "bin", this.phpcsExecutableFile);
        }
        // Check bin-bin configuration
        if (config["config"] && config["config"]["bin-dir"]) {
            vendorPath = path.join(basePath, config["config"]["bin-dir"], this.phpcsExecutableFile);
        }
        return vendorPath;
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            let resolvedPath = null;
            if (this.workspaceRoot) {
                // Determine whether composer.json and composer.lock exist and phpcs is defined as a dependency.
                if (this.hasComposerJson() && this.hasComposerLock() && this.hasComposerDependency()) {
                    let vendorPath = this.getVendorPath();
                    if (fs.existsSync(vendorPath)) {
                        resolvedPath = vendorPath;
                    }
                    else {
                        let relativeVendorPath = path.relative(this.workspaceRoot, vendorPath);
                        throw new Error(`Composer phpcs dependency is configured but was not found under ${relativeVendorPath}. You may need to run "composer install" or set your phpcs.executablePath manually.`);
                    }
                }
            }
            return resolvedPath;
        });
    }
}
exports.ComposerPhpcsPathResolver = ComposerPhpcsPathResolver;
//# sourceMappingURL=composer-path-resolver.js.map