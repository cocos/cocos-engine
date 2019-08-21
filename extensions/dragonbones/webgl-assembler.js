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

import Assembler from '../../cocos2d/core/renderer/assembler';

const Armature = require('./ArmatureDisplay');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const Material = require('../../cocos2d/core/assets/material/CCMaterial');
const gfx = cc.gfx;
const mat4 = cc.vmath.mat4;
const NEED_NONE = 0x00;
const NEED_COLOR = 0x01;
const NEED_BATCH = 0x10;
const NEED_COLOR_BATCH = 0x11;

let _boneColor = cc.color(255, 0, 0, 255);
let _slotColor = cc.color(0, 0, 255, 255);

let _nodeR, _nodeG, _nodeB, _nodeA,
    _premultipliedAlpha, _multiply,
    _mustFlush, _buffer, _node,
    _renderer, _comp,
    _vfOffset, _indexOffset, _vertexOffset,
    _vertexCount, _indexCount,
    _x, _y, _c, _r, _g, _b, _a, _handleVal,
    _m00, _m04, _m12,
    _m01, _m05, _m13;

function _getSlotMaterial (tex, blendMode) {
    if(!tex)return null;

    let src, dst;
    switch (blendMode) {
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

    let useModel = !_comp.enableBatch;
    // Add useModel flag due to if pre same db useModel but next db no useModel,
    // then next db will multiply model matrix more than once.
    let key = tex.getId() + src + dst + useModel;
    let baseMaterial = _comp.sharedMaterials[0];
    if (!baseMaterial) {
        return null;
    }
    let materialCache = _comp._materialCache;

    let material = materialCache[key];
    if (!material) {
        let baseKey = baseMaterial._hash;
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = new cc.Material();
            material.copy(baseMaterial);
        }

        material.define('CC_USE_MODEL', useModel);
        material.setProperty('texture', tex);

        // update blend function
        material.effect.setBlend(
            true,
            gfx.BLEND_FUNC_ADD,
            src, dst,
            gfx.BLEND_FUNC_ADD,
            src, dst
        );
        materialCache[key] = material;
        material.updateHash(key);
    }
    else if (material.texture !== tex) {
        material.setProperty('texture', tex);
        material.updateHash(key);
    }
    return material;
}

function _handleColor (color, parentOpacity) {
    _a = color.a * parentOpacity * _nodeA;
    _multiply = _premultipliedAlpha? _a / 255.0 : 1.0;
    _r = color.r * _nodeR * _multiply;
    _g = color.g * _nodeG * _multiply;
    _b = color.b * _nodeB * _multiply;
    _c = ((_a<<24) >>> 0) + (_b<<16) + (_g<<8) + _r;
}

export default class ArmatureAssembler extends Assembler {
    updateRenderData (comp, batchData) {}

    realTimeTraverse (armature, parentMat, parentOpacity) {
        let slots = armature._slots;
        let vbuf, ibuf, uintbuf;
        let material;
        let vertices, indices;
        let slotColor;
        let slot;
        let slotMat;
        let slotMatm;
        let offsetInfo;

        for (let i = 0, l = slots.length; i < l; i++) {
            slot = slots[i];
            slotColor = slot._color;

            if (!slot._visible || !slot._displayData) continue;

            if (parentMat) {
                slot._mulMat(slot._worldMatrix, parentMat, slot._matrix);
            } else {
                mat4.copy(slot._worldMatrix, slot._matrix);
            }

            if (slot.childArmature) {
                this.realTimeTraverse(slot.childArmature, slot._worldMatrix, parentOpacity * slotColor.a / 255);
                continue;
            }

            material = _getSlotMaterial(slot.getTexture(), slot._blendMode);
            if (!material) {
                continue;
            }

            if (_mustFlush || material._hash !== _renderer.material._hash) {
                _mustFlush = false;
                _renderer._flush();
                _renderer.node = _node;
                _renderer.material = material;
            }

            _handleColor(slotColor, parentOpacity);
            slotMat = slot._worldMatrix;
            slotMatm = slotMat.m;

            vertices = slot._localVertices;
            _vertexCount = vertices.length >> 2;

            indices = slot._indices;
            _indexCount = indices.length;
            
            offsetInfo = _buffer.request(_vertexCount, _indexCount);
            _indexOffset = offsetInfo.indiceOffset;
            _vfOffset = offsetInfo.byteOffset >> 2;
            _vertexOffset = offsetInfo.vertexOffset;
            vbuf = _buffer._vData;
            ibuf = _buffer._iData;
            uintbuf = _buffer._uintVData;

            _m00 = slotMatm[0];
            _m04 = slotMatm[4];
            _m12 = slotMatm[12];
            _m01 = slotMatm[1];
            _m05 = slotMatm[5];
            _m13 = slotMatm[13];

            for (let vi = 0, vl = vertices.length; vi < vl;) {
                _x = vertices[vi++]; 
                _y = vertices[vi++];

                vbuf[_vfOffset++] = _x * _m00 + _y * _m04 + _m12; // x
                vbuf[_vfOffset++] = _x * _m01 + _y * _m05 + _m13; // y

                vbuf[_vfOffset++] = vertices[vi++]; // u
                vbuf[_vfOffset++] = vertices[vi++]; // v
                uintbuf[_vfOffset++] = _c; // color
            }

            for (let ii = 0, il = indices.length; ii < il; ii ++) {
                ibuf[_indexOffset++] = _vertexOffset + indices[ii];
            }
        }
    }

