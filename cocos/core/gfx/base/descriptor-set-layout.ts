/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, ObjectType, DescriptorSetLayoutBinding, DescriptorSetLayoutInfo } from './define';

/**
 * @en GFX descriptor sets layout.
 * @zh GFX 描述符集布局。
 */
export abstract class DescriptorSetLayout extends GFXObject {
    get bindings () {
        return this._bindings;
    }

    get bindingIndices () {
        return this._bindingIndices;
    }

    get descriptorIndices () {
        return this._descriptorIndices;
    }

    protected _bindings: DescriptorSetLayoutBinding[] = [];
    protected _bindingIndices: number[] = [];
    protected _descriptorIndices: number[] = [];

    constructor () {
        super(ObjectType.DESCRIPTOR_SET_LAYOUT);
    }

    public abstract initialize (info: DescriptorSetLayoutInfo): void;

    public abstract destroy (): void;
}
