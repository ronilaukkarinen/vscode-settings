import { SymbolInformation } from 'vscode-languageserver';
import StorageService from '../services/storage';
export declare function searchWorkspaceSymbol(query: string, storage: StorageService, root: string): Promise<SymbolInformation[]>;
