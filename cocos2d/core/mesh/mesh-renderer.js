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

const MeshRenderer = require('./CCMeshRenderer');


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
                renderer.material = material;
                renderer.cullingMask = comp.node._cullingMask;
                renderer.customProperties = comp._customProperties;
                renderer.node = renderer._dummyNode;
            }
            
            this._fillBuffer(comp, meshData, renderer);
        }

        if (cc.macro.SHOW_MESH_WIREFRAME) {
            this._drawWireFrames(comp, renderer);
        }
    }

    _fillBuffer (comp, meshData, renderer) {
        let matrix = comp.node._worldMatrix;
        let vData = meshData.vData;

        let vtxFormat = meshData.vfm;
        let attrPos = vtxFormat._attr2el[gfx.ATTR_POSITION];
        let attrOffset = attrPos.offset / 4;
        let elementCount = vtxFormat._bytes / 4;

        let vertexCount = vData.length / elementCount | 0;
        
        let indices = meshData.iData;
        let indicesCount = indices.length;

        let buffer = renderer.getBuffer('mesh', vtxFormat);
        let offsetInfo = buffer.request(vertexCount, indicesCount);
        
        // buffer data may be realloc, need get reference after request.
        let indiceOffset = offsetInfo.indiceOffset,
            vertexOffset = offsetInfo.byteOffset >> 2,
            vertexId = offsetInfo.vertexOffset,
            vbuf = buffer._vData,
            ibuf = buffer._iData;

        let tmpV3 = cc.v3();
        for (let i = 0; i < vertexCount; i++) {
            let offset = i * elementCount;
            for (let j = 0; j < attrOffset; j++) {
                vbuf[vertexOffset++] = vData[offset + j];
            }

            tmpV3.x = vData[offset + attrOffset];
            tmpV3.y = vData[offset + attrOffset + 1];
            tmpV3.z = vData[offset + attrOffset + 2];

            vec3.transformMat4(tmpV3, tmpV3, matrix);

            vbuf[vertexOffset++] = tmpV3.x;
            vbuf[vertexOffset++] = tmpV3.y;
            vbuf[vertexOffset++] = tmpV3.z;

            for (let j = attrOffset + 3; j < elementCount; j++) {
                vbuf[vertexOffset++] = vData[offset + j];
            }
        }

        for (let i = 0; i < indicesCount; i++) {
            ibuf[indiceOffset + i] = vertexId + indices[i];
        }
    }

    _drawWireFrames (comp, renderer) {
        renderer._flush();
        
        comp._updateWireFrameDatas();
        renderer.node = this._renderNode;
        
        let wireFrameDatas = comp._wireFrameDatas;
        for (let i = 0; i < wireFrameDatas.length; i++) {
            let wireFrameData = wireFrameDatas[i];
            let material = wireFrameData.material;
            renderer.material = material;
            renderer._flushIA(wireFrameData.ia);
        }
    }
}

Assembler.register(MeshRenderer, MeshRendererAssembler);
