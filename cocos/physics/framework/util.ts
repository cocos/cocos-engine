/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { IVec3Like, IQuatLike } from '../../core/math/type-define';

export function stringfyVec3 (value: IVec3Like): string {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;    
}

export function stringfyQuat (value: IQuatLike): string {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
}

interface IWrapped<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper> (object: any, wrapper: Wrapper) {
    (object as IWrapped<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper> (object: any) {
    return (object as IWrapped<Wrapper>).__cc_wrapper__;
}

export function maxComponent (v: Vec3) {
    return Math.max(v.x, Math.max(v.y, v.z));
}
