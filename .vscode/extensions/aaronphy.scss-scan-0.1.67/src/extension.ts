'use strict';

import * as _ from 'lodash';
import * as vscode from 'vscode';
const path = require('path');
/**
 * Definitions
 */

import ScssVariableDefinition from './common/scss-variable-definition';
import ScssMixinDefinition from './common/scss-mixin-definition';
import ScssExtendDefinition from './common/scss-extend-definition';

/**
 * Fetcher & Notifier
 */
import Fetcher from './fetcher';
import Notifier from './notifier';

/**
 * ParseEngine 
 */

import VariableEngineGateway from './variable-engine-gateway';
import MixinEngineGateway from './mixin-engine-gateway';
import ExtendEngineGateway from './extend-engine-gateway';

/**
 * init
 */
let notifier: Notifier = new Notifier('scss-scan.cache');
let uniqueVariables: ScssVariableDefinition[];
let uniqueMixin: ScssMixinDefinition[];
let uniqueExtend: ScssExtendDefinition[];

async function cache(): Promise<void> {
    try {
        notifier.notify('search','Looking for SCSS Elements on the workspace...');
        console.log('Looking for parseable SCSS');
        let uris: vscode.Uri[] = await Fetcher.findAllParseableDocuments();
        let customs :vscode.Uri[] = [];
        customs = generate(vscode.workspace.getConfiguration('scss-scan').customPaths);
        if(customs.length>0){
            uris.push(...customs);
        }
        if(!uris) {
            console.log("Found no SCSS");
            notifier.statusBarItem.hide();
            return;
        }
        
        console.log('Found all parseable SCSS files');
        
        let variables:ScssVariableDefinition[] = [];
        let mixins: ScssMixinDefinition[] = [];
        let extendes:ScssExtendDefinition[] = [];
        let failedLogs: string = '';
        let failedLogsCount: number = 0;

        console.log('Parsing documents and looking for SCSS Elements...')

        try {
            await Promise.all(uris.map(async (uri:vscode.Uri) => {
                try {
                   
                    variables.push(...await VariableEngineGateway.callParser(uri));
                    mixins.push(...await MixinEngineGateway.callParser(uri));
                    extendes.push(...await ExtendEngineGateway.callParser(uri))
                } catch(error) {
                    failedLogs += `${uri.path}\n`;
                    failedLogsCount++;
                }
            }));

        }catch(error){
            console.error('Failed to parse the documents: ', error);
            throw error;
        }
        
        //去重
        uniqueExtend = _.uniqBy(extendes,(x:ScssExtendDefinition)=>x.prop);
        uniqueVariables = _.uniqBy(variables,(x:ScssVariableDefinition)=>x.prop);
        uniqueMixin = _.uniqBy(mixins,(x:ScssMixinDefinition)=>x.prop);

        console.log('Sumary:');
        console.log(uris.length, 'parseable documents found');
        console.log(variables.length, 'SCSS variables definitions found');
        console.log(uniqueVariables.length, 'unique SCSS variables definitions found');
        console.log(mixins.length, 'SCSS mixin definitions found');
        console.log(uniqueMixin.length, 'unique SCSS mixin definitions found');
        console.log(extendes.length, 'SCSS extendes definitions found');
        console.log(uniqueExtend.length, 'unique SCSS extendes definitions found');
        
        console.log(failedLogsCount, 'failed attempts to parse. List of the documents:');
        console.log(failedLogs);
       
        notifier.notify('sync', 'SCSS variables cached (click to cache again)');

    }catch(error){
        console.error('Failed while looping through the documents to cache the classes definitions:', error);
        notifier.notify('alert', 'Failed to cache the SCSS classes on the workspace (click for another attempt)');
        throw error;
    }
}



