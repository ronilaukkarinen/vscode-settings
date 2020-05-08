"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const util_1 = require("../util");
async function testCompletion(docUri, position, expectedItems) {
    await util_1.showFile(docUri);
    const result = (await vscode.commands.executeCommand('vscode.executeCompletionItemProvider', docUri, position));
    expectedItems.forEach(ei => {
        if (typeof ei === 'string') {
            assert.ok(result.items.some(i => {
                return i.label === ei;
            }));
        }
        else {
            const match = result.items.find(i => i.label === ei.label);
            if (!match) {
                assert.fail(`Can't find matching item for ${JSON.stringify(ei, null, 2)}`);
                return;
            }
            assert.equal(match.label, ei.label);
            if (ei.kind) {
                assert.equal(match.kind, ei.kind);
            }
            if (ei.detail) {
                assert.equal(match.detail, ei.detail);
            }
            if (ei.documentation) {
                if (typeof match.documentation === 'string') {
                    assert.equal(match.documentation, ei.documentation);
                }
                else {
                    if (ei.documentation && ei.documentation.value && match.documentation) {
                        assert.equal(match.documentation.value, ei.documentation.value);
                    }
                }
            }
        }
    });
}
exports.testCompletion = testCompletion;
//# sourceMappingURL=helper.js.map