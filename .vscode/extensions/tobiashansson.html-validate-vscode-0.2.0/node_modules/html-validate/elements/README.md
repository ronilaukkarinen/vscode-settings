# Element metadata

Element metadata is looked up based on tag name and contains information about
its content model, if it is deprecated, void element, etc.

Each element will have the following information:

```javascript
{
	// Content model
	metadata: boolean,
	flow: boolean,
	sectioning: boolean,
	heading: boolean,
	phrasing: boolean,
	embedded: boolean,
	interactive: boolean,

	// Markup related
	deprecated: boolean;
	void: boolean;
}
```

## Runtime evaluations

When the content models for a node is conditional, e.g. a `<video>` tag is only
interactive if the `controls` attribute is present, the model can be resolved at
runtime using an evaluator.

### `isDescendant`

Usage: `["isDescendant", "tagname"]`

Evaluates to true if the node is a descendant of `tagname`.

### `hasAttribute`

Usage: `["hasAttribute", "attr-name"]`

Evaluates to true if the node has an attribute named `attr-name` (the value
does't matter and can be boolean).

### `matchAttribute`

Usage: `["matchAttribute", ["attr-name", "=", "attr-value"]]`

Evaluates to true if the node has an attribute named `attr-name` with the value
`attr-value`. It supports both `=` and `!=`.
