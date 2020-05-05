"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const helper_1 = require("./helper");
describe('SCSS Definition Test', () => {
    const docUri = util_1.getDocUri('definition/main.scss');
    const vueDocUri = util_1.getDocUri('definition/AppButton.vue');
    before(async () => {
        await util_1.showFile(docUri);
        await util_1.showFile(vueDocUri);
        await util_1.sleep(2000);
    });
    it('should find definition for variables', async () => {
        const expectedDocumentUri = util_1.getDocUri('_variables.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 10);
        await helper_1.testDefinition(docUri, util_1.position(2, 13), expectedLocation);
    });
    it('should find definition for functions', async () => {
        const expectedDocumentUri = util_1.getDocUri('_functions.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 9);
        await helper_1.testDefinition(docUri, util_1.position(2, 24), expectedLocation);
    });
    it('should find definition for mixins', async () => {
        const expectedDocumentUri = util_1.getDocUri('_mixins.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 6);
        await helper_1.testDefinition(docUri, util_1.position(4, 12), expectedLocation);
    });
    it('should find definition for variables on vue file', async () => {
        const expectedDocumentUri = util_1.getDocUri('_variables.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 10);
        await helper_1.testDefinition(vueDocUri, util_1.position(13, 13), expectedLocation);
    });
    it('should find definition for functions on vue file', async () => {
        const expectedDocumentUri = util_1.getDocUri('_functions.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 9);
        await helper_1.testDefinition(vueDocUri, util_1.position(13, 24), expectedLocation);
    });
    it('should find definition for mixins on vue file', async () => {
        const expectedDocumentUri = util_1.getDocUri('_mixins.scss');
        const expectedLocation = util_1.sameLineLocation(expectedDocumentUri, 1, 1, 6);
        await helper_1.testDefinition(vueDocUri, util_1.position(15, 12), expectedLocation);
    });
});
//# sourceMappingURL=definitions.test.js.map