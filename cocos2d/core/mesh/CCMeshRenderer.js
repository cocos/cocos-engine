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

const RenderComponent = require('../components/CCRenderComponent');
const Mesh = require('./CCMesh');
const RenderFlow = require('../renderer/render-flow');
const Material = require('../assets/material/CCMaterial');

import { aabb } from '../3d/geom-utils';
import gfx from '../../renderer/gfx';
import CustomProperties from '../assets/material/custom-properties';

/**
 * !#en Shadow projection mode
 *
 * !#ch 阴影投射方式
 * @static
 * @enum MeshRenderer.ShadowCastingMode
 */
let ShadowCastingMode = cc.Enum({
    /**
     * !#en
     *
     * !#ch 关闭阴影投射
     * @property OFF
     * @readonly
     * @type {Number}
     */
    OFF: 0,
    /**
     * !#en
     *
     * !#ch 开启阴影投射，当阴影光产生的时候
     * @property ON
     * @readonly
     * @type {Number}
     */
    ON: 1,
    // /**
    //  * !#en
    //  *
    //  * !#ch 可以从网格的任意一遍投射出阴影
    //  * @property TWO_SIDED
    //  * @readonly
    //  * @type {Number}
    //  */
    // TWO_SIDED: 2,
    // /**
    //  * !#en
    //  *
    //  * !#ch 只显示阴影
    //  * @property SHADOWS_ONLY
    //  * @readonly
    //  * @type {Number}
    //  */
    // SHADOWS_ONLY: 3,
});

/**
 * !#en
 * Mesh Renderer Component
 * !#zh
 * 网格渲染组件
 * @class MeshRenderer
 */
let MeshRenderer = cc.Class({
    name: 'cc.MeshRenderer',
    extends: RenderComponent,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.mesh/MeshRenderer',
    },

    properties: {
        _mesh: {
            default: null,
            type: Mesh
        },

        _receiveShadows: false,
        _shadowCastingMode: ShadowCastingMode.OFF,

        /**
         * !#en
         * The mesh which the renderer uses.
         * !#zh
         * 设置使用的网格
         * @property {Mesh} mesh
         */
        mesh: {
            get () {
                return this._mesh;
            },
            set (v) {
                if (this._mesh === v) return;
                this._setMesh(v);
                if (!v) {
                    this.markForRender(false);
                    return;
                }
                this.markForRender(true);
                this._activateMaterial(true);
                this.markForUpdateRenderData(true);
                this.node._renderFlag |= RenderFlow.FLAG_TRANSFORM;
            },
            type: Mesh
        },

        textures: {
            default: [],
            type: cc.Texture2D,
            visible: false
        },

        /**
         * !#en
         * Whether the mesh should receive shadows.
         * !#zh
         * 网格是否接受光源投射的阴影
         * @property {Boolean} receiveShadows
         */
        receiveShadows: {
            get () {
                return this._receiveShadows;
            },
            set (val) {
                this._receiveShadows = val;
                this._updateReceiveShadow();
            }
        },

        /**
         * !#en
         * Shadow Casting Mode
         * !#zh
         * 网格投射阴影的模式
         * @property {ShadowCastingMode} shadowCastingMode
         */
        shadowCastingMode: {
            get () {
                return this._shadowCastingMode;
            },
            set (val) {
                this._shadowCastingMode = val;
                this._updateCastShadow();
            },
            type: ShadowCastingMode
        }
    },

    statics: {
        ShadowCastingMode: ShadowCastingMode
    },

    ctor () {
        this._renderDatas = [];
        this._boundingBox = null;
        this._customProperties = new CustomProperties();
    },

    onEnable () {
        this._super();
        this._setMesh(this._mesh);
        this._activateMaterial();
    },

    onDestroy () {
        this._setMesh(null);
    },

    getRenderNode () {
        return this.node;
    },

    _setMesh (mesh) {
        if (this._mesh) {
            this._mesh.off('init-format', this._updateMeshAttribute, this);
        }
        if (mesh) {
            mesh.on('init-format', this._updateMeshAttribute, this);
        }
        this._mesh = mesh;
    },

    _getDefaultMaterial () {
        return Material.getBuiltinMaterial('unlit');
    },

    _activateMaterial (force) {
        let mesh = this._mesh;

        if (!mesh || mesh.subMeshes.length === 0) {
            this.disableRender();
            return;
        }

        if (aabb) {
            this._boundingBox = aabb.fromPoints(aabb.create(), mesh._minPos, mesh._maxPos);
        }

        // TODO: used to upgrade from 2.1, should be removed
        let textures = this.textures;
        if (textures && textures.length > 0) {
            for (let i = 0; i < textures.length; i++) {
                let material = this.sharedMaterials[i];
                if (material) continue;
                material = cc.Material.getInstantiatedMaterial(this._getDefaultMaterial(), this);
                material.setProperty('diffuseTexture', textures[i]);
                this.setMaterial(i, material);
            }
        }

        let materials = this.sharedMaterials;
        if (!materials[0]) {
            let material = this._getDefaultMaterial();
            materials[0] = material;
        }

        this._updateMeshAttribute();
        this._updateReceiveShadow();
        this._updateCastShadow();
        
        this.markForUpdateRenderData(true);
        this.markForRender(true);
    },

    _updateReceiveShadow () {
        this._customProperties.define('_USE_SHADOW_MAP', this._receiveShadows);
    },

    _updateCastShadow () {
        this._customProperties.define('_SHADOW_CASTING', this._shadowCastingMode === ShadowCastingMode.ON);
    },

    _updateMeshAttribute () {
        let subMeshes = this._mesh && this._mesh.subMeshes;
        if (!subMeshes) return;

        let attr2el = subMeshes[0]._vertexBuffer._format._attr2el;
        this._customProperties.define('_USE_ATTRIBUTE_COLOR', !!attr2el[gfx.ATTR_COLOR]);
        this._customProperties.define('_USE_ATTRIBUTE_UV0', !!attr2el[gfx.ATTR_UV0]);
        this._customProperties.define('_USE_ATTRIBUTE_NORMAL', !!attr2el[gfx.ATTR_NORMAL]);
    }
});

cc.MeshRenderer = module.exports = MeshRenderer;
