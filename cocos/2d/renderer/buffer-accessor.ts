/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
 * @module ui
 */

import { Attribute, Device } from '../../core/gfx';
import type { MeshBuffer } from './mesh-buffer';
import { getComponentPerVertex } from './vertex-format';

export class BufferAccessor {
    public get attributes (): Readonly<Attribute[]> { return this._attributes; }
    public get vertexFormatBytes () { return this._vertexFormatBytes; }

    protected _device: Device = null!
    protected _attributes: Attribute[] = null!;
    protected _vertexFormatBytes: number;
    protected _buffers: MeshBuffer[] = [];

    constructor (device: Device, attributes: Attribute[]) {
        this._device = device;
        this._attributes = attributes;
        const floatCount = getComponentPerVertex(attributes);
        this._vertexFormatBytes = floatCount * Float32Array.BYTES_PER_ELEMENT;
    }

    public initialize () {}
    public reset () {}
    public request (vertexCount = 4, indicesCount = 6) {}
    public uploadBuffers () {}
    public destroy () {
        this._attributes.length = 0;
    }
}
