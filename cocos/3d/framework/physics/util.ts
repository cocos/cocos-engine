import CANNON from 'cannon';
import { Vec3 } from '../../../core/value-types';

export interface IWrappedCANNON<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper> (cannonObject: any, wrapper: Wrapper) {
    (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper> (cannonObject: any) {
    return (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__;
}

export function toCannonVec3 (value: Vec3) {
    return new CANNON.Vec3(value.x, value.y, value.z);
}

export function toCannonOptions<T> (options: any, optionsRename?: { [x: string]: string; }) {
    const result = {};
    for (const key of Object.keys(options)) {
        let destKey = key;
        if (optionsRename) {
            const rename = optionsRename[key];
            if (rename) {
                destKey = rename;
            }
        }
        result[destKey] = options[key];
    }
    return result as T;
}
