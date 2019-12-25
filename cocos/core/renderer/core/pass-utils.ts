/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category material
 */

import { GFXBindingType, GFXType } from '../../gfx/define';
import { Mat3, Mat4, Vec2, Vec3, Vec4 } from '../../math';

const btMask      = 0xf0000000; //  4 bits => 16 binding types
const typeMask    = 0x0fc00000; //  6 bits => 64 types
const bindingMask = 0x003fc000; //  8 bits => 256 bindings
const offsetMask  = 0x00003fff; // 14 bits => 4096 vectors

export const genHandle = (bt: GFXBindingType, binding: number, type: GFXType, offset: number = 0) =>
    ((bt << 28) & btMask) | ((type << 22) & typeMask) | ((binding << 14) & bindingMask) | (offset & offsetMask);
export const getBindingTypeFromHandle = (handle: number) => (handle & btMask) >>> 28;
export const getTypeFromHandle = (handle: number) => (handle & typeMask) >>> 22;
export const getBindingFromHandle = (handle: number) => (handle & bindingMask) >>> 14;
export const getOffsetFromHandle = (handle: number) => (handle & offsetMask);
export const customizeType = (handle: number, type: GFXType) => (handle & ~typeMask) | ((type << 22) & typeMask);

export const type2reader = {
    [GFXType.UNKNOWN]: (a: Float32Array, v: any, idx: number = 0) => console.warn('illegal uniform handle'),
    [GFXType.INT]: (a: Float32Array, v: any, idx: number = 0) => a[idx],
    [GFXType.INT2]: (a: Float32Array, v: any, idx: number = 0) => Vec2.fromArray(v, a, idx),
    [GFXType.INT3]: (a: Float32Array, v: any, idx: number = 0) => Vec3.fromArray(v, a, idx),
    [GFXType.INT4]: (a: Float32Array, v: any, idx: number = 0) => Vec4.fromArray(v, a, idx),
    [GFXType.FLOAT]: (a: Float32Array, v: any, idx: number = 0) => a[idx],
    [GFXType.FLOAT2]: (a: Float32Array, v: any, idx: number = 0) => Vec2.fromArray(v, a, idx),
    [GFXType.FLOAT3]: (a: Float32Array, v: any, idx: number = 0) => Vec3.fromArray(v, a, idx),
    [GFXType.FLOAT4]: (a: Float32Array, v: any, idx: number = 0) => Vec4.fromArray(v, a, idx),
    [GFXType.MAT3]: (a: Float32Array, v: any, idx: number = 0) => Mat3.fromArray(v, a, idx),
    [GFXType.MAT4]: (a: Float32Array, v: any, idx: number = 0) => Mat4.fromArray(v, a, idx),
};

export const type2writer = {
    [GFXType.UNKNOWN]: (a: Float32Array, v: any, idx: number = 0) => console.warn('illegal uniform handle'),
    [GFXType.INT]: (a: Float32Array, v: any, idx: number = 0) => a[idx] = v,
    [GFXType.INT2]: (a: Float32Array, v: any, idx: number = 0) => Vec2.toArray(a, v, idx),
    [GFXType.INT3]: (a: Float32Array, v: any, idx: number = 0) => Vec3.toArray(a, v, idx),
    [GFXType.INT4]: (a: Float32Array, v: any, idx: number = 0) => Vec4.toArray(a, v, idx),
    [GFXType.FLOAT]: (a: Float32Array, v: any, idx: number = 0) => a[idx] = v,
    [GFXType.FLOAT2]: (a: Float32Array, v: any, idx: number = 0) => Vec2.toArray(a, v, idx),
    [GFXType.FLOAT3]: (a: Float32Array, v: any, idx: number = 0) => Vec3.toArray(a, v, idx),
    [GFXType.FLOAT4]: (a: Float32Array, v: any, idx: number = 0) => Vec4.toArray(a, v, idx),
    [GFXType.MAT3]: (a: Float32Array, v: any, idx: number = 0) => Mat3.toArray(a, v, idx),
    [GFXType.MAT4]: (a: Float32Array, v: any, idx: number = 0) => Mat4.toArray(a, v, idx),
};

export const type2default = {
    [GFXType.INT]: [0],
    [GFXType.INT2]: [0, 0],
    [GFXType.INT3]: [0, 0, 0],
    [GFXType.INT4]: [0, 0, 0, 0],
    [GFXType.FLOAT]: [0],
    [GFXType.FLOAT2]: [0, 0],
    [GFXType.FLOAT3]: [0, 0, 0],
    [GFXType.FLOAT4]: [0, 0, 0, 0],
    [GFXType.MAT3]: [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [GFXType.MAT4]: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [GFXType.SAMPLER2D]: 'default-texture',
    [GFXType.SAMPLER_CUBE]: 'default-cube-texture',
};

export interface IDefineMap { [name: string]: number | boolean | string; }

export function assignDefines (target: IDefineMap, source: IDefineMap): boolean {
    const entries = Object.entries(source);
    let isDifferent: boolean = false;
    for (let i = 0; i < entries.length; i++) {
        if (target[entries[i][0]] !== entries[i][1]) {
            target[entries[i][0]] = entries[i][1];
            isDifferent = true;
        }
    }
    return isDifferent;
}
