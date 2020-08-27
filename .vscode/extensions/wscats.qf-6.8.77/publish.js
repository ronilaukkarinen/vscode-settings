const fs = require('fs');
const packageJson = {
    "name": "qf",
    "displayName": "Beautify Javascript/Json/Css/Sass/Html",
    "description": "🚀Beautify javascript, json, css, sass and html.",
    "author": {
        "name": "Eno Yao",
        "email": "kalone.cool@gmail.com",
        "url": "https://github.com/Wscats"
    },
    "publisher": "Wscats",
    "version": "6.8.71",
    "preview": true,
    "icon": "logos/hero4.png",
    "homepage": "https://github.com/Wscats/compile-hero",
    "engines": {
        "vscode": "^1.39.0"
    },
    "galleryBanner": {
        "color": "#58bc58",
        "theme": "dark"
    },
    "bugs": {
        "url": "https://github.com/Wscats/compile-hero/issues/new"
    },
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/Wscats/compile-hero"
    },
    "categories": [
        "Other",
        "Programming Languages",
        "Snippets",
        "Linters",
        "Debuggers",
        "Formatters"
    ],
    "keywords": [
        "sass",
        "scss",
        "css",
        "typescript",
        "ts",
        "less",
        "ES6",
        "ES5",
        "JS",
        "javascript",
        "html",
        "compile",
        "translate",
        "tsx",
        "jade",
        "hero",
        "close",
        "port",
        "pug",
        "easysass",
        "easy",
        "super",
        "minified",
        "format",
        "json",
        "formatter",
        "beautify"
    ],
    "activationEvents": [
        "*",
        "onCommand:compile-hero.openInBrowser",
        "onCommand:compile-hero.closePort",
        "onCommand:compile-hero.compileFile",
        "onCommand:compile-hero.compileHeroOn",
        "onCommand:compile-hero.compileHeroOff",
        "onCommand:compile-hero.beautify",
        "onCommand:compile-hero.beautifyFile"
    ],
    "main": "./out/extension.js",
    "contributes": {
        "commands": [
            {
                "command": "compile-hero.openInBrowser",
                "title": "Open In Browser"
            },
            {
                "command": "compile-hero.closePort",
                "title": "Close Port"
            },
            {
                "command": "compile-hero.compileFile",
                "title": "Compile Files"
            },
            {
                "command": "compile-hero.beautify",
                "title": "Beautify"
            },
            {
                "command": "compile-hero.beautifyFile",
                "title": "Beautify File"
            }
        ],
        "languages": [
            {
                "id": "json",
                "aliases": [
                    "JSON"
                ],
                "filenames": [
                    ".jsbeautifyrc",
                    ".jshintrc"
                ]
            }
        ],
        "jsonValidation": [
            {
                "fileMatch": ".jsbeautifyrc",
                "url": "./beautifyrc.json"
            }
        ],
        "configuration": {
            "title": "Compile hero configuration",
            "properties": {
                "compile-hero.disable-compile-files-on-did-save-code": {
                    "type": "boolean",
                    "default": false,
                    "description": "Disable compile files on did save code."
                },
                "compile-hero.javascript-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling javascript."
                },
                "compile-hero.sass-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling sass."
                },
                "compile-hero.scss-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling sass."
                },
                "compile-hero.less-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling less."
                },
                "compile-hero.jade-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling jade."
                },
                "compile-hero.typescript-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling typescript."
                },
                "compile-hero.typescriptx-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling typescriptx."
                },
                "compile-hero.pug-output-directory": {
                    "type": "string",
                    "default": "./dist",
                    "description": "Set the directory to output after compiling pug."
                },
                "compile-hero.javascript-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of javascript."
                },
                "compile-hero.sass-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of sass."
                },
                "compile-hero.scss-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of sass."
                },
                "compile-hero.less-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of less."
                },
                "compile-hero.jade-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of jade."
                },
                "compile-hero.typescript-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of typescript."
                },
                "compile-hero.typescriptx-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of typescriptx."
                },
                "compile-hero.pug-output-toggle": {
                    "type": "boolean",
                    "default": true,
                    "description": "Switch to control the compilation of pug."
                },
                "compile-hero.generate-minified-html": {
                    "type": "boolean",
                    "default": false,
                    "description": "Enable to generate minified html (*.min.html) files."
                },
                "compile-hero.generate-minified-css": {
                    "type": "boolean",
                    "default": false,
                    "description": "Enable to generate minified css (*.min.css) files."
                },
                "compile-hero.generate-minified-javascript": {
                    "type": "boolean",
                    "default": false,
                    "description": "Enable to generate minified javascript (*.dev.js) files."
                },
                "compile-hero.ignore": {
                    "type": [
                        "string",
                        "array"
                    ],
                    "items": {
                        "type": "string"
                    },
                    "default": [],
                    "description": "List of paths to ignore when using VS Code format command, including format on save. Uses glob pattern matching.",
                    "scope": "resource"
                },
                "compile-hero.config": {
                    "type": [
                        "string",
                        "object",
                        "null"
                    ],
                    "default": null,
                    "description": "A path to a file, or an object containing the configuration options for js-beautify. If the .jsbeautifyrc file exists in project root, it overrides this configuration."
                },
                "compile-hero.language": {
                    "type": "object",
                    "description": "Link file types to the beautifier type",
                    "default": {
                        "js": {
                            "type": [
                                "javascript",
                                "json",
                                "jsonc"
                            ],
                            "filename": [
                                ".jshintrc",
                                ".jsbeautifyrc"
                            ]
                        },
                        "css": [
                            "css",
                            "less",
                            "scss"
                        ],
                        "html": [
                            "htm",
                            "html"
                        ]
                    },
                    "properties": {
                        "js": {
                            "type": [
                                "object",
                                "array",
                                "null"
                            ],
                            "items": {
                                "type": "string"
                            },
                            "description": "Array of language types, or an object containing types, extensions and filenames to associate",
                            "properties": {
                                "type": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "VS Code language name"
                                },
                                "ext": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "File extensions (without the leading dot)"
                                },
                                "filename": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Full filenames (eg: '.jsbeautifyrc')"
                                }
                            }
                        },
                        "css": {
                            "type": [
                                "object",
                                "array",
                                "null"
                            ],
                            "items": {
                                "type": "string"
                            },
                            "description": "Array of language types, or an object containing types, extensions and filenames to associate",
                            "properties": {
                                "type": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "VS Code language name"
                                },
                                "ext": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "File extensions (without the leading dot)"
                                },
                                "filename": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Full filenames (eg: '.jsbeautifyrc')"
                                }
                            }
                        },
                        "html": {
                            "type": [
                                "object",
                                "array",
                                "null"
                            ],
                            "items": {
                                "type": "string"
                            },
                            "description": "Array of language types, or an object containing types, extensions and filenames to associate",
                            "properties": {
                                "type": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "VS Code language name"
                                },
                                "ext": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "File extensions (without the leading dot)"
                                },
                                "filename": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Full filenames (eg: '.jsbeautifyrc')"
                                }
                            }
                        }
                    }
                }
            }
        },
        "menus": {
            "explorer/context": [
                {
                    "when": "resourceLangId == html",
                    "command": "compile-hero.openInBrowser",
                    "group": "open-in-browser"
                },
                {
                    "command": "compile-hero.compileFile"
                }
            ],
            "editor/context": [
                {
                    "when": "resourceLangId == html",
                    "command": "compile-hero.openInBrowser",
                    "group": "open-in-browser"
                },
                {
                    "command": "compile-hero.compileFile"
                }
            ],
            "editor/title/context": [
                {
                    "when": "resourceLangId == html",
                    "command": "compile-hero.openInBrowser",
                    "group": "open-in-browser"
                },
                {
                    "command": "compile-hero.compileFile"
                }
            ]
        }
    },
    "scripts": {
        "build": "npm run build:delete.vsix && npm run build:compile.hero && npm run build:beautify",
        "vscode:prepublish": "yarn run compile",
        "build:delete.vsix": "node publish d",
        "build:compile.hero": "node publish c && vsce package",
        "build:beautify": "node publish b && vsce package",
        "compile": "tsc -p ./",
        "watch": "tsc -watch -p ./",
        "postinstall": "node ./node_modules/vscode/bin/install",
        "test": "yarn run compile && node ./node_modules/vscode/bin/test"
    },
    "dependencies": {
        "@babel/core": "^7.7.0",
        "@babel/preset-env": "^7.7.1",
        "@types/mocha": "^2.2.42",
        "@types/node": "^10.12.21",
        "editorconfig": "^0.15.3",
        "gulp": "^4.0.2",
        "gulp-babel": "^8.0.0",
        "gulp-jade": "^1.1.0",
        "gulp-less": "^4.0.1",
        "gulp-minify-css": "^1.2.4",
        "gulp-rename": "^1.4.0",
        "gulp-typescript": "^5.0.1",
        "gulp-uglify": "^3.0.2",
        "js-beautify": "^1.13.0",
        "minimatch": "^3.0.4",
        "open": "^6.4.0",
        "pug": "^2.0.4",
        "sass": "^1.26.10",
        "typescript": "^3.3.1"
    },
    "devDependencies": {
        "vscode": "^1.1.28"
    }
}

