"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const helper_1 = require("./helper");
describe('SCSS Completion Test', () => {
    const docUri = util_1.getDocUri('completion/main.scss');
    const vueDocUri = util_1.getDocUri('completion/AppButton.vue');
    before(async () => {
        await util_1.showFile(docUri);
        await util_1.showFile(vueDocUri);
        await util_1.sleep(2000);
    });
    it('Offers variable completions', async () => {
        await helper_1.testCompletion(docUri, util_1.position(5, 11), ['$color', '$fonts']);
    });
    it('Offers completions from tilde imports', async () => {
        await helper_1.testCompletion(docUri, util_1.position(11, 11), [{ label: '$tilde', detail: 'node_modules/foo/bar.scss' }]);
    });
    it('Offers completions from partial file', async () => {
        await helper_1.testCompletion(docUri, util_1.position(17, 11), [{ label: '$partial', detail: '_partial.scss' }]);
    });
    it('no completions on vue file outside scss regions', async () => {
        await helper_1.testCompletion(vueDocUri, util_1.position(2, 9), []);
        await helper_1.testCompletion(vueDocUri, util_1.position(6, 8), []);
    });
    it('Offers variable completions on vue file', async () => {
        await helper_1.testCompletion(vueDocUri, util_1.position(16, 11), ['$color', '$fonts']);
    });
    it('Offers completions from tilde imports on vue file', async () => {
        await helper_1.testCompletion(vueDocUri, util_1.position(22, 11), [{ label: '$tilde', detail: 'node_modules/foo/bar.scss' }]);
    });
    it('Offers completions from partial file on vue file', async () => {
        await helper_1.testCompletion(vueDocUri, util_1.position(28, 11), [{ label: '$partial', detail: '_partial.scss' }]);
    });
});
//# sourceMappingURL=completion.test.js.map