/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Component = require('./CCComponent');
const defaultVertexFormat = require('../renderer/vertex-format');
const renderEngine = require('../renderer/render-engine');
const RenderData = renderEngine.RenderData;

/**
 * !#en
 * Base class for components which supports rendering features.
 * !#zh
 * 所有支持渲染的组件的基类
 *
 * @class RenderComponent
 * @extends Component
 */
var RenderComponent = cc.Class({
    name: 'RenderComponent',
    extends: Component,

    editor: CC_EDITOR && {
        executeInEditMode: true
    },
    
    ctor () {
        this._material = null;
        this._customMaterial = false;
        this._renderData = null;
        this.__allocedDatas = [];
        this._vertexFormat = defaultVertexFormat;
        this._toPostHandle = false;
    },

    onEnable () {
        this.node._renderComponent = this;
    },

    onDisable () {
        this.node._renderComponent = null;
    },

    onDestroy () {
        for (let i = 0, l = this.__allocedDatas.length; i < l; i++) {
            RenderData.free(this.__allocedDatas[i]);
        }
        this.__allocedDatas.length = 0;
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

    getEffect () {
        if (this._material) {
            return this._material.effect;
        }
        else {
            return null;
        }
    },
});
RenderComponent._assembler = null;
RenderComponent._postAssembler = null;

cc.RenderComponent = module.exports = RenderComponent;