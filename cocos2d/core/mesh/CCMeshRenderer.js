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
const renderEngine = require('../renderer/render-engine');
const gfx = renderEngine.gfx;
const RenderFlow = require('../renderer/render-flow');
const aabb = require('../3d/geom-utils/aabb');
const Material = require('../assets/CCMaterial');

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

        mesh: {
            get () {
                return this._mesh;
            },
            set (v) {
                if (this._mesh === v) return;
                this._mesh = v;
                this._activateMaterial(true);
                this.markForUpdateRenderData(true);
                this.node._renderFlag |= RenderFlow.FLAG_TRANSFORM;
            },
            type: Mesh
        },

        textures: {
            default: [],
            type: cc.Texture2D
        }
    },

    ctor () {
        this._renderDatas = [];
        this._materials = [];
        this._boundingBox = null;
    },

    onEnable () {
        this._super();
        this._activateMaterial();
    },

    _activateSubMaterial (material, subMesh) {
        material.define('useTexture', true);
        material.define('useModel', true);

        material.setProperty('color', this.node.color);
        if (subMesh._vertexBuffer._format._attr2el[gfx.ATTR_COLOR]) {
            material.define('useAttributeColor', true);
        }
    },

    _updateColor () {
        let materials = this._materials;
        for (let i = 0; i < materials.length; i++) {
            let material = materials[i];
            material.setProperty('color', this.node.color);
            material.updateHash();
        }
        
        this.node._renderFlag &= ~RenderFlow.FLAG_COLOR;
    },

    _reset () {
        this._materials.length = 0;
    },

    _activateMaterial (force) {
        let mesh = this._mesh;
        // TODO: should init mesh when mesh loaded, need asset load event support
        if (mesh) {
            mesh._initResource();
        }

        if (!mesh || mesh.subMeshes.length === 0) {
            this.disableRender();
            return;
        }

        if (aabb) {
            this._boundingBox = aabb.fromPoints(aabb.create(), mesh._minPos, mesh._maxPos);
        }
        
        this._reset();

        let subMeshes = mesh._subMeshes;
        let materials = this.sharedMaterials;

        if (!materials[0]) {
            let builtinMaterial = cc.Asset.getBuiltin('builtin-material-mesh');
            materials[0] = Material.getInstantiatedMaterial(builtinMaterial, this);
        }

        for (let i = 0; i < materials.length; i++) {
            let subMesh = subMeshes[i];
            if (!subMesh) continue;
            let material = materials[i];
            this._activateSubMaterial(material, subMesh);
        }
        
        this.markForUpdateRenderData(true);
        this.markForRender(true);
    }
});

cc.MeshRenderer = module.exports = MeshRenderer;
