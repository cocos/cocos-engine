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

const macro = require('../platform/CCMacro');
const renderEngine = require('./render-engine');
const defaultVertexFormat = require('./vertex-format');
const StencilManager = require('./stencil-manager');
const hierarchyChain = require('./utils/hierarchy-chain');
const gfx = renderEngine.gfx;
const RecyclePool = renderEngine.RecyclePool;
const InputAssembler = renderEngine.InputAssembler;
const IARenderData = renderEngine.IARenderData;
const bits = renderEngine.math.bits;

const FLOATS_PER_VERT = defaultVertexFormat._bytes / 4;
const BYTE_PER_INDEX = 2;
const MAX_VERTEX = macro.BATCH_VERTEX_COUNT;
const MAX_VERTEX_BYTES = MAX_VERTEX * defaultVertexFormat._bytes;
const MAX_INDICE = MAX_VERTEX * BYTE_PER_INDEX;
const MAX_INDICE_BYTES = MAX_INDICE * 2;

var _batchData = {
    node: null,
    worldMatUpdated: false,
    vfmt: null,
    material: null,
    data: null,
    vertexOffset: 0,
    byteStart: 0,
    byteOffset: 0,
    indiceStart: 0,
    indiceOffset: 0,
    cullingMask: 1,
    MAX_VERTEX: MAX_VERTEX,
    MAX_INDICE: MAX_INDICE
};

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    this._stencilMgr = StencilManager.sharedManager;

    
    let defaultFormat = new gfx.VertexFormat([]);
    this._iaPool = new RecyclePool(function () {
        return new InputAssembler();
    }, 16);

    this._modelPool = new RecyclePool(() => {
        return new renderEngine.Model();
    }, 16);


    // buffers
    this._vb = null;
    this._ib = null;
    this._buffersToDestroy = [];

    this._maxVertexCount = MAX_VERTEX;
    this._maxIndiceCount = MAX_INDICE;
    this._reallocBuffer(this._maxVertexCount, this._maxIndiceCount);

    this._batchedModels = [];
    this._dummyNode = new cc.Node();
    this._sortKey = 0;

    this._curCameraNode = null;
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
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

        // reset caches for handle render components
        _batchData.node = null;
        _batchData.worldMatUpdated = false;
        _batchData.vfmt = null;
        _batchData.material = null;
        _batchData.data = null;
        _batchData.vertexOffset = 0;
        _batchData.byteStart = 0;
        _batchData.byteOffset = 0;
        _batchData.indiceStart = 0;
        _batchData.indiceOffset = 0;
        _batchData.cullingMask = 1;

        // reset stencil manager's cache
        this._stencilMgr.reset();
    },

    _uploadData () {
        // update vertext data
        let vertexsData = new Float32Array(this._vData.buffer, 0, _batchData.byteOffset / 4);
        let indicesData = new Uint16Array(this._iData.buffer, 0, _batchData.indiceOffset);

        let gl = this._device._gl;
        let vb = this._vb;
        vb.update(0, vertexsData);

        let ib = this._ib;
        ib.update(0, indicesData);
    },

    _reallocBuffer (vertexCount, indiceCount) {
        _batchData.vertexOffset = 0;
        _batchData.byteStart = 0;
        _batchData.byteOffset = 0;
        _batchData.indiceStart = 0;
        _batchData.indiceOffset = 0;

        if (this._vb) {
            this._buffersToDestroy.push(this._vb);
        }
        if (this._ib) {
            this._buffersToDestroy.push(this._ib);
        }

        this._vData = new Float32Array(vertexCount * FLOATS_PER_VERT);
        this._uintVData = new Uint32Array(this._vData.buffer);
        this._iData = new Uint16Array(indiceCount);

        this._vb = new gfx.VertexBuffer(
            this._device,
            defaultVertexFormat,
            gfx.USAGE_DYNAMIC,
            this._vData.buffer,
            vertexCount
        );

        this._ib = new gfx.IndexBuffer(
            this._device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            this._iData.buffer,
            indiceCount
        );
    },

    _flush () {
        let material = _batchData.material,
            indiceStart = _batchData.indiceStart,
            indiceOffset = _batchData.indiceOffset,
            indiceCount = indiceOffset - indiceStart;
        if (!material || indiceCount <= 0) {
            return;
        }

        let effect = material.effect;

        // Generate ia
        let ia = this._iaPool.add();
        ia._vertexBuffer = this._vb;
        ia._indexBuffer = this._ib;
        ia._start = indiceStart;
        ia._count = indiceCount;

        // Check stencil state and modify pass
        this._stencilMgr.handleEffect(effect);
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._cullingMask = CC_EDITOR ? 1 : _batchData.cullingMask;
        model.setNode(_batchData.node);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
           
        _batchData.byteStart = _batchData.byteOffset;
        _batchData.indiceStart = _batchData.indiceOffset;
    },

    _flushIA () {
        let material = _batchData.material,
            cullingMask = _batchData.cullingMask,
            iaRenderData = _batchData.data;

        if (!iaRenderData.ia) {
            return;
        }

        // Check stencil state and modify pass
        let effect = this._stencilMgr.handleEffect(material.effect);
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._cullingMask = CC_EDITOR ? 1 : cullingMask;
        model.setNode(_batchData.node);
        model.addEffect(effect);
        model.addInputAssembler(iaRenderData.ia);
        
        this._renderScene.addModel(model);
    },

    renderComp (comp, assembler) {
        if (!assembler) {
            return;
        }
        
        let material = null, 
            datas = null,
            data = null,
            cullingMask = 1,
            broken = false,
            iaData = false;

        // Update render data
        datas = assembler.updateRenderData(comp, _batchData);

        cullingMask = comp.node._cullingMask;

        for (let id = 0; id < datas.length; id ++) {
            data = datas[id];
            material = data.material;
            // Nothing can be rendered without material
            if (!material) {
                continue;
            }

            // need to realloc buffers
            if ((_batchData.vertexOffset + data.vertexCount) > this._maxVertexCount ||
                (_batchData.indiceOffset + data.indiceCount) > this._maxIndiceCount) {
                this._uploadData();

                this._maxVertexCount *= 2;
                this._maxIndiceCount *= 2;
                this._reallocBuffer(this._maxVertexCount, this._maxIndiceCount);
            }

            // Check ia data, each ia data should be packed into a separated model
            iaData = data.type === IARenderData.type;

            // breaking batch
            broken = iaData || 
                        !_batchData.material || _batchData.material._hash != material._hash || 
                        _batchData.cullingMask !== cullingMask;
            if (broken) {
                this._flush(_batchData);

                _batchData.node = assembler.useModel ? comp.node : this._dummyNode;
                _batchData.material = material;
                _batchData.vfmt = comp._vertexFormat;
                _batchData.cullingMask = cullingMask;
            }

            _batchData.data = data;
            if (iaData) {
                this._flushIA();
            }
            else {
                assembler.fillBuffers(comp, _batchData, _batchData.vertexOffset, this._vData, this._uintVData, this._iData);
                _batchData.byteOffset += data.vertexCount * comp._vertexFormat._bytes;
                _batchData.indiceOffset += data.indiceCount;
                _batchData.vertexOffset += data.vertexCount;
            }
        }
    },

    _transform (node) {
        if (node._worldMatDirty) {
            node._updateWorldMatrix();
            _batchData.worldMatUpdated = true;
        }
    },

    visit (scene) {
        this.reset();

        if (this._buffersToDestroy.length !== 0) {
            for (let i = 0, l = this._buffersToDestroy.length; i < l; i++) {
                this._buffersToDestroy[i].destroy();
            }
            this._buffersToDestroy.length = 0;
        }

        let entry = hierarchyChain.entry(scene);
        for (; entry; entry = entry.next) {
            let comp = entry.comp;
            let node = comp.node;
            if (!comp._enabled || !node._activeInHierarchy) {
                continue;
            }
            let assembler = null;

            // Pre handle
            if (!entry.post) {
                if (node.groupIndex !== 0) {
                    this._curCameraNode = node;
                }

                let group = this._curCameraNode ? this._curCameraNode.groupIndex : node.groupIndex;
                node._cullingMask = 1 << group;
                assembler = comp.constructor._assembler;
            }
            // Post handle
            else {
                if (this._curCameraNode === node) {
                    this._curCameraNode = null;
                }
                assembler = comp.constructor._postAssembler;
            }
            this._transform(node);
            this.renderComp(comp, assembler);
            _batchData.worldMatUpdated = false;
        }
        
        this._flush();
        this._uploadData();
    }
}

module.exports = RenderComponentWalker;