export async function activate(context: vscode.ExtensionContext): Promise<void> {
    context.subscriptions.push(vscode.commands.registerCommand('scss-scan.cache',async ()=>{
        await cache();
    }));
    await cache();
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scss',{
       provideCompletionItems(document:vscode.TextDocument, position:vscode.Position):vscode.CompletionItem[] {
           let start:vscode.Position = new vscode.Position(position.line, 0);
           let range:vscode.Range = new vscode.Range(start, position);
           let text:string = document.getText(range);
           let rawVariables: RegExpMatchArray = text.match(/.*:[ ]*[\$]([\w-]*$)/);
           if(rawVariables === null){ 
               return [];
           }
           let variablesOn:string[] = [];
           let variablesRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;
           let item : RegExpExecArray = null;
           
           while ((item = variablesRegex.exec(rawVariables[1])) !== null) {
               if (item.index === variablesRegex.lastIndex) {
                   variablesRegex.lastIndex++;
               }
               if (item!= null && item.length >0) {
                   variablesOn.push(item[1]);
               }
           }
           variablesOn.pop();
           let completionItems : vscode.CompletionItem[] = [];
           for (let i = 0 ; i<uniqueVariables.length; i++) {
               let mockItem = new vscode.CompletionItem(uniqueVariables[i].prop,vscode.CompletionItemKind.Variable);
               mockItem.detail = uniqueVariables[i].val;
               completionItems.push(mockItem);
           }

           for (let i = 0 ; i< variablesOn.length;i++){
               for(let j = 0 ; j < completionItems.length; j++){
                   if(completionItems[j].label === variablesOn[i]){
                       completionItems.splice(j,1);
                   }
               }
           }
           return completionItems; 
       }             
    }));   

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scss',{
       provideCompletionItems(document:vscode.TextDocument, position:vscode.Position):vscode.CompletionItem[] {
           let start:vscode.Position = new vscode.Position(position.line, 0);
           let range:vscode.Range = new vscode.Range(start, position);
           let text:string = document.getText(range);
           let rawMixins: RegExpMatchArray = text.match(/@include[ ]*([\w-]*$)/);
           if(rawMixins === null){ 
               return [];
           }
           let mixinsOn:string[] = [];
           let mixinsRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;
           let item : RegExpExecArray = null;
           
           while ((item = mixinsRegex.exec(rawMixins[1])) !== null) {
               if (item.index === mixinsRegex.lastIndex) {
                   mixinsRegex.lastIndex++;
               }
               if (item!= null && item.length >0) {
                   mixinsOn.push(item[1]);
               }
           }
           mixinsOn.pop();
           let completionItems : vscode.CompletionItem[] = [];
           for (let i = 0 ; i<uniqueMixin.length; i++) {
               let mockItem = new vscode.CompletionItem(uniqueMixin[i].prop,vscode.CompletionItemKind.Variable);
               mockItem.detail = uniqueMixin[i].val;
               mockItem.insertText = `${uniqueMixin[i].prop}(${mockItem.detail})`
               completionItems.push(mockItem);
           }

           for (let i = 0 ; i< mixinsOn.length;i++){
               for(let j = 0 ; j < completionItems.length; j++){
                   if(completionItems[j].label === mixinsOn[i]){
                       completionItems.splice(j,1);
                   }
               }
           }
           return completionItems; 
       }             
    })); 


    context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scss',{
       provideCompletionItems(document:vscode.TextDocument, position:vscode.Position):vscode.CompletionItem[] {
           let start:vscode.Position = new vscode.Position(position.line, 0);
           let range:vscode.Range = new vscode.Range(start, position);
           let text:string = document.getText(range);
           let rawExtends: RegExpMatchArray = text.match(/@extend[ ]*([\w-]*$)/);
           if(rawExtends === null){ 
               return [];
           }
           let extendsOn:string[] = [];
           let extendsRegex: RegExp = /[ ]*([\w-]*)[ ]*/g;
           let item : RegExpExecArray = null;
           
           while ((item = extendsRegex.exec(rawExtends[1])) !== null) {
               if (item.index === extendsRegex.lastIndex) {
                   extendsRegex.lastIndex++;
               }
               if (item!= null && item.length >0) {
                   extendsOn.push(item[1]);
               }
           }
           extendsOn.pop();
           let completionItems : vscode.CompletionItem[] = [];
           for (let i = 0 ; i<uniqueExtend.length; i++) {
               let mockItem = new vscode.CompletionItem(uniqueExtend[i].prop,vscode.CompletionItemKind.Variable);
               completionItems.push(mockItem);
           }

           for (let i = 0 ; i< extendsOn.length;i++){
               for(let j = 0 ; j < completionItems.length; j++){
                   if(completionItems[j].label === extendsOn[i]){
                       completionItems.splice(j,1);
                   }
               }
           }
           return completionItems; 
       }             
    }));         
}


function generate(list):vscode.Uri[]{
    let convert:vscode.Uri[] = [];
    let base = vscode.workspace.rootPath;
    list.map((item,index)=>{
       convert.push(createResourceUri(item));
    });
    return convert;
}

function createResourceUri(relativePath: string): vscode.Uri {
  const absolutePath = path.join(vscode.workspace.rootPath, relativePath);
  return vscode.Uri.file(absolutePath);
}


export function deactivate(): void {
    
}

