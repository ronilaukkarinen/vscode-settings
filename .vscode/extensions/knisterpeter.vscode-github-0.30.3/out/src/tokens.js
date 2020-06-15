"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function migrateToken(memento) {
    const token = memento.get('token');
    if (token) {
        const tokens = memento.get('tokens', {});
        tokens['github.com'] = {
            token,
            provider: 'github'
        };
        memento.update('tokens', tokens);
        memento.update(token, undefined);
    }
    let migrated = false;
    const tokens = memento.get('tokens', {});
    const struct = Object.keys(tokens).reduce((akku, host) => {
        if (typeof tokens[host] === 'string') {
            migrated = true;
            akku[host] = {
                token: tokens[host],
                provider: 'github'
            };
        }
        else {
            akku[host] = tokens[host];
        }
        return akku;
    }, {});
    if (migrated) {
        memento.update('tokens', struct);
    }
}
exports.migrateToken = migrateToken;
function getTokens(memento) {
    return memento.get('tokens', {});
}
exports.getTokens = getTokens;
function listTokenHosts(memento) {
    const tokens = memento.get('tokens');
    if (!tokens) {
        return [];
    }
    return Object.keys(tokens);
}
exports.listTokenHosts = listTokenHosts;
function removeToken(memento, host) {
    const tokens = memento.get('tokens');
    if (tokens) {
        delete tokens[host];
        memento.update('tokens', tokens);
    }
}
exports.removeToken = removeToken;
//# sourceMappingURL=tokens.js.map