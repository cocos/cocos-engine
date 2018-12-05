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

import gfx from '../../renderer/gfx';
import InputAssembler from '../../renderer/core/input-assembler';
import IARenderData from '../../renderer/render-data/ia-render-data';

const MeshRenderer = require('./CCMeshRenderer');

const BLACK_COLOR = cc.Color.BLACK;

let meshRendererAssembler = {
    useModel: true,
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

    createWireFrameData (ia, oldIbData, material, renderer) {
        let data = new IARenderData();
        let m = material.clone();
        m.color = BLACK_COLOR;
        m.define('USE_TEXTRUE', false);
        m._mainTech._passes[0].setDepth(true, true);
        data.material = m;

        let indices = [];
        for (let i = 0; i < oldIbData.length; i+=3) {
            let a = oldIbData[ i + 0 ];
            let b = oldIbData[ i + 1 ];
            let c = oldIbData[ i + 2 ];
            indices.push(a, b, b, c, c, a);
        }

        let ibData = new Uint16Array(indices);
        let ib = new gfx.IndexBuffer(
            renderer._device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            ibData,
            ibData.length
        );

        data.ia = new InputAssembler(ia._vertexBuffer, ib, gfx.PT_LINES);
        return data;
    },

    fillBuffers (comp, renderer) {
        if (!comp.mesh) return;

        renderer._flush();

        let renderDatas = comp._renderDatas;
        let submeshes = comp.mesh._subMeshes;
        if (cc.macro.SHOW_MESH_WIREFRAME) {
            if (renderDatas.length === submeshes.length) {
                let ibs = comp.mesh._ibs;
                for (let i = 0; i < submeshes.length; i++) {
                    let data = renderDatas[i];
                    renderDatas.push( this.createWireFrameData(data.ia, ibs[i].data, data.material, renderer) );
                }
            }
        }
        else {
            renderDatas.length = submeshes.length;
        }

        let tmpMaterial = renderer.material;

        let tmpNode = renderer.node;
        renderer.node = comp instanceof cc.SkinnedMeshRenderer ? renderer._dummyNode : comp.node;
        renderer.defines = comp._defines;
        renderer.uniforms = comp._uniforms;

        comp._setUniform('_nodeColor', comp.node.color);

        comp.mesh._uploadData();

        for (let i = 0; i < renderDatas.length; i++) {
            let renderData = renderDatas[i];
            let material = renderData.material;
            
            let attr2el = renderData.ia._vertexBuffer._format._attr2el;
            comp._setDefine('_USE_ATTRIBUTE_COLOR', !!attr2el[gfx.ATTR_COLOR]);
            comp._setDefine('_USE_ATTRIBUTE_UV0', !!attr2el[gfx.ATTR_UV0]);

            renderer.material = material;
            renderer._flushIA(renderData);
        }

        renderer.node = tmpNode;
        renderer.material = tmpMaterial;
    }
};

module.exports = MeshRenderer._assembler = meshRendererAssembler;
