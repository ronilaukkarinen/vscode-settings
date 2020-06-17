'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const configuration_1 = require("./configuration");
class BaseContentProvider {
    constructor(context) {
        this.context = context;
    }
    static checkNoSvg(document, displayMessage = true) {
        if (!document) {
            vscode.window.showWarningMessage(BaseContentProvider.noSvgErrorNessage);
            return true;
        }
        let isSvg = document.getText().match(BaseContentProvider.svgRegexp);
        if (!isSvg && displayMessage) {
            vscode.window.showWarningMessage(BaseContentProvider.noSvgErrorNessage);
        }
        return !isSvg;
    }
    get localResourceRoots() {
        return [vscode.Uri.file(path.join(this.context.extensionPath, 'media'))];
    }
    getPath(file) {
        const onDiskPath = vscode.Uri.file(path.join(this.context.extensionPath, file));
        return onDiskPath.with({ scheme: 'vscode-resource' });
    }
}
BaseContentProvider.svgRegexp = /<svg .*<\/svg>/s;
BaseContentProvider.noSvgErrorNessage = `Active editor doesn't show a SVG document - no properties to preview.`;
exports.BaseContentProvider = BaseContentProvider;
class SvgDocumentContentProvider extends BaseContentProvider {
    snippet(properties, state) {
        const showTransGrid = configuration_1.Configuration.showTransGrid();
        const transparencycolor = configuration_1.Configuration.transparencyColor();
        let transparencyGridCss = '';
        if (showTransGrid) {
            if (transparencycolor != null && transparencycolor !== "") {
                transparencyGridCss = `
<style type="text/css">
.svgv-bg img {
    background: ` + transparencycolor + `;
    transform-origin: top left;
}
</style>`;
            }
            else {
                transparencyGridCss = `<link rel="stylesheet" href="${this.getPath('media/background.css')}" type="text/css"></style>`;
            }
        }
        let matches;
        let css = new Array();
        while (matches = SvgDocumentContentProvider.stylesheetRegex.exec(properties)) {
            css.push(matches[1]);
        }
        let html = `<!DOCTYPE html><html><head>
<meta id="vscode-svg-preview-data" data-state="${JSON.stringify(state || {}).replace(/"/g, '&quot;')}">
${transparencyGridCss}
<script src="${this.getPath('media/preview.js')}"></script>
<link rel="stylesheet" href="${this.getPath('media/preview.css')}" type="text/css"></style>
</head><body>
        ${this.buttonHtml()}
        <div class="svgv-bg"><img id="svgimg" src="data:image/svg+xml,${encodeURIComponent(this.insertCss(properties, css))}"></div>
        </body></html>`;
        return html;
    }
    provideTextDocumentContent(sourceUri, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield vscode.workspace.openTextDocument(sourceUri);
            this.resourceDir = path.dirname(sourceUri.fsPath);
            return this.snippet(document.getText(), state);
        });
    }
    buttonHtml() {
        return vscode.workspace.getConfiguration('svgviewer').get('showzoominout') ?
            `<div class="svgv-zoom-container">
            <button class="svgv-btn" type="button" title="Zoom in" id="zoom_in">+</button>
            <button class="svgv-btn" type="button" title="Zoom out" id="zoom_out">-</button>
            <button class="svgv-btn" type="button" title="Reset Zoom" id="zoom_reset">Reset</button>
            </div>` : '';
    }
    insertCss(svg, css) {
        if (css == null || css.length == 0)
            return svg;
        let defsEndIndex = svg.toLowerCase().indexOf('</defs>');
        if (defsEndIndex === -1) {
            let svgEndIndex = svg.toLowerCase().indexOf('</svg>');
            return svg.slice(0, svgEndIndex)
                + `<defs>${this.loadCss(css)}</defs>`
                + svg.slice(svgEndIndex, svg.length);
        }
        return svg.slice(0, defsEndIndex)
            + this.loadCss(css)
            + svg.slice(defsEndIndex, svg.length);
    }
    loadCss(css) {
        let result = "";
        css.forEach(x => {
            result += `<style type="text/css"><![CDATA[${fs.readFileSync(this.getWorkspacePath(x))}]]></style>`;
        });
        return result;
    }
    getWorkspacePath(file) {
        return path.join(this.resourceDir, file);
    }
}
SvgDocumentContentProvider.stylesheetRegex = /<\?\s*xml-stylesheet\s+.*href="(.+?)".*\s*\?>/gi;
exports.SvgDocumentContentProvider = SvgDocumentContentProvider;
//# sourceMappingURL=svgProvider.js.map