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

const StencilManager = require('../stencil-manager');
const Node = require('../../CCNode');
const Mask = require('../../components/CCMask');
const renderEngine = require('../render-engine');

const js = require('../../platform/js');
const assembler = require('./assembler');
const spriteAssembler = require('./sprite/simple');
const Graphics = require('../../graphics/graphics');
const graphicsAssembler = require('./graphics');

let _stencilMgr = StencilManager.sharedManager;
let _color = cc.color(255, 255, 255, 0);
// for nested mask, we might need multiple graphics component to avoid data conflict
let _graphicsPool = [];

function getGraphics () {
    let graphics = _graphicsPool.pop();

    if (!graphics) {
        let graphicsNode = new Node();
        graphics = graphicsNode.addComponent(Graphics);
        graphics.lineWidth = 0;
    }
    return graphics;
}

let maskFrontAssembler = js.addon({
    updateGraphics (mask) {
        let renderData = mask._renderData;
        let graphics = mask._graphics;
        // Share render data with graphics content
        graphics.clear(false);
        let width = renderData._width;
        let height = renderData._height;
        let x = -width * renderData._pivotX;
        let y = -height * renderData._pivotY;
        if (mask._type === Mask.Type.RECT) {
            graphics.rect(x, y, width, height);
        }
        else if (mask._type === Mask.Type.ELLIPSE) {
            let cx = x + width / 2,
                cy = y + height / 2,
                rx = width / 2,
                ry = height / 2;
            graphics.ellipse(cx, cy, rx, ry);
        }
        graphics.fill();
    },

    updateRenderData (mask) {
        if (!mask._renderData) {
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                mask._renderData = spriteAssembler.createData(mask);
            }
            else {
                // for updateGraphics calculation
                mask._renderData = mask.requestRenderData();
            }
        }
        let renderData = mask._renderData;
        let size = mask.node._contentSize;
        let anchor = mask.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);

        let datas;
        mask._material = mask._frontMaterial;
        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            if (mask.spriteFrame) {
                datas = mask._renderDatas;
                datas.length = 0;
                renderData.dataLength = 4;
                spriteAssembler.update(mask);
                renderData.material = mask.getMaterial();
                datas.push(renderData);
            }
            else {
                mask._material = null;
            }
        }
        else {
            mask._graphics = getGraphics();
            this.updateGraphics(mask);
            mask._graphics._material = mask._material;
            datas = graphicsAssembler.updateRenderData(mask._graphics);
        }

        return datas;
    },

    fillBuffers (mask, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.vertexOffset,
            indiceOffset = batchData.indiceOffset;
        
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            _stencilMgr.pushMask(mask);

            // vertex buffer
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                spriteAssembler.fillBuffers(mask, batchData, vertexId, vbuf, uintbuf, ibuf);
            }
            else {
                // Share node for correct global matrix
                mask._graphics.node = mask.node;
                graphicsAssembler.fillBuffers(mask._graphics, batchData, vertexId, vbuf, uintbuf, ibuf);
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

        let datas;
        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            datas = mask._renderDatas;
        }
        else {
            datas = mask._graphics._impl._renderDatas;
        }
        let material = mask.getMaterial();
        for (let i = 0; i < datas.length; i++) {
            datas[i].material = material;
        }
        return datas;
    },

    fillBuffers (mask, batchData, vertexId, vbuf, uintbuf, ibuf) {
        let vertexOffset = batchData.vertexOffset,
            indiceOffset = batchData.indiceOffset;
        
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must pop mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            _stencilMgr.popMask();

            // vertex buffer
            if (mask._type === Mask.Type.IMAGE_STENCIL) {
                spriteAssembler.fillBuffers(mask, batchData, vertexId, vbuf, uintbuf, ibuf);
            }
            else {
                // Share node for correct global matrix
                mask._graphics.node = mask.node;
                graphicsAssembler.fillBuffers(mask._graphics, batchData, vertexId, vbuf, uintbuf, ibuf);
                // put back graphics to pool
                _graphicsPool.push(mask._graphics);
                mask._graphics = null;
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