# html-validate changelog

## Upcoming release

## 1.2.1 (2019-07-30)

- fix configuration when using multiple extends.

## 1.2.0 (2019-06-23)

- new rule `prefer-tbody` to validate presence of `<tbody>` in `<table`.
- add `requiredAncestors` metadata and validation to test elements with
  additional requirements for the parent elements, such as `<area>` and
  `<dd>`/`<dt>`.
- add `HtmlElement.closest()` to locate a parent matching the given selector.
- add `HtmlElement.matches()` to test if a selector matches the given element.
- fix so multiple combinators can be used in selectors, e.g. `foo > bar > baz`
  now works as expected.

## 1.1.2 (2019-06-18)

- allow div to group elements under dl (fixes #44).

## 1.1.1 (2019-06-07)

- `Reporter` is now exposed in shim.
- `getFormatter` CLI API now returns output as string instead of writing
  directly to stdout.
- `codeframe` formatter now adds final newline in output.

## 1.1.0 (2019-06-04)

- `input-missing-label` now validates `<textarea>` and `<select>`.
- `querySelector` and friends now handles `[attr="keyword-with-dashes"]` and
  similar constructs.

## 1.0.0 (2019-05-12)

- rule `wcag/h37` now ignores images with `role="presentation` or
  `aria-hidden="true"`.
- allow `crossorigin` attribute to be boolean or `""` (maps to `"anonymous"`).
- add `<picture>` element.
- mark `<style>` as foreign as to not trigger errors inside css content.
- allow whitespace around attribute equals sign, e.g `class = "foo"`.

## 0.25.1 (2019-05-10)

- allow raw ampersands (`&`) in quoted attributes.
- extend set of allowed characters in unquoted attributes in lexer.

## 0.25.0 (2019-04-23)

- new rule `unrecognized-char-ref` for validating character references.
- add support for `auto` style for `attr-quotes` rule.
- new rule `no-raw-characters` to check for presence of unescaped `<`, `>` and
  `&` characters.

## 0.24.2 (2019-03-31)

### Features

- new rule `meta-refresh`.
- new event `element:ready` triggered after an element and its children has been
  fully constructed.
- add plugin callbacks `init()` and `setup()`.
- new rule `require-sri`.
- add `<slot>` element.

## 0.24.1 (2019-03-26)

### Bugfixes

- fix broken edit links in footer.
- fix broken import causing typescript API users getting build errors.

## 0.24.0 (2019-03-26)

### Features

- adding link to edit documentation and view rule source in documentation.
- new rule `wcag/h36`.
- new rule `wcag/h30`.
- new rule `long-title`.
- new rule `empty-title`.
- add `UserError` exception which is to be used for any error which is not
  caused by an internal error, e.g. configuration errors or a plugin. The error
  supresses the notice about internal error which should be reported as a bug.
- reworked and extendable validation of elements metadata. Plugins may now add
  support for custom metadata.

### Bugfixes

- fix handling of plugins with no rules.

## 0.23.0 (2019-03-20)

### Features

- new rule `empty-heading` validating headers have textual content.
- let plugins add configuration presets.
- add `processElement` hook on `Source`.
- add `textContent` property on `DOMNode` to get text (recursive) from child
  nodes. A new node type `TextNode` is added.
- add `firstChild` and `lastChild` to `DOMNode`.
- docs: precompile syntax highlighting for smoother page loads.
- expose `Config`, `ConfigData` and `ConfigLoader` in shim.

## 0.22.1 (2019-02-25)

### Breaking change

- `.children` has been split and moved from `HtmlElement` to
  `DOMNode`. `.childNodes` replaces the original `.children` but is now typed
  `DOMNode[]` (and in a future release may contain other node types). A getter
  `.nodeElements` can be used to access only `HtmlElement` from `.childNodes`
  and is typed `HtmlElement[]`. If your rules use `.children` the

### Bugfixes

- `<rootDir>` is now respected when configuring plugins.
- fix cosmetic case of `wcag/h37` rule.

## 0.22.0 (2019-02-24)

### Breaking changes

- `HtmlElement` direct access to `attr` is replaced with `attributes`. The
  former was an key-value object and the latter is a flattened array of
  `Attribute`.

### Features

- exposes `Source` and `AttributeData` in shim.
- `HtmlElement` will now store duplicated (or aliased) attributes. The biggest
  change this introduces is that `classList` will now contain a merged list of
  all classes. This is needed when combining a static `class` attribute with a
  dynamic one.
- DOM `Attribute` got two flags `isStatic` and `isDynamic` to easily tell if the
  value is static or dynamic.
- more verbose exception when a transformer fails. (fixes #37)
- allow `processAttribute` hook to yield multiple attributes, typically used
  when adding aliased attributes such as `:class`. By adding both the alias and
  the original the latter can be validated as well (e.g. `no-dup-attr` can
  trigger for multiple uses of `:class`). (fixes #36)
- allow setting hooks when using `HtmlValidate.validateString`, makes it easier
  to write tests which requires hooks, e.g. processing attributes.

### Bugfixes

- `[attr]` selector now matches boolean attributes.
- `attribute-boolean-style` and `no-dup-attr` now handles when dynamic
  attributes is used to alias other attributes, e.g `:required="foo"` no longer
  triggers an boolean style and `class=".."` combined with `:class=".."` no
  longer triggers duplicate attributes. (fixes #35)
- `attribute-allowed-values` now ignores boolean attributes with dynamic
  values. (partially fixes #35)

## 0.21.0 (2019-02-17)

### Breaking changes

- `button-type` is replaced with `element-required-attributes`.

### Features

- new rule `element-required-attributes` replaces `button-type` and allows any
  element to contain `requiredAttributes` metadata.
- support foreign elements. The body of the foreign element will be discarded
  from the DOM tree and not trigger any rules.
- CLI write a more verbose message when unhandled exceptions are raised.
- `--dump-events` output reduced by hiding element metadata and compacting
  location data.
- use jest snapshots to test element metadata as it is more maintainable.

### Bugfixes

- allow `<area shape="default">` (fixes #31)

## 0.20.1 (2019-02-06)

### Bugfixes

- fix #33: ensure `wcag/h37` and `wcag/h67` checks if node exists before testing
  tagname.
- handle boolean attributes in `attribute-allowed-values`.

## 0.20.0 (2019-01-29)

### Features

- update `codeframe` formatter to show not just start location but also end.

### Bugfixes

- Fixes html-validate-angular#1 by handling both regular and arrow functions.

## 0.19.0 (2019-01-27)

### Breaking changes

- `img-req-alt` has been renamed `wcag/h37`.

### Features

- new rule `prefer-button`.
- `Attribute` now stores location of value.
- new rules `wcag/h32` and `wcag/h67`.
- move `location` and `isRootElement` to `DOMNode` and add new `nodeType`
  property.
- add `Attribute.valueMatches` to test attribute value. Handles `DynamicValue`.
- `querySelector` now handles selector lists (comma-separated selectors)

## 0.18.2 (2019-01-14)

### Bugfixes

- fix issue when calling `getAttributeValue` on a boolean attribute.
- handle `DynamicValue` in `DOMTokenList` and `id-pattern`.

## 0.18.1 (2019-01-12)

### Features

- CLI learned `--print-config` to output configuration for a given file.

## 0.18.0 (2019-01-10)

### Features

- add support for dynamic attribute values, that is the value is marked as being
  set but has no known value. Rules are expected to assume the value exists and
  is valid. The primary usage for this is in combination with the
  `parseAttribute` hook, e.g `:id="..."` can yield attribute `id` with a dynamic
  value.
- add support for transformer hooks, currently the only hook is `parseAttribute`
  allowing the transformer to alter the attribute before any events are emitted,
  e.g. it can pick up the vuejs `:id` attribute and pass it as `id` to allow
  other rules to continue just as if `id` was typed.

### Bugfixes

- fix `ConfigLoader` tests when running on windows.

## 0.17.0 (2019-01-09)

### Breaking changes

- `DOMNode` has been renamed `HtmlElement` and there is instead a new base class
  `DOMnode` which `HtmlElement` extends from. Rules using `DOMNode` need to be
  changed to use `HtmlElement`.

### Features

- use [Prettier](https://prettier.io/) for formatting sources.
- add `HtmlValidate.getRuleDocumentation()` API for IDEs to fetch contextual
  rule documentation.
- add `codeframe` formatter (from eslint).
- add `HtmlValidate.flushConfigCache` to allow flushing the config loader cache.
- add `TemplateExtractor.createSource` as a quick way to create a source from
  filename.
- add typescript definition for `shim.js`
- add `validateSource` to `HtmlValidate` allowing to manually passing a source.
- `HtmlValidate.getConfigFor` is now part of public API.

### Bugfixes

- Directives can now enable/disable rules working with `dom:ready` event.
- `HtmlElement` location is now shifted by 1.

## 0.16.1 (2018-12-16)

### Bugfixes

- `Message` now passes `size` property from `Location`

## 0.16.0 (2018-12-15)

### Features

- `Location` has a new property `size` holding the number of characters the
  location refers to.
- `HtmlValidate` class now loads same default config as CLI if no configuration
  is passed explicitly.
- `Location` has a new property `offset` holding the offset into the source
  data (starting at zero).
- CLI learned `--stdin` and `--stdin-filename` for passing markup on standard
  input and explicitly naming it. Useful for external tools and IDEs which wants
  to pass the markup in stdin instead of a temporary file.

## 0.15.3 (2018-12-05)

### Features

- expose `querySelector` and `querySelectorAll` on `DOMNode`, not just
  `DOMTree`.

## 0.15.2 (2018-12-01)

### Features

- move repository to https://gitlab.com/html-validate/html-validate
- move homepage to https://html-validate.org
- more element attributes added.

## 0.15.1 (2018-11-26)

### Features

- new properties `previousSibling` and `nextSibling` on `DOMNode`.

## 0.15.0 (2018-11-21)

### Features

- new rule `attribute-boolean-style` to validate style of boolean attributes.
- new property `nodeName` on `DOMNode`.

### Bugfixes

- `attribute-allowed-values` now normalizes boolean attributes before
  validating, i.e. it will accept `disabled`, `disabled=""` or
  `disabled="disabled"`. Fixes #13.
- `input` learned `required` attribute.
- `querySelector` properly handles attribute selectors with dashes and
  digits. Fixes #15.

## 0.14.2 (2018-11-06)

### Features

- bump dependencies.
- use `acorn-walk` instead of `acorn@5`.

## 0.14.1 (2018-11-04)

### Bugfixes

- fix dependency on `acorn`, the package now properly resolves acorn 5 when
  dependant pulls acorn 6.

## 0.14.0 (2018-11-03)

- support global metadata.
- new rule `attribute-allowed-values` validates allowed values for attributes,
  such as `type` for `<input>`.

## 0.13.0 (2018-10-21)

### Features

- `deprecated` supports adding a message for custom elements.
- Rule constructors can now throw exceptions. Previously the exceptions would be
  silently swallowed and the rule would trigger the missing rule logic.
- Support writing element metadata inline in configuration file.

### Bugfixes

- `element-permitted-order` now reports the error where the malplaced element is
  instead of the parent element (which holds the restriction). Fixes #10.

## 0.12.0 (2018-10-17)

### Features

- Support writing plugins with custom rules.
- Bump dependencies, including typescript 3.0 to 3.1

## 0.11.1 (2018-10-07)

### Features

- Rule documentation examples are now validated automatically with htmlvalidate
  to provide direct feedback of how a rule will react on the given markup.

### Bugfixes

- `no-implicit-close` now provides more context when closed by a sibling.
- `close-order` no longer reports error for implicitly closed elements.

## 0.11.0 (2018-09-23)

### Breaking changes

- For compatibility with other tools the severity `disable` has been renamed to
  `off`. The old name will continue to work but will be removed in the future.

### Features

- support directives to enable/disable rules inside files, e.g. to ignore a
  single error.
- rules are now using dynamic severity which can change at runtime.
- new class `Attribute` used by `DOMNode`. Attributes now holds the location
  they are created from making DOM attribute rules more precise.
- new rule `heading-level` for validating sequential heading levels.

### Bugfixes

- `element-permitted-occurrences` no longer triggers for the first occurrence,
  only subsequent usages.
- `Table.getMetaFor(..)` is not case-insensitive.

## 0.10.0 (2018-08-11)

### Breaking changes

- rule api overhaul, all rules are now classes.

### Features

- support multiple events for single listener and listener deregistration.
- new `Engine` class for easier programmatical usage.
- stricter types related to events
- bump dependencies.

### Bugfixes

- add espree dependency

## 0.9.2 (2018-07-12)

### Features

- add `no-inline-style` to `htmlvalidate:recommended`.
- add `htmlvalidate:document` for predefined set of document-related rules,
  e.g. recommended for documents but not component templates.
- add `missing-doctype` rule to require doctype.
- add source location to root DOMNode containing the first line and column in
  the source file.
- add `doctype` property to `DOMTree`.
- add `doctype` event, emitted when a doctype is encountered.
- add `element-case` rule for validating case of element names.
- add `attr-case` rule for validating case of attributes.

## 0.9.1 (2018-07-01)

### Features

- add `protractor-html-validate` to docs.

## 0.9.0 (2018-06-17)

### Breaking changes

- semantics for `require` changed from `require('html-validate')` to
  `require('html-validate').HtmlValidate` to support exposing other classes.

### Features

- new `TemplateExtractor` helper class for extracting templates from javascript
  sources.
- trigger downstream projects on release

### Bugfixes

- Report `valid` now only checks for errors, the result will still be valid if
  only warnings are present.

## 0.8.3 (2018-06-12)

- run tests against multiple node versions (8.x, 9.x and 10.x) to ensure
  compatibility.
- exposed `getFormatter` as a reusable function to load formatters from string
  (like CLI tool): `name[=DST][,name=DST...]`

## 0.8.2 (2018-05-28)

### Bugfixes

- lexer better handling of newlines, especially CRLF `\r\n`.

## 0.8.1 (2018-05-27)

### Misc

- update `package.json`

## 0.8.0 (2018-05-27)

### Features

- easier API usage: `require('html-validate')` now returns class without using
  `require(html-validate/build/htmlvalidate').default`.
- support `transform` in configuration to extract source html from other files.
- attach `depth` and `unique` readonly properties to `DOMNode` corresponding to
  the nodes depth in the DOM tree and a sequential id (unique for the session).
- new rule `no-conditional-comments` to disallow usage of conditional comments.
- handle conditional comments.

### Bugfixes

- handle whitespace before doctype
- DOMTokenlist now handles multiple spaces as delimiter and strip
  leading/trailing whitespace.

## 0.7.0 (2017-11-04)

### Features

- new rule `no-implicit-close` to disallow usage of optional end tags.
- handle optional end tags.
- better result sorting, error messages are now sorted by line and column, the
  stage which triggered the error doesn't matter any longer.
- better result merging, files will no longer be duplicated.
- element metadata can no be sourced from multiple sources and be configured
  using the `elements` configuration property.

### Improvements

- better configuration merging

### Bugfixes

- fixed script tag incorrectly consuming markup due to greedy matching.

## 0.6.0 (2017-10-29)

### Features

- new rule `no-deprecated-attr` for testing if any deprecated attributes is
  used.
- CLI supports globbing (as fallback if shell doesn't expand the glob already)

### Bugfixes

- fix lowercase `<!doctype html>` crashing the lexer.
- fix node binary name in shebang
- fix directory traversal on windows

## 0.5.0 (2017-10-17)

### Features

- Rule `element-name` learned `whitelist` and `blacklist` options.
- Support outputting to multiple formatters and capturing output to file.
- checkstyle formatter. Use `-f checkstyle`.

## 0.4.0 (2017-10-17)

### Features

- new rule `no-inline-style` disallowing inline `style` attribute.
- new rule `img-req-alt` validating that images have alternative text.
- new rule `element-permitted-order` validating the required order of elements
  with restrictions.
- new rule `element-permitted-occurrences` validating elements with content
  models limiting the number of times child elements can be used.

### Bugfixes

- the parser now resets the DOM tree before starting, fixes issue when running
  the same parser instance on multiple sources.

## 0.3.0 (2017-10-12)

### Features

- new rules `id-pattern` and `class-pattern` for requiring a specific formats.
- new rule `no-dup-class` preventing duplicate classes names on the same
  element.

### Bugfixes

- lexer now chokes on `<ANY\n<ANY></ANY></ANY>` (first tag missing `>`) instead
  of handling the inner `<ANY>` as an attribute.
- `element-permitted-content` fixed issue where descending with missing metadata
  would report as disallowed content.

## 0.2.0 (2017-10-11)

### Features

- Support putting configuration in `.htmlvalidate.json` file.
- `void` rule rewritten to better handle both tag omission and self-closing. It
  learned a new option `style` to allow a single style.
- new rule `element-permitted-content` verifies that only allowed content is
  used.
- new rule `element-name` to validate custom element names.

## 0.1.3 (2017-10-08)

### Features

- Rule documentation

### Bugfixes

- `no-dup-attr` now handles attribute names with different case.
