'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const os = require("os");
const extend = require("extend");
function prepare(rootDirectory, settings) {
    let config = {};
    if (settings.config) {
        if (typeof settings.config !== 'string') {
            config = settings.config;
        }
        else {
            const configPath = settings.config;
            let filepath = configPath;
            // Expand HOME directory within filepath
            if (configPath.startsWith('~')) {
                const home = os.homedir();
                filepath = configPath.replace(/^~($|\/|\\)/, `${home}$1`);
            }
            // Expand relative path within filepath
            if (rootDirectory && (configPath.startsWith('./') || configPath.startsWith('../'))) {
                filepath = path.resolve(rootDirectory, configPath);
            }
            config.configFile = filepath;
        }
    }
    if (settings.configBasedir) {
        config.configBasedir = settings.configBasedir;
    }
    // Override stylfmt rules by stylelint rules
    if (settings.useStylelintConfigOverrides && settings.configOverrides) {
        config.rules = extend(true, {}, config.rules, settings.configOverrides);
    }
    return config;
}
exports.prepare = prepare;
