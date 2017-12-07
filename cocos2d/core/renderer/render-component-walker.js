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

const renderer = require('./index');
const renderEngine = require('./render-engine');
const defaultVertexFormat = require('./vertex-format');
const macro = require('../platform/CCMacro');
const gfx = renderEngine.gfx;
const RecyclePool = renderEngine.RecyclePool;
const InputAssembler = renderEngine.InputAssembler;

const FLOATS_PER_VERT = defaultVertexFormat._bytes / 4;
const PER_INDEX_BYTE = 2;
const MAX_VERTEX = macro.BATCH_VERTEX_COUNT;
const MAX_INDICE = MAX_VERTEX * 2;

var _queue = null;

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;

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
    this._compList = [];
    this._batchedModels = [];
    this._dummyNode = new cc.Node();
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

    },

    _flush (vertexFormat, effect, vertexCount, indiceCount) {
        let verts = this._verts,
            indices = this._indices,
            batchedComps = this._compList,
            comp = null,
            assembler = null,
            vertexId = 0,
            indiceId = 0;

        let vertexByte = vertexCount * vertexFormat._bytes;
        let byteOffset = this._vOffset * vertexFormat._bytes;
        let vertexsFloat = new Float32Array(verts.buffer, byteOffset, vertexByte / 4);
        let vertexsUint = new Uint32Array(verts.buffer, byteOffset, vertexByte / 4);
        byteOffset = 2 * this._iOffset;
        let indicesData = new Uint16Array(indices.buffer, byteOffset, indiceCount);

        for (let i = 0; i < batchedComps.length; i++) {
            comp = batchedComps[i];
            assembler = comp.constructor._assembler;

            indiceId += assembler.fillIndexBuffer(comp, indiceId, vertexId, indicesData);
            vertexId += assembler.fillVertexBuffer(comp, vertexId, vertexsFloat, vertexsUint);
        }

        // Generate vb, ib, ia
        let device = this._device;
        let vb = this._vbPool.add();
        device._stats.vb -= vb._bytes;
        vb._format = vertexFormat;
        vb._numVertices = vertexCount;
        vb._bytes = vertexByte;
        vb._data = vertexsFloat;
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
        
        // Generate model
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._viewID = -1;
        model.setNode(this._dummyNode);
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

    _checkBatchBroken (vertexFormat, currEffect, vertexOffset, indiceOffset, needNewBuf) {
        let vertexCount = vertexOffset - this._vOffset,
            indiceCount = indiceOffset - this._iOffset;
        if (vertexFormat && currEffect && vertexCount > 0 && indiceCount > 0) {
            this._flush(vertexFormat, currEffect, vertexCount, indiceCount);
            if (needNewBuf) {
                this._switchBuffer();
            }
            else {
                // update buffer
                this._vOffset = vertexOffset;
                this._iOffset = indiceOffset;
            }
            return true;
        }
        else {
            return false;
        }
    },

    batchQueue () {
        // reset caches for handle render components
        let currEffect = null,
            vertexFormat = null,
            vertexOffset = this._vOffset,
            indiceOffset = this._iOffset,
            vertexId = 0,
            batchedComps = this._compList,
            needNewBuf = false,
            broken = false;
            comp = null, 
            effect = null, 
            assembler = null, 
            data = null;

        for (let i = 0, len = this._queue.length; i < len; i++) {
            comp = this._queue[i];
            effect = comp.getEffect();
            assembler = comp.constructor._assembler;
            if (!assembler || !effect) {
                continue;
            }
            
            // Update render data
            assembler.updateRenderData(comp);
            data = comp._renderData;

            // breaking batch
            needNewBuf = (vertexOffset + data.vertexCount > MAX_VERTEX) || (indiceOffset + data.indiceCount > MAX_INDICE);
            if (currEffect != effect || needNewBuf) {
                vertexFormat = comp._vertexFormat;
                broken = this._checkBatchBroken(vertexFormat, currEffect, vertexOffset, indiceOffset, needNewBuf);
                if (broken) {
                    vertexOffset = this._vOffset;
                    indiceOffset = this._iOffset;
                }
                currEffect = effect;
                batchedComps.length = 0;
            }

            batchedComps.push(comp);
    
            vertexOffset += data.vertexCount;
            indiceOffset += data.indiceCount;
        }

        // last batch
        this._checkBatchBroken(comp && comp._vertexFormat, currEffect, vertexOffset, indiceOffset, false);
        this._compList.length = 0;
        this._queue.length = 0;
    },

    visit (scene) {
        this.reset();
        
        // Store all render components to _queue
        _queue = this._queue;
        scene.walk(this._handleRender);

        this.batchQueue();
    }
}

module.exports = RenderComponentWalker;