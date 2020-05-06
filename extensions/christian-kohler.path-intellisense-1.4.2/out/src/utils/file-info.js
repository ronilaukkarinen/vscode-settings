"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var FileInfo = (function () {
    function FileInfo(path, file) {
        this.file = file;
        this.isFile = fs_1.statSync(path_1.join(path, file)).isFile();
    }
    return FileInfo;
}());
exports.FileInfo = FileInfo;
//# sourceMappingURL=file-info.js.map