"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Extractor {
    enableStrategies(strategiesToEnable) {
        this.enabledStrategies = this.strategies.filter(strategy => {
            if (strategiesToEnable.find(_ => _ === strategy.name)) {
                let constructor = strategy.constructor;
                return new constructor();
            }
        });
    }
    constructor() {
        this.strategies = [];
    }
    registerStrategy(strategy) {
        if (!this.has(strategy)) {
            this.strategies.push(strategy);
        }
    }
    has(strategy) {
        if (typeof strategy === 'string') {
            return this.strategies.some(_ => _.name === strategy);
        }
        return this.strategies.some(_ => _.name === strategy.name);
    }
    get(strategy) {
        if (this.has(strategy) === false) {
            return null;
        }
        return this.strategies.find(_ => _.name === strategy);
    }
}
exports.Extractor = Extractor;
// Use mixin instead?
// type Constructor<T = {}> = new (...args: any[]) => T;
// export function TExtractor<TBase extends Constructor>(Base: TBase) {
//   return class TExtractor extends Base {
//       public extractors: IStrategy[];
//       constructor(...args: any[]) {
//         super(...args);
//         this.extractors = [];
//       }
//       public registerExtractor(extractor: IStrategy) {
//         if (!this.has(extractor)) {
//           this.extractors.push(extractor);
//         }
//       }
//       public has(extractor: string | IStrategy): boolean {
//         if (typeof extractor === 'string') {
//           return this.extractors.some(_ => _.name === extractor);
//         }
//         return this.extractors.some(_ => _.name === extractor.name);
//       }
//       public get(extractor: string | IStrategy): IStrategy {
//         if (this.has(extractor) === false) {
//           return null;
//         }
//         return this.extractors.find(_ => _.name === extractor);
//       }
//   };
// }
//# sourceMappingURL=extractor-mixin.js.map