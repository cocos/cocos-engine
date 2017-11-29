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

const Sprite = require('../../components/CCSprite');
const renderEngine = require('../render-engine');
const SpriteType = Sprite.Type;
const RenderData = renderEngine.RenderData;
const math = renderEngine.math;

var _matrix = math.mat4.create();

var simpleRenderData = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.xysLength = 4;
        renderData.uvsLength = 4;
        renderData.vertexCount = 4;
        renderData.indexCount = 6;
        return renderData;
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        let data = sprite._renderData;
        if (effect && data) {
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
            
            let uvs = data._uvs;
            uvs.u[0] = l;
            uvs.u[1] = r;
            uvs.u[2] = l;
            uvs.u[3] = r;
            uvs.v[0] = b;
            uvs.v[1] = b;
            uvs.v[2] = t;
            uvs.v[3] = t;
            
            data.uvDirty = false;
        }
    },

    updateVerts (sprite) {
        let data = sprite._renderData,
            frame = sprite.spriteFrame,
            width, height;
        if (sprite.trim) {
            width = frame._rect.width;
            height = frame._rect.height;
        }
        else {
            width = frame._originalSize.width;
            height = frame._originalSize.height;
        }
            
        let appx = data._pivotX * width,
            appy = data._pivotY * height;
        
        var verts = data._verts;
        verts.x[0] = -appx;
        verts.x[1] = width - appx;
        verts.x[2] = -appx;
        verts.x[3] = width - appx;
        verts.y[0] = -appy;
        verts.y[1] = -appy;
        verts.y[2] = height - appy;
        verts.y[3] = height - appy;

        data.vertDirty = false;
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let texture = sprite.getEffect().getValue('texture');
    
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let data = sprite._renderData;
        let x = data._verts.x,
            y = data._verts.y,
            u = data._uvs.u,
            v = data._uvs.v,
            z = node.z;
        
        let color = node._color._val;
        let uintColor = ((color&0xff<<24) >>> 0) + ((color&0xff00)<<8) + ((color&0xff0000)>>8) + (color>>>24);
        
        node.getWorldMatrix(_matrix);
        let a = _matrix.m00,
            b = _matrix.m01,
            c = _matrix.m04,
            d = _matrix.m05,
            tx = _matrix.m12,
            ty = _matrix.m13;
    
        for (let i = 0; i < 4; i++) {
            vbuf[off++] = x[i] * a + y[i] * c + tx;
            vbuf[off++] = x[i] * b + y[i] * d + ty;
            vbuf[off++] = z;
            uintbuf[off++] = color;
            vbuf[off++] = u[i];
            vbuf[off++] = v[i];
        }
    },
    
    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        ibuf[offset + 0] = vertexId;
        ibuf[offset + 1] = vertexId + 1;
        ibuf[offset + 2] = vertexId + 2;
        ibuf[offset + 3] = vertexId + 1;
        ibuf[offset + 4] = vertexId + 3;
        ibuf[offset + 5] = vertexId + 2;
    }
};

