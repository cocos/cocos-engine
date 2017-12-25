/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Sprite = require('../../../components/CCSprite');
const RenderData = require('../../render-engine').RenderData;

module.exports = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    update (sprite) {
        let renderData = sprite._renderData;
        if (renderData.uvDirty) {
            this.updateUVs(sprite);
        }
        if (renderData.vertDirty) {
            this.updateVerts(sprite);
        }
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        let renderData = sprite._renderData;
        if (effect && renderData) {
            let data = renderData._data;
            let texture = effect.getValue('texture');
            let texw = texture._width,
                texh = texture._height;
            let frame = sprite.spriteFrame;
            let rect = frame._rect;
            let l, b, r, t;
      
            if (sprite.trim) {
                l = rect.x;
                t = rect.y;
                r = rect.x + rect.width;
                b = rect.y + rect.height;
            } else {
                let originalSize = frame._originalSize;
                let offset = frame._offset;
                let ow = originalSize.width,
                    oh = originalSize.height,
                    rw = rect.width,
                    rh = rect.height;
                let ox = rect.x + (rw - ow) / 2 - offset.x;
                let oy = rect.y + (rh - oh) / 2 - offset.y;
        
                l = ox;
                t = oy;
                r = ox + ow;
                b = oy + oh;
            }
            
            l = texw === 0 ? 0 : l / texw;
            r = texw === 0 ? 0 : r / texw;
            b = texh === 0 ? 0 : b / texh;
            t = texh === 0 ? 0 : t / texh;
            
            if (frame._rotated) {
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
        }
    },

    updateVerts (sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
            cw = renderData._width,
            ch = renderData._height,
            appx = renderData._pivotX * cw,
            appy = renderData._pivotY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
        }
        else {
            let frame = sprite.spriteFrame,
                ow = frame._originalSize.width,
                oh = frame._originalSize.height,
                rw = frame._rect.width,
                rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow,
                scaleY = ch / oh;
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
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let renderData = sprite._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;
    
        let vert;
        let length = renderData.dataLength;
        for (let i = 0; i < length; i++) {
            vert = data[i];
            vbuf[off + 0] = vert.x * a + vert.y * c + tx;
            vbuf[off + 1] = vert.x * b + vert.y * d + ty;
            vbuf[off + 2] = z;
            vbuf[off + 4] = vert.u;
            vbuf[off + 5] = vert.v;
            uintbuf[off + 3] = color;
            off += 6;
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        ibuf[offset + 0] = vertexId;
        ibuf[offset + 1] = vertexId + 1;
        ibuf[offset + 2] = vertexId + 2;
        ibuf[offset + 3] = vertexId + 1;
        ibuf[offset + 4] = vertexId + 3;
        ibuf[offset + 5] = vertexId + 2;
    }
};