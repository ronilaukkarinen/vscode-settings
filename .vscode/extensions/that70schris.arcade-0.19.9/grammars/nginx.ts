import { writeFileSync } from 'fs';
import './sugar';

writeFileSync('./dist/nginx.json', JSON.stringify({
  injectionSelector: 'L:-comment',
  scopeName: 'injection.nginx',
  patterns: [{
    match: /(@)\w+/,
    name: 'anchor',
    captures: {
      1: {
        name: 'punctuation',
      },
    },
  }],
}));
