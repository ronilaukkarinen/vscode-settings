"use strict";
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
const ripgrep_1 = require("./ripgrep");
const execa = require("execa");
const MatchRegex = /(.+?):(\d+):(\d+):(.*)/;
const ContextRegex = /(.+?)-(\d+)-(.*)/;
class ResultSeparator {
}
exports.ResultSeparator = ResultSeparator;
const RESULT_SEPARATOR = new ResultSeparator();
function isResultSeparator(obj) {
    return obj === RESULT_SEPARATOR;
}
exports.isResultSeparator = isResultSeparator;
function parseResults(ripgrepStdout) {
    const results = [];
    for (let line of ripgrepStdout.split("\n")) {
        if (line === "--") {
            results.push(RESULT_SEPARATOR);
            continue;
        }
        const matched = line.match(MatchRegex);
        if (matched !== null) {
            results.push({
                filePath: matched[1],
                line: parseInt(matched[2]),
                column: parseInt(matched[3]),
                content: matched[4],
                isContext: false
            });
        }
        else {
            const context = line.match(ContextRegex);
            if (context !== null) {
                results.push({
                    filePath: context[1],
                    line: parseInt(context[2]),
                    content: context[3],
                    isContext: true
                });
            }
        }
    }
    return results;
}
function runSearch(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const execOptions = {
            cwd: opts.location,
            stdin: 'ignore',
        };
        let command = [
            (yield ripgrep_1.getRipgrepExecutablePath()),
            opts.query,
            "--color",
            "never",
            "--no-heading",
            "--column",
            "--line-number",
            "--context",
            opts.context.toString()
        ];
        if (!opts.queryRegex) {
            command.push("--fixed-strings");
        }
        if (opts.sortFiles === "true") {
            command.push("--sort-files");
        }
        console.log(command);
        try {
            const { stdout } = yield execa(command[0], command.slice(1), execOptions);
            return parseResults(stdout);
        }
        catch (e) {
            // ripgrep returns a non-zero exit code if no results are
            // found. Not sure if there's a way to get better signal.
            console.log(e);
            return [];
        }
    });
}
exports.runSearch = runSearch;
//# sourceMappingURL=search.js.map