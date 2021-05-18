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
    private _vertexBuffer: Buffer;
    private _indexBuffer: Buffer;
    private _ia: InputAssemblerHandle;

    get ia () { return this._ia; }

    constructor (device: Device) {
        // 需要顶点索引
        // 控制顶点索引需要的数据
        const elementPerVertex = (/* position */3 + /* texCoord */2 + /* instanceID */1); // 每个顶点需要的数量
        const vertexPerQuad = 16; // 顶点数
        const elementsPerQuad = elementPerVertex * vertexPerQuad; // 每个对象实际需要的数量
        const stride = elementPerVertex * Float32Array.BYTES_PER_ELEMENT; // 偏移量
        const maxQuadPerDrawcall = Math.floor(device.capabilities.maxVertexUniformVectors / 36);// 每个块 4 个 vec4，9个块
        console.log(`MaxNum:  ${maxQuadPerDrawcall}`);

        this._vertexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX,
            MemoryUsageBit.DEVICE,
            stride * vertexPerQuad * maxQuadPerDrawcall,
            stride,
        ));

        const indexPerQuad = 54; // 索引数
        this._indexBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX,
            MemoryUsageBit.DEVICE,
            Uint16Array.BYTES_PER_ELEMENT * indexPerQuad * maxQuadPerDrawcall,
            Uint16Array.BYTES_PER_ELEMENT,
        ));

        const vertexData = new Float32Array(elementsPerQuad * maxQuadPerDrawcall);
        const indexData = new Uint16Array(indexPerQuad * maxQuadPerDrawcall);
        for (let i = 0; i < maxQuadPerDrawcall; ++i) {
            // 一次遍历则 9 个 Quad
            // 9 个边长为 1 的块？
            // 0
            vertexData[i * elementsPerQuad +  0] = -1.5;// 而且这里公用了顶点，偏移怎么做
            vertexData[i * elementsPerQuad +  1] = -1.5;
            vertexData[i * elementsPerQuad +  2] = 0;
            vertexData[i * elementsPerQuad +  3] = 0;
            vertexData[i * elementsPerQuad +  4] = 1;
            vertexData[i * elementsPerQuad +  5] = i;// 这个 i 填多少？？？共用了


            // 1
            vertexData[i * elementsPerQuad +  6] = -0.5;
            vertexData[i * elementsPerQuad +  7] = -1.5;
            vertexData[i * elementsPerQuad +  8] = 0;
            vertexData[i * elementsPerQuad +  9] = 1;
            vertexData[i * elementsPerQuad + 10] = 1;
            vertexData[i * elementsPerQuad + 11] = i;

            // 2
            vertexData[i * elementsPerQuad + 12] = 0.5;
            vertexData[i * elementsPerQuad + 13] = -1.5;
            vertexData[i * elementsPerQuad + 14] = 0;
            vertexData[i * elementsPerQuad + 15] = 0;
            vertexData[i * elementsPerQuad + 16] = 0;
            vertexData[i * elementsPerQuad + 17] = i;

            // 3
            vertexData[i * elementsPerQuad + 18] = 1.5;
            vertexData[i * elementsPerQuad + 19] = -1.5;
            vertexData[i * elementsPerQuad + 20] = 0;
            vertexData[i * elementsPerQuad + 21] = 1;
            vertexData[i * elementsPerQuad + 22] = 0;
            vertexData[i * elementsPerQuad + 23] = i;

            // 4
            vertexData[i * elementsPerQuad + 24] = -1.5;
            vertexData[i * elementsPerQuad + 25] = -0.5;
            vertexData[i * elementsPerQuad + 26] = 0;
            vertexData[i * elementsPerQuad + 27] = 0;
            vertexData[i * elementsPerQuad + 28] = 1;
            vertexData[i * elementsPerQuad + 29] = i;

            // 5
            vertexData[i * elementsPerQuad + 30] = -0.5;
            vertexData[i * elementsPerQuad + 31] = -0.5;
            vertexData[i * elementsPerQuad + 32] = 0;
            vertexData[i * elementsPerQuad + 33] = 1;
            vertexData[i * elementsPerQuad + 34] = 1;
            vertexData[i * elementsPerQuad + 35] = i;

            // 6
            vertexData[i * elementsPerQuad + 36] = 0.5;
            vertexData[i * elementsPerQuad + 37] = -0.5;
            vertexData[i * elementsPerQuad + 38] = 0;
            vertexData[i * elementsPerQuad + 39] = 0;
            vertexData[i * elementsPerQuad + 40] = 0;
            vertexData[i * elementsPerQuad + 41] = i;

            // 7
            vertexData[i * elementsPerQuad + 42] = 1.5;
            vertexData[i * elementsPerQuad + 43] = -0.5;
            vertexData[i * elementsPerQuad + 44] = 0;
            vertexData[i * elementsPerQuad + 45] = 1;
            vertexData[i * elementsPerQuad + 46] = 0;
            vertexData[i * elementsPerQuad + 47] = i;

            // 8
            vertexData[i * elementsPerQuad + 48] = -1.5;
            vertexData[i * elementsPerQuad + 49] = 0.5;
            vertexData[i * elementsPerQuad + 50] = 0;
            vertexData[i * elementsPerQuad + 51] = 0;
            vertexData[i * elementsPerQuad + 52] = 1;
            vertexData[i * elementsPerQuad + 53] = i;

            // 9
            vertexData[i * elementsPerQuad + 54] = -0.5;
            vertexData[i * elementsPerQuad + 55] = 0.5;
            vertexData[i * elementsPerQuad + 56] = 0;
            vertexData[i * elementsPerQuad + 57] = 1;
            vertexData[i * elementsPerQuad + 58] = 1;
            vertexData[i * elementsPerQuad + 59] = i;

            // 10
            vertexData[i * elementsPerQuad + 60] = 0.5;
            vertexData[i * elementsPerQuad + 61] = 0.5;
            vertexData[i * elementsPerQuad + 62] = 0;
            vertexData[i * elementsPerQuad + 63] = 0;
            vertexData[i * elementsPerQuad + 64] = 0;
            vertexData[i * elementsPerQuad + 65] = i;

            // 11
            vertexData[i * elementsPerQuad + 66] = 1.5;
            vertexData[i * elementsPerQuad + 67] = 0.5;
            vertexData[i * elementsPerQuad + 68] = 0;
            vertexData[i * elementsPerQuad + 69] = 1;
            vertexData[i * elementsPerQuad + 70] = 0;
            vertexData[i * elementsPerQuad + 71] = i;

            // 12
            vertexData[i * elementsPerQuad + 72] = -1.5;
            vertexData[i * elementsPerQuad + 73] = 1.5;
            vertexData[i * elementsPerQuad + 74] = 0;
            vertexData[i * elementsPerQuad + 75] = 0;
            vertexData[i * elementsPerQuad + 76] = 1;
            vertexData[i * elementsPerQuad + 77] = i;

            // 13
            vertexData[i * elementsPerQuad + 78] = -0.5;
            vertexData[i * elementsPerQuad + 79] = 1.5;
            vertexData[i * elementsPerQuad + 80] = 0;
            vertexData[i * elementsPerQuad + 81] = 1;
            vertexData[i * elementsPerQuad + 82] = 1;
            vertexData[i * elementsPerQuad + 83] = i;

            // 14
            vertexData[i * elementsPerQuad + 84] = 0.5;
            vertexData[i * elementsPerQuad + 85] = 1.5;
            vertexData[i * elementsPerQuad + 86] = 0;
            vertexData[i * elementsPerQuad + 87] = 0;
            vertexData[i * elementsPerQuad + 88] = 0;
            vertexData[i * elementsPerQuad + 89] = i;

            // 15
            vertexData[i * elementsPerQuad + 90] = 1.5;
            vertexData[i * elementsPerQuad + 91] = 1.5;
            vertexData[i * elementsPerQuad + 92] = 0;
            vertexData[i * elementsPerQuad + 93] = 1;
            vertexData[i * elementsPerQuad + 94] = 0;
            vertexData[i * elementsPerQuad + 95] = i;

            // quad 0
            indexData[i * indexPerQuad +  0] = 0 + i * 16;
            indexData[i * indexPerQuad +  1] = 1 + i * 16;
            indexData[i * indexPerQuad +  2] = 4 + i * 16;
            indexData[i * indexPerQuad +  3] = 4 + i * 16;
            indexData[i * indexPerQuad +  4] = 1 + i * 16;
            indexData[i * indexPerQuad +  5] = 5 + i * 16;

            // quad 1
            indexData[i * indexPerQuad +  6] =  5 + i * 16;
            indexData[i * indexPerQuad +  7] =  1 + i * 16;
            indexData[i * indexPerQuad +  8] =  2 + i * 16;
            indexData[i * indexPerQuad +  9] =  5 + i * 16;
            indexData[i * indexPerQuad + 10] =  2 + i * 16;
            indexData[i * indexPerQuad + 11] =  6 + i * 16;

            // quad 2
            indexData[i * indexPerQuad + 12] =  6 + i * 16;
            indexData[i * indexPerQuad + 13] =  2 + i * 16;
            indexData[i * indexPerQuad + 14] =  3 + i * 16;
            indexData[i * indexPerQuad + 15] =  6 + i * 16;
            indexData[i * indexPerQuad + 16] =  3 + i * 16;
            indexData[i * indexPerQuad + 17] =  7 + i * 16;

            // quad 3
            indexData[i * indexPerQuad + 18] =  8 + i * 16;
            indexData[i * indexPerQuad + 19] =  4 + i * 16;
            indexData[i * indexPerQuad + 20] =  5 + i * 16;
            indexData[i * indexPerQuad + 21] =  8 + i * 16;
            indexData[i * indexPerQuad + 22] =  5 + i * 16;
            indexData[i * indexPerQuad + 23] =  9 + i * 16;

            // quad 4
            indexData[i * indexPerQuad + 24] =  9 + i * 16;
            indexData[i * indexPerQuad + 25] =  5 + i * 16;
            indexData[i * indexPerQuad + 26] =  6 + i * 16;
            indexData[i * indexPerQuad + 27] =  9 + i * 16;
            indexData[i * indexPerQuad + 28] =  6 + i * 16;
            indexData[i * indexPerQuad + 29] = 10 + i * 16;

            // quad 5
            indexData[i * indexPerQuad + 30] = 10 + i * 16;
            indexData[i * indexPerQuad + 31] =  6 + i * 16;
            indexData[i * indexPerQuad + 32] =  7 + i * 16;
            indexData[i * indexPerQuad + 33] = 10 + i * 16;
            indexData[i * indexPerQuad + 34] =  7 + i * 16;
            indexData[i * indexPerQuad + 35] = 11 + i * 16;

            // quad 6
            indexData[i * indexPerQuad + 36] = 12 + i * 16;
            indexData[i * indexPerQuad + 37] =  8 + i * 16;
            indexData[i * indexPerQuad + 38] =  9 + i * 16;
            indexData[i * indexPerQuad + 39] = 12 + i * 16;
            indexData[i * indexPerQuad + 40] =  9 + i * 16;
            indexData[i * indexPerQuad + 41] = 13 + i * 16;

            // quad 7
            indexData[i * indexPerQuad + 42] = 13 + i * 16;
            indexData[i * indexPerQuad + 43] =  9 + i * 16;
            indexData[i * indexPerQuad + 44] = 10 + i * 16;
            indexData[i * indexPerQuad + 45] = 13 + i * 16;
            indexData[i * indexPerQuad + 46] = 10 + i * 16;
            indexData[i * indexPerQuad + 47] = 14 + i * 16;

            // quad 8
            indexData[i * indexPerQuad + 48] = 14 + i * 16;
            indexData[i * indexPerQuad + 49] = 10 + i * 16;
            indexData[i * indexPerQuad + 50] = 11 + i * 16;
            indexData[i * indexPerQuad + 51] = 14 + i * 16;
            indexData[i * indexPerQuad + 52] = 11 + i * 16;
            indexData[i * indexPerQuad + 53] = 15 + i * 16;
        }

        this._vertexBuffer.update(vertexData);
        this._indexBuffer.update(indexData);

        this._ia = IAPool.alloc(device, new InputAssemblerInfo(
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
            IAPool.free(this._ia);
            this._ia = NULL_HANDLE;
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
