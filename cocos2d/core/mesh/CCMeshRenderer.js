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
import Aabb from '../geom-utils/aabb';
import Vec3 from '../value-types/vec3';
import Mat4 from '../value-types/mat4';
import MaterialVariant from '../assets/material/material-variant';

const RenderComponent = require('../components/CCRenderComponent');
const Mesh = require('./CCMesh');
const RenderFlow = require('../renderer/render-flow');
const Renderer = require('../renderer');
const Material = require('../assets/material/CCMaterial');


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
 * @extends RenderComponent
 */
let MeshRenderer = cc.Class({
    name: 'cc.MeshRenderer',
    extends: RenderComponent,
    
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.mesh/MeshRenderer',
        help: 'i18n:COMPONENT.help_url.mesh-renderer',
    },

    properties: {
        _mesh: {
            default: null,
            type: Mesh
        },

        _receiveShadows: false,
        _shadowCastingMode: ShadowCastingMode.OFF,

        _enableAutoBatch: false,

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
                    this.disableRender();
                    return;
                }
                this.markForRender(true);
                this.node._renderFlag |= RenderFlow.FLAG_TRANSFORM;
            },
            type: Mesh,
            animatable: false
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
            },
            animatable: false
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
            type: ShadowCastingMode,
            animatable: false
        },

        /**
         * !#en
         * Enable auto merge mesh, only support when mesh's VertexFormat, PrimitiveType, materials are all the same
         * !#zh 
         * 开启自动合并 mesh 功能，只有在网格的 顶点格式，PrimitiveType, 使用的材质 都一致的情况下才会有效
         * @property {Boolean} enableAutoBatch
         */
        enableAutoBatch: {
            get () {
                return this._enableAutoBatch;
            },
            set (val) {
                this._enableAutoBatch = val;
            }
        },
    },

    statics: {
        ShadowCastingMode: ShadowCastingMode
    },

    ctor () {
        this._boundingBox = cc.geomUtils && new Aabb();

        if (CC_DEBUG) {
            this._debugDatas = {
                wireFrame: [],
                normal: []
            };
        }
    },

    onEnable () {
        this._super();
        if (this._mesh && !this._mesh.loaded) {
            this.disableRender();
            this._mesh.once('load', () => {
                if (!this.isValid) return;
                this._setMesh(this._mesh);
                this.markForRender(true);
            });
            cc.assetManager.postLoadNative(this._mesh);
        }
        else {
            this._setMesh(this._mesh);
        }

        this._updateRenderNode();
        this._updateMaterial();
    },

    onDestroy () {
        this._setMesh(null);
        cc.pool.assembler.put(this._assembler);
    },

    _updateRenderNode () {
        this._assembler.setRenderNode(this.node);
    },

    _setMesh (mesh) {
        if (cc.geomUtils && mesh) {
            Aabb.fromPoints(this._boundingBox, mesh._minPos, mesh._maxPos);
        }

        if (this._mesh) {
            this._mesh.off('init-format', this._updateMeshAttribute, this);
        }
        if (mesh) {
            mesh.on('init-format', this._updateMeshAttribute, this);
        }
        this._mesh = mesh;
        this._assembler && (this._assembler._worldDatas = {});
        this._updateMeshAttribute();
    },

    _getDefaultMaterial () {
        return Material.getBuiltinMaterial('unlit');
    },

    _validateRender () {
        let mesh = this._mesh;
        if (mesh && mesh._subDatas.length > 0) {
            return;
        }

        this.disableRender();
    },

    _updateMaterial () {
        // TODO: used to upgrade from 2.1, should be removed
        let textures = this.textures;
        if (textures && textures.length > 0) {
            let defaultMaterial = this._getDefaultMaterial();
            for (let i = 0; i < textures.length; i++) {
                let material = this._materials[i];
                if (material && material._uuid !== defaultMaterial._uuid) continue;
                if (!material) {
                    material = MaterialVariant.create(defaultMaterial, this);
                    this.setMaterial(i, material);
                }
                material.setProperty('diffuseTexture', textures[i]);
            }
        }

        this._updateReceiveShadow();
        this._updateCastShadow();
        this._updateMeshAttribute();
    },

    _updateReceiveShadow () {
        let materials = this.getMaterials();
        for (let i = 0; i < materials.length; i++) {
            materials[i].define('CC_USE_SHADOW_MAP', this._receiveShadows, undefined, true);
        }
    },

    _updateCastShadow () {
        let materials = this.getMaterials();
        for (let i = 0; i < materials.length; i++) {
            materials[i].define('CC_CASTING_SHADOW', this._shadowCastingMode === ShadowCastingMode.ON, undefined, true);
        }
    },

    _updateMeshAttribute () {
        let subDatas = this._mesh && this._mesh.subDatas;
        if (!subDatas) return;

        let materials = this.getMaterials();
        for (let i = 0; i < materials.length; i++) {
            if (!subDatas[i]) break;
            let vfm = subDatas[i].vfm;
            let material = materials[i];
            material.define('CC_USE_ATTRIBUTE_COLOR', !!vfm.element(gfx.ATTR_COLOR), undefined, true);
            material.define('CC_USE_ATTRIBUTE_UV0', !!vfm.element(gfx.ATTR_UV0), undefined, true);
            material.define('CC_USE_ATTRIBUTE_NORMAL', !!vfm.element(gfx.ATTR_NORMAL), undefined, true);
            material.define('CC_USE_ATTRIBUTE_TANGENT', !!vfm.element(gfx.ATTR_TANGENT), undefined, true);
        }

        if (CC_DEBUG) {
            for (let name in this._debugDatas) {
                this._debugDatas[name].length = 0;
            }
        }

        if (CC_JSB && CC_NATIVERENDERER) {
            this._assembler.updateMeshData(this);
        }
    },

    _checkBacth () {
    },
});

