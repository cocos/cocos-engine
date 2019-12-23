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
import Vec3 from '../value-types/vec3';

const MeshRenderer = require('./CCMeshRenderer');

let _tmp_vec3 = new Vec3();

export default class MeshRendererAssembler extends Assembler {
    init (renderComp) {
        super.init(renderComp);
        
        this._worldDatas = {};
        this._renderNode = null;
    }

    setRenderNode (node) {
        this._renderNode = node;
    }

    fillBuffers (comp, renderer) {
        if (!comp.mesh) return;

        comp.mesh._uploadData();

        // update culling mask
        let isCullingMaskSame = renderer.cullingMask === comp.node._cullingMask;

        let enableAutoBatch = comp.enableAutoBatch;

        let materials = comp._materials;
        let submeshes = comp.mesh._subMeshes;
        let subDatas = comp.mesh.subDatas;
        for (let i = 0; i < submeshes.length; i++) {
            let ia = submeshes[i];
            let meshData = subDatas[i];

            let material = materials[i] || materials[0];

            if (!enableAutoBatch || !meshData.canBatch || ia._primitiveType !== gfx.PT_TRIANGLES) {
                renderer._flush();

                renderer.material = material;
                renderer.cullingMask = comp.node._cullingMask;
                renderer.node = this._renderNode;

                renderer._flushIA(ia);

                continue;
            }

            if (!isCullingMaskSame ||
                material.getHash() !== renderer.material.getHash()) {
                renderer._flush();
            }

            renderer.material = material;
            renderer.cullingMask = comp.node._cullingMask;
            renderer.node = renderer._dummyNode;
            
            this._fillBuffer(comp, meshData, renderer, i);
        }

        if (CC_DEBUG &&
            (cc.macro.SHOW_MESH_WIREFRAME || cc.macro.SHOW_MESH_NORMAL) && 
            !(comp.node._cullingMask & (1<<cc.Node.BuiltinGroupIndex.DEBUG))) {
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

    _fillBuffer (comp, meshData, renderer, dataIndex) {
        let vData = meshData.getVData(Float32Array);

        let vtxFormat = meshData.vfm;
        let vertexCount = (vData.byteLength / vtxFormat._bytes) | 0;
        
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

        if (renderer.worldMatDirty || !this._worldDatas[dataIndex]) {
            this._updateWorldVertices(dataIndex, vertexCount, vData, vtxFormat, comp.node._worldMatrix);
        }

        vbuf.set(this._worldDatas[dataIndex], vertexOffset);

        for (let i = 0; i < indicesCount; i++) {
            ibuf[indiceOffset + i] = vertexId + indices[i];
        }
    }

    _updateWorldVertices (dataIndex, vertexCount, local, vtxFormat, wolrdMatrix) {
        let world = this._worldDatas[dataIndex];
        if (!world) {
            world = this._worldDatas[dataIndex] = new Float32Array(local.length);
            world.set(local);
        }

        let floatCount = vtxFormat._bytes / 4;
        
        let elements = vtxFormat._elements;
        for (let i = 0, n = elements.length; i < n; i++) {
            let element = elements[i];
            let attrOffset = element.offset / 4;
         
            if (element.name === gfx.ATTR_POSITION || element.name === gfx.ATTR_NORMAL) {
                let transformMat4 = element.name === gfx.ATTR_NORMAL ? Vec3.transformMat4Normal : Vec3.transformMat4;
                for (let j = 0; j < vertexCount; j++) {
                    let offset = j * floatCount + attrOffset;

                    _tmp_vec3.x = local[offset];
                    _tmp_vec3.y = local[offset + 1];
                    _tmp_vec3.z = local[offset + 2];
        
                    transformMat4(_tmp_vec3, _tmp_vec3, wolrdMatrix);

                    world[offset] = _tmp_vec3.x;
                    world[offset + 1] = _tmp_vec3.y;
                    world[offset + 2] = _tmp_vec3.z;
                }
            }
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
