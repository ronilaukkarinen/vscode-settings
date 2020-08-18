import { TextDocument, Location } from 'vscode-languageserver';
import StorageService from '../services/storage';
export declare function goDefinition(document: TextDocument, offset: number, storage: StorageService): Promise<Location>;
