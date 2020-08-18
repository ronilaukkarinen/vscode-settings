"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("../colors/color");
const path_1 = require("path");
class VariablesStore {
    constructor() {
        this.entries = new Map();
    }
    has(variable = null, fileName = null, line = null) {
        const declarations = this.get(variable, fileName, line);
        return declarations && declarations.length > 0;
    }
    get(variable, fileName = null, line = null) {
        let decorations = this.entries.get(variable) || [];
        if (fileName !== null) {
            decorations = decorations.filter(_ => _.location.fileName === fileName);
        }
        if (line !== null) {
            decorations = decorations.filter(_ => _.location.line === line);
        }
        return decorations;
    }
    __delete(variable, fileName, line) {
        let decorations = this.get(variable);
        if (line !== null) {
            decorations = decorations.filter(_ => _.location.fileName !== fileName || (_.location.fileName === fileName && _.location.line !== line));
        }
        else if (fileName !== null) {
            decorations = decorations.filter(_ => _.location.fileName !== fileName);
        }
        this.entries.set(variable, decorations);
        return;
    }
    delete(variable = null, fileName = null, line = null) {
        if (variable !== null) {
            return this.__delete(variable, fileName, line);
        }
        const IT = this.entries.entries();
        let tmp = IT.next();
        while (tmp.done === false) {
            const varName = tmp.value[0];
            this.__delete(varName, fileName, line);
            tmp = IT.next();
        }
    }
    // not sure it should be here ><
    getColor(match, fileName, line) {
        let color = null;
        let varName = match[1] || match[2];
        let variables = [].concat(this.get(varName, fileName, line));
        if (variables.length === 0) {
            variables = [].concat(this.get(varName));
        }
        if (variables.length !== 0) {
            color = new color_1.default(varName, match.index, variables.pop().color.rgb);
        }
        return color;
    }
    addEntry(key, value) {
        const _value = Array.isArray(value) ? value : [value];
        if (this.entries.has(key)) {
            const decorations = this.entries.get(key);
            this.entries.set(key, decorations.concat(_value));
        }
        else {
            this.entries.set(key, _value);
        }
    }
    // public addEntries(entries: ExtractedDeclarationPlus[]) {
    //   entries.forEach(({
    //     varName,
    //     color,
    //     content,
    //     fileName,
    //     line
    //   }) => {
    //     const entry = this.get(varName, fileName, line);
    //     // color = color || this.getColor(content, fileName, line);
    //     if (entry.length !== 0) {
    //       entry[0].update(<Color>color);
    //     } else {
    //       const variable = new Variable(varName, <Color>color, {
    //         fileName,
    //         line
    //       });
    //       this.addEntry(varName, variable);
    //     }
    //   });
    // }
    get count() {
        return this.entries.size;
    }
    // need to create a proxy (?) to always return the same variable.
    findDeclaration(variable, file, line) {
        return this.findClosestDeclaration(variable, file, line);
    }
    // need to create a proxy (?) to always return the same variable.
    findClosestDeclaration(variable, file, line) {
        let decorations = this.get(variable, file);
        if (decorations.length === 0) {
            decorations = this.get(variable);
        }
        if (decorations.length === 0) {
            this.delete(variable);
        }
        decorations = this.filterDecorations(decorations, file);
        if (line) {
            decorations = decorations.filter(decoration => decoration.location.line === line);
        }
        else {
            decorations = decorations.sort((a, b) => a.location.line - b.location.line);
        }
        const _closest = decorations[decorations.length - 1];
        let closest = decorations.pop();
        while (closest && closest.color === undefined) {
            closest = decorations.pop();
        }
        return closest || _closest;
    }
    filterDecorations(decorations, dir) {
        const folder = path_1.dirname(dir);
        const r = new RegExp(`^${encodeURI(folder)}`);
        let decorationsFound = decorations.filter((deco) => r.test(encodeURI(deco.location.fileName)));
        if (decorationsFound.length !== 0 || folder === dir) {
            return decorationsFound;
        }
        return this.filterDecorations(decorations, folder);
    }
}
exports.default = VariablesStore;
//# sourceMappingURL=variable-store.js.map