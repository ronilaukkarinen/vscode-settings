'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const folderArrows_1 = require("./folderArrows");
// Toggle the arrows near the folder icons
const hidesExplorerArrowsCommand = vscode.commands.registerCommand('city-lights-icons-vsc.hidesExplorerArrows', () => {
    folderArrows_1.toggleFolderArrows();
});
exports.commands = [
    hidesExplorerArrowsCommand
];
//# sourceMappingURL=index.js.map