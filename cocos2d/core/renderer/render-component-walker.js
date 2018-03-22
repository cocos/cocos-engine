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

var _queue = null;
var _batchData = {
    node: null,
    vfmt: null,
    material: null,
    data: null,
    vertexOffset: 0,
    byteOffset: 0,
    indiceOffset: 0,
    cullingMask: 1,
    MAX_VERTEX: MAX_VERTEX,
    MAX_INDICE: MAX_INDICE
};

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    this._stencilMgr = StencilManager.sharedManager;

    // Buffers
    this._vData = new Float32Array(MAX_VERTEX * FLOATS_PER_VERT);
    this._uintVData = new Uint32Array(this._vData.buffer);
    this._iData = new Uint16Array(MAX_INDICE);
    
    let defaultFormat = new gfx.VertexFormat([]);
    this._vbPool = new RecyclePool(function () {
        let vb = new gfx.VertexBuffer(
            device,
            defaultFormat,
            gfx.USAGE_DYNAMIC,
            null,
            0
        );
        return vb;
    }, 16);
    this._ibPool = new RecyclePool(function () {
        var ib = new gfx.IndexBuffer(
            device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            null,
            0
        );
        return ib;
    }, 16);
    this._iaPool = new RecyclePool(function () {
        return new InputAssembler();
    }, 16);

    this._modelPool = new RecyclePool(() => {
        return new renderEngine.Model();
    }, 16);
    
    this._queue = [];
    this._batchedModels = [];
    this._dummyNode = new cc.Node();
    this._sortKey = 0;

    this._curCameraNode = null;

    this._handleRender = this._handleRender.bind(this);
    this._postHandleRender = this._postHandleRender.bind(this);
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
    reset() {
        // Reset pools
        this._iaPool.reset();
        this._vbPool.reset();
        this._ibPool.reset();

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
        _batchData.vfmt = null;
        _batchData.material = null;
        _batchData.data = null;
        _batchData.vertexOffset = 0;
        _batchData.byteOffset = 0;
        _batchData.indiceOffset = 0;
        _batchData.cullingMask = 1;

        // reset stencil manager's cache
        this._stencilMgr.reset();
    },

    _handleRender (node) {
        if (node.groupIndex !== 0) {
            this._curCameraNode = node;
        }

        let group = this._curCameraNode ? this._curCameraNode.groupIndex : node.groupIndex;
        node._cullingMask = 1 << group;

        let comp = node._renderComponent;
        if (comp) {
            _queue.push(comp);
        }
    },

    _postHandleRender (node) {
        let comp = node._renderComponent;
        if (comp && comp.constructor._postAssembler) {
            _queue.push(comp);
        }

        if (this._curCameraNode === node) {
            this._curCameraNode = null;
        }
    },

    _flush (batchData) {
        let vfmt = batchData.vfmt,
            material = batchData.material,
            vertexByte = batchData.byteOffset,
            cullingMask = batchData.cullingMask,
            vertexCount = batchData.vertexOffset,
            indiceCount = batchData.indiceOffset,
            vDataSize = Math.min(bits.nextPow2(vertexByte), MAX_VERTEX_BYTES),
            vertexsData = null,
            indicesData = null;

        // Prepare data view for vb ib
        if (material && vertexCount > 0 && indiceCount > 0) {
            vertexsData = new Float32Array(this._vData.buffer, 0, vDataSize / 4);
            indicesData = new Uint16Array(this._iData.buffer, 0, indiceCount);
        }
        else {
            return;
        }

        let effect = material.effect;

        // Generate vb, ib, ia
        let device = this._device;
        let vb = this._vbPool.add();
        device._stats.vb -= vb._bytes;
        vb._format = vfmt;
        vb._numVertices = vertexCount;
        vb._bytes = vDataSize;
        vb.update(0, vertexsData);
        device._stats.vb += vb._bytes;
    
        let ib = this._ibPool.add();
        device._stats.ib -= ib._bytes;
        ib._numIndices = indiceCount;
        ib._bytes = BYTE_PER_INDEX * indiceCount;
        ib.update(0, indicesData);
        device._stats.ib += ib._bytes;
    
        let ia = this._iaPool.add();
        ia._vertexBuffer = vb;
        ia._indexBuffer = ib;
        ia._start = 0;
        ia._count = indiceCount;

        // Check stencil state and modify pass
        this._stencilMgr.handleEffect(effect);
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._cullingMask = CC_EDITOR ? 1 : cullingMask;
        model.setNode(batchData.node);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
    },

    _flushIA (batchData) {
        let material = batchData.material,
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

    batchQueue () {
        let vertexId = 0,
            comp = this._queue[0],
            material = null,
            assembler = null,
            datas = null,
            data = null,
            cullingMask = 1,
            broken = false,
            iaData = false;

        for (let i = 0, len = this._queue.length; i < len; i++) {
            comp = this._queue[i];
            if (comp._toPostHandle) {
                assembler = comp.constructor._postAssembler;
                comp._toPostHandle = false;
            }
            else {
                assembler = comp.constructor._assembler;
                if (comp.constructor._postAssembler) {
                    comp._toPostHandle = true;
                }
            }
            if (!assembler) {
                continue;
            }
            
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

                // Check ia data, each ia data should be packed into a separated model
                iaData = data.type === IARenderData.type;

                // breaking batch
                broken = iaData || 
                         !_batchData.material || _batchData.material._hash != material._hash || 
                         _batchData.cullingMask !== cullingMask ||
                         (_batchData.vertexOffset + data.vertexCount > MAX_VERTEX) || 
                         (_batchData.indiceOffset + data.indiceCount > MAX_INDICE);
                if (broken) {
                    this._flush(_batchData);
                    _batchData.node = assembler.useModel ? comp.node : this._dummyNode;
                    _batchData.material = material;
                    _batchData.vfmt = comp._vertexFormat;
                    _batchData.vertexOffset = 0;
                    _batchData.byteOffset = 0;
                    _batchData.indiceOffset = 0;
                    _batchData.cullingMask = cullingMask;
                }

                _batchData.data = data;
                if (iaData) {
                    this._flushIA(_batchData);
                }
                else {
                    assembler.fillBuffers(comp, _batchData, _batchData.vertexOffset, this._vData, this._uintVData, this._iData);
                    _batchData.vertexOffset += data.vertexCount;
                    _batchData.byteOffset += data.vertexCount * comp._vertexFormat._bytes;
                    _batchData.indiceOffset += data.indiceCount;
                }
            }
        }

        // last batch
        this._flush(_batchData);
        this._queue.length = 0;
    },

    visit (scene) {
        this.reset();
        
        // Store all render components to _queue
        _queue = this._queue;
        scene.walk(this._handleRender, this._postHandleRender);

        this.batchQueue();
    }
}

module.exports = RenderComponentWalker;