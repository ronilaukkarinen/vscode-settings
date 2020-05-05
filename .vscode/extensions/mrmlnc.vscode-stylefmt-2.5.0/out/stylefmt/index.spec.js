'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert = require("assert");
const fs = require("fs");
const rimraf = require("rimraf");
const proxyquire = require("proxyquire");
const text = fs.readFileSync('./fixtures/test.scss').toString();
function fileExist(filepath) {
    return new Promise((resolve) => {
        fs.access(filepath, (err) => resolve(!err));
    });
}
exports.fileExist = fileExist;
function removeFile(filepath) {
    return fileExist(filepath).then((exists) => {
        if (!exists) {
            return false;
        }
        return new Promise((resolve, reject) => {
            fs.unlink(filepath, (err) => err ? reject(err) : resolve());
        });
    });
}
exports.removeFile = removeFile;
function writeFile(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => err ? reject(err) : resolve());
    });
}
exports.writeFile = writeFile;
function mockupDocument() {
    return {
        uri: { fsPath: '.tmp/test.scss' },
        lineCount: text.split('\n').length,
        lineAt: (line) => ({
            lineNumber: line,
            text: text.split('\n')[line]
        }),
        getText: () => text
    };
}
class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
const stylefmt = proxyquire('./index', {
    vscode: {
        Position,
        Range,
        workspace: { rootPath: '.tmp' },
        '@noCallThru': true
    }
});
describe('Stylefmt API', () => {
    before(() => {
        rimraf.sync('./.tmp');
        fs.mkdirSync('./.tmp');
        fs.writeFileSync('./.tmp/test.scss', text);
    });
    afterEach(() => {
        rimraf.sync('./.tmp/!(test.scss)*');
    });
    after(() => {
        rimraf.sync('./.tmp');
    });
    it('should work without configuration', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const document = mockupDocument();
        const settings = {};
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('@mixin clearfix()') !== -1);
    }));
    it('should work with stylelint config as js file', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configTpl = 'module.exports={rules:{\'color-hex-case\':\'upper\'}}';
        const document = mockupDocument();
        const settings = {};
        yield writeFile('./.tmp/stylelint.config.js', configTpl);
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('#AAACCC') !== -1);
    }));
    it('should work with stylelint config as field in package.json', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configTpl = '{"stylelint":{"rules":{"color-hex-case":"upper"}}}';
        const document = mockupDocument();
        const settings = {};
        yield writeFile('./.tmp/package.json', configTpl);
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('#AAACCC') !== -1);
    }));
    it('should work with stylelint config as .stylelintrc file with JSON syntax', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configTpl = '{rules:{"color-hex-case":"upper"}}';
        const document = mockupDocument();
        const settings = {};
        yield writeFile('./.tmp/.stylelintrc', configTpl);
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('#AAACCC') !== -1);
    }));
    it('should work with stylelint config as .stylelintrc file with YAML syntax', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configTpl = 'rules:\n  color-hex-case: upper';
        const document = mockupDocument();
        const settings = {};
        yield writeFile('./.tmp/.stylelintrc', configTpl);
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('#AAACCC') !== -1);
    }));
    it('should work with config string from settings', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        const configTpl = '{rules:{"color-hex-case":"upper"}}';
        const document = mockupDocument();
        const settings = {
            config: './.my-stylelint-config.json'
        };
        yield writeFile('./.tmp/.my-stylelint-config.json', configTpl);
        const result = yield stylefmt.use(settings, document, null);
        assert.ok(result.css.search('#AAACCC') !== -1);
    }));
});
