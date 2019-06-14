import { Vec3 } from '../../core/value-types';
import { quat, vec3 } from '../../core/vmath';

export function stringfyVec3 (value: {x: number; y: number; z: number}): string {
    if (vec3.exactEquals(value, vec3.create())) {
        return `<origin>`;
    } else {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
    }
}

export function stringfyQuat (value: {x: number; y: number; z: number; w: number}): string {
    if (quat.exactEquals(value, quat.create())) {
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
