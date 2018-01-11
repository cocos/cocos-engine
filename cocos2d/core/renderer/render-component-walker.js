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

const macro = require('../platform/CCMacro');
const renderEngine = require('./render-engine');
const defaultVertexFormat = require('./vertex-format');
const StencilManager = require('./stencil-manager');
const gfx = renderEngine.gfx;
const RecyclePool = renderEngine.RecyclePool;
const InputAssembler = renderEngine.InputAssembler;

const FLOATS_PER_VERT = defaultVertexFormat._bytes / 4;
const PER_INDEX_BYTE = 2;
const MAX_VERTEX = macro.BATCH_VERTEX_COUNT;
const MAX_INDICE = MAX_VERTEX * 2;

var _queue = null;
var _batchData = {
    vfmt: null,
    effect: null,
    vertexOffset: 0,
    indiceOffset: 0,
    comp: null,
    data: null,
    MAX_VERTEX: MAX_VERTEX,
    MAX_INDICE: MAX_INDICE
};

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    this._stencilMgr = StencilManager.sharedManager;

    // Buffers
    let verts = new Float32Array(MAX_VERTEX * FLOATS_PER_VERT);
    this._bufs = [{
        verts: verts,
        uintVerts: new Uint32Array(verts.buffer),
        indices: new Uint16Array(MAX_INDICE)
    }];
    this._nextBuf = 0;
    this._switchBuffer();
    
    let defaultFormat = new gfx.VertexFormat([]);
    this._vbPool = new RecyclePool(function () {
        let vb = new gfx.VertexBuffer(
            device,
            defaultFormat,
            gfx.USAGE_DYNAMIC,
            null,
            0
        );
        vb._data = null;
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
        ib._data = null;
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
    this._node = this._dummyNode;
    this._sortKey = 0;
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
        this._node = this._dummyNode;
        this._sortKey = 0;

        // Reset buffer
        this._nextBuf = 0;
        this._switchBuffer();
    },

    _handleRender (node) {
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
    },

    _flush (vertexFormat, effect, vertexCount, indiceCount) {
        let vertexByte = vertexCount * vertexFormat._bytes,
            byteOffset = 0,
            vertexsData = null,
            indicesData = null;
            
        // Prepare data view for vb ib
        if (vertexCount > 0 && indiceCount > 0) {
            byteOffset = this._vOffset * vertexFormat._bytes;
            vertexsData = new Float32Array(this._verts.buffer, byteOffset, vertexByte / 4);
            byteOffset = 2 * this._iOffset;
            indicesData = new Uint16Array(this._indices.buffer, byteOffset, indiceCount);
        }

        // Generate vb, ib, ia
        let device = this._device;
        let vb = this._vbPool.add();
        device._stats.vb -= vb._bytes;
        vb._format = vertexFormat;
        vb._numVertices = vertexCount;
        vb._bytes = vertexByte;
        vb._data = vertexsData;
        device._stats.vb += vb._bytes;
    
        let ib = this._ibPool.add();
        device._stats.ib -= ib._bytes;
        ib._numIndices = indiceCount;
        ib._bytes = 2 * indiceCount;
        ib._data = indicesData;
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
        model._viewID = -1;
        model.setNode(this._node);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
    },
    
    _switchBuffer () {
        if (this._nextBuf === this._bufs.length) {
            let verts = new Float32Array(MAX_VERTEX * FLOATS_PER_VERT);
            this._bufs.push({
                verts: verts,
                uintVerts: new Uint32Array(verts.buffer),
                indices: new Uint16Array(MAX_INDICE)
            });
        }
        let buf = this._bufs[this._nextBuf];
        this._verts = buf.verts;
        this._uintVerts = buf.uintVerts;
        this._indices = buf.indices;
        this._vOffset = 0;
        this._iOffset = 0;
        this._nextBuf++;
    },

    _checkBatchBroken (batchData, needNewBuf) {
        let vertexCount = batchData.vertexOffset - this._vOffset,
            indiceCount = batchData.indiceOffset - this._iOffset;
        if (batchData.vfmt && batchData.effect && vertexCount > 0 && indiceCount > 0) {
            this._flush(batchData.vfmt, batchData.effect, vertexCount, indiceCount);
            if (needNewBuf) {
                this._switchBuffer();
                batchData.vertexOffset = 0;
                batchData.indiceOffset = 0;
            }
            else {
                // update buffer
                this._vOffset = batchData.vertexOffset;
                this._iOffset = batchData.indiceOffset;
            }
        }
    },

    batchQueue () {
        // reset caches for handle render components
        _batchData.vfmt = null;
        _batchData.effect = null;
        _batchData.vertexOffset = this._vOffset;
        _batchData.indiceOffset = this._iOffset;
        let vertexId = 0,
            needNewBuf = false,
            comp = this._queue[0],
            effect = null, 
            assembler = null, 
            datas = null,
            data = null,
            j = 0;

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
            _batchData.comp = comp;
            datas = assembler.updateRenderData(comp, _batchData);

            for (id = 0; id < datas.length; id ++) {
                data = datas[id];
                _batchData.data = data;
                effect = data.effect;
                // breaking batch
                needNewBuf = (_batchData.vertexOffset + data.vertexCount > MAX_VERTEX) || (_batchData.indiceOffset + data.indiceCount > MAX_INDICE);
                if (_batchData.vfmt && _batchData.effect != effect || needNewBuf) {
                    this._checkBatchBroken(_batchData, needNewBuf);
                    this._node = this._dummyNode;
                    _batchData.effect = effect;
                }
                // Init effect
                else if (!_batchData.effect) {
                    _batchData.effect = effect;
                }

                // Set model
                if (assembler.useModel) {
                    this._node = comp.node;
                }

                let vertexId = _batchData.vertexOffset - this._vOffset;
                assembler.fillBuffers(_batchData, vertexId, this._verts, this._uintVerts, this._indices);

                _batchData.vertexOffset += data.vertexCount;
                _batchData.indiceOffset += data.indiceCount;
            }
            _batchData.vfmt = comp._vertexFormat;
        }

        // last batch
        this._checkBatchBroken(_batchData, false);
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