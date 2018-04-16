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

const AUTO_PACK_ATLAS = true;

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    this._stencilMgr = StencilManager.sharedManager;

    this._batchData = {
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

        // Reset useless buffers
        if (this._buffersToDestroy.length !== 0) {
            for (let i = 0, l = this._buffersToDestroy.length; i < l; i++) {
                this._buffersToDestroy[i].destroy();
            }
            this._buffersToDestroy.length = 0;
        }

        // reset caches for handle render components
        let batchData = this._batchData;
        batchData.node = null;
        batchData.worldMatUpdated = false;
        batchData.vfmt = null;
        batchData.material = null;
        batchData.data = null;
        batchData.vertexOffset = 0;
        batchData.byteStart = 0;
        batchData.byteOffset = 0;
        batchData.indiceStart = 0;
        batchData.indiceOffset = 0;
        batchData.cullingMask = 1;

        // reset stencil manager's cache
        this._stencilMgr.reset();
    },

    _uploadData () {
        // update vertext data
        let vertexsData = new Float32Array(this._vData.buffer, 0, this._batchData.byteOffset / 4);
        let indicesData = new Uint16Array(this._iData.buffer, 0, this._batchData.indiceOffset);

        let gl = this._device._gl;
        let vb = this._vb;
        vb.update(0, vertexsData);

        let ib = this._ib;
        ib.update(0, indicesData);
    },

    _reallocBuffer (vertexCount, indiceCount) {
        let batchData = this._batchData;
        batchData.vertexOffset = 0;
        batchData.byteStart = 0;
        batchData.byteOffset = 0;
        batchData.indiceStart = 0;
        batchData.indiceOffset = 0;

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
        let batchData = this._batchData,
            material = batchData.material,
            indiceStart = batchData.indiceStart,
            indiceOffset = batchData.indiceOffset,
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
        model._cullingMask = CC_EDITOR ? 1 : batchData.cullingMask;
        model.setNode(batchData.node);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
           
        batchData.byteStart = batchData.byteOffset;
        batchData.indiceStart = batchData.indiceOffset;
    },

    _flushIA () {
        let batchData = this._batchData,
            material = batchData.material,
            cullingMask = batchData.cullingMask,
            iaRenderData = batchData.data;

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
        model.setNode(batchData.node);
        model.addEffect(effect);
        model.addInputAssembler(iaRenderData.ia);
        
        this._renderScene.addModel(model);
    },

    _commitComp (comp, assembler, cullingMask) {
        let batchData = this._batchData,
            material = null, 
            datas = null,
            data = null,
            broken = false,
            iaData = false;

        if (AUTO_PACK_ATLAS && assembler.checkPacker) {
            assembler.checkPacker(comp);
        }
        if (comp._activateMaterial) {
            comp._activateMaterial();
        }

        // Update render data
        datas = assembler.updateRenderData(comp, batchData);

        for (let id = 0; id < datas.length; id ++) {
            data = datas[id];
            material = data.material;
            // Nothing can be rendered without material
            if (!material) {
                continue;
            }

            // need to realloc buffers
            if ((batchData.vertexOffset + data.vertexCount) > this._maxVertexCount ||
                (batchData.indiceOffset + data.indiceCount) > this._maxIndiceCount) {
                this._uploadData();

                this._maxVertexCount *= 2;
                this._maxIndiceCount *= 2;
                this._reallocBuffer(this._maxVertexCount, this._maxIndiceCount);
            }

            // Check ia data, each ia data should be packed into a separated model
            iaData = data.type === IARenderData.type;

            // breaking batch
            broken = iaData || 
                        !batchData.material || batchData.material._hash != material._hash || 
                        batchData.cullingMask !== cullingMask;
            if (broken) {
                this._flush(batchData);

                batchData.node = assembler.useModel ? comp.node : this._dummyNode;
                batchData.material = material;
                batchData.vfmt = comp._vertexFormat;
                batchData.cullingMask = cullingMask;
            }

            batchData.data = data;
            if (iaData) {
                this._flushIA();
            }
            else {
                assembler.fillBuffers(comp, batchData, batchData.vertexOffset, this._vData, this._uintVData, this._iData);
                batchData.byteOffset += data.vertexCount * comp._vertexFormat._bytes;
                batchData.indiceOffset += data.indiceCount;
                batchData.vertexOffset += data.vertexCount;
            }
        }
    },

    _findEntry (node) {
        if (node._renderComponent) {
            return node._renderComponent._chain;
        }
    
        let children = node._children;
        let first;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            first = this._findEntry(child);
            if (first) {
                return first;
            }
        }
        return null;
    },

    visit (scene) {
        this.reset();

        let batchData = this._batchData;
        let entry = this._findEntry(scene);
        let comp, node, assembler, group, cullingMask;
        for (; entry; entry = entry.next) {
            comp = entry.comp;
            node = comp.node;
            if (!comp._enabled || !node._activeInHierarchy) {
                continue;
            }
            assembler = null;

            // Pre handle
            if (!entry.post) {
                if (node.groupIndex !== 0) {
                    this._curCameraNode = node;
                }

                group = this._curCameraNode ? this._curCameraNode.groupIndex : node.groupIndex;
                node._cullingMask = 1 << group;
                assembler = comp._assembler || comp.constructor._assembler;
            }
            // Post handle
            else {
                if (this._curCameraNode === node) {
                    this._curCameraNode = null;
                }
                assembler = comp.constructor._postAssembler;
            }

            // Transform
            if (node._worldMatDirty) {
                node._updateWorldMatrix();
                batchData.worldMatUpdated = true;
            }

            // Commit component render data
            cullingMask = node._cullingMask;
            this._commitComp(comp, assembler, cullingMask);
            this._batchData.worldMatUpdated = false;
        }
        
        this._flush();
        this._uploadData();
    }
}

module.exports = RenderComponentWalker;