var slicedRenderData = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.xysLength = 4;
        renderData.uvsLength = 4;
        renderData.vertexCount = 36;
        renderData.indexCount = 54;
        return renderData;
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        let data = sprite._renderData;
        if (effect) {
            let texture = effect.getValue('texture');
            let frame = sprite.spriteFrame;
            let rect = frame._rect;
            let atlasWidth = texture._width;
            let atlasHeight = texture._height;
        
            // caculate texture coordinate
            let leftWidth = frame.insetLeft;
            let rightWidth = frame.insetRight;
            let centerWidth = rect.width - leftWidth - rightWidth;
            let topHeight = frame.insetTop;
            let bottomHeight = frame.insetBottom;
            let centerHeight = rect.height - topHeight - bottomHeight;
        
            // uv computation should take spritesheet into account.
            let u = data._uvs.u;
            let v = data._uvs.v;
            if (frame._rotated) {
                u[0] = (rect.x) / atlasWidth;
                u[1] = (bottomHeight + rect.x) / atlasWidth;
                u[2] = (bottomHeight + centerHeight + rect.x) / atlasWidth;
                u[3] = (rect.x + rect.height) / atlasWidth;
        
                v[0] = (rect.y) / atlasHeight;
                v[1] = (leftWidth + rect.y) / atlasHeight;
                v[2] = (leftWidth + centerWidth + rect.y) / atlasHeight;
                v[3] = (rect.y + rect.width) / atlasHeight;
            }
            else {
                u[0] = (rect.x) / atlasWidth;
                u[1] = (leftWidth + rect.x) / atlasWidth;
                u[2] = (leftWidth + centerWidth + rect.x) / atlasWidth;
                u[3] = (rect.x + rect.width) / atlasWidth;
        
                v[3] = (rect.y) / atlasHeight;
                v[2] = (topHeight + rect.y) / atlasHeight;
                v[1] = (topHeight + centerHeight + rect.y) / atlasHeight;
                v[0] = (rect.y + rect.height) / atlasHeight;
            }
            data.uvDirty = false;
        }
    },
    
    updateVerts (sprite) {
        let data = sprite._renderData,
            width = data._width,
            height = data._height,
            appx = data._pivotX * width, 
            appy = data._pivotY * height;
    
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
    
        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        let x = data._verts.x;
        let y = data._verts.y;
        x[0] = -appx;
        x[1] = leftWidth * xScale - appx;
        x[2] = x[1] + sizableWidth - appx;
        x[3] = width - appx;
        y[0] = -appy;
        y[1] = bottomHeight * yScale - appy;
        y[2] = y[1] + sizableHeight - appy;
        y[3] = height - appy;

        data.vertDirty = false;
    },
    
    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let texture = sprite.getEffect().getValue('texture');
    
        let offset = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let data = sprite._renderData;
        let x = data._verts.x,
            y = data._verts.y,
            u = data._uvs.u,
            v = data._uvs.v,
            z = node.z;
        
        let color = node._color;
        let uintColor = ((color.a<<24) >>> 0) + (color.b<<16) + (color.g<<8) + color.r;
        
        node.getWorldMatrix(_matrix);
        let a = _matrix.m00,
            b = _matrix.m01,
            c = _matrix.m04,
            d = _matrix.m05,
            tx = _matrix.m12,
            ty = _matrix.m13;

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                // lb
                vbuf[offset] = x[r][c];
                vbuf[offset + 1] = y[r][c];
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = u[c];
                vbuf[offset + 5] = v[r];
                offset += 6;
                // rb
                vbuf[offset] = x[r][c+1];
                vbuf[offset + 1] = y[r][c+1];
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = u[c+1];
                vbuf[offset + 5] = v[r];
                offset += 6;
                // lt
                vbuf[offset] = x[r+1][c];
                vbuf[offset + 1] = y[r+1][c];
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = u[c];
                vbuf[offset + 5] = v[r+1];
                offset += 6;
                // rt
                vbuf[offset] = x[r+1][c+1];
                vbuf[offset + 1] = y[r+1][c+1];
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = u[c+1];
                vbuf[offset + 5] = v[r+1];
                offset += 6;
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                ibuf[offset++] = vertexId;
                ibuf[offset++] = vertexId + 1;
                ibuf[offset++] = vertexId + 2;
                ibuf[offset++] = vertexId + 1;
                ibuf[offset++] = vertexId + 3;
                ibuf[offset++] = vertexId + 2;
                vertexId += 4;
            }
        }
    }
}

var dataUpdater = {};
dataUpdater[SpriteType.SIMPLE] = simpleRenderData;
dataUpdater[SpriteType.SLICED] = slicedRenderData;

var spriteAssembler = {
    updateRenderData (sprite) {
        let updater = dataUpdater[sprite.type];
        // Create render data if needed
        if (!sprite._renderData) {
            sprite._renderData = updater.createData(sprite);
        }

        let renderData = sprite._renderData;
        let size = sprite.node._contentSize;
        let anchor = sprite.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);

        if (renderData.uvDirty) {
            updater.updateUVs(sprite);
        }
        if (renderData.vertDirty) {
            updater.updateVerts(sprite);
        }
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let updater = dataUpdater[sprite.type];
        updater.fillVertexBuffer(sprite, index, vbuf, uintbuf);
    },

    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        let updater = dataUpdater[sprite.type];
        updater.fillIndexBuffer(sprite, offset, vertexId, ibuf);
    }
}

Sprite._assembler = spriteAssembler;

module.exports = spriteAssembler;