"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const helper_1 = require("./helper");
describe('SCSS Signature Help Test', () => {
    const docUri = util_1.getDocUri('signature/main.scss');
    const vueDocUri = util_1.getDocUri('signature/AppButton.vue');
    before(async () => {
        await util_1.showFile(docUri);
        await util_1.showFile(vueDocUri);
        await util_1.sleep(2000);
    });
    describe('Mixin', () => {
        it('should suggest all parameters of mixin', async () => {
            await helper_1.testSignature(docUri, util_1.position(2, 19), {
                activeParameter: 0,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'square ($size: null, $radius: 0)',
                        parameters: [{ label: '$size' }, { label: '$radius' }]
                    }
                ]
            });
        });
        it('should suggest the second parameter of mixin', async () => {
            await helper_1.testSignature(docUri, util_1.position(3, 21), {
                activeParameter: 1,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'square ($size: null, $radius: 0)',
                        parameters: [{ label: '$size' }, { label: '$radius' }]
                    }
                ]
            });
        });
        it('should suggest all parameters of mixin on vue file', async () => {
            await helper_1.testSignature(vueDocUri, util_1.position(13, 19), {
                activeParameter: 0,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'square ($size: null, $radius: 0)',
                        parameters: [{ label: '$size' }, { label: '$radius' }]
                    }
                ]
            });
        });
        it('should suggest the second parameter of mixin on vue file', async () => {
            await helper_1.testSignature(vueDocUri, util_1.position(14, 21), {
                activeParameter: 1,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'square ($size: null, $radius: 0)',
                        parameters: [{ label: '$size' }, { label: '$radius' }]
                    }
                ]
            });
        });
    });
    describe('Function', () => {
        it('should suggest all parameters of function', async () => {
            await helper_1.testSignature(docUri, util_1.position(5, 16), {
                activeParameter: 0,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'pow ($base: null, $exponent: null)',
                        parameters: [{ label: '$base' }, { label: '$exponent' }]
                    }
                ]
            });
        });
        it('should suggest the second parameter of function', async () => {
            await helper_1.testSignature(docUri, util_1.position(5, 26), {
                activeParameter: 1,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'pow ($base: null, $exponent: null)',
                        parameters: [{ label: '$base' }, { label: '$exponent' }]
                    }
                ]
            });
        });
        it('should suggest all parameters of function on vue file', async () => {
            await helper_1.testSignature(vueDocUri, util_1.position(16, 16), {
                activeParameter: 0,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'pow ($base: null, $exponent: null)',
                        parameters: [{ label: '$base' }, { label: '$exponent' }]
                    }
                ]
            });
        });
        it('should suggest the second parameter of function on vue file', async () => {
            await helper_1.testSignature(vueDocUri, util_1.position(16, 26), {
                activeParameter: 1,
                activeSignature: 0,
                signatures: [
                    {
                        label: 'pow ($base: null, $exponent: null)',
                        parameters: [{ label: '$base' }, { label: '$exponent' }]
                    }
                ]
            });
        });
    });
});
//# sourceMappingURL=signature.test.js.map