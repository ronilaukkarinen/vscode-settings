"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode = require("vscode");
const vscode_languageserver_1 = require("vscode-languageserver");
const findSelector_1 = require("./../../server/src/core/findSelector");
const logger_1 = require("./../../server/src/logger");
describe("Extension Tests", () => {
    let document;
    let document2;
    before(done => {
        console.log('before');
        logger_1.create(console);
        vscode.workspace.openTextDocument(`${vscode.workspace.rootPath}/example.html`)
            .then(doc => {
            document = doc;
            document2 = vscode_languageserver_1.TextDocument.create(doc.uri.toString(), doc.languageId, doc.version, doc.getText());
            done();
        }, error => {
            done(error);
        });
    });
    // Defines a Mocha unit test
    describe("findSelector", () => {
        const classTestPos = new vscode.Position(4, 19);
        const idTestIDPos = new vscode.Position(4, 38);
        const classTest2Pos = new vscode.Position(7, 19);
        // const idCommonPos: vscode.Position = new vscode.Position(4, 43);
        // const invalidPos: vscode.Position = new vscode.Position(1000, 19);
        const notAnAttributePos = new vscode.Position(4, 30);
        const notAnAttributePos2 = new vscode.Position(4, 53);
        it("can find the right id selector in a simple 'testID' case", () => {
            assert.ok(document);
            const selector = findSelector_1.default(document2, idTestIDPos);
            assert.equal(selector.attribute, "id");
            assert.equal(selector.value, "testID");
        });
        it("can find the right class selector in a simple 'test' case", () => {
            assert.ok(document);
            const selector = findSelector_1.default(document2, classTestPos);
            assert.equal(selector.attribute, "class");
            assert.equal(selector.value, "test");
        });
        it("can find the right class selector after an HTML comment", () => {
            assert.ok(document);
            const selector = findSelector_1.default(document2, classTest2Pos);
            assert.equal(selector.attribute, "id");
            assert.equal(selector.value, "test-2");
        });
        //TODO: Add test case for HTML tags
        it("throws an error for an invalid position", () => {
            assert.ok(document);
            let selector = findSelector_1.default(document2, notAnAttributePos);
            assert.equal(selector, null);
            selector = findSelector_1.default(document2, notAnAttributePos2);
            assert.equal(selector, null);
        });
    });
    //TODO: Add tests to actually query the definition from the document and ensure definitions are found
});
//# sourceMappingURL=extension.test.js.map