/**
 * @hidden
 */

import { Quat, Vec3 } from '../../core/value-types';

export function stringfyVec3 (value: {x: number; y: number; z: number}): string {
    if (Vec3.exactEquals(value, Vec3.create())) {
        return `<origin>`;
    } else {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
    }
}

export function stringfyQuat (value: {x: number; y: number; z: number; w: number}): string {
    value = Quat.create(value.x, value.y, value.z, value.w);
    if (Quat.exactEquals(value, Quat.create())) {
        return `<Identity>`;
    } else {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
    }
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
