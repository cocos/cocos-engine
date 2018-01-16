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

const StencilManager = require('../stencil-manager');
const Node = require('../../CCNode');
const Mask = require('../../components/CCMask');
const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;

const js = require('../../platform/js');
const assembler = require('./assembler');
const spriteAssembler = require('./sprite/simple');
const Graphics = require('../../graphics/graphics');
const graphicsAssembler = require('./graphics/graphics-assembler');

let _stencilMgr = StencilManager.sharedManager;
let _color = cc.color(255, 255, 255, 0);
let _graphicsNode = new Node();
let _graphics = _graphicsNode.addComponent(Graphics);
_graphics.lineWidth = 0;

let maskFrontAssembler = js.addon({
    update (mask) {
        let renderData = mask._renderData;
        if (renderData.vertDirty) {
            // Share render data with graphics content
            _graphics._renderData = renderData;
            _graphics.clear(false);
            let width = renderData._width;
            let height = renderData._height;
            let x = -width * renderData._pivotX;
            let y = -height * renderData._pivotY;
            if (mask._type === Mask.Type.RECT) {
                _graphics.rect(x, y, width, height);
            }
            else if (mask._type === Mask.Type.ELLIPSE) {
                let cx = x + width / 2,
                    cy = y + height / 2,
                    rx = width / 2,
                    ry = height / 2;
                _graphics.ellipse(cx, cy, rx, ry);
            }
            _graphics.fill();
        }
    },

    updateRenderData (mask) {
        if (!mask._renderData) {
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                mask._renderData = spriteAssembler.createData(mask);
            }
            else {
                mask._renderData = RenderData.alloc();
            }
        }
        let renderData = mask._renderData;
        let size = mask.node._contentSize;
        let anchor = mask.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);

        mask._material = mask._frontMaterial;
        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            if (mask.spriteFrame) {
                renderData.dataLength = 4;
                spriteAssembler.update(mask);
            }
            else {
                mask._material = null;
            }
        }
        else {
            this.update(mask);
        }

        renderData.effect = mask.getEffect();
        this.datas.length = 0;
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (batchData, vertexId, vbuf, uintbuf, ibuf) {
        let mask = batchData.comp,
            vertexOffset = batchData.vertexOffset,
            indiceOffset = batchData.indiceOffset;
        
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            _stencilMgr.pushMask(mask);

            // vertex buffer
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                batchData.comp = mask;
                spriteAssembler.fillVertexBuffer(mask, batchData.byteOffset / 4, vbuf, uintbuf);
                spriteAssembler.fillIndexBuffer(mask, batchData.indiceOffset, vertexId, ibuf);
            }
            else {
                // Share node for correct global matrix
                _graphics.node = mask.node;
                _graphics._renderData = mask._renderData;
                batchData.comp = _graphics;
                graphicsAssembler.fillBuffers(batchData, vertexId, vbuf, uintbuf, ibuf);
            }
        }
    }
}, assembler);

let maskEndAssembler = js.addon({
    updateRenderData (mask) {
        if (mask._type === Mask.Type.IMAGE_STENCIL && !mask.spriteFrame) {
            mask._material = null;
        }
        else {
            mask._material = mask._endMaterial;
        }

        let renderData = mask._renderData;
        renderData.effect = mask.getEffect();
        this.datas.length = 0;
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (batchData, vertexId, vbuf, uintbuf, ibuf) {
        let mask = batchData.comp,
            vertexOffset = batchData.vertexOffset,
            indiceOffset = batchData.indiceOffset;
        
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must pop mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            _stencilMgr.popMask();

            // vertex buffer
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                batchData.comp = mask;
                spriteAssembler.fillVertexBuffer(mask, batchData.byteOffset / 4, vbuf, uintbuf);
                spriteAssembler.fillIndexBuffer(mask, batchData.indiceOffset, vertexId, ibuf);
            }
            else {
                // Share node for correct global matrix
                _graphics.node = mask.node;
                _graphics._renderData = mask._renderData;
                batchData.comp = _graphics;
                graphicsAssembler.fillBuffers(batchData, vertexId, vbuf, uintbuf, ibuf);
            }
        }
    }
}, assembler);

Mask._assembler = maskFrontAssembler;
Mask._postAssembler = maskEndAssembler;

module.exports = {
    front: maskFrontAssembler,
    end: maskEndAssembler
}