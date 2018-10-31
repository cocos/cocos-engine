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

const renderEngine = require('../render-engine');
const defaultVertexFormat = require('./vertex-format').vfmtPosUvColor;
const StencilManager = require('./stencil-manager');
const QuadBuffer = require('./quad-buffer');
const MeshBuffer = require('./mesh-buffer');

let idGenerater = new (require('../../platform/id-generater'))('VertextFormat');

const RecyclePool = renderEngine.RecyclePool;
const InputAssembler = renderEngine.InputAssembler;

let _buffers = {};

const empty_material = new renderEngine.Material();
empty_material.updateHash();

var ModelBatcher = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    this._stencilMgr = StencilManager.sharedManager;

    this.walking = false;
    this.material = empty_material;
    this.cullingMask = 1;

    this._iaPool = new RecyclePool(function () {
        return new InputAssembler();
    }, 16);

    this._modelPool = new RecyclePool(function () {
        return new renderEngine.Model();
    }, 16);

    // buffers
    this._quadBuffer = this.getBuffer('quad', defaultVertexFormat);
    this._meshBuffer = this.getBuffer('mesh', defaultVertexFormat);
    this._buffer = this._quadBuffer;

    this._batchedModels = [];
    this._dummyNode = new cc.Node();
    this._sortKey = 0;

    this.node = this._dummyNode;
    
    this.parentOpacity = 1;
    this.parentOpacityDirty = 0;
    this.worldMatDirty = 0;
};

ModelBatcher.prototype = {
    constructor: ModelBatcher,
    
    reset() {
        // Reset pools
        this._iaPool.reset();

        // Reset scene
        let scene = this._renderScene;
        let models = this._batchedModels;
        for (let i = 0; i < models.length; ++i) {
            // remove from scene
            models[i].clearInputAssemblers();
            models[i].clearEffects();
            scene.removeModel(models[i]);
        }
        this._modelPool.reset();
        models.length = 0;
        this._sortKey = 0;

        for (let key in _buffers) {
            _buffers[key].reset();
        }
        this._buffer = this._quadBuffer;

        // reset caches for handle render components
        this.node = this._dummyNode;
        this.material = empty_material;
        this.cullingMask = 1;

        this.parentOpacity = 1;
        this.parentOpacityDirty = 0;
        this.worldMatDirty = 0;

        // reset stencil manager's cache
        this._stencilMgr.reset();
    },

    _flush () {
        let material = this.material,
            buffer = this._buffer,
            indiceStart = buffer.indiceStart,
            indiceOffset = buffer.indiceOffset,
            indiceCount = indiceOffset - indiceStart;
        if (!this.walking || !material || indiceCount <= 0) {
            return;
        }

        let effect = material.effect;

        // Generate ia
        let ia = this._iaPool.add();
        ia._vertexBuffer = buffer._vb;
        ia._indexBuffer = buffer._ib;
        ia._start = indiceStart;
        ia._count = indiceCount;

        // Check stencil state and modify pass
        this._stencilMgr.handleEffect(effect);
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._cullingMask = this.cullingMask;
        model.setNode(this.node);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
           
        buffer.byteStart = buffer.byteOffset;
        buffer.indiceStart = buffer.indiceOffset;
        buffer.vertexStart = buffer.vertexOffset;
    },

    _flushIA (iaRenderData) {
        let material = iaRenderData.material;
        
        if (!iaRenderData.ia || !material) {
            return;
        }

        this.material = material;

        // Check stencil state and modify pass
        let effect = this._stencilMgr.handleEffect(material.effect);
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._cullingMask = this.cullingMask;
        model.setNode(this.node);
        model.addEffect(effect);
        model.addInputAssembler(iaRenderData.ia);
        
        this._renderScene.addModel(model);
    },

    _commitComp (comp, assembler, cullingMask) {
        if (this.material._hash != comp._material._hash || 
            this.cullingMask !== cullingMask) {
            this._flush();
    
            this.node = assembler.useModel ? comp.node : this._dummyNode;
            this.material = comp._material;
            this.cullingMask = cullingMask;
        }
    
        assembler.fillBuffers(comp, this);
    },

    _commitIA (comp, assembler, cullingMask) {
        this._flush();
        this.cullingMask = cullingMask;
        this.material = comp._material;
        this.node = assembler.useModel ? comp.node : this._dummyNode;

        assembler.renderIA(comp, this);
    },

    terminate () {
        if (cc.dynamicAtlasManager && cc.dynamicAtlasManager.enabled) {
            cc.dynamicAtlasManager.update();
        }

        // flush current rest Model
        this._flush();

        for (let key in _buffers) {
            _buffers[key].uploadData();
        }
    },

    getBuffer (type, vertextFormat) {
        if (!vertextFormat.name) {
            vertextFormat.name = idGenerater.getNewId();
        }

        let key = type + vertextFormat.name;
        let buffer = _buffers[key];
        if (!buffer) {
            if (type === 'mesh') {
                buffer = new MeshBuffer(this, vertextFormat);
            }
            else if (type === 'quad') {
                buffer = new QuadBuffer(this, vertextFormat);
            }
            else {
                cc.error(`Not support buffer type [${type}]`);
                return null;
            }

            _buffers[key] = buffer;
        }

        return buffer;
    }
}

module.exports = ModelBatcher;