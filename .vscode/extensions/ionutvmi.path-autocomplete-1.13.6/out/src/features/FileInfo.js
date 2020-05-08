"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
class FileInfo {
    /**
     * Extracts the needed information about the provider file path.
     *
     * @throws Error if the path is invalid or you don't have permissions to it
     */
    constructor(itemPath) {
        this.itemPath = itemPath;
        this.type = fs.statSync(itemPath).isDirectory() ? 'dir' : 'file';
        this.name = path.basename(itemPath);
    }
    isDirectory() {
        return this.type == 'dir';
    }
    getPath() {
        return this.itemPath;
    }
    getName() {
        return this.name;
    }
}
exports.FileInfo = FileInfo;
//# sourceMappingURL=FileInfo.js.map