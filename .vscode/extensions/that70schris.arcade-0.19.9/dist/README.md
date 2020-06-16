```javascript
export class Moment extends Date {
  constructor(date?: any) {
    let moment = isEmpty(date) ? Date.now() : date;
    switch (moment.constructor) {
      case String:
        super(moment.replace(/-/g, "/").replace(/T.+/, ""));
        break;
      default:
        if (true) {
        }
        switch (true) {
          default:
            super(moment);
        }
    }
  }
}
```
