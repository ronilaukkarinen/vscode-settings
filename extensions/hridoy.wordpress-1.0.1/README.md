# Wordpress Devlopment Toolkit

**Now Updated for WordpPess 4.8.1 release**

This extension for Visual Studio Code adds snippets for WordPress. More Snippets will coming soon just release.

[Use Extension](https://github.com/hridoy/wordpress-development-vscode/blob/master/img/snippest-preview.jpg)

## Contributors

<!-- Contributors table start -->
[![Hridoy](https://avatars.githubusercontent.com/hridoy?s=100)<br /><sub>Hridoy</sub>](http://github.com/hridoy)<br />

<!-- Contributors table END -->
See the [CHANGELOG](https://github.com/hridoy/wordpress-development-vscode/master/CHANGELOG.md) for the latest changes




## Usage
Type part of a snippet, press `enter`, and the snippet unfolds.

### Wordpress Core Snippets
```php
ADMIN_COOKIE_PATH                 // Core ADMIN COOKIE PATH constant
add_blog_option                   // Add a new option for a given blog id.
add_action                        // Core Hooks a function on to a specific action.
```

### Custom Snippets List
```php
1. Dashboard functions          // 20 Added
2. Meta tag functions           // 5 Added
3. Shoertcode functions         // 5 Added
2. Widget functions           // 5 Added
```



### 1. Dashboard Snippets
```php
wp_change_admin_footer_text                    // Change Dashboard footer text
wp_disable_visual_editor                       // Disable Visual Editor
wp_change_admin_logo                           // Change Admin Logo
wp_column_thumbnail_to_post_list               // Add thumbnail column to post listing
wp_remove_admin_bar                            // Remove Admin Bar
wp_remove_dashboard_css                        // Remove Dashboard Css
wp_remove_dashboard_widget                     // Remove dashboard widget
```

### 2. Meta Tag Snippets
```php
wp_meta_open_graph                               // Add open graph meta tag
```

### 3. Shortcode Snippets
```php
wp_shortcode_member_content                      // Only Member can view the content
```

### 3. Widget Snippets
```php
wp_widget_disable_page                           //Disbale widget from custom page
wp_widget_disable_page_and_role                  //Disable Widget from Specific page by user role
```





Alternatively, press `Ctrl`+`Space` (Windows, Linux) or `Cmd`+`Space` (OSX) to activate snippets from within the editor.

## Installation

1. Install Visual Studio Code 1.10.0 or higher
2. Launch Code
3. From the command palette `Ctrl`-`Shift`-`P` (Windows, Linux) or `Cmd`-`Shift`-`P` (OSX)
4. Select `Install Extension`
5. Choose the extension
6. Reload Visual Studio Code
