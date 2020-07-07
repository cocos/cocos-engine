/**
 * @hidden
 */

import { IVec3Like, IQuatLike } from '../../core/math/type-define';

interface IWrapped<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper> (object: any, wrapper: Wrapper) {
    (object as IWrapped<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper> (object: any) {
    return (object as IWrapped<Wrapper>).__cc_wrapper__;
}

export function maxComponent (v: IVec3Like) {
    return Math.max(v.x, Math.max(v.y, v.z));
}

