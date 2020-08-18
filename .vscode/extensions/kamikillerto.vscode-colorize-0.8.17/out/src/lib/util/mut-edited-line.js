"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
// Split the TextDocumentContentChangeEvent into multiple line if the added text contain multiple lines
// example :
//  let editedLine = [{
//  rangeLength: 0,
//  text: 'a\nb\nc\n',
//  range: {start:{line:1}, end:{line:1}}
// }]
// became
//  let editedLine = [{
//  rangeLength: 0,
//  text: 'a',
//  range: {start:{line:1,/*...*/}, end:{line:1,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: 'b',
//  range: {start:{line:2,/*...*/}, end:{line:2,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: 'c',
//  range: {start:{line:3,/*...*/}, end:{line:3,/*...*/}}
// }, {
//  rangeLength: 0,
//  text: '',
//  range: {start:{line:4,/*...*/}, end:{line:4,/*...*/}}
// }]
//
function mutEditedLIne(editedLine) {
    let newEditedLine = [];
    let startLine = 0;
    let before = 0;
    editedLine.reverse();
    editedLine.forEach(line => {
        let a = line.text.match(/\n/g);
        startLine = line.range.start.line + before;
        line.text.split(/\n/).map((text, i, array) => {
            if (i === 0 && text === '' && array.length === 1) {
                startLine++;
            }
            else {
                newEditedLine.push(generateTextDocumentContentChange(startLine++, text));
            }
            before++;
        });
        before--;
    });
    return newEditedLine;
}
exports.mutEditedLIne = mutEditedLIne;
// Generate a TextDocumentContentChangeEvent like object for one line
function generateTextDocumentContentChange(line, text) {
    return {
        rangeLength: 0,
        rangeOffset: 0,
        text: text,
        range: new vscode_1.Range(new vscode_1.Position(line, 0), new vscode_1.Position(line, text.length))
    };
}
//# sourceMappingURL=mut-edited-line.js.map