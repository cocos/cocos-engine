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
    private _vertexBuffer: Buffer;
    private _indexBuffer: Buffer;
    private _ia: InputAssembler;

    get ia () { return this._ia; }

    constructor (device: Device) {
        const elementPerVertex = (/* position */3 + /* texCoord */2 + /* instanceID */1); // 每个顶点需要的数量
        const vertexPerQuad = 4; // 顶点数
        const elementsPerQuad = elementPerVertex * vertexPerQuad; // 每个对象实际需要的数量
        const stride = elementPerVertex * Float32Array.BYTES_PER_ELEMENT; // 偏移量
        const maxQuadPerDrawcall = Math.floor(device.capabilities.maxVertexUniformVectors / 5);
        console.log(`MaxNum:  ${maxQuadPerDrawcall}`);

        this._vertexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX,
            MemoryUsageBit.DEVICE,
            stride * vertexPerQuad * maxQuadPerDrawcall,
            stride,
        ));

        const indexPerQuad = 6; // 索引数
        this._indexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX,
            MemoryUsageBit.DEVICE,
            Uint16Array.BYTES_PER_ELEMENT * indexPerQuad * maxQuadPerDrawcall,
            Uint16Array.BYTES_PER_ELEMENT,
        ));

        const vertexData = new Float32Array(elementsPerQuad * maxQuadPerDrawcall);
        const indexData = new Uint16Array(indexPerQuad * maxQuadPerDrawcall);
        for (let i = 0; i < maxQuadPerDrawcall; ++i) {
            vertexData[i * elementsPerQuad +  0] = -0.5;
            vertexData[i * elementsPerQuad +  1] = -0.5;
            vertexData[i * elementsPerQuad +  2] = 0;
            vertexData[i * elementsPerQuad +  3] = 0;
            vertexData[i * elementsPerQuad +  4] = 1;
            vertexData[i * elementsPerQuad +  5] = i;

            vertexData[i * elementsPerQuad +  6] = 0.5;
            vertexData[i * elementsPerQuad +  7] = -0.5;
            vertexData[i * elementsPerQuad +  8] = 0;
            vertexData[i * elementsPerQuad +  9] = 1;
            vertexData[i * elementsPerQuad + 10] = 1;
            vertexData[i * elementsPerQuad + 11] = i;

            vertexData[i * elementsPerQuad + 12] = -0.5;
            vertexData[i * elementsPerQuad + 13] = 0.5;
            vertexData[i * elementsPerQuad + 14] = 0;
            vertexData[i * elementsPerQuad + 15] = 0;
            vertexData[i * elementsPerQuad + 16] = 0;
            vertexData[i * elementsPerQuad + 17] = i;

            vertexData[i * elementsPerQuad + 18] = 0.5;
            vertexData[i * elementsPerQuad + 19] = 0.5;
            vertexData[i * elementsPerQuad + 20] = 0;
            vertexData[i * elementsPerQuad + 21] = 1;
            vertexData[i * elementsPerQuad + 22] = 0;
            vertexData[i * elementsPerQuad + 23] = i;

            indexData[i * indexPerQuad + 0] = 0 + i * 4;
            indexData[i * indexPerQuad + 1] = 1 + i * 4;
            indexData[i * indexPerQuad + 2] = 2 + i * 4;
            indexData[i * indexPerQuad + 3] = 2 + i * 4;
            indexData[i * indexPerQuad + 4] = 1 + i * 4;
            indexData[i * indexPerQuad + 5] = 3 + i * 4;
        }

        this._vertexBuffer.update(vertexData);
        this._indexBuffer.update(indexData);

        this._ia = device.createInputAssembler(new InputAssemblerInfo(
            [
                new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0, false, 0),
                new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F, false, 0, false, 1),
                new Attribute(AttributeName.ATTR_BATCH_ID,   Format.R32F, false, 0, false, 2),
            ],
            [this._vertexBuffer],
            this._indexBuffer,
        ));
    }

    destroy () {
        if (this._ia) {
            this._ia.destroy();
            this._ia = null!;
        }

        if (this._vertexBuffer) {
            this._vertexBuffer.destroy();
            this._vertexBuffer = null!;
        }

        if (this._indexBuffer) {
            this._indexBuffer.destroy();
            this._indexBuffer = null!;
        }
    }
}
