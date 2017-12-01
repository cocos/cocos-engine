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
var _queue = [];

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;

    // Buffers
    this._bufId = 0;
    this._sharedBufs = [];
    for (let i = 0; i < 2; i++) {
        let vertexs = new Float32Array(MAX_VERTEX * FLOATS_PER_VERT);
        this._sharedBufs.push({
            vertexs: vertexs,
            uintVertexs: new Uint32Array(vertexs.buffer),
            indices: new Uint16Array(MAX_INDICE)
        });
    }
    
    let defaultFormat = new gfx.VertexFormat([]);
    this._vbPool = new RecyclePool(function () {
        return new gfx.VertexBuffer(
            device,
            defaultFormat,
            gfx.USAGE_STATIC,
            null,
            0
        );
    }, 16);
    this._ibPool = new RecyclePool(function () {
        return new gfx.IndexBuffer(
            device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            null,
            0
        );
    }, 16);
    this._iaPool = new RecyclePool(function () {
        return new InputAssembler();
    }, 16);

    this._modelPool = new RecyclePool(() => {
        return new renderEngine.Model();
    }, 16);
    
    this._batchedModels = [];
    this._dummyNode = new cc.Node();
    this._sortKey = 0;
};

RenderComponentWalker.prototype = {
    constructor: RenderComponentWalker,
    
    reset() {
        this._iaPool.reset();
        this._vbPool.reset();
        this._ibPool.reset();
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
        _queue.length = 0;
        this._sortKey = 0;
    },

    _handleRender (node) {
        if (node instanceof cc.Scene) {
            return;
        }
        let comp = node.getComponent(cc.RenderComponent);
        if (comp) {
            _queue.push(comp);
        }
    },

    _postHandleRender (node) {

    },

    _flush (vertexFormat, effect, vertexCount, indiceCount) {
        let bufs = this._sharedBufs[this._bufId];

        let device = this._device;
        let vb = this._vbPool.add();
        device._stats.vb -= vb._bytes;
        vb._format = vertexFormat;
        vb._numVertices = vertexCount;
        vb._bytes = vertexFormat._bytes * vertexCount;
        let vertexsData = new Float32Array(bufs.vertexs.buffer, 0, vb._bytes / 4);
        vb.update(0, vertexsData);
        device._stats.vb += vb._bytes;
    
        let ib = this._ibPool.add();
        device._stats.ib -= ib._bytes;
        ib._numIndices = indiceCount;
        ib._bytes = 2 * indiceCount;
        let indicesData = new Uint16Array(bufs.indices.buffer, 0, indiceCount);
        ib.update(0, indicesData);
        device._stats.ib += ib._bytes;
    
        let ia = this._iaPool.add();
        ia._vertexBuffer = vb;
        ia._indexBuffer = ib;
        ia._start = 0;
        ia._count = indiceCount;
        
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._viewID = -1;
        model.setNode(this._dummyNode);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        this._renderScene.addModel(model);
    },

    visit (scene) {
        this.reset();

        // Store all render components to _queue
        scene.walk(this._handleRender);

        let bufs = this._sharedBufs[this._bufId];
        let verts = bufs.vertexs;
        let uintVerts = bufs.uintVertexs;
        let indices = bufs.indices;
        let comp, effect, assembler, data;
        let currEffect = null;
        let vertexFormat = null;
        let vertexCount = 0;
        let indiceCount = 0;
        let start = 0;

        for (let i = 0, len = _queue.length; i < len; i++) {
            comp = _queue[i];
            effect = comp.getEffect();
            assembler = comp.constructor._assembler;
            if (!assembler || !effect) {
                continue;
            }
            
            // Update render data
            assembler.updateRenderData(comp);
            data = comp._renderData;

            // breaking batch
            if (currEffect != effect || 
                vertexCount + data.vertexCount > MAX_VERTEX ||
                indiceCount + data.indiceCount > MAX_INDICE) 
            {
                vertexFormat = comp._vertexFormat;
                if (vertexCount > 0 && indiceCount > 0) {
                    this._flush(vertexFormat, effect, vertexCount, indiceCount);
                    // Switch to another buf
                    this._bufId++;
                    if (this._bufId >= this._sharedBufs.length) {
                        this._bufId = 0;
                    }
                    bufs = this._sharedBufs[this._bufId];
                    verts = bufs.vertexs;
                    uintVerts = bufs.uintVertexs;
                    indices = bufs.indices;

                    vertexCount = 0;
                    indiceCount = 0;
                }
                start = i;
                currEffect = effect;
            }

            assembler.fillVertexBuffer(comp, vertexCount, verts, uintVerts);
            assembler.fillIndexBuffer(comp, indiceCount, vertexCount, indices);
    
            vertexCount += data.vertexCount;
            indiceCount += data.indiceCount;
        }

        // last batch
        if (effect && vertexCount > 0 && indiceCount > 0) {
            vertexFormat = _queue[start]._vertexFormat;
            this._flush(vertexFormat, effect, vertexCount, indiceCount);
        }
        _queue.length = 0;
    }
}

module.exports = RenderComponentWalker;