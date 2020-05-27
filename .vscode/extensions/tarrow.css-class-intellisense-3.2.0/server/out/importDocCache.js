"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportDocCache = void 0;
const nodeURL = require("url");
function getImportDocCache(maxEntries, cleanupIntervalTimeInSec, openDoc) {
    let importDocs = {};
    let nDocs = 0;
    let cleanupInterval = undefined;
    if (cleanupIntervalTimeInSec > 0) {
        cleanupInterval = setInterval(() => {
            const cutoffTime = Date.now() - cleanupIntervalTimeInSec * 1000;
            const uris = Object.keys(importDocs);
            for (const uri of uris) {
                const importDocInfo = importDocs[uri];
                if (importDocInfo.cTime < cutoffTime) {
                    delete importDocs[uri];
                    nDocs--;
                }
            }
        }, cleanupIntervalTimeInSec * 1000);
    }
    return {
        get(uri) {
            const importDocInfo = importDocs[uri];
            if (importDocInfo) {
                importDocInfo.cTime = Date.now();
                return importDocInfo.importDoc;
            }
            importDocs[uri] = {
                cTime: Date.now(),
            };
            openDoc(uri).then((importDoc) => {
                if (!importDoc) {
                    delete importDocs[uri];
                    return;
                }
                importDocs[uri] = {
                    cTime: Date.now(),
                    importDoc: { doc: importDoc, info: uri },
                };
                nDocs++;
                if (nDocs === maxEntries) {
                    let oldestTime = Number.MAX_VALUE;
                    let oldestUri = null;
                    for (const uri in importDocs) {
                        const importDocInfo = importDocs[uri];
                        if (importDocInfo.cTime < oldestTime) {
                            oldestUri = uri;
                            oldestTime = importDocInfo.cTime;
                        }
                    }
                    if (oldestUri) {
                        delete importDocs[oldestUri];
                        nDocs--;
                    }
                }
            });
        },
        onChangeCSSDoc(doc) {
            const uri = nodeURL.fileURLToPath(doc.uri);
            if (importDocs[uri] && importDocs[uri].importDoc) {
                importDocs[uri].importDoc.doc = doc;
            }
        },
        dispose() {
            if (typeof cleanupInterval !== "undefined") {
                clearInterval(cleanupInterval);
                cleanupInterval = undefined;
                importDocs = {};
                nDocs = 0;
            }
        },
    };
}
exports.getImportDocCache = getImportDocCache;
//# sourceMappingURL=importDocCache.js.map