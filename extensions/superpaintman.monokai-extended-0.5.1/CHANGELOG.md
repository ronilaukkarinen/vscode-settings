# Changelog
## 0.5.1
#### Chore
##### `changed` - urls in `README.md`

## 0.5.0
#### Go
##### `added` - colors for some scopes

#### Markdown
##### `added` - colors for some scopes

## 0.4.1
#### Chore
##### `added` - table of colors to `README.md`

## 0.4.0
### Clojure
#### `added` - color for `def`'s

```clojure
; v
(ns my.test)
; v
(def get-name [])
```

#### `added` - color for keywords

```clojure
(ns my.test
;      v                     v
  (:require [clojure.test :refer [deftest is]]
            anagram))
```

## 0.3.0
### GitGutter
#### `added` - colors for GitGutter

## 0.2.0
### JavaScript / TypeScirpt
#### `added` - color for `this`

```ts
class Animal {
  constructor() {
    // v
    this.name = "SuperPaintman"
  }
}
```

#### `added` - color for library variables

```ts
global
root
__dirname
__filename
```

#### `changed` - JSX component color

```jsx
<header className="header">
  <h1>todos</h1>
  {/*    v           */}
  <TodoTextInput newTodo
                 onSave={this.handleSave}
                 placeholder="What needs to be done?" />
</header>
```