if (CC_DEBUG) {
    const BLACK_COLOR = cc.Color.BLACK;
    const RED_COLOR = cc.Color.RED;

    let v3_tmp = [cc.v3(), cc.v3()];
    let mat4_tmp = cc.mat4();

    let createDebugDataFns = {
        normal (comp, ia, subData, subIndex) {
            let oldVfm = subData.vfm;

            let normalEle = oldVfm.element(gfx.ATTR_NORMAL);
            let posEle = oldVfm.element(gfx.ATTR_POSITION);
            let jointEle = oldVfm.element(gfx.ATTR_JOINTS);
            let weightEle = oldVfm.element(gfx.ATTR_WEIGHTS);
            
            if (!normalEle || !posEle) {
                return;
            }

            let indices = [];
            let vbData = [];

            let lineLength = 100;
            Vec3.set(v3_tmp[0], 5, 0, 0);
            Mat4.invert(mat4_tmp, comp.node._worldMatrix);
            Vec3.transformMat4Normal(v3_tmp[0], v3_tmp[0], mat4_tmp);
            lineLength = v3_tmp[0].mag();

            let mesh = comp.mesh;
            let posData = mesh._getAttrMeshData(subIndex, gfx.ATTR_POSITION);
            let normalData = mesh._getAttrMeshData(subIndex, gfx.ATTR_NORMAL);
            let jointData = mesh._getAttrMeshData(subIndex, gfx.ATTR_JOINTS);
            let weightData = mesh._getAttrMeshData(subIndex, gfx.ATTR_WEIGHTS);

            let vertexCount = posData.length / posEle.num;

            for (let i = 0; i < vertexCount; i++) {
                let normalIndex = i * normalEle.num;
                let posIndex = i * posEle.num;

                Vec3.set(v3_tmp[0], normalData[normalIndex], normalData[normalIndex+1], normalData[normalIndex+2]);
                Vec3.set(v3_tmp[1], posData[posIndex], posData[posIndex+1], posData[posIndex+2]);
                Vec3.scaleAndAdd(v3_tmp[0], v3_tmp[1], v3_tmp[0], lineLength);

                for (let lineIndex = 0; lineIndex < 2; lineIndex++) {
                    vbData.push(v3_tmp[lineIndex].x, v3_tmp[lineIndex].y, v3_tmp[lineIndex].z);
                    if (jointEle) {
                        let jointIndex = i * jointEle.num;
                        for (let j = 0; j < jointEle.num; j++) {
                            vbData.push(jointData[jointIndex + j]);
                        }
                    }
                    if (weightEle) {
                        let weightIndex = i * weightEle.num;
                        for (let j = 0; j < weightEle.num; j++) {
                            vbData.push(weightData[weightIndex + j]);
                        }
                    }
                }

                indices.push(i*2, i*2+1);
            }

            let formatOpts = [
                { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
            ];
            if (jointEle) {
                formatOpts.push({ name: gfx.ATTR_JOINTS, type: gfx.ATTR_TYPE_FLOAT32, num: jointEle.num })
            }
            if (weightEle) {
                formatOpts.push({ name: gfx.ATTR_WEIGHTS, type: gfx.ATTR_TYPE_FLOAT32, num: weightEle.num })
            }
            let gfxVFmt = new gfx.VertexFormat(formatOpts);

            let vb = new gfx.VertexBuffer(
                Renderer.device,
                gfxVFmt,
                gfx.USAGE_STATIC,
                new Float32Array(vbData)
            );

            let ibData = new Uint16Array(indices);
            let ib = new gfx.IndexBuffer(
                Renderer.device,
                gfx.INDEX_FMT_UINT16,
                gfx.USAGE_STATIC,
                ibData,
                ibData.length
            );

            let m = MaterialVariant.createWithBuiltin('unlit');
            m.setProperty('diffuseColor', RED_COLOR);

            return {
                material: m,
                ia: new InputAssembler(vb, ib, gfx.PT_LINES)
            };
        },

        wireFrame (comp, ia, subData) {
            let oldIbData = subData.getIData(Uint16Array);
            let m = MaterialVariant.createWithBuiltin('unlit');
            m.setProperty('diffuseColor', BLACK_COLOR);

            let indices = [];
            for (let i = 0; i < oldIbData.length; i+=3) {
                let a = oldIbData[ i + 0 ];
                let b = oldIbData[ i + 1 ];
                let c = oldIbData[ i + 2 ];
                indices.push(a, b, b, c, c, a);
            }

            let ibData = new Uint16Array(indices);
            let ib = new gfx.IndexBuffer(
                Renderer.device,
                gfx.INDEX_FMT_UINT16,
                gfx.USAGE_STATIC,
                ibData,
                ibData.length
            );

            return {
                material: m,
                ia: new InputAssembler(ia._vertexBuffer, ib, gfx.PT_LINES)
            };
        }
    };

    let _proto = MeshRenderer.prototype;
    _proto._updateDebugDatas = function () {
        let debugDatas = this._debugDatas;
        let subMeshes = this._mesh.subMeshes;
        let subDatas = this._mesh._subDatas;
        for (let name in debugDatas) {
            let debugData = debugDatas[name];
            if (debugData.length === subMeshes.length) continue;
            if (!cc.macro['SHOW_MESH_' + name.toUpperCase()]) continue;

            debugData.length = subMeshes.length;
            for (let i = 0; i < subMeshes.length; i++) {
                debugData[i] = createDebugDataFns[name](this, subMeshes[i], subDatas[i], i);
            }
        }
    };
}

cc.MeshRenderer = module.exports = MeshRenderer;
