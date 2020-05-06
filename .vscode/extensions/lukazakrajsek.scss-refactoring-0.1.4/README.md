# SCSS Refactoring

SCSS Refactoring tools

## Extract variable

Extract selection into new variable. Name is automatically generated from context.

Shortcut: `Ctrl+Alt+E` on Windows and `⌘+Ctrl+E` on Mac.

![preview](https://github.com/bancek/vscode-scss-refactoring/raw/master/preview.gif)

### Examples

```scss
.foo {
    background-color: #f8f8f8;
}
```
```scss
$foo-bg-color: #f8f8f8;

.foo {
    background-color: $foo-bg-color;
}
```

***

```scss
@import "common";

$foo-text-color: #333;

.foo {
    color: $foo-text-color;
    background-color: #f8f8f8;
}
```
```scss
@import "common";

$foo-text-color: #333;
$foo-bg-color: #f8f8f8;

.foo {
    color: $foo-text-color;
    background-color: $foo-bg-color;
}
```

***

```scss
.l-menu {
    &__item {
        color: #f8f8f8;
    }
}
```
```scss
$menu-item-text-color: #f8f8f8;

.l-menu {
    &__item {
        color: $menu-item-text-color;
    }
}
```

***

```scss
.l-menu {
    &__header {
        border-radius: 3px;
    }
    &__item {
        color: #f8f8f8;
    }
}
```
```scss
$menu-item-text-color: #f8f8f8;

.l-menu {
    &__header {
        border-radius: 3px;
    }
    &__item {
        color: $menu-item-text-color;
    }
}
```

***

```scss
#menu {
    &.active:hover a {
        font-weight: bold;
    }
}
```
```scss
$menu-active-hover-link-font-weight: bold;

#menu {
    &.active:hover a {
        font-weight: $menu-active-hover-link-font-weight;
    }
}
```

## Format variables

Format variables.

### Examples

```scss
$foo-text-color: #333;
$foo-bg-color: #ffffff;
```
```scss
$foo-text-color: #333;
$foo-bg-color:   #ffffff;
```

***

```scss
@import "variables";

$foo-text-color: #333;
$foo-bg-color: #ffffff;

.foo {
    color: $foo-text-color;
    background-color: $foo-bg-color;
}
```
```scss
@import "variables";

$foo-text-color: #333;
$foo-bg-color:   #ffffff;

.foo {
    color: $foo-text-color;
    background-color: $foo-bg-color;
}
```
