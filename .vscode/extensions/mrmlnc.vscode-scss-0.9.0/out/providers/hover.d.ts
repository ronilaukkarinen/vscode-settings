import { Hover, TextDocument } from 'vscode-languageserver';
import StorageService from '../services/storage';
export declare function doHover(document: TextDocument, offset: number, storage: StorageService): Promise<Hover | null>;
