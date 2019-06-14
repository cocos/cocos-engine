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
import InputAssembler from '../../renderer/core/input-assembler';
import IARenderData from '../../renderer/render-data/ia-render-data';
const Material = require('../assets/material/CCMaterial');

const MeshRenderer = require('./CCMeshRenderer');

const BLACK_COLOR = cc.Color.BLACK;

export default class MeshRendererAssembler extends Assembler {
    constructor (comp) {
        super(comp);
        this._ias = [];
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

    createWireFrameData (ia, oldIbData, renderer) {
        let m = new Material();
        m.copy(Material.getBuiltinMaterial('unlit'));
        m.setProperty('diffuseColor', BLACK_COLOR);
        m.define('USE_DIFFUSE_TEXTURE', false);

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

        return new InputAssembler(ia._vertexBuffer, ib, gfx.PT_LINES);
    }

    fillBuffers (comp, renderer) {
        renderer._flush();

        let ias = this._ias;
        // let submeshes = comp.mesh._subMeshes;
        // if (cc.macro.SHOW_MESH_WIREFRAME) {
        //     if (ias.length === submeshes.length) {
        //         let ibs = comp.mesh._ibs;
        //         for (let i = 0; i < submeshes.length; i++) {
        //             ias.push( this.createWireFrameData(ias[i], ibs[i].data, renderer) );
        //         }
        //     }
        // }
        // else {
        //     ias.length = submeshes.length;
        // }

        let tmpMaterial = renderer.material;

        let tmpNode = renderer.node;
        renderer.node = comp.getRenderNode();

        renderer.customProperties = comp._customProperties;
        let tmpCustomProperties = renderer.customProperties;

        comp.mesh._uploadData();

        let materials = comp.sharedMaterials;
        for (let i = 0; i < ias.length; i++) {
            let material = materials[i] || materials[0];

            renderer.material = material;
            renderer._flushIA(ias[i]);
        }

        renderer.customProperties = tmpCustomProperties;
        renderer.node = tmpNode;
        renderer.material = tmpMaterial;
    }
}

Assembler.register(MeshRenderer, MeshRendererAssembler);
