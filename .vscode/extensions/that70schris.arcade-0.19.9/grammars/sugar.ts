Object.defineProperty(
  RegExp.prototype, 'toJSON', {
    value() {
      return this.toString().slice(1, -1);
    },
  }
);
