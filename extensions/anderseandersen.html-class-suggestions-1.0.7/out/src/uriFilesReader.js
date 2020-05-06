"use strict";
var fs_1 = require("fs");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (urisPromise, encoding) {
    return Promise.resolve(urisPromise).then(function (uris) {
        return Promise.all(uris.map(function (uri) { return new Promise(function (resolve, reject) {
            fs_1.readFile(uri.fsPath, encoding, function (err, data) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data.toString());
                }
            });
        }); }));
    });
};
//# sourceMappingURL=uriFilesReader.js.map