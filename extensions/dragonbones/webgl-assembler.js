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

const StencilManager = require('../../cocos2d/core/renderer/webgl/stencil-manager').sharedManager;
const Armature = require('./ArmatureDisplay');
const renderEngine = require('../../cocos2d/core/renderer/render-engine');
const RenderFlow = require('../../cocos2d/core/renderer/render-flow');
const gfx = renderEngine.gfx;
const SpriteMaterial = renderEngine.SpriteMaterial;
const vfmtPosUvColor = require('../../cocos2d/core/renderer/webgl/vertex-format').vfmtPosUvColor;

let _boneColor = cc.color(255, 0, 0, 255);
let _slotColor = cc.color(0, 0, 255, 255);

const STENCIL_SEP = '@';

function _updateKeyWithStencilRef (key, stencilRef) {
    return key.replace(/@\d+$/, STENCIL_SEP + stencilRef);
}

function _getSlotMaterial (comp, slot, premultiAlpha) {
    premultiAlpha = premultiAlpha || false;
    let tex = slot.getTexture();
    if(!tex)return null;
    let src, dst;

    switch (slot._blendMode) {
        case 1://additive
            src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
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
            src = premultiAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
            dst = cc.macro.ONE_MINUS_SRC_ALPHA;
            break;
    }

    let key = tex.url + src + dst + STENCIL_SEP + '0';
    comp._material = comp._material || new SpriteMaterial();
    let baseMaterial = comp._material;
    let materialCache = comp._materialCache;
    let material = materialCache[key];
    if (!material) {

        var baseKey = baseMaterial._hash;
        if (!materialCache[baseKey]) {
            material = baseMaterial;
        } else {
            material = baseMaterial.clone();
        }

        material.useModel = true;
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

let _vertexOffset, _indiceOffset,
    _nodeR, _nodeG, _nodeB, _nodeA,
    _material, _currMaterial,
    _dataId, _datas, _data, _newData;

let armatureAssembler = {
    useModel: true,

    updateRenderData (comp) {

        let armature = comp._armature;
        if (!armature) {
            return;
        }

        _dataId = 0;
        _datas = comp._renderDatas;
        _data = _datas[_dataId];
        _newData = false;
        if (!_data) {
            _data = _datas[_dataId] = comp.requestRenderData();
        }
        _data.dataLength = 0;
        _material = null;
        _currMaterial = null;
        _vertexOffset = 0;
        _indiceOffset = 0;

        let node = comp.node;
        let nodeColor = node.color;
        _nodeR = nodeColor.r / 255;
        _nodeG = nodeColor.g / 255;
        _nodeB = nodeColor.b / 255;
        _nodeA = nodeColor.a / 255;

        this.traverseArmature(comp,armature);
    },

    traverseArmature (comp,armature) {
        let slots = armature._slots;
        let premultipliedAlpha = comp.premultipliedAlpha;
        for (let i = 0, l = slots.length; i < l; i++) {
            let slot = slots[i];
            if (!slot._visible || !slot._displayData) continue;

            slot.updateWorldMatrix();

            // If slot has childArmature,then the slot has no 
            // vertices and indice info.It only has sub slots
            // transform info,so multiply the slot's transform 
            // with parent transform and give the sub slots.
            if (slot.childArmature) {
                this.traverseArmature(comp, slot.childArmature);
                continue;
            }

            _material = _getSlotMaterial(comp, slot, premultipliedAlpha);
            if (!_material) {
                continue;
            }

            // Check break
            if (_currMaterial !== _material) {
                if (_currMaterial) {
                    _newData = true;
                    _data.material = _currMaterial;
                }
                else {
                    // Init data material
                    _data.material = _material;
                }
                _currMaterial = _material;
            }

            // Request new render data and new vertex content
            if (_newData) {
                // set old data vertex indice
                _data.vertexCount = _vertexOffset;
                _data.indiceCount = _indiceOffset;
                // gen new data
                _dataId++;
                _data = _datas[_dataId];
                if (!_data) {
                    _data = _datas[_dataId] = comp.requestRenderData();
                }
                _data.material = _currMaterial;
                _data.dataLength = 0;

                // reset offset
                _vertexOffset = 0;
                _indiceOffset = 0;
            }

            let indices = slot._indices;
            let indiceBuffer = _data._indices;
            for (let j = 0, il = indices.length; j < il; j++) {
                indiceBuffer[_indiceOffset++] = _vertexOffset + indices[j];
            }

            let vertices = slot._localVertices;
            let slotColor = slot._color;
            let worldMatrix = slot._worldMatrix;
            let cr = slotColor.r * _nodeR;
            let cg = slotColor.g * _nodeG;
            let cb = slotColor.b * _nodeB;
            let ca = slotColor.a * _nodeA;
            let color = ((ca<<24) >>> 0) + (cb<<16) + (cg<<8) + cr;

            let vertexBuffer = _data._data;
            _data.dataLength += vertices.length;
            for (let j = 0, vl = vertices.length; j < vl; j++) {
                let vertex = vertices[j];
                let content = vertexBuffer[_vertexOffset++];
                content.x = vertex.x * worldMatrix.m00 + vertex.y * worldMatrix.m04 + worldMatrix.m12;
                content.y = vertex.x * worldMatrix.m01 + vertex.y * worldMatrix.m05 + worldMatrix.m13;
                content.u = vertex.u;
                content.v = vertex.v;
                content.color = color;
            }
        }

        _data.vertexCount = _vertexOffset;
        _data.indiceCount = _indiceOffset;

        // Check for last data valid or not
        if (_vertexOffset > 0 && _indiceOffset > 0) {
            _datas.length = _dataId + 1;
        }
        else {
            _datas.length = _dataId;
        }
    },

    fillBuffers (comp, renderer) {

        let armature = comp._armature;
        if (!armature) return;

        let renderDatas = comp._renderDatas;
        let materialCache = comp._materialCache;

        for (let index = 0, length = renderDatas.length; index < length; index++) {
            let data = renderDatas[index];

            let key = data.material._hash;
            let newKey = _updateKeyWithStencilRef(key, StencilManager.getStencilRef());
            if (key !== newKey) {
                data.material = materialCache[newKey] || data.material.clone();
                data.material.updateHash(newKey);
                if (!materialCache[newKey]) {
                    materialCache[newKey] = data.material;
                }
            }

            if (data.material !== renderer.material) {
                renderer._flush();
                renderer.node = comp.node;
                renderer.material = data.material;
            }

            let vertexs = data._data;
            let indices = data._indices;

            let buffer = renderer.getBuffer('mesh', vfmtPosUvColor),
                vertexOffset = buffer.byteOffset >> 2,
                vertexCount = data.vertexCount;
            
            let indiceOffset = buffer.indiceOffset,
                vertexId = buffer.vertexOffset;
            
            buffer.request(vertexCount, data.indiceCount);

            // buffer data may be realloc, need get reference after request.
            let vbuf = buffer._vData,
                ibuf = buffer._iData,
                uintbuf = buffer._uintVData;

            // fill vertex buffer
            let vert;
            for (let i = 0, l = data.dataLength; i < l; i++) {
                vert = vertexs[i];
                vbuf[vertexOffset++] = vert.x;
                vbuf[vertexOffset++] = vert.y;
                vbuf[vertexOffset++] = vert.u;
                vbuf[vertexOffset++] = vert.v;
                uintbuf[vertexOffset++] = vert.color;
            }

            // index buffer
            for (let i = 0, l = indices.length; i < l; i ++) {
                ibuf[indiceOffset++] = vertexId + indices[i];
            }
        }

        if (comp.debugBones && comp._debugDraw) {

            var graphics = comp._debugDraw;
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

        comp.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    }
};

module.exports = Armature._assembler = armatureAssembler;