    cacheTraverse (frame, parentMat) {
        if (!frame) return;
        let segments = frame.segments;
        if (segments.length == 0) return;

        let vbuf, ibuf, uintbuf;
        let material;
        let offsetInfo;
        let vertices = frame.vertices;
        let indices = frame.indices;
        let uintVert = frame.uintVert;
        
        let frameVFOffset = 0, frameIndexOffset = 0, segVFCount = 0;
        if (parentMat) {
            let parentMatm = parentMat.m;
            _m00 = parentMatm[0];
            _m01 = parentMatm[1];
            _m04 = parentMatm[4];
            _m05 = parentMatm[5];
            _m12 = parentMatm[12];
            _m13 = parentMatm[13];
        }

        let justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
        let needBatch = _handleVal == NEED_BATCH || _handleVal == NEED_COLOR_BATCH;
        let calcTranslate = needBatch && justTranslate;

        let colorOffset = 0;
        let colors = frame.colors;
        let nowColor = colors[colorOffset++];
        let maxVFOffset = nowColor.vfOffset;
        _handleColor(nowColor, 1.0);

        for (let i = 0, n = segments.length; i < n; i++) {
            let segInfo = segments[i];
            material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
            if (_mustFlush || material._hash !== _renderer.material._hash) {
                _mustFlush = false;
                _renderer._flush();
                _renderer.node = _node;
                _renderer.material = material;
            }

            _vertexCount = segInfo.vertexCount;
            _indexCount = segInfo.indexCount;
            
            offsetInfo = _buffer.request(_vertexCount, _indexCount);
            _indexOffset = offsetInfo.indiceOffset;
            _vertexOffset = offsetInfo.vertexOffset;
            _vfOffset = offsetInfo.byteOffset >> 2;
            vbuf = _buffer._vData;
            ibuf = _buffer._iData;
            uintbuf = _buffer._uintVData;

            for (let ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
                ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
            }

            segVFCount = segInfo.vfCount;
            vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
            frameVFOffset += segVFCount;

            if (calcTranslate) {
                for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += 5) {
                    vbuf[ii] += _m12;
                    vbuf[ii + 1] += _m13;
                }
            } else if (needBatch) {
                for (let ii = _vfOffset, il = _vfOffset + segVFCount; ii < il; ii += 5) {
                    _x = vbuf[ii];
                    _y = vbuf[ii + 1];
                    vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                    vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
                }
            }

            if ( !(_handleVal & NEED_COLOR) ) continue;

            // handle color
            let frameColorOffset = frameVFOffset - segVFCount;
            for (let ii = _vfOffset + 4, il = _vfOffset + 4 + segVFCount; ii < il; ii+=5, frameColorOffset += 5) {
                if (frameColorOffset >= maxVFOffset) {
                    nowColor = colors[colorOffset++];
                    _handleColor(nowColor, 1.0);
                    maxVFOffset = nowColor.vfOffset;
                }
                uintbuf[ii] = _c;
            }
        }
    }

    fillBuffers (comp, renderer) {
        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
        
        // Init temp var.
        _mustFlush = true;
        _premultipliedAlpha = comp.premultipliedAlpha;
        _node = comp.node;
        _buffer = renderer._meshBuffer;
        _renderer = renderer;
        _comp = comp;
        _handleVal = 0;

        let nodeColor = _node._color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;
        if (nodeColor._val !== 0xffffffff) {
            _handleVal |= NEED_COLOR;
        }

        let worldMat = undefined;
        if (_comp.enableBatch) {
            worldMat = _node._worldMatrix;
            _mustFlush = false;
            _handleVal |= NEED_BATCH;
        }

        if (comp.isAnimationCached()) {
            // Traverse input assembler.
            this.cacheTraverse(comp._curFrame, worldMat);
        } else {
            // Traverse all armature.
            let armature = comp._armature;
            if (!armature) return;

            this.realTimeTraverse(armature, worldMat, 1.0);

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
        
        // Clear temp var.
        _node = undefined;
        _buffer = undefined;
        _renderer = undefined;
        _comp = undefined;
    }
}

Assembler.register(Armature, ArmatureAssembler);
