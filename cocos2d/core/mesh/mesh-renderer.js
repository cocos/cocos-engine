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

import IARenderData from '../../renderer/render-data/ia-render-data';
import gfx from '../../renderer/gfx';
import vec3 from '../vmath/vec3';

const Material = require('../assets/material/CCMaterial');
const MeshRenderer = require('./CCMeshRenderer');

let _idRenderData = new IARenderData();

let meshRendererAssembler = {
    updateRenderData (comp) {
        let renderDatas = comp._renderDatas;
        renderDatas.length = 0;
        if (!comp.mesh) return;
        let submeshes = comp.mesh._subMeshes;
        for (let i = 0; i < submeshes.length; i++) {
            let data = new IARenderData();
            data.material = comp.sharedMaterials[i] || comp.sharedMaterials[0];
            data.ia = submeshes[i];
            renderDatas.push(data);
        }
    },

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
        let submeshes = comp.mesh.subMeshes;
        let vbs = comp.mesh._vbs;
        let ibs = comp.mesh._ibs;
        for (let i = 0; i < submeshes.length; i++) {
            let submesh = submeshes[i];
            let vb = vbs[i];

            let material = materials[i] || materials[0];

            if (!enableAutoBatch || !vb.canBatch || submesh._primitiveType !== gfx.PT_TRIANGLES) {
                renderer._flush();

                renderer.material = material;
                renderer.cullingMask = comp.node._cullingMask;
                renderer.customProperties = comp._customProperties;
                renderer.node = comp.getRenderNode();

                _idRenderData.ia = submesh;
                _idRenderData.material = material
                
                renderer._flushIA(_idRenderData);

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
            
            this._fillBuffer(comp, vb, ibs[i], renderer);
        }

        if (cc.macro.SHOW_MESH_WIREFRAME) {
            this._drawWireFrames(comp, renderer);
        }
    },

    _fillBuffer (comp, vb, ib, renderer) {
        let matrix = comp.node._worldMatrix;
        let data = vb.Float32Array;
        if (!data) {
            data = vb.Float32Array = new Float32Array(vb.data.buffer);
        }
        let vtxFormat = vb.format;
        let attrPos = vtxFormat._attr2el[gfx.ATTR_POSITION];
        let attrOffset = attrPos.offset / 4;
        let elementCount = vtxFormat._bytes / 4;

        let vertexCount = data.length / elementCount | 0;
        
        let indices = ib.data;
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
                vbuf[vertexOffset++] = data[offset + j];
            }

            tmpV3.x = data[offset + attrOffset];
            tmpV3.y = data[offset + attrOffset + 1];
            tmpV3.z = data[offset + attrOffset + 2];

            vec3.transformMat4(tmpV3, tmpV3, matrix);

            vbuf[vertexOffset++] = tmpV3.x;
            vbuf[vertexOffset++] = tmpV3.y;
            vbuf[vertexOffset++] = tmpV3.z;

            for (let j = attrOffset + 3; j < elementCount; j++) {
                vbuf[vertexOffset++] = data[offset + j];
            }
        }

        for (let i = 0; i < indicesCount; i++) {
            ibuf[indiceOffset + i] = vertexId + indices[i];
        }
    },

    _drawWireFrames (comp, renderer) {
        renderer._flush();
        
        comp._updateWireFrameDatas();
        renderer.node = comp.getRenderNode();
        
        let datas = comp._wireFrameDatas;
        for (let i = 0; i < datas.length; i++) {
            let renderData = datas[i];
            let material = renderData.material;
            renderer.material = material;
            renderer._flushIA(renderData);
        }
    }
};

module.exports = MeshRenderer._assembler = meshRendererAssembler;
