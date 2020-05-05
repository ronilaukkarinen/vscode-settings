# Sass Variables Helper

### Features

This extension add a new tab in your activity bar with a Tree View of your Sass colors variables.
Get an overall look at all your colors easily and copy the associated variable in one click.

After you installed the extension, you have to specify the sass file you want to explore in your workspace settings, like so :
````js
"sassVariablesHelper.route": "/css/root/vars/_colors.scss"
````

If you have variables that are not colors, you need to wrap your colors variables around comments like below
````scss
// COLORS
$maincolor: #26318d;
$maincolor--light: #6f8f9d;
$textcolor: #26318d;
$red: #e40521;
$green: #009f37;
$lightcolor: #fff;
$darkcolor: #000;
$maingrey: #f8f8f8;
$dark-gray: #333;
$darker-gray: #231F20;
$medium-gray: #999;
$light-gray: #EBEBEB;
$grid-border: $light-gray;
// END COLORS
````

Here is a preview of how it looks
![Package Explorer](https://raw.githubusercontent.com/Nkzq/sass-variables-helper/master/resources/sass-variables.png)

### Roadmap

- Add search and filter
- Handle multiple files and variables

Thanks to Sangyong Lee from the Noun Project