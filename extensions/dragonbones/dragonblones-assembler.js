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

const Armature = require('./ArmatureDisplay');

const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const RenderData = renderEngine.RenderData;
const math = renderEngine.math;


let _matrix = math.mat4.create();
let _v3 = cc.v3();

let _vbuf, _uintbuf, 
    _vertexId, _ibuf,
    _off, 
    _a, _b, _c, _d, _tx, _ty,
    _renderData, _z,
    _worldMatrix;

let assembler = {
    useModel: false,

    createData (comp) {
        return RenderData.alloc();
    },

    updateRenderData (comp) {
        let renderData = comp._renderData;
        if (!renderData) {
            renderData = comp._renderData = this.createData(comp);
        }

        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        if (!comp._armature) return;
        let node = comp.node;
        
        _vbuf = vbuf;
        _uintbuf = uintbuf;
        _off = index * comp._vertexFormat._bytes / 4;
        _z = node._position.z;

        node._updateWorldMatrix();
        _worldMatrix = node._worldMatrix;
        _a = _worldMatrix.m00; _b = _worldMatrix.m01; _c = _worldMatrix.m04; _d = _worldMatrix.m05;
        _tx = _worldMatrix.m12; _ty = _worldMatrix.m13;

        _renderData = comp._renderData;
        _renderData.vertexCount = 0;

        this.fillVertexBufferWithArmature (comp._armature);

        _vbuf = _uintbuf = _renderData = null;
    },

    fillVertexBufferWithArmature (armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot.displayData) continue;

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
            let color = slot._color;
            for (let j = 0, vl = vertices.length; j < vl; j++) {
                let vertex = vertices[j];
                _vbuf[_off + 0] = vertex.x * _a + vertex.y * _c + _tx;
                _vbuf[_off + 1] = vertex.x * _b + vertex.y * _d + _ty;
                _vbuf[_off + 2] = _z;
                _vbuf[_off + 4] = vertex.u;
                _vbuf[_off + 5] = vertex.v;
                _uintbuf[_off + 3] = color;
                _off += 6;
            }

            _renderData.vertexCount += vertices.length;
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        if (!comp._armature) return;

        _ibuf = ibuf;
        _vertexId = vertexId;
        _off = offset;

        _renderData = comp._renderData;
        _renderData.indiceCount = 0;

        this.fillIndexBufferWithArmature(comp._armature);

        _ibuf = _renderData = null;
    },

    fillIndexBufferWithArmature (armature) {
        let slots = armature._slots;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot.displayData) continue;

            if (slot.childArmature) {
                this.fillIndexBufferWithArmature(slot.childArmature);
                continue;
            }

            let indices = slot._indices;
            for (let j = 0, il = indices.length; j < il; j++) {
                _ibuf[_off++] = _vertexId + indices[j];
            }

            _vertexId += slot._vertices.length;
            _renderData.indiceCount += indices.length;
        }
    }
}

module.exports = Armature._assembler = assembler;
