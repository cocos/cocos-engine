import { js } from './js';

export { ScalableContainer, scalableContainerManager } from './memop/scalable-container';

export function isPlainEmptyObj (obj): boolean {
    if (!obj || obj.constructor !== Object) {
        return false;
    }
    return js.isEmptyObject(obj);
}
