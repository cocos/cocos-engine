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

import Assembler from '../renderer/assembler';
import MaterialVariant from '../assets/material/material-variant';
import { Color } from '../value-types';

const Component = require('./CCComponent');
const RenderFlow = require('../renderer/render-flow');
const Material = require('../assets/material/CCMaterial');

let _temp_color = new Color();

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

        /**
         * !#en The materials used by this render component.
         * !#zh 渲染组件使用的材质。
         * @property {[Material]} sharedMaterials
         */
        materials: {
            get () {
                return this._materials;
            },
            set (val) {
                this._materials = val;
                this._activateMaterial();
            },
            type: [Material],
            displayName: 'Materials',
            animatable: false
        }
    },

    ctor () {
        this._vertsDirty = true;
        this._assembler = null;
    },

    _resetAssembler () {
        Assembler.init(this);
        this._updateColor();
        this.setVertsDirty();
    },

    __preload () {
        this._resetAssembler();
        this._activateMaterial();
    },

    onEnable () {
        if (this.node._renderComponent) {
            this.node._renderComponent.enabled = false;
        }
        this.node._renderComponent = this;
        this.node._renderFlag |= RenderFlow.FLAG_OPACITY_COLOR;

        this.setVertsDirty();
    },

    onDisable () {
        this.node._renderComponent = null;
        this.disableRender();
    },

    onDestroy () {
        let materials = this._materials;
        for (let i = 0; i < materials.length; i++) {
            cc.pool.material.put(materials[i]);
        }
        materials.length = 0;

        cc.pool.assembler.put(this._assembler);

        this.disableRender();
    },

    setVertsDirty () {
        this._vertsDirty = true;
        this.markForRender(true);
    },

    _on3DNodeChanged () {
        this._resetAssembler();
    },

    _validateRender () {
    },

    markForValidate () {
        cc.RenderFlow.registerValidate(this);
    },

    markForRender (enable) {
        let flag = RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA;
        if (enable) {
            this.node._renderFlag |= flag;
            this.markForValidate();
        }
        else {
            this.node._renderFlag &= ~flag;
        }
    },

    disableRender () {
        this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA);
    },

    /**
     * !#en Get the material by index.
     * !#zh 根据指定索引获取材质
     * @method getMaterial
     * @param {Number} index
     * @return {MaterialVariant}
     */
    getMaterial (index) {
        if (index < 0 || index >= this._materials.length) {
            return null;
        }

        let material = this._materials[index];
        if (!material) return null;

        let instantiated = MaterialVariant.create(material, this);
        if (instantiated !== material) {
            this.setMaterial(index, instantiated);
        }

        return instantiated;
    },

    /**
     * !#en Gets all the materials.
     * !#zh 获取所有材质。
     * @method getMaterials
     * @return {[MaterialVariant]}
     */
    getMaterials () {
        let materials = this._materials;
        for (let i = 0; i < materials.length; i++) {
            materials[i] = MaterialVariant.create(materials[i], this);
        }
        return materials;
    },

    /**
     * !#en Set the material by index.
     * !#zh 根据指定索引设置材质
     * @method setMaterial
     * @param {Number} index
     * @param {Material} material
     * @return {Material}
     */
    setMaterial (index, material) {
        if (material !== this._materials[index]) {
            material = MaterialVariant.create(material, this);
            this._materials[index] = material;
        }
        this._updateMaterial();
        this.markForRender(true);
        return material;
    },

    _getDefaultMaterial () {
        return Material.getBuiltinMaterial('2d-sprite');
    },

    /**
     * Init material.
     */
    _activateMaterial () {
        let materials = this._materials;
        if (!materials[0]) {
            let material = this._getDefaultMaterial();
            materials[0] = material;
        }

        for (let i = 0; i < materials.length; i++) {
            materials[i] = MaterialVariant.create(materials[i], this);
        }

        this._updateMaterial();
    },

    /**
     * Update material properties.
     */
    _updateMaterial () {

    },

    _updateColor () {
        if (this._assembler.updateColor) {
            let premultiply = this.srcBlendFactor === cc.macro.BlendFactor.ONE;
            premultiply && Color.premultiplyAlpha(_temp_color, this.node._color);
            let color = premultiply ? _temp_color._val : null;
            this._assembler.updateColor(this, color);
        }
    },

    _checkBacth (renderer, cullingMask) {
        let material = this._materials[0];
        if ((material && material.getHash() !== renderer.material.getHash()) ||
            renderer.cullingMask !== cullingMask) {
            renderer._flush();

            renderer.node = material.getDefine('CC_USE_MODEL') ? this.node : renderer._dummyNode;
            renderer.material = material;
            renderer.cullingMask = cullingMask;
        }
    }
});

cc.RenderComponent = module.exports = RenderComponent;
