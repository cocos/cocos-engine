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

import { GFXDescriptorType, GFXType } from '../../gfx/define';
import { Color, Mat3, Mat4, Vec2, Vec3, Vec4, Quat } from '../../math';

const dtMask      = 0xf0000000; //  4 bits => 16 descriptor types
const typeMask    = 0x0fc00000; //  6 bits => 64 types
const setMask     = 0x00300000; //  2 bits => 4 sets
const bindingMask = 0x000fc000; //  6 bits => 64 bindings
const offsetMask  = 0x00003fff; // 14 bits => 4096 vectors

export const genHandle = (dt: GFXDescriptorType, set: number, binding: number, type: GFXType, offset: number = 0) =>
    ((dt << 28) & dtMask) | ((type << 22) & typeMask) | ((set << 20) & setMask) | ((binding << 14) & bindingMask) | (offset & offsetMask);
export const getDescriptorTypeFromHandle = (handle: number) => (handle & dtMask) >>> 28;
export const getTypeFromHandle = (handle: number) => (handle & typeMask) >>> 22;
export const getSetIndexFromHandle = (handle: number) => (handle & setMask) >>> 20;
export const getBindingFromHandle = (handle: number) => (handle & bindingMask) >>> 14;
export const getOffsetFromHandle = (handle: number) => (handle & offsetMask);
export const customizeType = (handle: number, type: GFXType) => (handle & ~typeMask) | ((type << 22) & typeMask);

export type MaterialProperty = number | Vec2 | Vec3 | Vec4 | Color | Mat3 | Mat4 | Quat;

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

const defaultValues = [
    Object.freeze([0]),
    Object.freeze([0, 0]),
    Object.freeze([0, 0, 0, 0]),
    Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
];

export function getDefaultFromType (type: GFXType) {
    switch (type) {
        case GFXType.BOOL:
        case GFXType.INT:
        case GFXType.UINT:
        case GFXType.FLOAT:
            return defaultValues[0];
        case GFXType.BOOL2:
        case GFXType.INT2:
        case GFXType.UINT2:
        case GFXType.FLOAT2:
            return defaultValues[1];
        case GFXType.BOOL4:
        case GFXType.INT4:
        case GFXType.UINT4:
        case GFXType.FLOAT4:
            return defaultValues[2];
        case GFXType.MAT4:
            return defaultValues[3];
        case GFXType.SAMPLER2D:
            return 'default-texture';
        case GFXType.SAMPLER_CUBE:
            return 'default-cube-texture';
    }
    return defaultValues[0];
}

export type MacroRecord = Record<string, number | boolean | string>;

export function overrideMacros (target: MacroRecord, source: MacroRecord): boolean {
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
