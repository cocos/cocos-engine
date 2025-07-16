/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

import { Attribute, deviceManager } from '../../gfx';
import { Vec3 } from '../../core';
import type { Model as JsbModel } from './model';

declare const jsb: any;

export interface IInstancedAttributeBlock {
    buffer: Uint8Array;
    views: TypedArray[];
    attributes: Attribute[];
}

export enum ModelType {
    DEFAULT,
    SKINNING,
    BAKED_SKINNING,
    BATCH_2D,
    PARTICLE_BATCH,
    LINE,
}

export const Model: typeof JsbModel = jsb.Model;
export type Model = JsbModel;

const modelProto: any = Model.prototype;

modelProto._ctor = function () {
    this._device = deviceManager.gfxDevice;
};

const oldCreateBoundingShape = modelProto.createBoundingShape;
modelProto.createBoundingShape = function (minPos?: Vec3, maxPos?: Vec3) {
    if (!minPos || !maxPos) { return; }
    oldCreateBoundingShape.call(this, minPos, maxPos);
};
