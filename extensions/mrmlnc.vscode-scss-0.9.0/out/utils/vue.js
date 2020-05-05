"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
function isVueFile(path) {
    return path.endsWith('.vue');
}
exports.isVueFile = isVueFile;
function getVueSCSSRegions(content) {
    const regions = [];
    const startRe = /<style[\w=\"\' \n\t]{1,}lang=[\"\']scss[\"\'][\w=\"\' \n\t]{0,}>/g;
    const endRe = /<\/style>/g;
    /* tslint:disable:no-conditional-assignment */
    let start;
    let end;
    while ((start = startRe.exec(content)) !== null && (end = endRe.exec(content)) !== null) {
        regions.push([start.index + start[0].length, end.index]);
    }
    return regions;
}
exports.getVueSCSSRegions = getVueSCSSRegions;
function getVueSCSSContent(content, regions = getVueSCSSRegions(content)) {
    const oldContent = content;
    let newContent = oldContent
        .split('\n')
        .map(line => ' '.repeat(line.length))
        .join('\n');
    for (const r of regions) {
        newContent = newContent.slice(0, r[0]) + oldContent.slice(r[0], r[1]) + newContent.slice(r[1]);
    }
    return newContent;
}
exports.getVueSCSSContent = getVueSCSSContent;
function convertVueTextDocument(document, regions) {
    return vscode_languageserver_1.TextDocument.create(document.uri, 'scss', document.version, getVueSCSSContent(document.getText(), regions));
}
function getSCSSRegionsDocument(document, position) {
    const offset = document.offsetAt(position);
    if (!isVueFile(document.uri)) {
        return { document, offset };
    }
    const vueSCSSRegions = getVueSCSSRegions(document.getText());
    if (vueSCSSRegions.some(region => region[0] <= offset && region[1] >= offset)) {
        return { document: convertVueTextDocument(document, vueSCSSRegions), offset };
    }
    return { document: null, offset };
}
exports.getSCSSRegionsDocument = getSCSSRegionsDocument;
//# sourceMappingURL=vue.js.map