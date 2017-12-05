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

let _matrix = math.mat4.create();

let simpleRenderData = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.xysLength = 4;
        renderData.uvsLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    update (sprite) {
        let data = sprite._renderData;
        if (data.uvDirty) {
            this.updateUVs(sprite);
        }
        if (data.vertDirty) {
            this.updateVerts(sprite);
        }
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        if (!effect) return;

        let data = sprite._renderData;
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
        
        let u = data._uvs.u;
        let v = data._uvs.v;

        if (frame._rotated) {
            u[0] = l;
            u[1] = l;
            u[2] = r;
            u[3] = r;
            v[0] = t;
            v[1] = b;
            v[2] = t;
            v[3] = b;
        }
        else {
            u[0] = l;
            u[1] = r;
            u[2] = l;
            u[3] = r;
            v[0] = b;
            v[1] = b;
            v[2] = t;
            v[3] = t;
        }
        
        data.uvDirty = false;
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
        
        let x = data._verts.x;
        let y = data._verts.y;
        x[0] = -appx;
        x[1] = width - appx;
        x[2] = -appx;
        x[3] = width - appx;
        y[0] = -appy;
        y[1] = -appy;
        y[2] = height - appy;
        y[3] = height - appy;

        data.vertDirty = false;
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let data = sprite._renderData;
        let x = data._verts.x,
            y = data._verts.y,
            u = data._uvs.u,
            v = data._uvs.v,
            z = node.z;
        
        let color = node._color._val;
        
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

let slicedRenderData = {
    createData (sprite) {
        let renderData = RenderData.alloc();
        renderData.xysLength = 4;
        renderData.uvsLength = 4;
        renderData.vertexCount = 16;
        renderData.indiceCount = 54;
        return renderData;
    },
    
    update (sprite) {
        let data = sprite._renderData;
        if (data.uvDirty) {
            this.updateUVs(sprite);
        }
        if (data.vertDirty) {
            this.updateVerts(sprite);
        }
    },

    updateUVs (sprite) {
        let effect = sprite.getEffect();
        if (!effect) return;

        let data = sprite._renderData;
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
        x[2] = x[1] + sizableWidth;
        x[3] = width - appx;
        y[0] = -appy;
        y[1] = bottomHeight * yScale - appy;
        y[2] = y[1] + sizableHeight;
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
        
        let color = node._color._val;
        
        node.getWorldMatrix(_matrix);
        let a = _matrix.m00,
            b = _matrix.m01,
            c = _matrix.m04,
            d = _matrix.m05,
            tx = _matrix.m12,
            ty = _matrix.m13;

        for (let row = 0; row < 4; ++row) {
            for (let col = 0; col < 4; ++col) {
                vbuf[offset] = x[col]*a + y[row]*c + tx;
                vbuf[offset + 1] = x[col]*b + y[row]*d + ty;
                vbuf[offset + 2] = z;
                uintbuf[offset + 3] = color;
                vbuf[offset + 4] = u[col];
                vbuf[offset + 5] = v[row];
                offset += 6;
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = vertexId + r*4 + c;
                ibuf[offset++] = start;
                ibuf[offset++] = start + 1;
                ibuf[offset++] = start + 4;
                ibuf[offset++] = start + 1;
                ibuf[offset++] = start + 5;
                ibuf[offset++] = start + 4;
            }
        }
    }
};


let tiledRenderData = {
    createData (sprite) {
        return RenderData.alloc();
    },

    update (sprite) {
        let data = sprite._renderData;
        if (!data.uvDirty && !data.vertDirty) return;

        let effect = sprite.getEffect();
        if (!effect) return;

        let texture = effect.getValue('texture');
        let texw = texture._width,
            texh = texture._height;
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let contentSize = sprite.node._contentSize;
        let contentWidth = Math.abs(contentSize.width);
        let contentHeight = Math.abs(contentSize.height);

        let rectWidth = rect.width;
        let rectHeight = rect.height;
        let hRepeat = contentWidth / rectWidth;
        let vRepeat = contentHeight / rectHeight;
        let row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);

        let u = data._uvs.u;
        let v = data._uvs.v;
        u.length = v.length = 8;

        let l, b, r, t;
        if (!frame._rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            u[0] = l;
            v[0] = b;
            u[1] = r;
            v[1] = b;
            u[2] = l;
            v[2] = t;
            u[3] = r;
            v[3] = t;
            
            u[4] = l;
            v[4] = b;
            u[5] = l + (r-l) * Math.min(1, hRepeat - col + 1);
            v[5] = b;
            u[6] = l;
            v[6] = b + (t-b) * Math.min(1, vRepeat - row + 1);
            u[7] = u[5];
            v[7] = v[6];
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            u[0] = l;
            v[0] = t;
            u[1] = l;
            v[1] = b;
            u[2] = r;
            v[2] = t;
            u[3] = r;
            v[3] = b;

            u[4] = l;
            v[4] = t;
            u[5] = l;
            v[5] = t + (b - t) * Math.min(1, vRepeat - cow + 1);
            u[6] = l + (r - l) * Math.min(1, hRepeat - row + 1);
            v[6] = t;
            u[7] = u[5];
            v[7] = v[6];
        }

        // update x, y
        let x = data._verts.x;
        let y = data._verts.y;

        x.length = col + 1;
        y.length = row + 1;

        let appx = data._pivotX * contentWidth,
            appy = data._pivotY * contentHeight;

        for (let i = 0, l = x.length; i < l; ++i) {
            x[i] = Math.min(rectWidth * i, contentWidth) - appx;
        }

        for (let i = 0, l = y.length; i < l; ++i) {
            y[i] = Math.min(rectHeight * i, contentHeight) - appy;
        }
        
        // update data property
        data.vertexCount = row * col * 4;
        data.indiceCount = row * col * 6;
        data.uvDirty = false;
        data.vertDirty = false;
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let off = index * sprite._vertexFormat._bytes / 4;
        let node = sprite.node;
        let data = sprite._renderData;
        let x = data._verts.x,
            y = data._verts.y,
            u = data._uvs.u,
            v = data._uvs.v,
            z = node.z;
        
        let color = node._color._val;
        
        node.getWorldMatrix(_matrix);
        let a = _matrix.m00,
            b = _matrix.m01,
            c = _matrix.m04,
            d = _matrix.m05,
            tx = _matrix.m12,
            ty = _matrix.m13;

        for (let yindex = 0, ylength = y.length - 1; yindex < ylength; ++yindex) {
            for (let xindex = 0, xlength = x.length - 1; xindex < xlength; ++xindex) {
                let lasty = yindex + 1 === ylength;
                let lastx = xindex + 1 === xlength;

                // lb
                vbuf[off++] = x[xindex] * a + y[yindex] * c + tx;
                vbuf[off++] = x[xindex] * b + y[yindex] * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? u[4] : u[0];
                vbuf[off++] = lasty ? v[4] : v[0];

                // rb
                vbuf[off++] = x[xindex+1] * a + y[yindex] * c + tx;
                vbuf[off++] = x[xindex+1] * b + y[yindex] * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? u[5] : u[1];
                vbuf[off++] = lasty ? v[5] : v[1];

                // lt
                vbuf[off++] = x[xindex] * a + y[yindex+1] * c + tx;
                vbuf[off++] = x[xindex] * b + y[yindex+1] * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? u[6] : u[2];
                vbuf[off++] = lasty ? v[6] : v[2];

                // rt
                vbuf[off++] = x[xindex+1] * a + y[yindex+1] * c + tx;
                vbuf[off++] = x[xindex+1] * b + y[yindex+1] * d + ty;
                vbuf[off++] = z;
                uintbuf[off++] = color;
                vbuf[off++] = lastx ? u[7] : u[3];
                vbuf[off++] = lasty ? v[7] : v[3];
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        let data = sprite._renderData;
        let length = data.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[offset++] = vertexId;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+2;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+3;
            ibuf[offset++] = vertexId+2;
            vertexId += 4;
        }
    }
};

let dataUpdater = {};
dataUpdater[SpriteType.SIMPLE] = simpleRenderData;
dataUpdater[SpriteType.SLICED] = slicedRenderData;
dataUpdater[SpriteType.TILED]  = tiledRenderData;

let spriteAssembler = {
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
        
        updater.update(sprite);
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