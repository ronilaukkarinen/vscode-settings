"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const color_util_1 = require("../util/color-util");
const variables_manager_1 = require("./variables-manager");
class VariableDecoration {
    constructor(variable, line) {
        /**
         * Keep track of the TextEditorDecorationType status
         *
         * @type {boolean}
         * @public
         * @memberOf ColorDecoration
         */
        this.disposed = false;
        this.hidden = false;
        this.variable = variable;
        if (this.variable.color) {
            this.generateRange(line);
        }
        else {
            this.currentRange = new vscode_1.Range(new vscode_1.Position(line, 0), new vscode_1.Position(line, 0));
        }
    }
    /**
     * The TextEditorDecorationType associated to the color
     *
     * @type {TextEditorDecorationType}
     * @memberOf ColorDecoration
     */
    get decoration() {
        this._generateDecorator();
        return this._decoration;
    }
    set decoration(deco) {
        this._decoration = deco;
    }
    get rgb() {
        return this.variable.color.rgb;
    }
    /**
     * Disposed the TextEditorDecorationType
     * (destroy the colored background)
     *
     * @public
     * @memberOf ColorDecoration
     */
    dispose() {
        try {
            this._decoration.dispose();
            this.variable.color.rgb = null;
        }
        catch (error) { }
        this.disposed = true;
    }
    hide() {
        if (this._decoration) {
            this._decoration.dispose();
        }
        this.hidden = true;
    }
    /**
     * Generate the decoration Range (start and end position in line)
     *
     * @param {number} line
     * @returns {Range}
     *
     * @memberOf ColorDecoration
     */
    generateRange(line) {
        const range = new vscode_1.Range(new vscode_1.Position(line, this.variable.color.positionInText), new vscode_1.Position(line, this.variable.color.positionInText + this.variable.color.value.length));
        this.currentRange = range;
        return range;
    }
    shouldGenerateDecoration() {
        let color = variables_manager_1.default.findVariable(this.variable);
        if (this.disposed === true || color === null) {
            return false;
        }
        return (this._decoration === null || this._decoration === undefined || this.hidden);
    }
    _generateDecorator() {
        let color = variables_manager_1.default.findVariable(this.variable);
        if (color && this.variable.color !== color) {
            this.variable.color = color;
        }
        if (this.variable.color && this.variable.color.rgb) {
            let backgroundDecorationType = vscode_1.window.createTextEditorDecorationType({
                // borderWidth: '1px',
                borderWidth: '0 0 2px 0',
                borderStyle: 'solid',
                borderColor: this.variable.color.toRgbString(),
                // backgroundColor: this.variable.color.toRgbString(),
                // color: color_util_1.generateOptimalTextColor(this.variable.color),
                rangeBehavior: vscode_1.DecorationRangeBehavior.ClosedClosed
            });
            this._decoration = backgroundDecorationType;
        }
    }
}
exports.default = VariableDecoration;
//# sourceMappingURL=variable-decoration.js.map