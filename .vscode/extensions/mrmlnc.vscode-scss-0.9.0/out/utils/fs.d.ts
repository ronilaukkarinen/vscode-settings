/// <reference types="node" />
import * as fs from 'fs';
import * as fg from 'fast-glob';
export declare function findFiles(pattern: string, options: fg.Options): Promise<string[]>;
export declare function fileExists(filepath: string): Promise<boolean>;
export declare function fileExistsSync(filepath: string): boolean;
/**
 * Read file by specified filepath;
 */
export declare function readFile(filepath: string): Promise<string>;
/**
 * Read file by specified filepath;
 */
export declare function statFile(filepath: string): Promise<fs.Stats>;
