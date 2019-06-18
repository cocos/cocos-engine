/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import BmfontAssembler from '../../../../utils/label/bmfont';

let _dataOffset = 0;

export default class WebglBmfontAssembler extends BmfontAssembler {
    initData (comp) {
    }

    _reserveQuads (comp, count) {

        let renderData = this._renderData;

        this.verticesCount = count * 4;
        let vBytes = 4 * this.verticesFloats;
        let iBytes = count * 6 * 2;
        let bytes = vBytes + iBytes;
        let needUpdateArray = false;

        if (!renderData.flexBuffer) {
            renderData.flexBuffer = new cc.FlexBuffer(bytes);
            needUpdateArray = true;
        }
        else {
            needUpdateArray = renderData.flexBuffer.reserve(bytes);
        }

        let buffer = renderData.flexBuffer.buffer;
        let vData = renderData.vDatas[0];
        if (needUpdateArray || !vData || vData.length != count) {
            let vertices = new Float32Array(buffer, 0, vBytes / 4);
            let indices = new Uint16Array(buffer, vBytes, iBytes / 2);
            for (let i = 0, vid = 0; i < indices.length; i += 6, vid += 4) {
                indices[i] = vid;
                indices[i + 1] = vid + 1;
                indices[i + 2] = vid + 2;
                indices[i + 3] = vid + 1;
                indices[i + 4] = vid + 3;
                indices[i + 5] = vid + 2;
            }
            renderData.updateMesh(0, vertices, indices);
        }
        _dataOffset = 0;
    }

    _quadsUpdated (comp) {
        _dataOffset = 0;
    }

    appendQuad (comp, texture, rect, rotated, x, y, scale) {
        let renderData = this._renderData;
        let verts = renderData.vDatas[0],
            uintVerts = renderData.uintVDatas[0];

        let texw = texture.width,
            texh = texture.height,
            rectWidth = rect.width,
            rectHeight = rect.height,
            color = comp.node._color._val;

        // Keep alpha channel for cpp to update
        color = ((uintVerts[4] & 0xff000000) | (color & 0x00ffffff) >>> 0) >>> 0;

        let l, b, r, t;
        let floatsPerVert = this.floatsPerVert;
        // uvs
        let uvDataOffset = _dataOffset + this.uvOffset;
        if (!rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            verts[uvDataOffset] = l;
            verts[uvDataOffset + 1] = b;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = r;
            verts[uvDataOffset + 1] = b;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = l;
            verts[uvDataOffset + 1] = t;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = r;
            verts[uvDataOffset + 1] = t;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            verts[uvDataOffset] = l;
            verts[uvDataOffset + 1] = t;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = l;
            verts[uvDataOffset + 1] = b;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = r;
            verts[uvDataOffset + 1] = t;
            uvDataOffset += floatsPerVert;
            verts[uvDataOffset] = r;
            verts[uvDataOffset + 1] = b;
        }


        // positions
        l = x;
        r = x + rectWidth * scale;
        b = y - rectHeight * scale;
        t = y;

        this.appendVerts(comp, _dataOffset, l, r, b, t);

        // colors
        let colorOffset = _dataOffset + this.colorOffset;
        for (let i = 0; i < 4; i++) {
            uintVerts[colorOffset] = color;
            colorOffset += floatsPerVert;
        }

        _dataOffset += this.floatsPerVert * 4;
    }

    appendVerts (comp, offset, l, r, b, t) {
        let local = this._renderData._local;
        let floatsPerVert = this.floatsPerVert;

        local[offset] = l;
        local[offset + 1] = b;

        offset += floatsPerVert;
        local[offset] = r;
        local[offset + 1] = b;

        offset += floatsPerVert;
        local[offset] = l;
        local[offset + 1] = t;

        offset += floatsPerVert;
        local[offset] = r;
        local[offset + 1] = t;
    }

    updateWorldVerts (comp) {
        let node = comp.node;

        let matrix = node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let local = this._renderData._local;
        let world = this._renderData.vDatas[0];
        let floatsPerVert = this.floatsPerVert;
        for (let offset = 0; offset < local.length; offset += floatsPerVert) {
            let x = local[offset];
            let y = local[offset + 1];
            world[offset] = x * a + y * c + tx;
            world[offset+1] = x * b + y * d + ty;
        }
    }
}

