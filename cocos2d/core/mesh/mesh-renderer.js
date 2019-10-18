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

import Assembler from '../renderer/assembler';
import gfx from '../../renderer/gfx';
import vec3 from '../vmath/vec3';
import mat4 from '../vmath/mat4';

const MeshRenderer = require('./CCMeshRenderer');

let _tmp_vec3 = cc.v3();
let _tmp_mat4 = cc.mat4();

export default class MeshRendererAssembler extends Assembler {
    constructor (comp) {
        super(comp);
        this._ias = [];
        this._renderNode = null;
    }

    setRenderNode (node) {
        this._renderNode = node;
    }

    updateRenderData (comp) {
        let ias = this._ias;
        ias.length = 0;
        if (!comp.mesh) return;
        let submeshes = comp.mesh._subMeshes;
        for (let i = 0; i < submeshes.length; i++) {
            ias.push(submeshes[i]);
        }
    }

    fillBuffers (comp, renderer) {
        if (!comp.mesh) return;

        comp.mesh._uploadData();

        // update custom properties
        let isCustomPropertiesSame = renderer.customProperties && 
            renderer.customProperties.getHash() === comp._customProperties.getHash();

        // update culling mask
        let isCullingMaskSame = renderer.cullingMask === comp.node._cullingMask;

        let enableAutoBatch = comp.enableAutoBatch;

        let materials = comp.sharedMaterials;
        let ias = this._ias;
        let subDatas = comp.mesh.subDatas;
        for (let i = 0; i < ias.length; i++) {
            let ia = ias[i];
            let meshData = subDatas[i];

            let material = materials[i] || materials[0];

            if (!enableAutoBatch || !meshData.canBatch || ia._primitiveType !== gfx.PT_TRIANGLES) {
                renderer._flush();

                renderer.material = material;
                renderer.cullingMask = comp.node._cullingMask;
                renderer.customProperties = comp._customProperties;
                renderer.node = this._renderNode;

                renderer._flushIA(ia);

                continue;
            }

            if (!isCustomPropertiesSame ||
                !isCullingMaskSame ||
                material.getHash() !== renderer.material.getHash()) {
                renderer._flush();
            }

            renderer.material = material;
            renderer.cullingMask = comp.node._cullingMask;
            renderer.customProperties = comp._customProperties;
            renderer.node = renderer._dummyNode;
            
            this._fillBuffer(comp, meshData, renderer);
        }

        if (CC_DEBUG &&
            (cc.macro.SHOW_MESH_WIREFRAME || cc.macro.SHOW_MESH_NORMAL) && 
            comp.node.groupIndex !== cc.Node.BuiltinGroupIndex.DEBUG) {
            renderer._flush();
            renderer.node = this._renderNode;
            comp._updateDebugDatas();
        
            if (cc.macro.SHOW_MESH_WIREFRAME) {
                this._drawDebugDatas(comp, renderer, 'wireFrame');
            }
            if (cc.macro.SHOW_MESH_NORMAL) {
                this._drawDebugDatas(comp, renderer, 'normal');
            }
        }
    }

    _fillBuffer (comp, meshData, renderer) {
        let wolrdMatrix = comp.node._worldMatrix;
        let vData = meshData.getVData(Float32Array);

        let vtxFormat = meshData.vfm;
        let floatCount = vtxFormat._bytes / 4;
        let vertexCount = vData.length / floatCount | 0;
        
        let indices = meshData.getIData(Uint16Array);
        let indicesCount = indices.length;

        let buffer = renderer.getBuffer('mesh', vtxFormat);
        let offsetInfo = buffer.request(vertexCount, indicesCount);
        
        // buffer data may be realloc, need get reference after request.
        let indiceOffset = offsetInfo.indiceOffset,
            vertexOffset = offsetInfo.byteOffset >> 2,
            vertexId = offsetInfo.vertexOffset,
            vbuf = buffer._vData,
            ibuf = buffer._iData;


        let elements = vtxFormat._elements;
        for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            let elementCount = element.num;
            let attrOffset = element.offset / 4;
         
            if (element.name === gfx.ATTR_POSITION || element.name === gfx.ATTR_NORMAL) {
                let transformMat4 = element.name === gfx.ATTR_NORMAL ? vec3.transformMat4Normal : vec3.transformMat4;
                for (let j = 0; j < vertexCount; j++) {
                    let offset = j * floatCount + attrOffset;

                    _tmp_vec3.x = vData[offset];
                    _tmp_vec3.y = vData[offset + 1];
                    _tmp_vec3.z = vData[offset + 2];
        
                    transformMat4(_tmp_vec3, _tmp_vec3, wolrdMatrix);

                    vbuf[vertexOffset + offset] = _tmp_vec3.x;
                    vbuf[vertexOffset + offset + 1] = _tmp_vec3.y;
                    vbuf[vertexOffset + offset + 2] = _tmp_vec3.z;
                }
            }
            else {
                for (let j = 0; j < vertexCount; j++) {
                    let offset = j * floatCount + attrOffset;
                    for (let k = 0; k < elementCount; k++) {
                        vbuf[vertexOffset + offset + k] = vData[offset + k];
                    }
                }
            }
        }

        for (let i = 0; i < indicesCount; i++) {
            ibuf[indiceOffset + i] = vertexId + indices[i];
        }
    }

    _drawDebugDatas (comp, renderer, name) {
        let debugDatas = comp._debugDatas[name];
        if (!debugDatas) return;
        for (let i = 0; i < debugDatas.length; i++) {
            let debugData = debugDatas[i];
            if (!debugData) continue;
            let material = debugData.material;
            renderer.material = material;
            renderer._flushIA(debugData.ia);
        }
    }
}

Assembler.register(MeshRenderer, MeshRendererAssembler);
