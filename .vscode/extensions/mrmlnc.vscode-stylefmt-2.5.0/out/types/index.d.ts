import * as vscode from 'vscode';
export interface IStylefmtOptions {
    rules: object;
    configBasedir: string;
    configFile: string;
}
export interface IStylefmtSettings {
    configBasedir?: string;
    config?: string | object;
    useStylelintConfigOverrides?: boolean;
    showErrorMessages?: boolean;
}
export interface IStylelintSettings {
    configOverrides?: any;
}
export interface IVSCodeSettings {
    formatOnSave?: boolean;
}
export declare type ISettings = IStylelintSettings & IStylefmtSettings & IVSCodeSettings;
export interface IResult {
    css: string;
    range: vscode.Range;
}
