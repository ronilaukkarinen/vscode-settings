"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EditorManager {
    /**
     * Run through a list of decorations to generate editor's decorations
     *
     * @static
     * @param {TextEditor} editor
     * @param {Map<number, IDecoration[]>} decorations
     * @param {number[]} skipLines
     * @returns
     * @memberof EditorManager
     */
    static decorate(editor, decorations, skipLines) {
        let it = decorations.entries();
        let tmp = it.next();
        while (!tmp.done) {
            const line = tmp.value[0];
            const deco = tmp.value[1];
            if (skipLines.indexOf(line) === -1) {
                this.decorateOneLine(editor, deco, line);
            }
            tmp = it.next();
        }
        return;
    }
    // Decorate editor's decorations for one line
    /**
     * Generate decorations in one line for the selected editor
     *
     * @static
     * @param {TextEditor} editor
     * @param {IDecoration[]} decorations
     * @param {number} line
     * @memberof EditorManager
     */
    static decorateOneLine(editor, decorations, line) {
        decorations.forEach((decoration) => {
            if (decoration.shouldGenerateDecoration() === true) {
                editor.setDecorations(decoration.decoration, [decoration.generateRange(line)]);
            }
        });
    }
}
exports.default = EditorManager;
//# sourceMappingURL=editor-manager.js.map