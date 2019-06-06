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

const labelAssembler = require('../label');
const js = require('../../../../../platform/js');
const bmfontUtls = require('../../../../utils/label/bmfont');
const base = require('../../base/2d');

let _dataOffset = 0;

module.exports = labelAssembler.bmfont = js.addon({
    createData (comp) {
    },

    _reserveQuads (comp, count) {
        let renderHandle = comp._renderHandle;

        let vBytes = count * 4 * this.verticesFloats;
        let iBytes = count * 6 * 2;
        let bytes = vBytes + iBytes;
        let needUpdateArray = false;

        if (!renderHandle.flexBuffer) {
            renderHandle.flexBuffer = new cc.FlexBuffer(bytes);
            needUpdateArray = true;
        }
        else {
            needUpdateArray = renderHandle.flexBuffer.reserve(bytes);
        }

        let buffer = renderHandle.flexBuffer.buffer;
        let vData = renderHandle.vDatas[0];
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
            renderHandle.updateMesh(0, vertices, indices);
        }
        _dataOffset = 0;
    },

    _quadsUpdated (comp) {
        _dataOffset = 0;
    },

    appendQuad (comp, texture, rect, rotated, x, y, scale) {
        let renderHandle = comp._renderHandle;
        let verts = renderHandle.vDatas[0],
            uintVerts = renderHandle.uintVDatas[0];

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

        _dataOffset += this.verticesFloats;
    },

    appendVerts (comp, offset, l, r, b, t) {
        let local = comp._renderHandle._local;
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
    },

    updateWorldVerts (comp) {
        let node = comp.node;

        let matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let local = comp._renderHandle._local;
        let world = comp._renderHandle.vDatas[0];
        let floatsPerVert = this.floatsPerVert;
        for (let offset = 0; offset < local.length; offset += floatsPerVert) {
            let x = local[offset];
            let y = local[offset + 1];
            world[offset] = x * a + y * c + tx;
            world[offset+1] = x * b + y * d + ty;
        }
    }
}, base, bmfontUtls);
