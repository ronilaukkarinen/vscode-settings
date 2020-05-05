"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const util_1 = require("../util");
async function testSignature(docUri, position, signature) {
    await util_1.showFile(docUri);
    const result = await vscode.commands.executeCommand('vscode.executeSignatureHelpProvider', docUri, position);
    assert.equal(result.activeParameter, signature.activeParameter, 'activeParameter');
    assert.equal(result.activeSignature, signature.activeSignature, 'activeSignature');
    assert.equal(result.signatures.length, signature.signatures.length, `Count of signatures: ${signature.signatures.length} expected; ${result.signatures.length} actual`);
    signature.signatures.forEach((expectedSignature, i) => {
        const actualSignature = result.signatures[i];
        assert.equal(actualSignature.label, expectedSignature.label);
        assert.equal(actualSignature.parameters.length, expectedSignature.parameters.length, `Count of parameters for {expectedSignature.label}: ${expectedSignature.parameters.length} expected; ${actualSignature.parameters.length} actual`);
    });
}
exports.testSignature = testSignature;
//# sourceMappingURL=helper.js.map