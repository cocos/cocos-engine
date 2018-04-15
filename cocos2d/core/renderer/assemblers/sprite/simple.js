/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

const js = require('../../../platform/js');

module.exports = {
    useModel: false,

    updateRenderData (sprite) {
        let renderData = sprite._renderData;
        if (renderData && sprite._material) {
            if (renderData.uvDirty) {
                this.updateUVs(sprite);
            }

            if (renderData.vertDirty) {
                this.updateVerts(sprite);
            }
        }
        return sprite.__allocedDatas;
    },

    fillBuffers (sprite, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.byteOffset / 4,
            indiceOffset = batchData.indiceOffset;

        let data = sprite._renderData._data;
        let node = sprite.node;
        let z = node._position.z;
        let color = node._color._val;
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
    
        for (let i = 0; i < 4; i++) {
            let vert = data[i];
            vbuf[vertexOffset ++] = vert.x * a + vert.y * c + tx;
            vbuf[vertexOffset ++] = vert.x * b + vert.y * d + ty;
            vbuf[vertexOffset ++] = z;
            uintbuf[vertexOffset ++] = color;
            vbuf[vertexOffset ++] = vert.u;
            vbuf[vertexOffset ++] = vert.v;
        }

        ibuf[indiceOffset ++] = vertexId;
        ibuf[indiceOffset ++] = vertexId + 1;
        ibuf[indiceOffset ++] = vertexId + 2;
        ibuf[indiceOffset ++] = vertexId + 1;
        ibuf[indiceOffset ++] = vertexId + 3;
        ibuf[indiceOffset ++] = vertexId + 2;
    },

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for world verts
        // 5-8 for local verts
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    updateUVs (sprite) {
        let material = sprite.getMaterial();
        let renderData = sprite._renderData;
        let data = renderData._data;
        let texture = material.effect.getProperty('texture');
        let texw = texture._width,
            texh = texture._height;
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        
        if (frame._rotated) {
            let l = texw === 0 ? 0 : rect.x / texw;
            let r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
            let b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
            let t = texh === 0 ? 0 : rect.y / texh;
            data[0].u = l;
            data[0].v = t;
            data[1].u = l;
            data[1].v = b;
            data[2].u = r;
            data[2].v = t;
            data[3].u = r;
            data[3].v = b;
        }
        else {
            let l = texw === 0 ? 0 : rect.x / texw;
            let r = texw === 0 ? 0 : (rect.x + rect.width) / texw;
            let b = texh === 0 ? 0 : (rect.y + rect.height) / texh;
            let t = texh === 0 ? 0 : rect.y / texh;
            data[0].u = l;
            data[0].v = b;
            data[1].u = r;
            data[1].v = b;
            data[2].u = l;
            data[2].v = t;
            data[3].u = r;
            data[3].v = t;
        }
        
        renderData.uvDirty = false;
    },

    updateVerts (sprite) {
        let renderData = sprite._renderData,
            node = sprite.node,
            data = renderData._data,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
        }
        else {
            let frame = sprite.spriteFrame,
                ow = frame._originalSize.width, oh = frame._originalSize.height,
                rw = frame._rect.width, rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow, scaleY = ch / oh;
            let trimLeft = offset.x + (ow - rw) / 2;
            let trimRight = offset.x - (ow - rw) / 2;
            let trimBottom = offset.y + (oh - rh) / 2;
            let trimTop = offset.y - (oh - rh) / 2;
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw + trimRight * scaleX - appx;
            t = ch + trimTop * scaleY - appy;
        }
        
        data[0].x = l;
        data[0].y = b;
        data[1].x = r;
        data[1].y = b;
        data[2].x = l;
        data[2].y = t;
        data[3].x = r;
        data[3].y = t;

        renderData.vertDirty = false;
    }
};
