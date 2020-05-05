"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// converted to ts from https://github.com/Nicd/code-stats-atom/blob/master/lib/utils.js
function getISOTimestamp(date) {
    const offset = -date.getTimezoneOffset();
    const prefix = offset >= 0 ? "+" : "-";
    function pad(num) {
        const norm = Math.abs(Math.floor(num));
        return (norm < 10 ? "0" : "") + norm;
    }
    return (date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes()) +
        ":" +
        pad(date.getSeconds()) +
        prefix +
        pad(offset / 60) +
        pad(offset % 60));
}
exports.getISOTimestamp = getISOTimestamp;
function getLanguageName(langId) {
    // currently supported language ids in vscode as of 2017-03-18
    let languageNames = {
        plaintext: "Plain text",
        Log: "Log",
        bat: "Batch",
        clojure: "Clojure",
        coffeescript: "CoffeeScript",
        c: "C",
        cpp: "C++",
        csharp: "C#",
        css: "CSS",
        diff: "Diff",
        dockerfile: "Docker",
        elixir: "Elixir",
        elm: "Elm",
        fsharpcss: "F#",
        "git-commit": "Git",
        "git-rebase": "Git",
        go: "Go",
        groovy: "Groovy",
        handlebars: "Handlebars",
        hlsl: "HLSL",
        html: "HTML",
        ini: "Ini",
        properties: "Properties",
        java: "Java",
        javascriptreact: "JavaScript (React)",
        javascript: "JavaScript",
        "jsx-tags": "JavaScript (JSX)",
        json: "JSON",
        less: "LESS",
        lua: "Lua",
        makefile: "Makefile",
        markdown: "Markdown",
        "objective-c": "Objective-C",
        perl: "Perl",
        perl6: "Perl 6",
        php: "PHP",
        powershell: "PowerShell",
        qsharp: "Q#",
        jade: "Pug",
        python: "Python",
        r: "R",
        razor: "Razor",
        ruby: "Ruby",
        rust: "Rust",
        scss: "SCSS",
        shaderlab: "Shaderlab",
        shellscript: "Shell Script",
        sql: "SQL",
        swift: "Swift",
        typescript: "TypeScript",
        typescriptreact: "TypeScript (React)",
        vb: "Visual Basic",
        xml: "XML",
        xsl: "XSL",
        yaml: "YAML"
    };
    let languageName = languageNames[langId];
    if (languageName === null || languageName === undefined) {
        return langId;
    }
    return languageName;
}
exports.getLanguageName = getLanguageName;
//# sourceMappingURL=utils.js.map