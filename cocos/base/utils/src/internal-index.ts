import { js } from './js';

export { ScalableContainer, scalableContainerManager } from './memop/scalable-container';

export function isPlainEmptyObj (obj): boolean {
    if (!obj || obj.constructor !== Object) {
        return false;
    }
    return js.isEmptyObject(obj);
}

export function applyMixins (derivedCtor: any, baseCtors: any[]): void {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (name !== 'constructor') {
                Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name)!);
            }
        });
    });
}