const deleteVsix = (uri) => {
    const files = fs.readdirSync(uri);
    files.forEach((filename) => {
        if (filename.indexOf('vsix') >= 0) {
            fs.unlinkSync(filename);
        }
    });
};

switch (process.argv[2]) {
    case 'c':
        packageJson.name = "qf";
        packageJson.displayName = "Formatters Hero - Beautify Javascript/Json/Css/Sass/Html";
        packageJson.description = "🚀Beautify javascript, json, css, sass and html.";
        packageJson.version = "6.8.77";
        packageJson.preview = true;
        packageJson.icon = "logos/hero4.png";
        packageJson.contributes.configuration.properties["compile-hero.disable-compile-files-on-did-save-code"] = true;
        fs.writeFileSync('./package.json', JSON.stringify(packageJson));
        break;
    case 'b':
        packageJson.name = "eno";
        packageJson.displayName = "Sass/Less/Scss/Typescript/Javascript/Jade/Pug Compile Hero Pro";
        packageJson.description = "🚀Easy to compile ts, tsx, scss, less, jade, pug and es6+ on save without using a build task.";
        packageJson.contributes.configuration.properties["compile-hero.disable-compile-files-on-did-save-code"] = false;
        packageJson.version = "2.3.10";
        packageJson.preview = true;
        packageJson.icon = "logos/hero2.png";
        fs.writeFileSync('./package.json', JSON.stringify(packageJson));
        break;
    case 'd':
        deleteVsix(__dirname);
}