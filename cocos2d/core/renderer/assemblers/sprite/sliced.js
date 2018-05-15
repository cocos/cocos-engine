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

const Sprite = require('../../../components/CCSprite');
const dynamicAtlasManager = require('../../utils/dynamic-atlas/manager');
const FillType = Sprite.FillType;

module.exports = {
    useModel: false,

    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for local verts
        // 5-20 for world verts
        renderData.dataLength = 20;

        renderData.vertexCount = 16;
        renderData.indiceCount = 54;
        return renderData;
    },

    updateRenderData (sprite, batchData) {
        let frame = sprite.spriteFrame;
        
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (!frame._original) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            if (!sprite._material || sprite._material._texture !== frame._texture) {
                sprite._material = null;
                sprite._activateMaterial();
            }
        }

        let renderData = sprite._renderData;
        if (renderData && frame) {
            if (renderData.uvDirty) {
                this.updateUVs(sprite);
            }

            let vertDirty = renderData.vertDirty;
            if (vertDirty) {
                this.updateVerts(sprite);
                this.updateWorldVerts(sprite);
            }
        }
    },
    
    updateUVs (sprite) {
        let material = sprite.getMaterial();
        let renderData = sprite._renderData;
        let texture = material.effect.getProperty('texture');
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
        let data = renderData._data;
        if (frame._rotated) {
            data[0].u = (rect.x) / atlasWidth;
            data[0].v = (rect.y) / atlasHeight;
            data[1].u = (bottomHeight + rect.x) / atlasWidth;
            data[1].v = (leftWidth + rect.y) / atlasHeight;
            data[2].u = (bottomHeight + centerHeight + rect.x) / atlasWidth;
            data[2].v = (leftWidth + centerWidth + rect.y) / atlasHeight;
            data[3].u = (rect.x + rect.height) / atlasWidth;
            data[3].v = (rect.y + rect.width) / atlasHeight;
        }
        else {
            data[0].u = (rect.x) / atlasWidth;
            data[1].u = (leftWidth + rect.x) / atlasWidth;
            data[2].u = (leftWidth + centerWidth + rect.x) / atlasWidth;
            data[3].u = (rect.x + rect.width) / atlasWidth;
            data[3].v = (rect.y) / atlasHeight;
            data[2].v = (topHeight + rect.y) / atlasHeight;
            data[1].v = (topHeight + centerHeight + rect.y) / atlasHeight;
            data[0].v = (rect.y + rect.height) / atlasHeight;
        }

        for (let row = 0; row < 4; ++row) {
            let rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                let colD = data[col];
                let world = data[4 + row*4 + col];
                world.u = colD.u;
                world.v = rowD.v;
            }
        }

        renderData.uvDirty = false;
    },
    
    updateVerts (sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
            node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;
    
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
        
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = leftWidth * xScale - appx;
        data[1].y = bottomHeight * yScale - appy;
        data[2].x = data[1].x + sizableWidth;
        data[2].y = data[1].y + sizableHeight;
        data[3].x = width - appx;
        data[3].y = height - appy;

        renderData.vertDirty = false;
    },

    fillBuffers (sprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        let renderData = sprite._renderData,
            data = renderData._data,
            node = sprite.node;

        let buffer = renderer._meshBuffer,
            vertexOffset = buffer.byteOffset >> 2,
            vbuf = buffer._vData,
            vertexCount = renderData.vertexCount;
        
        let ibuf = buffer._iData,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;
            
        buffer.request(vertexCount, renderData.indiceCount);

        for (let i = 4; i < 20; ++i) {
            let vert = data[i];

            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
        }

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = vertexId + r*4 + c;
                ibuf[indiceOffset++] = start;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 4;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 5;
                ibuf[indiceOffset++] = start + 4;
            }
        }
    },

    updateWorldVerts (sprite) {
        let node = sprite.node,
            data = sprite._renderData._data;
        
        let matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        
        for (let row = 0; row < 4; ++row) {
            let rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                let colD = data[col];
                let world = data[4 + row*4 + col];
                world.x = colD.x*a + rowD.y*c + tx;
                world.y = colD.x*b + rowD.y*d + ty;
            }
        }
    },
};
