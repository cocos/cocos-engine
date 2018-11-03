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

const MeshRenderer = require('./CCMeshRenderer');

const renderEngine = require('../renderer/render-engine');
const IARenderData = renderEngine.IARenderData;
const gfx = renderEngine.gfx;
const InputAssembler = renderEngine.InputAssembler;

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
            data.material = comp._materials[i];
            data.ia = submeshes[i];
            renderDatas.push(data);
        }
    },

    createWireFrameData (ia, oldIbData, material, renderer) {
        let data = new IARenderData();
        let m = material.clone();
        m.color = BLACK_COLOR;
        m.useTexture = false;
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

        data.ia = new renderEngine.InputAssembler(ia._vertexBuffer, ib, gfx.PT_LINES);
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
        renderer.node = comp._material.useModel ? comp.node : renderer._dummyNode;

        comp.mesh._uploadData();

        let textures = comp.textures;
        let materials = comp._materials;
        for (let i = 0; i < renderDatas.length; i++) {
            let renderData = renderDatas[i];
            let material = renderData.material;
            if (textures[i]) {
                material.texture = textures[i];
            }
            else {
                material.useTexture = false;
            }

            renderer.material = material;
            renderer._flushIA(renderData);
        }

        renderer.node = tmpNode;
        renderer.material = tmpMaterial;
    }
};

module.exports = MeshRenderer._assembler = meshRendererAssembler;
