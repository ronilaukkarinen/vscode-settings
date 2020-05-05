"use strict";
/*! accessibilityPatterns.ts
 * Flamingos are pretty badass!
 * Copyright (c) 2018 Max van der Schee; Licensed MIT */
// import {
// 	createConnection,
// 	ProposedFeatures
// } from 'vscode-languageserver';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// connection is used for debuging > connection.console.log();
// let connection = createConnection(ProposedFeatures.all);
// Order based om most common types first
const patterns = [
    "<div(>|)(?:.)+?>",
    "<span(>|)(?:.)+?>",
    // "id=\"(?:.)+?\"",
    "<a (?:.)+?>(?:(?:\\s|\\S)+?(?=</a>))</a>",
    "<img (?:.)+?>",
    "<input (?:.)+?>",
    "<head (?:.|)+?>(?:(?:\\s|\\S|)+?(?=</head>))</head>",
    "<html(>|)(?:.)+?>",
    'tabindex="(?:.)+?"',
    "<(?:i|)frame (?:.|)+?>"
];
exports.pattern = new RegExp(patterns.join("|"), "ig");
const nonDescriptiveAlts = [
    'alt="image"',
    'alt="picture"',
    'alt="logo"',
    'alt="icon"',
    'alt="graphic"',
    'alt="an image"',
    'alt="a picture"',
    'alt="a logo"',
    'alt="an icon"',
    'alt="a graphic"'
];
const nonDescriptiveAltsTogether = new RegExp(nonDescriptiveAlts.join("|"), "i");
const badAltStarts = [
    'alt="image of',
    'alt="picture of',
    'alt="logo of',
    'alt="icon of',
    'alt="graphic of',
    'alt="an image of',
    'alt="a picture of',
    'alt="a logo of',
    'alt="an icon of',
    'alt="a graphic of'
];
const badAltStartsTogether = new RegExp(badAltStarts.join("|"), "i");
function validateDiv(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/role=(?:.*?[a-z].*?)"/i.test(m[0])) {
            return {
                meta: m,
                mess: 'Use Semantic HTML5 or specify a WAI-ARIA role [role=""]',
                severity: 3
            };
        }
    });
}
exports.validateDiv = validateDiv;
function validateSpan(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/role=(?:.*?[a-z].*?)"/i.test(m[0])) {
            if (!/<span(?:.+?)(?:aria-hidden="true)(?:.+?)>/.test(m[0])) {
                if (/<span(?:.+?)(?:button|btn)(?:.+?)>/.test(m[0])) {
                    return {
                        meta: m,
                        mess: "Change the span to a <button>",
                        severity: 3
                    };
                }
                else {
                    return {
                        meta: m,
                        mess: 'Provide a WAI-ARIA role [role=""]',
                        severity: 2
                    };
                }
            }
        }
    });
}
exports.validateSpan = validateSpan;
function validateA(m) {
    return __awaiter(this, void 0, void 0, function* () {
        let aRegEx;
        let oldRegEx = m;
        let filteredString = m[0].replace(/<(?:\s|\S)+?>/gi, "");
        if (!/(?:\S+?)/gi.test(filteredString)) {
            aRegEx = /<a(?:.)+?>/i.exec(oldRegEx[0]);
            aRegEx.index = oldRegEx.index;
            return {
                meta: aRegEx,
                mess: "Provide a descriptive text in between the tags",
                severity: 2
            };
        }
    });
}
exports.validateA = validateA;
function validateImg(m) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ordered by approximate frequency of the issue
        if (!/alt="(?:.*?[a-z].*?)"/i.test(m[0]) && !/alt=""/i.test(m[0])) {
            return {
                meta: m,
                mess: 'Provide an alt text that describes the image, or alt="" if image is purely decorative',
                severity: 1
            };
        }
        if (nonDescriptiveAltsTogether.test(m[0])) {
            return {
                meta: m,
                mess: "Alt attribute must be specifically descriptive",
                severity: 3
            };
        }
        if (badAltStartsTogether.test(m[0])) {
            return {
                meta: m,
                mess: 'Alt text should not begin with "image of" or similar phrasing',
                severity: 3
            };
        }
        // Most screen readers cut off alt text at 125 characters.
        if (/alt="(?:.*?[a-z].*.{125,}?)"/i.test(m[0])) {
            return {
                meta: m,
                mess: "Alt text is too long",
                severity: 1
            };
        }
    });
}
exports.validateImg = validateImg;
function validateMeta(m) {
    return __awaiter(this, void 0, void 0, function* () {
        let metaRegEx;
        let oldRegEx = m;
        if ((metaRegEx = /<meta(?:.+?)viewport(?:.+?)>/i.exec(oldRegEx[0]))) {
            metaRegEx.index = oldRegEx.index + metaRegEx.index;
            if (!/user-scalable=yes/i.test(metaRegEx[0])) {
                return {
                    meta: metaRegEx,
                    mess: "Enable pinching to zoom [user-scalable=yes]",
                    severity: 3
                };
            }
            if (/maximum-scale=1/i.test(metaRegEx[0])) {
                return {
                    meta: metaRegEx,
                    mess: "Avoid using [maximum-scale=1]",
                    severity: 3
                };
            }
        }
    });
}
exports.validateMeta = validateMeta;
function validateTitle(m) {
    return __awaiter(this, void 0, void 0, function* () {
        let titleRegEx;
        let oldRegEx = m;
        if (!/<title>/i.test(oldRegEx[0])) {
            titleRegEx = /<head(?:|.+?)>/i.exec(oldRegEx[0]);
            titleRegEx.index = oldRegEx.index;
            return {
                meta: titleRegEx,
                mess: "Provide a title within the <head> tags",
                severity: 1
            };
        }
        else {
            titleRegEx = /<title>(?:|.*?[a-z].*?|\s+?)<\/title>/i.exec(oldRegEx[0]);
            if (/>(?:|\s+?)</i.test(titleRegEx[0])) {
                titleRegEx.index = oldRegEx.index + titleRegEx.index;
                return {
                    meta: titleRegEx,
                    mess: "Provide a text within the <title> tags",
                    severity: 1
                };
            }
        }
    });
}
exports.validateTitle = validateTitle;
function validateHtml(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/lang=(?:.*?[a-z].*?)"/i.test(m[0])) {
            return {
                meta: m,
                mess: 'Provide a language [lang=""]',
                severity: 2
            };
        }
    });
}
exports.validateHtml = validateHtml;
function validateInput(m) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (true) {
            case /type="hidden"/i.test(m[0]):
                break;
            case /aria-label=/i.test(m[0]):
                if (!/aria-label="(?:(?![a-z]*?)|\s|)"/i.test(m[0])) {
                    break;
                }
                else {
                    return {
                        meta: m,
                        mess: 'Provide a text within the aria label [aria-label=""]',
                        severity: 3
                    };
                }
            case /id=/i.test(m[0]):
                if (/id="(?:.*?[a-z].*?)"/i.test(m[0])) {
                    let idValue = /id="(.*?[a-z].*?)"/i.exec(m[0])[1];
                    let pattern = new RegExp('for="' + idValue + '"', "i");
                    if (pattern.test(m.input)) {
                        break;
                    }
                    else {
                        return {
                            meta: m,
                            mess: 'Provide an aria label [aria-label=""] or a <label for="">',
                            severity: 2
                        };
                    }
                }
                else {
                    return {
                        meta: m,
                        mess: 'Provide an aria label [aria-label=""]',
                        severity: 2
                    };
                }
            case /aria-labelledby=/i.test(m[0]):
                if (!/aria-labelledby="(?:(?![a-z]*?)|\s|)"/i.test(m[0])) {
                    // TODO: needs to check elements with the same value.
                    break;
                }
                else {
                    return {
                        meta: m,
                        mess: 'Provide an id within the aria labelledby [aria-labelledby=""]',
                        severity: 1
                    };
                }
            case /role=/i.test(m[0]):
                // TODO: needs to check if <label> is surrounded.
                break;
            default:
                return {
                    meta: m,
                    mess: 'Provide an aria label [aria-label=""]',
                    severity: 2
                };
        }
    });
}
exports.validateInput = validateInput;
function validateTab(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/tabindex="(?:0|-1)"/i.test(m[0])) {
            return {
                meta: m,
                mess: "A tabindex greater than 0 interferes with the focus order. Try restructuring the HTML",
                severity: 1
            };
        }
    });
}
exports.validateTab = validateTab;
function validateFrame(m) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!/title=(?:.*?[a-z].*?)"/i.test(m[0])) {
            return {
                meta: m,
                mess: 'Provide a title that describes the frame\'s content [title=""]',
                severity: 3
            };
        }
    });
}
exports.validateFrame = validateFrame;
// export async function validateId(m: RegExpExecArray) {
// 	let connection = createConnection(ProposedFeatures.all);
// 	let idValue = /id="(.*?[a-z].*?)"/i.exec(m[0])[1];
// 	let pattern: RegExp = new RegExp(idValue, 'i');
// 	// connection.console.log(idValue);
// 	if (pattern.exec(m.input).length == 2) {
// 		return {
// 			meta: m,
// 			mess: 'Duplicated id'
// 		};
// 	}
// }
//# sourceMappingURL=accessibilityPatterns.js.map