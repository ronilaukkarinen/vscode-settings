"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const vscode_1 = require("vscode");
const path = require("path");
const template = require("lodash.template");
class ProfileProvider {
    constructor(context, api) {
        this.context = context;
        this.api = api;
    }
    provideTextDocumentContent(uri, token) {
        if (token.isCancellationRequested)
            return;
        const LEVEL_FACTOR = 0.025;
        function getLevel(xp) {
            return Math.floor(Math.sqrt(xp) * LEVEL_FACTOR);
        }
        function getNextLevelXp(level) {
            return Math.pow(Math.ceil((level + 1) / LEVEL_FACTOR), 2);
        }
        function getLevelProgress(xp, new_xp) {
            let level = getLevel(xp);
            let curLevelXp = getNextLevelXp(level - 1);
            let nextLevelXp = getNextLevelXp(level);
            let haveXp = xp - curLevelXp;
            let needXp = nextLevelXp - curLevelXp;
            let xpP = Math.round(haveXp * 100.0 / needXp);
            let nxpP = Math.round(new_xp * 100.0 / needXp);
            return [xpP, nxpP];
        }
        function getSortedArray(obj) {
            let items = [];
            for (let prop in obj) {
                let item = obj[prop];
                let percents = getLevelProgress(item.xps, item.new_xps);
                items.push({
                    name: prop,
                    level: getLevel(item.xps),
                    xp: item.xps,
                    new_xp: item.new_xps,
                    progress: percents[0],
                    new_progress: percents[1]
                });
            }
            return items.sort((a, b) => { return b.xp - a.xp; });
        }
        return this.api.getProfile().then(profile => {
            if (profile === null) {
                return `<h1>Can't fetch profile. Please try again later</h1> Make sure <strong>codestats.username</strong> setting is set to correct user name.`;
            }
            let htmlTemplate = fs.readFileSync(this.context.asAbsolutePath("assets/profile.html.eex"));
            profile["level"] = getLevel(profile["total_xp"]);
            let percents = getLevelProgress(profile["total_xp"], profile["new_xp"]);
            profile["progress"] = percents[0];
            profile["new_progress"] = percents[1];
            let languages = getSortedArray(profile["languages"]);
            let machines = getSortedArray(profile["machines"]);
            let html = template(htmlTemplate);
            const stylePath = vscode_1.Uri.file(path.join(this.context.extensionPath, 'assets', 'profile.css'));
            const styleSrc = stylePath.with({ scheme: 'vscode-resource' });
            return html({ profile: profile, languages: languages, machines: machines, style: styleSrc });
        });
    }
}
exports.ProfileProvider = ProfileProvider;
//# sourceMappingURL=profile-provider.js.map