"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./util/array");
const vscode_1 = require("vscode");
function getColorizeConfig() {
    const configuration = vscode_1.workspace.getConfiguration('colorize');
    // remove duplicates (if duplicates)
    const colorizedVariables = Array.from(new Set(configuration.get('colorized_variables', []))); // [...new Set(array)] // works too
    const colorizedColors = Array.from(new Set(configuration.get('colorized_colors', []))); // [...new Set(array)] // works too
    const filesExtensions = configuration.get('files_extensions', []);
    displayFilesExtensionsDeprecationWarning(filesExtensions);
    const languages = configuration.get('languages', []);
    const inferedFilesToInclude = inferFilesToInclude(languages, filesExtensions).map(extension => `**/*${extension}`);
    const filesToIncludes = Array.from(new Set(configuration.get('include', [])));
    const filesToExcludes = Array.from(new Set(configuration.get('exclude', [])));
    const searchVariables = configuration.get('enable_search_variables', false);
    const betaCWYS = configuration.get('colorize_only_visible_beta', false);
    return {
        languages,
        filesExtensions: filesExtensions.map(ext => RegExp(`\\${ext}$`)),
        isHideCurrentLineDecorations: configuration.get('hide_current_line_decorations'),
        colorizedColors,
        colorizedVariables,
        filesToIncludes,
        filesToExcludes,
        inferedFilesToInclude,
        searchVariables,
        betaCWYS
    };
}
exports.getColorizeConfig = getColorizeConfig;
function inferFilesToInclude(languagesConfig, filesExtensionsConfig) {
    let filesExtensions = [];
    vscode_1.extensions.all.forEach(extension => {
        if (extension.packageJSON && extension.packageJSON.contributes && extension.packageJSON.contributes.languages) {
            extension.packageJSON.contributes.languages.forEach(language => {
                if (languagesConfig.indexOf(language.id) !== -1) {
                    filesExtensions = filesExtensions.concat(language.extensions);
                }
            });
        }
    });
    filesExtensions = array_1.flatten(filesExtensions); // get all languages with their files extensions ^^. Now need to filter with the one set in config
    filesExtensions = filesExtensions.concat(filesExtensionsConfig);
    return array_1.unique(filesExtensions);
}
function displayFilesExtensionsDeprecationWarning(filesExtensionsConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = vscode_1.workspace.getConfiguration('colorize');
        const ignoreWarning = config.get('ignore_files_extensions_deprecation');
        if (filesExtensionsConfig.length > 0 && ignoreWarning === false) {
            const updateSetting = 'Update setting';
            const neverShowAgain = 'Don\'t Show Again';
            const choice = yield vscode_1.window.showWarningMessage('You\'re using the `colorize.files_extensions` settings. This settings as been deprecated in favor of `colorize.include`', updateSetting, neverShowAgain);
            if (choice === updateSetting) {
                vscode_1.commands.executeCommand('workbench.action.openSettings2');
            }
            else if (choice === neverShowAgain) {
                yield config.update('ignore_files_extensions_deprecation', true, true);
            }
        }
    });
}
//# sourceMappingURL=colorize-config.js.map