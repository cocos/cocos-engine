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

export interface IColorLike {
    r: number;
    g: number;
    b: number;
    a: number;
    _val: number;

}

export interface IMat3Like {
    m00: number; m01: number; m02: number;
    m03: number; m04: number; m05: number;
    m06: number; m07: number; m08: number;
}

export interface IMat4Like {
    m00: number; m01: number; m02: number; m03: number;
    m04: number; m05: number; m06: number; m07: number;
    m08: number; m09: number; m10: number; m11: number;
    m12: number; m13: number; m14: number; m15: number;
}

export interface IQuatLike {
    x: number;
    y: number;
    z: number;
    w: number;
}

export interface IRectLike {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISizeLike {
    width: number;
    height: number;
}

export interface IVec2Like {
    x: number;
    y: number;
}

export interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

export interface IVec4Like {
    x: number;
    y: number;
    z: number;
    w: number;
}

export type FloatArray = Float64Array | Float32Array;
export type IVec2 = IVec2Like | Readonly<IVec2Like>;
export type IVec3 = IVec3Like | Readonly<IVec3Like>;
export type IVec4 = IVec4Like | Readonly<IVec4Like>;
export type IMat3 = IMat3Like | Readonly<IMat3Like>;
export type IMat4 = IMat4Like | Readonly<IMat4Like>;
export type IRect = IRectLike | Readonly<IRectLike>;
export type IQuat = IQuatLike | Readonly<IQuatLike>;
export type IColor = IColorLike | Readonly<IColorLike>;
