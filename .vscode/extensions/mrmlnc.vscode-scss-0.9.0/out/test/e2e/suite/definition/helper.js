"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const util_1 = require("../util");
async function testDefinition(docUri, position, expectedLocation) {
    await util_1.showFile(docUri);
    const result = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', docUri, position));
    assert.ok(result[0].range.isEqual(expectedLocation.range));
    assert.equal(result[0].uri.fsPath, expectedLocation.uri.fsPath);
}
exports.testDefinition = testDefinition;
//# sourceMappingURL=helper.js.map