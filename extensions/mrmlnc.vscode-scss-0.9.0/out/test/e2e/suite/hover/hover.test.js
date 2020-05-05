"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const helper_1 = require("./helper");
describe('SCSS Hover Test', () => {
    const docUri = util_1.getDocUri('hover/main.scss');
    const vueDocUri = util_1.getDocUri('hover/AppButton.vue');
    before(async () => {
        await util_1.showFile(docUri);
        await util_1.showFile(vueDocUri);
        await util_1.sleep(2000);
    });
    it('shows hover for variables', async () => {
        await helper_1.testHover(docUri, util_1.position(2, 13), {
            contents: ['\n```scss\n$variable: \'value\';\n@import "../_variables.scss" (implicitly)\n```\n']
        });
    });
    it('shows hover for functions', async () => {
        await helper_1.testHover(docUri, util_1.position(2, 24), {
            contents: ['\n```scss\n@function function() {…}\n@import "../_functions.scss" (implicitly)\n```\n']
        });
    });
    it('shows hover for mixins', async () => {
        await helper_1.testHover(docUri, util_1.position(4, 12), {
            contents: ['\n```scss\n@mixin mixin() {…}\n@import "../_mixins.scss" (implicitly)\n```\n']
        });
    });
    it('shows hover for variables on vue file', async () => {
        await helper_1.testHover(vueDocUri, util_1.position(13, 13), {
            contents: [
                'Determines which page\\-based occurrence of a given element is applied to a counter or string value\\.',
                '\n```scss\n$variable: \'value\';\n@import "../_variables.scss" (implicitly)\n```\n'
            ]
        });
    });
    it('shows hover for functions on vue file', async () => {
        await helper_1.testHover(vueDocUri, util_1.position(13, 24), {
            contents: [
                'Determines which page\\-based occurrence of a given element is applied to a counter or string value\\.',
                '\n```scss\n@function function() {…}\n@import "../_functions.scss" (implicitly)\n```\n'
            ]
        });
    });
    it('shows hover for mixins on vue file', async () => {
        await helper_1.testHover(vueDocUri, util_1.position(15, 12), {
            contents: ['\n```scss\n@mixin mixin() {…}\n@import "../_mixins.scss" (implicitly)\n```\n']
        });
    });
});
//# sourceMappingURL=hover.test.js.map