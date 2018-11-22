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

const Armature = require('./ArmatureDisplay');

const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const math = renderEngine.math;

const js = require('../../cocos2d/core/platform/js');

const RenderFlow = require('../../cocos2d/core/renderer/render-flow');

let _matrix = math.mat4.create();
let _v3 = cc.v3();

let _vbuf, _uintbuf, 
    _vertexId, _ibuf,
    _vertexOffset, _indiceOffset,
    _a, _b, _c, _d, _tx, _ty,
    _nodeR, _nodeG, _nodeB, _nodeA,
    _renderData,
    _worldMatrix;

let armatureAssembler = {
    updateRenderData (comp) {
        let armature = comp._armature;
        if (!armature || comp._isChildArmature) {
            return;
        }
        
        let renderData = comp._renderData;
        if (!renderData) {
            renderData = comp._renderData = comp.requestRenderData();
        }

        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        renderData.material = comp.getMaterial();

        renderData.vertexCount = 0;
        renderData.indiceCount = 0;

        this.calcBufferCount(renderData, armature);
    },

    calcBufferCount (renderData, armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            if (slot.childArmature) {
                this.calcBufferCount(renderData, slot.childArmature);
                continue;
            }
            renderData.vertexCount += slot._vertices.length;
            renderData.indiceCount += slot._indices.length;
        }
    },

    fillBuffers (comp, renderer) {
        let armature = comp._armature;
        if (!armature || comp._isChildArmature) return;

        let buffer = renderer._meshBuffer,
            renderData = comp._renderData;

        _vertexOffset = buffer.byteOffset >> 2;
        _indiceOffset = buffer.indiceOffset;
        _vertexId = buffer.vertexOffset;

        buffer.request(renderData.vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        _vbuf = buffer._vData;
        _uintbuf = buffer._uintVData;
        _ibuf = buffer._iData;

        let node = comp.node;

        let nodeColor = node.color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;

        _worldMatrix = node._worldMatrix;
        _a = _worldMatrix.m00; _b = _worldMatrix.m01; _c = _worldMatrix.m04; _d = _worldMatrix.m05;
        _tx = _worldMatrix.m12; _ty = _worldMatrix.m13;

        this.fillIndexBufferWithArmature(armature);
        this.fillVertexBufferWithArmature(armature);

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

        _worldMatrix = _ibuf = _vbuf = _uintbuf = null;
    },

    fillVertexBufferWithArmature (armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            if (slot.childArmature) {
                math.mat4.mul(_matrix, _worldMatrix, slot._matrix);
                _a = _matrix.m00; _b = _matrix.m01; _c = _matrix.m04; _d = _matrix.m05;
                _tx = _matrix.m12; _ty = _matrix.m13;
                this.fillVertexBufferWithArmature(slot.childArmature);
                _a = _worldMatrix.m00; _b = _worldMatrix.m01; _c = _worldMatrix.m04; _d = _worldMatrix.m05;
                _tx = _worldMatrix.m12; _ty = _worldMatrix.m13;
                continue;
            }

            let vertices = slot._vertices;
            let slotColor = slot._color;
            let cr = slotColor.r * _nodeR;
            let cg = slotColor.g * _nodeG;
            let cb = slotColor.b * _nodeB;
            let ca = slotColor.a * _nodeA;
            let color = ((ca<<24) >>> 0) + (cb<<16) + (cg<<8) + cr;

            for (let j = 0, vl = vertices.length; j < vl; j++) {
                let vertex = vertices[j];
                _vbuf[_vertexOffset++] = vertex.x * _a + vertex.y * _c + _tx;
                _vbuf[_vertexOffset++] = vertex.x * _b + vertex.y * _d + _ty;
                _vbuf[_vertexOffset++] = vertex.u;
                _vbuf[_vertexOffset++] = vertex.v;
                _uintbuf[_vertexOffset++] = color;
            }
        }
    },

    fillIndexBufferWithArmature (armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            if (slot.childArmature) {
                this.fillIndexBufferWithArmature(slot.childArmature);
                continue;
            }

            let indices = slot._indices;
            for (let j = 0, il = indices.length; j < il; j++) {
                _ibuf[_indiceOffset++] = _vertexId + indices[j];
            }

            _vertexId += slot._vertices.length;
        }
    }
};

module.exports = Armature._assembler = armatureAssembler;
