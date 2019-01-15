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
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const gfx = renderEngine.gfx;
const SpriteMaterial = renderEngine.SpriteMaterial;
const math = require('../../cocos2d/core/renderer/render-engine').math;

let _boneColor = cc.color(255, 0, 0, 255);
let _slotColor = cc.color(0, 0, 255, 255);

let _nodeR, _nodeG, _nodeB, _nodeA,
    _premultipliedAlpha,
    _mustFlush, _buffer, _node,
    _renderer, _comp,
    _vertexFloatOffset, _indexOffset, _vertexOffset,
    _vertexCount, _indexCount,
    _x, _y, _c, _r, _g, _b, _a;

function _getSlotMaterial (slot) {
    let tex = slot.getTexture();
    if(!tex)return null;
    let src, dst;

    switch (slot._blendMode) {
        case 1://additive
            src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE;
            break;
        case 10://multiply
            src = cc.macro.DST_COLOR;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
        case 12://screen
            src = cc.macro.ONE;
            dst = cc.macro.ONE_MINUS_SRC_COLOR;
            break;
        case 0://normal
        default:
            src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }

    let key = tex.url + src + dst;
    _comp._material = _comp._material || new SpriteMaterial();
    let baseMaterial = _comp._material;
    let materialCache = _comp._materialCache;
    let material = materialCache[key];
    if (!material) {

        var baseKey = baseMaterial._hash;
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = baseMaterial.clone();
        }

        material.useModel = !_comp.enabledBatch;
        // update texture
        material.texture = tex;
        material.useColor = false;

        // update blend function
        let pass = material._mainTech.passes[0];
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        materialCache[key] = material;
        material.updateHash(key);
    }
    else if (material.texture !== tex) {
        material.texture = tex;
        material.updateHash(key);
    }
    return material;
}

let armatureAssembler = {
    updateRenderData (comp, batchData) {},

    traverseArmature (armature, parentMat) {
        let slots = armature._slots;
        let vbuf, ibuf, uintbuf;
        let material;
        let vertices, indices;
        let slotColor;
        let slot;

        for (let i = 0, l = slots.length; i < l; i++) {
            slot = slots[i];

            if (!slot._visible || !slot._displayData) continue;

            if (slot.childArmature) {
                if (parentMat) {
                    slot._mulMat(slot._worldMatrix, parentMat, slot._matrix);
                } else {
                    math.mat4.copy(slot._worldMatrix, slot._matrix);
                }
                this.traverseArmature(slot.childArmature, slot._worldMatrix);
                continue;
            }

            material = _getSlotMaterial(slot);
            if (!material) {
                continue;
            }

            if (_mustFlush || material._hash !== _renderer.material._hash) {
                _mustFlush = false;
                _renderer._flush();
                _renderer.node = _node;
                _renderer.material = material;
            }

            slotColor = slot._color;
            _r = slotColor.r * _nodeR;
            _g = slotColor.g * _nodeG;
            _b = slotColor.b * _nodeB;
            _a = slotColor.a * _nodeA;
            _c = ((_a<<24) >>> 0) + (_b<<16) + (_g<<8) + _r;

            vertices = slot._curFrame;
            _vertexCount = vertices.length >> 2;

            indices = slot._indices;
            _indexCount = indices.length;

            _vertexFloatOffset = _buffer.byteOffset >> 2;
            _indexOffset = _buffer.indiceOffset;
            _vertexOffset = _buffer.vertexOffset;

            _buffer.request(_vertexCount, _indexCount);
            vbuf = _buffer._vData;
            ibuf = _buffer._iData;
            uintbuf = _buffer._uintVData;

            if (!parentMat) {
                for (let vi = 0, vl = vertices.length; vi < vl;) {
                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // x
                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // y
                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // u
                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // v
                    uintbuf[_vertexFloatOffset++] = _c; // color
                }
            } else {
                
                for (let vi = 0, vl = vertices.length; vi < vl;) {
                    _x = vertices[vi++]; 
                    _y = vertices[vi++];

                    vbuf[_vertexFloatOffset++] = _x * parentMat.m00 + _y * parentMat.m04 + parentMat.m12; // x
                    vbuf[_vertexFloatOffset++] = _x * parentMat.m01 + _y * parentMat.m05 + parentMat.m13; // y

                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // u
                    vbuf[_vertexFloatOffset++] = vertices[vi++]; // v
                    uintbuf[_vertexFloatOffset++] = _c; // color
                }
            }

            for (let ii = 0, il = indices.length; ii < il; ii ++) {
                ibuf[_indexOffset++] = _vertexOffset + indices[ii];
            }
        }
    },

    fillBuffers (comp, renderer) {
        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;

        let armature = comp._armature;
        if (!armature) return;
        
        // Init temp var.
        _mustFlush = true;
        _premultipliedAlpha = comp.premultipliedAlpha;
        _node = comp.node;
        _buffer = renderer._meshBuffer;
        _renderer = renderer;
        _comp = comp;

        let nodeColor = _node._color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;

        let worldMat = undefined;
        if (_comp.enabledBatch) {
            worldMat = _node._worldMatrix;
            _mustFlush = false;
        }

        // Traverse all armature.
        this.traverseArmature(armature, worldMat);

        // Clear temp var.
        _node = undefined;
        _buffer = undefined;
        _renderer = undefined;
        _comp = undefined;

        let graphics = comp._debugDraw;
        if (comp.debugBones && graphics) {
            graphics.clear();

            graphics.lineWidth = 5;
            graphics.strokeColor = _boneColor;
            graphics.fillColor = _slotColor; // Root bone color is same as slot color.

            let bones = armature.getBones();
            for (let i = 0, l = bones.length; i < l; i++) {
                let bone =  bones[i];
                let boneLength = Math.max(bone.boneData.length, 5);
                let startX = bone.globalTransformMatrix.tx;
                let startY = -bone.globalTransformMatrix.ty;
                let endX = startX + bone.globalTransformMatrix.a * boneLength;
                let endY = startY - bone.globalTransformMatrix.b * boneLength;

                graphics.moveTo(startX, startY);
                graphics.lineTo(endX, endY);
                graphics.stroke();
            }
        }
    }
};

module.exports = Armature._assembler = armatureAssembler;
