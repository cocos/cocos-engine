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

const StencilManager = require('../stencil-manager');
const Mask = require('../../../components/CCMask');
const RenderFlow = require('../../render-flow');
const spriteAssembler = require('./sprite/simple');
const graphicsAssembler = require('./graphics');

let _stencilMgr = StencilManager.sharedManager;

let maskFrontAssembler = {
    updateRenderData (mask) {
        if (!mask._renderData) {
            // Update clear graphics material
            graphicsAssembler.updateRenderData(mask._clearGraphics);

            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                mask._renderData = spriteAssembler.createData(mask);
            }
            else {
                // for updateGraphics calculation
                mask._renderData = mask.requestRenderData();
            }
        }
        let renderData = mask._renderData;

        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            if (mask.spriteFrame) {
                let size = mask.node._contentSize;
                let anchor = mask.node._anchorPoint;
                renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
                renderData.dataLength = 4;
                spriteAssembler.updateRenderData(mask);
                renderData.material = mask._material;
            }
            else {
                mask._material = null;
            }
        }
        else {
            mask._graphics._material = mask._material;
            graphicsAssembler.updateRenderData(mask._graphics);
        }
    },

    fillBuffers (mask, renderer) {
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            _stencilMgr.pushMask(mask);
            _stencilMgr.clear();

            graphicsAssembler.fillBuffers(mask._clearGraphics, renderer);

            _stencilMgr.enterLevel();

            // vertex buffer
            renderer.node = mask.node;
            renderer.material = mask._material;
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                spriteAssembler.fillBuffers(mask, renderer);
                renderer._flush();
            }
            else {
                graphicsAssembler.fillBuffers(mask._graphics, renderer);
            }
            _stencilMgr.enableMask();
        }

        mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

let maskEndAssembler = {
    fillBuffers (mask, renderer) {
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must pop mask after batch, so we can only put this logic in fillBuffers
            _stencilMgr.exitMask();
        }

        mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

Mask._assembler = maskFrontAssembler;
Mask._postAssembler = maskEndAssembler;

module.exports = {
    front: maskFrontAssembler,
    end: maskEndAssembler
};
