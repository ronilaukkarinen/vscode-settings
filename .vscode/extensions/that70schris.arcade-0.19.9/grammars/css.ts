import { writeFileSync } from 'fs';
import './sugar';

writeFileSync('./dist/css.json', JSON.stringify({
  injectionSelector: 'L:-comment',
  scopeName: 'injection.css',
  patterns: [
    {
      match: /(cursor|content)(?=:)/,
      name: 'meta.property-name',
    },
    {
      match: /([/]|::)((?:ng-)?deep)([/])?/,
      name: 'anchor',
      captures: {
        1: {
          name: 'punctuation',
        },
        3: {
          name: 'punctuation',
        },
      },
    },
  ],
}));
