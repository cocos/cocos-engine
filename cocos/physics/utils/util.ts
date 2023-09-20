/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { equals, Vec3, IVec3Like, murmurhash2_32_gc } from '../../core';
import { CharacterController, CharacterTriggerEventType, Collider, CollisionEventType, IContactEquation, TriggerEventType } from '../framework';

export { cylinder } from '../../primitive';

interface IWrapped<T> {
    __cc_wrapper__: T;
}

export function setWrap<Wrapper> (object: any, wrapper: Wrapper): void {
    (object as IWrapped<Wrapper>).__cc_wrapper__ = wrapper;
}

export function getWrap<Wrapper> (object: any): Wrapper {
    return (object as IWrapped<Wrapper>).__cc_wrapper__;
}

export function maxComponent (v: IVec3Like): number {
    return Math.max(v.x, Math.max(v.y, v.z));
}

export const VEC3_0 = new Vec3();

export const TriggerEventObject = {
    type: 'onTriggerEnter' as TriggerEventType,
    selfCollider: null as Collider | null,
    otherCollider: null as Collider | null,
    impl: null as any,
};

export const CharacterTriggerEventObject = {
    type: 'onControllerTriggerEnter' as CharacterTriggerEventType,
    collider: null as Collider | null,
    characterController: null as CharacterController | null,
    impl: null as any,
};

export const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    contacts: [] as IContactEquation[],
    impl: null as any,
};

export function shrinkPositions (buffer: Float32Array | number[]): number[] {
    const pos: number[] = [];
    const posHashMap = {};
    if (buffer.length >= 3) {
        pos[0] = buffer[0];
        pos[1] = buffer[1];
        pos[2] = buffer[2];
        const len = buffer.length;
        for (let i = 3; i < len; i += 3) {
            const p0 = buffer[i];
            const p1 = buffer[i + 1];
            const p2 = buffer[i + 2];
            const str = String(p0) +  String(p1) + String(p2);
            //todo: directly use buffer as input
            const hash = murmurhash2_32_gc(str, 666);
            if (posHashMap[hash] !== str) {
                posHashMap[hash] = str;
                pos.push(p0); pos.push(p1); pos.push(p2);
            }
        }
    }
    return pos;
}

export function absolute (v: Vec3): Vec3 {
    v.x = Math.abs(v.x);
    v.y = Math.abs(v.y);
    v.z = Math.abs(v.z);
    return v;
}
