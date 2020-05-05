"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const util_1 = require("../util");
async function testHover(docUri, position, expectedHover) {
    await util_1.showFile(docUri);
    const result = (await vscode.commands.executeCommand('vscode.executeHoverProvider', docUri, position));
    if (!result[0]) {
        throw Error('Hover failed');
    }
    const contents = result[0].contents;
    contents.forEach((c, i) => {
        const val = c.value;
        assert.equal(val, expectedHover.contents[i]);
    });
    if (expectedHover.range && result[0] && result[0].range) {
        assert.ok(result[0].range.isEqual(expectedHover.range));
    }
}
exports.testHover = testHover;
//# sourceMappingURL=helper.js.map