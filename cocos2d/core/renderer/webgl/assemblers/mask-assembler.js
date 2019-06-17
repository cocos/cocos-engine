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

import Assembler from '../../assembler';

const Mask = require('../../../components/CCMask');
const RenderFlow = require('../../render-flow');
const SimpleSpriteAssembler = require('./sprite/2d/simple');
const GraphicsAssembler = require('./graphics');
const gfx = require('../../../../renderer/gfx');
const vfmtPos = require('../vertex-format').vfmtPos;

// todo: 8 is least Stencil depth supported by webGL device, it could be adjusted to vendor implementation value
let _maxLevel = 8;
// Current mask
let _maskStack = [];

function getWriteMask () {
    return 0x01 << (_maskStack.length - 1);
}

function getStencilRef () {
    let result = 0;
    for (let i = 0; i < _maskStack.length; ++i) {
        result += (0x01 << i);
    }
    return result;
}

function applyStencil (material, func, failOp, ref, stencilMask, writeMask) {
    let effect = material.effect;
    let zFailOp = gfx.STENCIL_OP_KEEP,
        zPassOp = gfx.STENCIL_OP_KEEP;
    effect.setStencil(gfx.STENCIL_ENABLE, func, ref, stencilMask, failOp, zFailOp, zPassOp, writeMask);
}


function pushMask (mask) {
    if (_maskStack.length + 1 > _maxLevel) {
        cc.errorID(9000, _maxLevel);
    }
    _maskStack.push(mask);
}

function exitMask (mask, renderer) {
    if (_maskStack.length === 0) {
        cc.errorID(9001);
    }
    _maskStack.pop();
    if (_maskStack.length === 0) {
        renderer._flushMaterial(mask._exitMaterial);
    }
    else {
        enableMask(renderer);
    }
}

function applyClearMask (mask, renderer) {
    let func = gfx.DS_FUNC_NEVER;
    let ref = getWriteMask();
    let stencilMask = ref;
    let writeMask = ref;
    let failOp = mask.inverted ? gfx.STENCIL_OP_REPLACE : gfx.STENCIL_OP_ZERO;

    applyStencil(mask._clearMaterial, func, failOp, ref, stencilMask, writeMask);

    let buffer = renderer.getBuffer('mesh', vfmtPos);
    let offsetInfo = buffer.request(4, 6);
    let indiceOffset = offsetInfo.indiceOffset,
        vertexOffset = offsetInfo.byteOffset >> 2,
        vertexId = offsetInfo.vertexOffset,
        vbuf = buffer._vData,
        ibuf = buffer._iData;
    
    vbuf[vertexOffset++] = -1;
    vbuf[vertexOffset++] = -1;
    vbuf[vertexOffset++] = -1;
    vbuf[vertexOffset++] = 1;
    vbuf[vertexOffset++] = 1;
    vbuf[vertexOffset++] = 1;
    vbuf[vertexOffset++] = 1;
    vbuf[vertexOffset++] = -1;

    ibuf[indiceOffset++] = vertexId;
    ibuf[indiceOffset++] = vertexId + 3;
    ibuf[indiceOffset++] = vertexId + 1;
    ibuf[indiceOffset++] = vertexId + 1;
    ibuf[indiceOffset++] = vertexId + 3;
    ibuf[indiceOffset++] = vertexId + 2;

    renderer.node = renderer._dummyNode;
    renderer.material = mask._clearMaterial;
    renderer._flush();
}

function applyAreaMask (mask, renderer) {
    let func = gfx.DS_FUNC_NEVER;
    let ref = getWriteMask();
    let stencilMask = ref;
    let writeMask = ref;
    let failOp = mask.inverted ? gfx.STENCIL_OP_ZERO : gfx.STENCIL_OP_REPLACE;

    applyStencil(mask.sharedMaterials[0], func, failOp, ref, stencilMask, writeMask);

    // vertex buffer
    renderer.material = mask.sharedMaterials[0];

    if (mask._type === Mask.Type.IMAGE_STENCIL) {
        renderer.node = renderer._dummyNode;
        SimpleSpriteAssembler.prototype.fillBuffers.call(mask._assembler, mask, renderer);
        renderer._flush();
    }
    else {
        renderer.node = mask.node;
        GraphicsAssembler.prototype.fillBuffers.call(mask._graphics._assembler, mask._graphics, renderer);
    }
}

function enableMask (renderer) {
    let func = gfx.DS_FUNC_EQUAL;
    let failOp = gfx.STENCIL_OP_KEEP;
    let ref = getStencilRef();
    let stencilMask = ref;
    let writeMask = getWriteMask();
    
    let mask = _maskStack[_maskStack.length - 1];
    applyStencil(mask._enableMaterial, func, failOp, ref, stencilMask, writeMask);
    renderer._flushMaterial(mask._enableMaterial);
}

export class MaskAssembler  extends SimpleSpriteAssembler {
    updateRenderData (mask) {
        if (mask._type === Mask.Type.IMAGE_STENCIL) {
            if (mask.spriteFrame) {
                SimpleSpriteAssembler.prototype.updateRenderData.call(this, mask);
            }
            else {
                mask.setMaterial(0, null);
            }
        }
        else {
            mask._graphics.setMaterial(0, mask.sharedMaterials[0]);
            GraphicsAssembler.prototype.updateRenderData.call(mask._graphics._assembler, mask._graphics, mask._graphics);
        }
    }

    fillBuffers (mask, renderer) {
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must push mask after batch, so we can only put this logic in fillVertexBuffer or fillIndexBuffer
            pushMask(mask);

            applyClearMask(mask, renderer);
            applyAreaMask(mask, renderer);

            enableMask(renderer);
        }

        mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }

    postFillBuffers (mask, renderer) {
        // Invalid state
        if (mask._type !== Mask.Type.IMAGE_STENCIL || mask.spriteFrame) {
            // HACK: Must pop mask after batch, so we can only put this logic in fillBuffers
            exitMask(mask, renderer);
        }

        mask.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

Assembler.register(Mask, MaskAssembler);
