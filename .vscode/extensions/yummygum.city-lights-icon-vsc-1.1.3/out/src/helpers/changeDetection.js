"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const objects_1 = require("./objects");
const changeOptions_1 = require("./changeOptions");
/** Compare the workspace and the user configuration with the current setup of the icons */
exports.detectConfigChanges = () => {
    const configs = Object.keys(_1.getExtensionConfiguration())
        .map(c => c.split('.').slice(1).join('.'));
    return compareConfigs(configs).then(changes => {
        // if there's nothing to update
        if (Object.keys(changes.updatedConfigs).length === 0)
            return;
        return changeOptions_1.changeOptions(changes.updatedConfigs, changes.updatedJSONConfig).then(() => {
            _1.promptToReload();
        }).catch(err => console.error(err));
    });
};
/**
 * Compares a specific configuration in the settings with a current configuration state.
 * The current configuration state is read from the icons json file.
 * @param configs List of configuration names
 * @returns List of configurations that needs to be updated.
 */
const compareConfigs = (configs) => {
    return _1.getCityLightsIconJSON().then(json => {
        return configs.reduce((result, configName, i) => {
            // no further actions (e.g. reload) required
            if (/show(Welcome|Update|Reload)Message/g.test(configName))
                return result;
            const configValue = _1.getThemeConfig(configName).globalValue;
            const currentState = objects_1.getObjectPropertyValue(json.options, configName);
            if (configValue !== undefined && JSON.stringify(configValue) !== JSON.stringify(currentState)) {
                objects_1.setObjectPropertyValue(json.options, configName, configValue);
                objects_1.setObjectPropertyValue(result.updatedConfigs, configName, configValue);
            }
            return result;
        }, { updatedConfigs: {}, updatedJSONConfig: json.options });
    });
};
//# sourceMappingURL=changeDetection.js.map