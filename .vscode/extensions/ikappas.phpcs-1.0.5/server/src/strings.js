/* --------------------------------------------------------------------------------------------
 * Copyright (c) Ioannis Kappas. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringResources {
}
StringResources.DidStartValidateTextDocument = 'Linting started on: {0}';
StringResources.DidEndValidateTextDocument = 'Linting completed on: {0}';
StringResources.ComposerDependencyNotFoundError = 'Composer phpcs dependency is configured but was not found under {0}. You may need to run "composer install" or set your phpcs.executablePath manually.';
StringResources.UnableToLocatePhpcsError = 'Unable to locate phpcs. Please add phpcs to your global path or use composer dependency manager to install it in your project locally.';
StringResources.InvalidVersionStringError = 'Invalid version string encountered!';
StringResources.UnknownErrorWhileValidatingTextDocument = 'An unknown error occurred while validating: {0}';
StringResources.CreateLinterErrorDefaultMessage = 'Please add phpcs to your global path or use composer dependency manager to install it in your project locally.';
StringResources.CreateLinterError = 'Unable to locate phpcs. {0}';
StringResources.UnknownExecutionError = 'Unknown error ocurred. Please verify that {0} returns a valid json object.';
StringResources.CodingStandardNotInstalledError = 'The "{0}" coding standard is not installed. Please review your configuration an try again.';
StringResources.InvalidJsonStringError = 'The phpcs report contains invalid json. Please review "Diagnosing Common Errors" in the plugin README';
StringResources.Empty = '';
StringResources.Space = ' ';
exports.StringResources = StringResources;
//# sourceMappingURL=strings.js.map