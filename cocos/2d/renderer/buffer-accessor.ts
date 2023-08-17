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

import { Attribute, Device } from '../../gfx';
import type { MeshBuffer } from './mesh-buffer';
import { getAttributeStride } from './vertex-format';

export class BufferAccessor {
    public get attributes (): Readonly<Attribute[]> { return this._attributes; }
    public get vertexFormatBytes (): number { return this._vertexFormatBytes; }
    public get floatsPerVertex (): number { return this._floatsPerVertex; }

    protected _device: Device = null!
    protected _attributes: Attribute[] = null!;
    protected _vertexFormatBytes: number;
    protected _floatsPerVertex: number;
    protected _buffers: MeshBuffer[] = [];

    constructor (device: Device, attributes: Attribute[]) {
        this._device = device;
        this._attributes = attributes;

        this._floatsPerVertex = getAttributeStride(attributes) >> 2;
        this._vertexFormatBytes = this._floatsPerVertex * Float32Array.BYTES_PER_ELEMENT;
    }

    public initialize (): void {}
    public reset (): void {}
    public request (vertexCount = 4, indexCount = 6): void {}
    public appendBuffers (vertices: Float32Array, indices: Uint16Array): void {}
    public uploadBuffers (): void {}
    public destroy (): void {
        this._attributes.length = 0;
    }
}
