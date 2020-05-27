'use strict';

const path = require('path');

const nodeModulesPath = path.join(require.resolve('tslint-eslint-rules'), '..', '..');

module.exports = {
	rulesDirectory: [
		path.join(nodeModulesPath, 'tslint-eslint-rules/dist/rules'),
		path.join(nodeModulesPath, 'tslint-microsoft-contrib'),
		path.join(nodeModulesPath, 'vrsource-tslint-rules/rules'),
		path.join(nodeModulesPath, 'tslint-divid/rules')
	],
	rules: {
		/**
		 * @eslint {comma-dangle}
		 * @tslint {trailing-comma}
		 * @provider {tslint}
		 */
		'trailing-comma': [
			true,
			{
				multiline: 'never',
				singleline: 'never'
			}
		],

		/**
		 * @eslint {for-direction}
		 * @unavailable
		 */
		// 'for-direction': null,

		/**
		 * @eslint {no-await-in-loop}
		 * @unavailable
		 */
		// 'no-await-in-loop': null,

		/**
		 * @eslint {no-compare-neg-zero}
		 * @unavailable
		 */
		// 'no-compare-neg-zero': null,

		/**
		 * @eslint {no-cond-assign}
		 * @tslint {no-conditional-assignment}
		 * @provider {tslint}
		 */
		'no-conditional-assignment': true,

		/**
		 * @eslint {no-constant-condition}
		 * @tslint {no-constant-condition}
		 * @provider {tslint-eslint-rules}
		 */
		'no-constant-condition': true,

		/**
		 * @eslint {no-control-regex}
		 * @tslint {no-control-regex}
		 * @provider {tslint-eslint-rules}
		 */
		'no-control-regex': true,

		/**
		 * @eslint {no-debugger}
		 * @tslint {no-debugger}
		 * @provider {tslint}
		 */
		'no-debugger': true,

		/**
		 * @eslint {no-dupe-args}
		 * @notApplicable
		 */
		// 'no-dupe-args': null,

		/**
		 * @eslint {no-dupe-keys}
		 * @notApplicable
		 */
		// 'no-dupe-keys': null,

		/**
		 * @eslint {no-duplicate-case}
		 * @tslint {no-duplicate-case}
		 * @provider {tslint-eslint-rules}
		 */
		'no-duplicate-case': true,

		/**
		 * @eslint {no-empty-character-class}
		 * @tslint {no-empty-character-class}
		 * @provider {tslint-eslint-rules}
		 */
		'no-empty-character-class': true,

		/**
		 * @eslint {no-empty}
		 * @tslint {no-empty}
		 * @provider {tslint}
		 * @missed {allowEmptyCatch}
		 */
		'no-empty': true,

		/**
		 * @eslint {no-ex-assign}
		 * @tslint {no-ex-assign}
		 * @provider {tslint-eslint-rules}
		 */
		'no-ex-assign': true,

		/**
		 * @eslint {no-extra-boolean-cast}
		 * @tslint {no-extra-boolean-cast}
		 * @provider {tslint-eslint-rules}
		 */
		'no-extra-boolean-cast': true,

		/**
		 * @eslint {no-extra-semi}
		 * @tslint {no-extra-semi}
		 * @provider {tslint-eslint-rules}
		 */
		'no-extra-semi': true,

		/**
		 * @eslint {no-func-assign}
		 * @notApplicable
		 */
		// 'no-func-assign': null,

		/**
		 * @eslint {no-inner-declarations}
		 * @tslint {no-inner-declarations}
		 * @provider {tslint-eslint-rules}
		 */
		'no-inner-declarations': [
			true,
			'functions'
		],

		/**
		 * @eslint {no-invalid-regexp}
		 * @tslint {no-invalid-regexp}
		 * @provider {tslint-eslint-rules}
		 */
		'no-invalid-regexp': true,

		/**
		 * @eslint {no-irregular-whitespace}
		 * @tslint {no-irregular-whitespace}
		 * @provider {tslint}
		 */
		'no-irregular-whitespace': true,

		/**
		 * @eslint {no-obj-calls}
		 * @notApplicable
		 */
		// 'no-obj-calls': null,

		/**
		 * @eslint {no-prototype-builtins}
		 * @unavailable
		 */
		// 'no-prototype-builtins': null,

		/**
		 * @eslint {no-regex-spaces}
		 * @tslint {no-regex-spaces}
		 * @provider {tslint-eslint-rules}
		 */
		'no-regex-spaces': true,

		/**
		 * @eslint {no-sparse-arrays}
		 * @tslint {no-sparse-arrays}
		 * @provider {tslint}
		 */
		'no-sparse-arrays': true,

		/**
		 * @eslint {no-template-curly-in-string}
		 * @tslint {no-invalid-template-strings}
		 * @provider {tslint}
		 */
		'no-invalid-template-strings': true,

		/**
		 * @eslint {no-unreachable}
		 * @notApplicable
		 */
		// 'no-unreachable': null,

		/**
		 * @eslint {no-unsafe-finally}
		 * @tslint {no-unsafe-finally}
		 * @provider {tslint}
		 */
		'no-unsafe-finally': true,

		/**
		 * @eslint {no-unsafe-negation}
		 * @unavailable
		 */
		// 'no-unsafe-negation': null,

		/**
		 * @eslint {use-isnan}
		 * @tslint {use-isnan}
		 * @provider {tslint}
		 */
		'use-isnan': true,

		/**
		 * @eslint {valid-typeof}
		 * @tslint {valid-typeof}
		 * @provider {tslint-eslint-rules}
		 * @missed {requireStringLiterals}
		 */
		'valid-typeof': true,

		/**
		 * @eslint {no-unexpected-multiline}
		 * @tslint {no-unexpected-multiline}
		 * @provider {tslint-eslint-rules}
		 */
		'no-unexpected-multiline': true,

		/**
		 * @eslint {accessor-pairs}
		 * @unavailable
		 */
		// 'accessor-pairs': null,

		/**
		 * @eslint {array-callback-return}
		 * @unavailable
		 */
		// 'array-callback-return': null,

		/**
		 * @eslint {block-scoped-var}
		 * @tslint {no-shadowed-variable}
		 * @provider {tslint}
		 */
		'no-shadowed-variable': true,

		/**
		 * @eslint {complexity}
		 * @tslint {cyclomatic-complexity}
		 * @provider {tslint}
		 */
		'cyclomatic-complexity': {
			severity: 'warning'
		},

		/**
		 * @eslint {curly}
		 * @tslint {curly}
		 * @provider {tslint}
		 */
		curly: true,

		/**
		 * @eslint {default-case}
		 * @tslint {switch-default}
		 * @provider {tslint}
		 */
		'switch-default': true,

		/**
		 * @eslint {dot-notation}
		 * @tslint {dot-notation}
		 * @provider {vrsource-tslint-rules}
		 */
		'dot-notation': [
			true,
			{
				'allow-pattern': '^[a-z]+(_[a-z]+)+$'
			}
		],

		/**
		 * @eslint {dot-location}
		 * @unavailable
		 */
		// 'dot-location': null,

		/**
		 * @eslint {eqeqeq}
		 * @tslint {triple-equals}
		 * @provider {tslint}
		 */
		'triple-equals': true,

		/**
		 * @eslint {guard-for-in}
		 * @tslint {forin}
		 * @provider {tslint}
		 */
		forin: true,

		/**
		 * @eslint {no-alert}
		 * @tslint {ban}
		 * @provider {tslint}
		 */
		ban: [
			true,
			[
				'alert'
			]
		],

		/**
		 * @eslint {no-caller}
		 * @tslint {no-arg}
		 * @provider {tslint}
		 */
		'no-arg': true,

		/**
		 * @eslint {no-case-declarations}
		 * @unavailable
		 */
		// 'no-case-declarations': null,

		/**
		 * @eslint {no-div-regex}
		 * @unavailable
		 */
		// 'no-div-regex': null,

		/**
		 * @eslint {no-else-return}
		 * @unavailable
		 */
		// 'no-else-after-return': null,

		/**
		 * @eslint {no-empty-pattern}
		 * @unavailable
		 */
		// 'no-empty-pattern': null,

		/**
		 * @eslint {no-eq-null}
		 * @unavailable
		 */
		// 'no-eq-null': null,

		/**
		 * @eslint {no-eval}
		 * @tslint {no-eval}
		 * @provider {tslint}
		 */
		'no-eval': true,

		/**
		 * @eslint {no-extend-native}
		 * @unavailable
		 */
		// 'no-extend-native': null,

		/**
		 * @eslint {no-extra-bind}
		 * @unavailable
		 */
		// 'no-extra-bind': null,

		/**
		 * @eslint {no-extra-label}
		 * @unavailable
		 */
		// 'no-extra-label': null,

		/**
		 * @eslint {no-fallthrough}
		 * @tslint {dot-notation}
		 * @provider {tslint}
		 */
		'no-switch-case-fall-through': true,

		/**
		 * @eslint {no-floating-decimal}
		 * @tslint {number-literal-format}
		 * @provider {tslint}
		 */
		'number-literal-format': true,

		/**
		 * @eslint {no-global-assign}
		 * @unavailable
		 */
		// 'no-global-assign': null,

		/**
		 * @eslint {no-implicit-coercion}
		 * @unavailable
		 */
		// 'no-implicit-coercion': null,

		/**
		 * @eslint {no-implicit-globals}
		 * @unavailable
		 */
		// 'no-implicit-globals': null,

		/**
		 * @eslint {no-implied-eval}
		 * @unavailable
		 */
		// 'no-implied-eval': null,

		/**
		 * @eslint {no-iterator}
		 * @unavailable
		 */
		// 'no-iterator': null,

		/**
		 * @eslint {no-labels}
		 * @tslint {no-label}
		 * @provider {tslint-divid}
		 */
		'no-label': true,

		/**
		 * @eslint {no-lone-blocks}
		 * @unavailable
		 */
		// 'no-lone-blocks': null,

		/**
		 * @eslint {no-multi-spaces}
		 * @tslint {no-multi-spaces}
		 * @provider {tslint-eslint-rules}
		 */
		'no-multi-spaces': [
			true,
			{
				exceptions: {
					PropertyAssignment: true
				}
			}
		],

		/**
		 * @eslint {no-multi-str}
		 * @unavailable
		 */
		// 'no-multi-str': null,

		/**
		 * @eslint {no-new-func,no-array-constructor,no-new-object}
		 * @tslint {prefer-literal}
		 * @provider {vrsource-tslint-rules}
		 */
		'prefer-literal': [
			true,
			'object',
			'function',
			'array'
		],

		/**
		 * @eslint {no-new-wrappers}
		 * @tslint {no-construct}
		 * @provider {tslint}
		 */
		'no-construct': true,

		/**
		 * @eslint {no-new,no-unused-expressions}
		 * @tslint {no-unused-expression}
		 * @provider {tslint}
		 */
		'no-unused-expression': true,

		/**
		 * @eslint {no-octal-escape}
		 * @tslint {no-octal-literal}
		 * @provider {tslint-microsoft-contrib}
		 */
		'no-octal-literal': true,

		/**
		 * @eslint {no-octal}
		 * @notApplicable
		 */
		// 'no-octal': null,

		/**
		 * @eslint {no-proto}
		 * @unavailable
		 */
		// 'no-proto': null,

		/**
		 * @eslint {no-redeclare}
		 * @tslint {no-duplicate-variable}
		 * @provider {tslint}
		 */
		'no-duplicate-variable': true,

		/**
		 * @eslint {no-return-assign}
		 * @unavailable
		 */
		// 'no-return-assign': null,

		/**
		 * @eslint {no-return-await}
		 * @unavailable
		 */
		// 'no-return-await': null,

		/**
		 * @eslint {no-script-url}
		 * @unavailable
		 */
		// 'no-script-url': null,

		/**
		 * @eslint {no-self-assign}
		 * @unavailable
		 */
		// 'no-self-assign': null,

		/**
		 * @eslint {no-self-compare}
		 * @unavailable
		 */
		// 'no-self-compare': null,

		/**
		 * @eslint {no-sequences}
		 * @unavailable
		 */
		// 'no-sequences': null,

		/**
		 * @eslint {no-throw-literal}
		 * @tslint {no-string-throw}
		 * @provider {tslint}
		 */
		'no-string-throw': true,

		/**
		 * @eslint {no-unmodified-loop-condition}
		 * @unavailable
		 */
		// 'no-unmodified-loop-condition': null,

		/**
		 * @eslint {no-unused-labels}
		 * @unavailable
		 */
		// 'no-unused-labels': null,

		/**
		 * @eslint {no-useless-call}
		 * @unavailable
		 */
		// 'no-useless-call': null,

		/**
		 * @eslint {no-useless-concat}
		 * @unavailable
		 */
		// 'no-useless-concat': null,

		/**
		 * @eslint {no-useless-escape}
		 * @unavailable
		 */
		// 'no-useless-escape': null,

		/**
		 * @eslint {no-useless-return}
		 * @unavailable
		 */
		// 'no-useless-return': null,

		/**
		 * @eslint {no-void}
		 * @unavailable
		 */
		// 'no-void': null,

		/**
		 * @eslint {no-warning-comments}
		 * @unavailable
		 */
		// 'no-warning-comments': null,

		/**
		 * @eslint {no-with}
		 * @tslint {no-with-statement}
		 * @provider {tslint-microsoft-contrib}
		 */
		'no-with-statement': true,

		/**
		 * @eslint {prefer-promise-reject-errors}
		 * @unavailable
		 */
		// 'prefer-promise-reject-errors': null,

		/**
		 * @eslint {radix}
		 * @tslint {radix}
		 * @provider {tslint}
		 */
		radix: true,

		/**
		 * @eslint {wrap-iife}
		 * @unavailable
		 */
		// 'wrap-iife': null,

		/**
		 * @eslint {yoda}
		 * @unavailable
		 */
		// yoda: null,

		/**
		 * @eslint {no-delete-var}
		 * @notApplicable
		 */
		// 'no-delete-var': null,

		/**
		 * @eslint {no-label-var}
		 * @unavailable
		 */
		// 'no-label-var': null,

		/**
		 * @eslint {no-restricted-globals}
		 * @unavailable
		 */
		// 'no-restricted-globals': null,

		/**
		 * @eslint {no-shadow-restricted-names}
		 * @unavailable
		 */
		// 'no-shadow-restricted-names': null,

		/**
		 * @eslint {no-undef-init}
		 * @unavailable
		 */
		// 'no-undef-init': null,

		/**
		 * @eslint {no-undef}
		 * @notApplicable
		 */
		// 'no-undef': null,

		/**
		 * @eslint {no-unused-vars}
		 * @core
		 */
		// 'no-unused-vars': null,

		/**
		 * @eslint {no-use-before-define}
		 * @tslint {no-use-before-declare}
		 * @provider {tslint}
		 */
		'no-use-before-declare': true,

		/**
		 * @eslint {no-buffer-constructor}
		 * @unavailable
		 */
		// 'no-buffer-constructor': null,

		/**
		 * @eslint {handle-callback-err}
		 * @tslint {handle-callback-err}
		 * @provider {tslint-eslint-rules}
		 */
		'handle-callback-err': {
			severity: 'warning'
		},

		/**
		 * @eslint {no-mixed-requires}
		 * @unavailable
		 */
		// 'no-mixed-requires': null,

		/**
		 * @eslint {no-new-require}
		 * @unavailable
		 */
		// 'no-new-require': null,

		/**
		 * @eslint {no-path-concat}
		 * @unavailable
		 */
		// 'no-path-concat': null,

		/**
		 * @eslint {no-restricted-imports}
		 * @unavailable
		 */
		// 'no-restricted-imports': null,

		/**
		 * @eslint {no-restricted-modules}
		 * @unavailable
		 */
		// 'no-restricted-modules': null,

		/**
		 * @eslint {array-bracket-spacing}
		 * @tslint {array-bracket-spacing}
		 * @provider {tslint-eslint-rules}
		 */
		'array-bracket-spacing': [
			true,
			'never'
		],

		/**
		 * @eslint {brace-style}
		 * @tslint {brace-style}
		 * @provider {tslint-eslint-rules}
		 */
		'brace-style': [
			true,
			'1tbs',
			{
				allowSingleLine: false
			}
		],

		/**
		 * @eslint {camelcase}
		 * @tslint {variable-name}
		 * @provider {tslint}
		 */
		'variable-name': [
			true,
			'check-format'
		],

		/**
		 * @eslint {capitalized-comments,spaced-comment}
		 * @tslint {comment-format}
		 * @provider {tslint}
		 */
		'comment-format': [
			true,
			'check-space', // 'always'
			'check-uppercase' // Rule: capitalized-comments
		],

		/**
		 * @eslint {comma-spacing}
		 * @unavailable
		 */
		// 'comma-spacing': null,

		/**
		 * @eslint {comma-style}
		 * @unavailable
		 */
		// 'comma-style': null,

		/**
		 * @eslint {computed-property-spacing}
		 * @unavailable
		 */
		// 'computed-property-spacing': null,

		/**
		 * @eslint {eol-last}
		 * @tslint {eofline}
		 * @provider {tslint}
		 */
		eofline: true,

		/**
		 * @eslint {func-call-spacing}
		 * @tslint {ter-func-call-spacing}
		 * @linrary {tslint-eslint-rules}
		 */
		'ter-func-call-spacing': [
			true,
			'never'
		],

		/**
		 * @eslint {func-name-matching}
		 * @unavailable
		 */
		// 'func-name-matching': null,

		/**
		 * @eslint {func-names}
		 * @unavailable
		 */
		// 'func-names': null,

		/**
		 * @eslint {indent}
		 * @tslint {ter-indent}
		 * @provider {tslint-eslint-rules}
		 */
		'ter-indent': [
			true,
			'tab',
			{
				SwitchCase: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1
				},
				FunctionExpression: {
					parameters: 1,
					body: 1
				},
				CallExpression: {
					arguments: 1
				}
			}
		],

		/**
		 * @eslint {jsx-quotes,quotes}
		 * @tslint {quotemark}
		 * @provider {tslint}
		 */
		quotemark: [
			true,
			'single',
			'jsx-double', // Rule: jsx-quotes
			'avoid-escape'
		],

		/**
		 * @eslint {key-spacing}
		 * @unavailable
		 */
		// 'key-spacing': null,

		/**
		 * @eslint {keyword-spacing}
		 * @unavailable
		 */
		// 'keyword-spacing': null,

		/**
		 * @eslint {linebreak-style}
		 * @tslint {linebreak-style}
		 * @provider {tslint}
		 */
		'linebreak-style': 'LF',

		/**
		 * @eslint {max-depth}
		 * @unavailable
		 */
		// 'max-depth': null,

		/**
		 * @eslint {max-nested-callbacks}
		 * @unavailable
		 */
		// 'max-nested-callbacks': null,

		/**
		 * @eslint {max-params}
		 * @unavailable
		 */
		// 'max-params': null,

		/**
		 * @eslint {max-statements-per-line}
		 * @unavailable
		 */
		// 'max-statements-per-line': null,

		/**
		 * @eslint {new-cap}
		 * @notApplicable
		 */
		// 'new-cap': null,

		/**
		 * @eslint {new-parens}
		 * @tslint {new-parens}
		 * @provider {tslint}
		 */
		'new-parens': true,

		/**
		 * @eslint {no-lonely-if}
		 * @unavailable
		 */
		// 'no-lonely-if': null,

		/**
		 * @eslint {no-mixed-operators}
		 * @unavailable
		 */
		// 'no-mixed-operators': null,

		/**
		 * @eslint {no-mixed-spaces-and-tabs}
		 * @tslint {indent}
		 * @provider {tslint}
		 */
		indent: [
			true,
			'tabs'
		],

		/**
		 * @eslint {no-multi-assign}
		 * @unavailable
		 */
		// 'no-multi-assign': null,

		/**
		 * @eslint {no-multiple-empty-lines}
		 * @tslint {no-consecutive-blank-lines}
		 * @provider {tslint}
		 */
		'no-consecutive-blank-lines': true,

		/**
		 * @eslint {no-negated-condition}
		 * @unavailable
		 */
		// 'no-negated-condition': null,

		/**
		 * @eslint {no-restricted-syntax}
		 * @unavailable
		 */
		// 'no-restricted-syntax': null,

		/**
		 * @eslint {no-whitespace-before-property}
		 * @unavailable
		 */
		// 'no-whitespace-before-property': null,

		/**
		 * @eslint {no-trailing-spaces}
		 * @tslint {no-trailing-whitespace}
		 * @provider {tslint}
		 */
		'no-trailing-whitespace': true,

		/**
		 * @eslint {no-unneeded-ternary}
		 * @unavailable
		 */
		// 'no-unneeded-ternary': null,

		/**
		 * @eslint {object-curly-spacing}
		 * @tslint {object-curly-spacing}
		 * @provider {tslint-eslint-rules}
		 */
		'object-curly-spacing': [
			true,
			'never'
		],

		/**
		 * @eslint {one-var,one-var-declaration-per-line}
		 * @tslint {one-variable-per-declaration}
		 * @provider {tslint}
		 */
		'one-variable-per-declaration': true,

		/**
		 * @eslint {operator-assignment}
		 * @unavailable
		 */
		// 'operator-assignment': null,

		/**
		 * @eslint {operator-linebreak}
		 * @unavailable
		 */
		// 'operator-linebreak': null,

		/**
		 * @eslint {padded-blocks}
		 * @unavailable
		 */
		// 'padded-blocks': null,

		/**
		 * @eslint {quote-props}
		 * @tslint {object-literal-key-quotes}
		 * @provider {tslint}
		 */
		'object-literal-key-quotes': [
			true,
			'as-needed'
		],

		/**
		 * @eslint {semi-spacing,space-before-blocks,space-infix-ops}
		 * @tslint {whitespace}
		 * @provider {tslint}
		 * @missed {before}
		 */
		whitespace: [
			true,
			'check-operator', // Rule: space-infix-ops
			'check-separator', // Rule: semi-spacing
			'check-preblock' // Rule: space-before-blocks
		],

		/**
		 * @eslint {semi-style}
		 * @unavailable
		 */
		// 'semi-style': null,

		/**
		 * @eslint {semi}
		 * @tslint {semicolon}
		 * @provider {tslint}
		 */
		semicolon: [
			true,
			'always'
		],

		/**
		 * @eslint {space-before-function-paren}
		 * @tslint {space-before-function-paren}
		 * @provider {tslint}
		 */
		'space-before-function-paren': [
			true,
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always'
			}
		],

		/**
		 * @eslint {space-in-parens}
		 * @tslint {space-in-parens}
		 * @provider {tslint-eslint-rules}
		 */
		'space-in-parens': [
			true,
			'never'
		],

		/**
		 * @eslint {space-unary-ops}
		 * @unavailable
		 */
		// 'space-unary-ops': null,

		/**
		 * @eslint {switch-colon-spacing}
		 * @unavailable
		 */
		// 'switch-colon-spacing': null,

		/**
		 * @eslint {template-tag-spacing}
		 * @unavailable
		 */
		// 'template-tag-spacing': null,

		/**
		 * @eslint {unicode-bom}
		 * @unavailable
		 */
		// 'unicode-bom': null,

		/**
		 * @eslint {arrow-parens}
		 * @tslint {ter-arrow-parens}
		 * @provider {tslint-eslint-rules}
		 */
		'ter-arrow-parens': [
			true,
			'as-needed'
		],

		/**
		 * @eslint {arrow-spacing}
		 * @tslint {ter-arrow-spacing}
		 * @provider {tslint-eslint-rules}
		 */
		'ter-arrow-spacing': [
			true,
			{
				before: true,
				after: true
			}
		]

		/**
		 * @eslint {constructor-super}
		 * @notApplicable
		 */
		// 'constructor-super': null,

		/**
		 * @eslint {generator-star-spacing}
		 * @unavailable
		 */
		// 'generator-star-spacing': null,

		/**
		 * @eslint {no-class-assign}
		 * @unavailable
		 */
		// 'no-class-assign': null,

		/**
		 * @eslint {no-const-assign}
		 * @notApplicable
		 */
		// 'no-const-assign': null,

		/**
		 * @eslint {no-dupe-class-members}
		 * @notApplicable
		 */
		// 'no-dupe-class-members': null,

		/**
		 * @eslint {no-new-symbol}
		 * @unavailable
		 */
		// 'no-new-symbol': null,

		/**
		 * @eslint {no-this-before-super}
		 * @notApplicable
		 */
		// 'no-this-before-super': null,

		/**
		 * @eslint {no-useless-computed-key}
		 * @unavailable
		 */
		// 'no-useless-computed-key': null,

		/**
		 * @eslint {no-useless-constructor}
		 * @unavailable
		 */
		// 'no-useless-constructor': null,

		/**
		 * @eslint {no-useless-rename}
		 * @unavailable
		 */
		// 'no-useless-rename': null,

		/**
		 * @eslint {require-yield}
		 * @unavailable
		 */
		// 'require-yield': null,

		/**
		 * @eslint {rest-spread-spacing}
		 * @unavailable
		 */
		// 'rest-spread-spacing': null,

		/**
		 * @eslint {symbol-description}
		 * @unavailable
		 */
		// 'symbol-description': null,

		/**
		 * @eslint {template-curly-spacing}
		 * @unavailable
		 */
		// 'template-curly-spacing': null,

		/**
		 * @eslint {yield-star-spacing}
		 * @unavailable
		 */
		// 'yield-star-spacing': null,
	}
};
