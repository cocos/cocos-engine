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

import gfx from '../../renderer/gfx';
import RenderData from '../../renderer/render-data/render-data';

const Component = require('./CCComponent');
const RenderFlow = require('../renderer/render-flow');
const BlendFactor = require('../platform/CCMacro').BlendFactor;
const Material = require('../assets/material/CCMaterial');

/**
 * !#en
 * Base class for components which supports rendering features.
 * !#zh
 * 所有支持渲染的组件的基类
 *
 * @class RenderComponent
 * @extends Component
 */
let RenderComponent = cc.Class({
    name: 'RenderComponent',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        disallowMultiple: true
    },

    properties: {
        _materials: {
            default: [],
            type: Material,
        },

        sharedMaterials: {
            get () {
                return this._materials;
            },
            set (val) {
                this._materials = val;
                this._activateMaterial(true);
            },
            type: [Material],
            displayName: 'Materials'
        }
    },
    
    ctor () {
        this._renderData = null;
        this.__allocedDatas = [];
        this._vertexFormat = null;
        this._toPostHandle = false;
        this._assembler = this.constructor._assembler;
        this._postAssembler = this.constructor._postAssembler;
    },

    onEnable () {
        if (this.node._renderComponent) {
            this.node._renderComponent.enabled = false;
        }
        this.node._renderComponent = this;
        this.node._renderFlag |= RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA;
    },

    onDisable () {
        this.node._renderComponent = null;
        this.disableRender();
    },

    onDestroy () {
        for (let i = 0, l = this.__allocedDatas.length; i < l; i++) {
            RenderData.free(this.__allocedDatas[i]);
        }
        this.__allocedDatas.length = 0;
        this._materials.length = 0;
        this._renderData = null;

        let uniforms = this._uniforms;
        for (let name in uniforms) {
            _uniformPool.remove(_uniformPool._data.indexOf(uniforms[name]));
        }
        this._uniforms = null;
        this._defines = null;
    },
    
    _canRender () {
        // When the node is activated, it will execute onEnable and the renderflag will also be reset.
        return this._enabled && this.node._activeInHierarchy;
    },

    markForUpdateRenderData (enable) {
        if (enable && this._canRender()) {
            this.node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
        }
        else if (!enable) {
            this.node._renderFlag &= ~RenderFlow.FLAG_UPDATE_RENDER_DATA;
        }
    },

    markForRender (enable) {
        if (enable && this._canRender()) {
            this.node._renderFlag |= RenderFlow.FLAG_RENDER;
        }
        else if (!enable) {
            this.node._renderFlag &= ~RenderFlow.FLAG_RENDER;
        }
    },

    markForCustomIARender (enable) {
        if (enable && this._canRender()) {
            this.node._renderFlag |= RenderFlow.FLAG_CUSTOM_IA_RENDER;
        }
        else if (!enable) {
            this.node._renderFlag &= ~RenderFlow.FLAG_CUSTOM_IA_RENDER;
        }
    },

    disableRender () {
        this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_CUSTOM_IA_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA);
    },

    requestRenderData () {
        let data = RenderData.alloc();
        this.__allocedDatas.push(data);
        return data;
    },

    destroyRenderData (data) {
        let index = this.__allocedDatas.indexOf(data);
        if (index !== -1) {
            this.__allocedDatas.splice(index, 1);
            RenderData.free(data);
        }
    },

    getMaterial (index) {
        if (index < 0 || index >= this._materials.length) {
            return null;
        }

        let material = this._materials[index];
        if (!material) return null;
        
        let instantiated = Material.getInstantiatedMaterial(material, this);
        if (instantiated !== material) {
            this.setMaterial(index, instantiated);
        }

        return this._materials[index];
    },
    
    setMaterial (index, material) {
        if (material) {
            this.markForUpdateRenderData(true);
        }
        this._materials[index] = material;
    },

    _activateMaterial (force) {
    },
});
RenderComponent._assembler = null;
RenderComponent._postAssembler = null;

cc.RenderComponent = module.exports = RenderComponent;