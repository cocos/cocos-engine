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
const renderEngine = require('../../render-engine');
const SpriteType = Sprite.Type;
const RenderData = renderEngine.RenderData;

const simpleRenderUtil = require('./simple');
const slicedRenderUtil = require('./sliced');
const tiledRenderUtil = require('./tiled');
const radialFilledRenderUtil = require('./radial-filled');
const barFilledRenderUtil = require('./bar-filled');

let filledRenderUtil = {
    createData (sprite) {
        if (sprite._fillType === FillType.RADIAL) {
            return radialFilledRenderUtil.createData(sprite);
        }
        return barFilledRenderUtil.createData(sprite);
    },
    update (sprite) {
        if (sprite._fillType === FillType.RADIAL) {
            return radialFilledRenderUtil.update(sprite);
        }
        return barFilledRenderUtil.update(sprite);
    },
    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        if (sprite._fillType === FillType.RADIAL) {
            radialFilledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
        }
        barFilledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
    },
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        if (sprite._fillType === FillType.RADIAL) {
            radialFilledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
        }
        barFilledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
    }
};

// Inline all type switch to avoid jit deoptimization during inlined function change
let spriteAssembler = {
    updateRenderData (sprite) {
        // Create render data if needed
        if (!sprite._renderData) {
            switch (sprite.type) {
                case SpriteType.SIMPLE:
                    sprite._renderData = simpleRenderUtil.createData(sprite);
                    break;
                case SpriteType.SLICED:
                    sprite._renderData = slicedRenderUtil.createData(sprite);
                    break;
                case SpriteType.TILED:
                    sprite._renderData = tiledRenderUtil.createData(sprite);
                    break;
                case SpriteType.FILLED:
                    sprite._renderData = filledRenderUtil.createData(sprite);
                    break;
            }
        }

        let renderData = sprite._renderData;
        let size = sprite.node._contentSize;
        let anchor = sprite.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.update(sprite);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.update(sprite);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.update(sprite);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.update(sprite);
                break;
        }
    },

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.fillVertexBuffer(sprite, index, vbuf, uintbuf);
                break;
        }
    },

    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        switch (sprite.type) {
            case SpriteType.SIMPLE:
                simpleRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.SLICED:
                slicedRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.TILED:
                tiledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
            case SpriteType.FILLED:
                filledRenderUtil.fillIndexBuffer(sprite, offset, vertexId, ibuf);
                break;
        }
    }
}

module.exports = Sprite._assembler = spriteAssembler;
