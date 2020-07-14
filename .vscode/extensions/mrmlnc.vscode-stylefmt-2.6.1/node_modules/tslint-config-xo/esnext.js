'use strict';

const path = require('path');

const baseRules = require('./index');

const nodeModulesPath = path.join(require.resolve('tslint-eslint-rules'), '..', '..');

module.exports = {
	rulesDirectory: [
		path.join(nodeModulesPath, 'tslint-eslint-rules/dist/rules'),
		path.join(nodeModulesPath, 'tslint-microsoft-contrib'),
		path.join(nodeModulesPath, 'vrsource-tslint-rules/rules'),
		path.join(nodeModulesPath, 'tslint-divid/rules')
	],
	rules: Object.assign({
		/**
		 * @eslint {no-var}
		 * @tslint {no-var-keyword}
		 * @provider {tslint}
		 */
		'no-var-keyword': true,

		/**
		 * @eslint {object-shorthand}
		 * @tslint {object-literal-shorthand}
		 * @provider {tslint}
		 */
		'object-literal-shorthand': true,

		/**
		 * @eslint {prefer-arrow-callback}
		 * @tslint {ter-prefer-arrow-callback}
		 * @provider {tslint-eslint-rules}
		 */
		'ter-prefer-arrow-callback': true,

		/**
		 * @eslint {prefer-const}
		 * @tslint {prefer-const}
		 * @provider {tslint-eslint-rules}
		 */
		'prefer-const': [
			true,
			{
				destructuring: 'all'
			}
		]

		/**
		 * @eslint {prefer-numeric-literals}
		 * @unavailable
		 */
		// 'prefer-numeric-literals': null,
	}, baseRules.rules)
};
