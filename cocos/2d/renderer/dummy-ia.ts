/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
import { Attribute, AttributeName, Buffer, BufferInfo, BufferUsageBit, Device, Format, InputAssembler, InputAssemblerInfo, MemoryUsageBit } from '../../core/gfx';
import { IAPool, InputAssemblerHandle, NULL_HANDLE } from '../../core/renderer';

export class DummyIA {
    private _buffer: Buffer;
    private _ia: InputAssemblerHandle;

    get ia () { return this._ia; }

    constructor (device: Device) {
        const elementPerVertex = (/* position */3 + /* texCoord */2 + /* instanceID */1); // 每个顶点需要的数量
        const vertexPerQuad = 6; // 顶点数
        const elementsPerQuad = elementPerVertex * vertexPerQuad; // 每个对象实际需要的数量
        const stride = elementPerVertex * Float32Array.BYTES_PER_ELEMENT; // 偏移量
        const maxQuadPerDrawcall = Math.floor(device.capabilities.maxVertexUniformVectors / 4); // 现在是写死的最多用 16 个

        this._buffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX,
            MemoryUsageBit.DEVICE,
            stride * vertexPerQuad * maxQuadPerDrawcall,
            stride,
        ));

        const data = new Float32Array(elementsPerQuad * maxQuadPerDrawcall);
        for (let i = 0; i < maxQuadPerDrawcall; ++i) {
            data[i * elementsPerQuad +  0] = -0.5;
            data[i * elementsPerQuad +  1] = -0.5;
            data[i * elementsPerQuad +  2] = 0;
            data[i * elementsPerQuad +  3] = 0;
            data[i * elementsPerQuad +  4] = 1;
            data[i * elementsPerQuad +  5] = i;

            data[i * elementsPerQuad +  6] = 0.5;
            data[i * elementsPerQuad +  7] = -0.5;
            data[i * elementsPerQuad +  8] = 0;
            data[i * elementsPerQuad +  9] = 1;
            data[i * elementsPerQuad + 10] = 1;
            data[i * elementsPerQuad + 11] = i;

            data[i * elementsPerQuad + 12] = -0.5;
            data[i * elementsPerQuad + 13] = 0.5;
            data[i * elementsPerQuad + 14] = 0;
            data[i * elementsPerQuad + 15] = 0;
            data[i * elementsPerQuad + 16] = 0;
            data[i * elementsPerQuad + 17] = i;

            data[i * elementsPerQuad + 18] = -0.5;
            data[i * elementsPerQuad + 19] = 0.5;
            data[i * elementsPerQuad + 20] = 0;
            data[i * elementsPerQuad + 21] = 0;
            data[i * elementsPerQuad + 22] = 0;
            data[i * elementsPerQuad + 23] = i;

            data[i * elementsPerQuad + 24] = 0.5;
            data[i * elementsPerQuad + 25] = -0.5;
            data[i * elementsPerQuad + 26] = 0;
            data[i * elementsPerQuad + 27] = 1;
            data[i * elementsPerQuad + 28] = 1;
            data[i * elementsPerQuad + 29] = i;

            data[i * elementsPerQuad + 30] = 0.5;
            data[i * elementsPerQuad + 31] = 0.5;
            data[i * elementsPerQuad + 32] = 0;
            data[i * elementsPerQuad + 33] = 1;
            data[i * elementsPerQuad + 34] = 0;
            data[i * elementsPerQuad + 35] = i;
        }

        this._buffer.update(data);

        this._ia = IAPool.alloc(device, new InputAssemblerInfo(
            [
                new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0, false, 0),
                new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F, false, 0, false, 1),
                new Attribute(AttributeName.ATTR_BATCH_ID,   Format.R32F, false, 0, false, 2),
            ],
            [this._buffer],
        ));
    }

    destroy () {
        if (this._ia) {
            IAPool.free(this._ia);
            this._ia = NULL_HANDLE;
        }

        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null!;
        }
    }
}
