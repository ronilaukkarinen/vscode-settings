# scss-scan README

## Features

- scanning scss variables & mixins & placeholders of  your ".scss" files in your workspace
- autocomplete the variables & mixins & placeholders when you are coding your styles in the ".scss" file
  workspace:

@mixins usage:
![autocomplete](https://gw.alicdn.com/tfs/TB1.qLAQpXXXXbOXVXXXXXXXXXX-480-359.gif)

## Usages

- I recommend you to create a `helper.scss` to store your `scss variables & mixins`  like  that:

 ```javascript
  ./src/styles
  ├── helper.scss
 ```
 ```sass
      //helper.scss
      $white: #FFFFFF;
      @mixin full-screen($color:#ffffff){
          position:absolute;
          top:0px;
          bottom:0px;
          left:0px;
          right:0px;
          background-color:$color;
          margin:0;
          padding:0;
          width:100%; 
          overflow:hidden; 
      }

      %text-control{
          text-align:center;
          padding:5px; 
      }
 ```

- When you has installed the extension ,it will  scan  all  scss files in your workspace. 

  You will see a "search" notifier in the left-bottom corner of the code editor.

  After creating some new '.scss' files or adding some new variables & mixins in your original '.scss' files,  you need to click the 'notifier' icon . It will scan again so that it can support the new variables & mixins & extend(placeholder`%`):
   ![search](https://gw.alicdn.com/tfs/TB1KkH8QpXXXXXRXXXXXXXXXXXX-480-192.gif) 

- You can also add your customed `.scss` files from the `node_modules` folder in the `scssscan.configuration`: 
![customed](https://gw.alicdn.com/tfs/TB1..0TQVXXXXXUXFXXXXXXXXXX-1190-732.gif)   
- In the end , you can use it like that :
   ![autocomplete](https://gw.alicdn.com/tfs/TB1LGTmQpXXXXcTaXXXXXXXXXXX-480-239.gif)
   ![extend](https://gw.alicdn.com/tfs/TB1LDpUQVXXXXX9XFXXXXXXXXXX-1102-732.gif)

##  Requirements

- node.js > 5.3.0

## Extension Settings

- no default extension settings

For example:

This extension contributes the following settings:

* `scss-scan.enable`: enable/disable this extension

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

I have not publish it to the GitHub, `cause the code still need to be optimized. 

If you have any issues , welcome to contact me  `aaronphy@outlook.com`.

## Release Notes

### 0.0.1

Initial and first release of this extension

### 0.0.2

activate bug fix

### 0.0.3 

Adding the `@extend`  and customed `.scss` files  configuration

