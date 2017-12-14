const StencilManager = require('../stencil-manager');
const spriteUtil = require('./sprite-assembler').simpleRenderUtil;
const Node = require('../../CCNode');
const Graphics = require('../../graphics/graphics');
const Mask = require('../../components/CCMask');
const renderEngine = require('../render-engine');
const RenderData = renderEngine.RenderData;

let _stencilMgr = StencilManager.sharedManager;
let _color = cc.color(255, 255, 255, 0);
let _graphicsNode = new Node();
let _graphics = _graphicsNode.addComponent(Graphics);
_graphics.lineWidth = 0;

let maskFrontAssembler = {
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
                mask._renderData = spriteUtil.createData(mask);
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
                spriteUtil.update(mask);
            }
            else {
                mask._material = null;
            }
        }
        else {
            this.update(mask);
        }
    },

    fillVertexBuffer (mask, index, vbuf, uintbuf) {
        // Invalid state
        if (mask._type === Mask.Type.IMAGE_STENCIL && !mask.spriteFrame) {
            return;
        }
        // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
        _stencilMgr.pushMask(mask);

        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            spriteUtil.fillVertexBuffer(mask, index, vbuf, uintbuf);
        }
        else {
            // Share node for correct global matrix
            _graphics.node = mask.node;
            _graphics._renderData = mask._renderData;
            Graphics._assembler.fillVertexBuffer(_graphics, index, vbuf, uintbuf);
        }
    },
    fillIndexBuffer (mask, offset, vertexId, ibuf) {
        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            if (mask.spriteFrame) {
                spriteUtil.fillIndexBuffer(mask, offset, vertexId, ibuf);
            }
        }
        else {
            Graphics._assembler.fillIndexBuffer(_graphics, offset, vertexId, ibuf);
        }
    }
}

let maskEndAssembler = {
    updateRenderData (mask) {
        if (mask._type === Mask.Type.IMAGE_STENCIL && !mask.spriteFrame) {
            mask._material = null;
        }
        else {
            mask._material = mask._endMaterial;
        }
    },

    fillVertexBuffer (mask, index, vbuf, uintbuf) {
        // Invalid state
        if (mask._type === Mask.Type.IMAGE_STENCIL && !mask.spriteFrame) {
            return;
        }
        // HACK: Must pop mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
        _stencilMgr.popMask();

        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            spriteUtil.fillVertexBuffer(mask, index, vbuf, uintbuf);
        }
        else {
            // Share node for correct global matrix
            _graphics.node = mask.node;
            _graphics._renderData = mask._renderData;
            Graphics._assembler.fillVertexBuffer(_graphics, index, vbuf, uintbuf);
        }
    },
    fillIndexBuffer: maskFrontAssembler.fillIndexBuffer
}

Mask._assembler = maskFrontAssembler;
Mask._postAssembler = maskEndAssembler;

module.exports = {
    front: maskFrontAssembler,
    end: maskEndAssembler
}