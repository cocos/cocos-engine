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

 export class DummyIA {
    private _buffer: Buffer;
    private _ia: InputAssembler;

    get ia() { return this._ia; }

    constructor (device: Device) {
        const elementCount = (/*position*/3 + /*texCoord*/2 + /*instanceID*/1) * /*vertexPerQuad*/4;
        const stride = elementCount * Float32Array.BYTES_PER_ELEMENT;
        const maxQuadPerDrawcall = device.capabilities.maxVertexUniformVectors / 4; // 现在是写死的最多用 16 个

        this._buffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX,
            MemoryUsageBit.DEVICE,
            stride * maxQuadPerDrawcall,
            stride
        ));

        const data = new Float32Array(elementCount * maxQuadPerDrawcall);
        for (let i = 0; i < maxQuadPerDrawcall; ++i) {
            data[i +  0] = -0.5;
            data[i +  1] = -0.5;
            data[i +  2] = 0;
            data[i +  3] = 0;
            data[i +  4] = 0;
            data[i +  5] = i;

            data[i +  6] = -0.5;
            data[i +  7] = 0.5;
            data[i +  8] = 0;
            data[i +  9] = 0;
            data[i + 10] = 1;
            data[i + 11] = i;

            data[i + 12] = 0.5;
            data[i + 13] = -0.5;
            data[i + 14] = 0;
            data[i + 15] = 1;
            data[i + 16] = 0;
            data[i + 17] = i;

            data[i + 18] = 0.5;
            data[i + 19] = 0.5;
            data[i + 20] = 0;
            data[i + 21] = 1;
            data[i + 22] = 1;
            data[i + 23] = i;
        }

        this._buffer.update(data);

        this._ia = device.createInputAssembler(new InputAssemblerInfo(
            [
                new Attribute(AttributeName.ATTR_POSITION,  Format.RGB32F, false, 0, false, 0),
                new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F,  false, 0, false, 1),
                new Attribute(AttributeName.ATTR_BATCH_ID,  Format.R32F,   false, 0, false, 2),
            ],
            [this._buffer]
        ));
    }

    destroy() {
        if (this._ia) {
            this._ia.destroy();
            this._ia = null!;
        }

        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null!;
        }
    }
}
