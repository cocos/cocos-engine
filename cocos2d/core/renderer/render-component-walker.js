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

const RenderComponent = require('../components/CCRenderComponent');
const renderer = require('./index');
const renderEngine = require('./render-engine');
const SharedArrayBuffer = require('./shared-array-buffer');
const gfx = renderEngine.gfx;
const RecyclePool = renderEngine.RecyclePool;
const InputAssembler = renderEngine.InputAssembler;

const PER_INDEX_BYTE = 2;
// 500 Quad + 750 Index
const MIN_SHARED_BUFFER_SIZE = 54000;
// 2000 Quad + 3000 Index
const MAX_SHARED_BUFFER_SIZE = 216000;
var _buffers = [];
var _newBuffer = {
    buffer: null,
    offset: -1
};
var _queue = [];

function _createNewBuffer (bytes) {
  // Allocate buffer
  let buffer = null, offset = -1;
  for (let i = 0, l = _buffers.length; i < l; i++) {
        buffer = _buffers[i];
        offset = buffer.request(bytes);
        if (offset !== -1) {
            break;
        }
  }
  if (offset === -1) {
    let bufferSize = 0;
        if (bytes > MAX_SHARED_BUFFER_SIZE) {
            bufferSize = bytes;
        }
    else {
      bufferSize = Math.max(bytes * 2, MIN_SHARED_BUFFER_SIZE);
    }
    buffer = new SharedArrayBuffer(bufferSize);
    _buffers.push(buffer);
    offset = buffer.request(bytes);
  }
  _newBuffer.buffer = buffer.data;
  _newBuffer.offset = offset;
  return _newBuffer;
}

var RenderComponentWalker = function (device, renderScene) {
    this._renderScene = renderScene;
    this._device = device;
    
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
        for (let i = 0; i < _buffers.length; i++) {
            _buffers[i].reset();
        }
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
        let comp = node.getComponent(RenderComponent);
        if (comp) {
            _queue.push(comp);
        }
    },

    _postHandleRender (node) {

    },

    _genModel (vertexCount, vertexFormat, indexCount, comps, start, end) {
        let vertexBytes = vertexCount * vertexFormat._bytes;
        let buf = _createNewBuffer(vertexBytes);
        let vbuf = new Float32Array(buf.buffer, buf.offset, vertexBytes / 4);
        buf = _createNewBuffer(indexCount * PER_INDEX_BYTE);
        let ibuf = new Uint16Array(buf.buffer, buf.offset, indexCount);
        let model = this._batch(comps, start, end, vbuf, ibuf);
        this._renderScene.addModel(model);
    },

    _batch (comps, start, end, vbuf, ibuf) {
        let uintbuf = new Uint32Array(vbuf.buffer, vbuf.byteOffset, vbuf.length);
        let vertexFormat = comps[start]._vertexFormat;
        let effect = comps[start].getEffect();
    
        let numIndices = 0;
        let numVertices = 0;
        let comp, assembler, data, vertexId;
        for (let i = start; i < end; i++) {
            comp = comps[i];
            assembler = comp.constructor._assembler;
            data = comp._renderData;
            vertexId = numVertices;
            assembler.fillVertexBuffer(comp, vertexId, vbuf, uintbuf);
            assembler.fillIndexBuffer(comp, numIndices, vertexId, ibuf);
            numVertices += data.vertexCount;
            numIndices += data.indexCount;
        }
        
        let count = end - start;
    
        let device = this._device;
        let vb = this._vbPool.add();
        device._stats.vb -= vb._bytes;
        vb._format = vertexFormat;
        vb._numVertices = numVertices;
        vb._bytes = vertexFormat._bytes * numVertices;
        vb.update(0, vbuf);
        device._stats.vb += vb._bytes;
    
        let ib = this._ibPool.add();
        device._stats.ib -= ib._bytes;
        ib._numIndices = numIndices;
        ib._bytes = 2 * numIndices;
        ib.update(0, ibuf);
        device._stats.ib += ib._bytes;
    
        let ia = this._iaPool.add();
        ia._vertexBuffer = vb;
        ia._indexBuffer = ib;
        ia._start = 0;
        ia._count = numIndices;
        
        let model = this._modelPool.add();
        this._batchedModels.push(model);
        model.sortKey = this._sortKey++;
        model._viewID = -1;
        model.setNode(this._dummyNode);
        model.addEffect(effect);
        model.addInputAssembler(ia);
        
        return model;
    },

    visit (scene) {
        this.reset();

        // Store all render components to _queue
        scene.walk(this._handleRender);

        let comp, effect, assembler, data;
        let currEffect = null;
        let vertexFormat = null;
        let vertexCount = 0;
        let indexCount = 0;
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

            if (currEffect != effect) {
                vertexFormat = comp._vertexFormat;
                // breaking batch
                if (vertexCount > 0 && indexCount > 0) {
                    this._genModel(vertexCount, vertexFormat, indexCount, _queue, start, i);
                }
                start = i;
                currEffect = effect;
            }
    
            vertexCount += data.vertexCount;
            indexCount += data.indexCount;
        }

        // last batch
        if (vertexCount > 0 && indexCount > 0) {
            vertexFormat = _queue[start]._vertexFormat;
            this._genModel(vertexCount, vertexFormat, indexCount, _queue, start, _queue.length);
        }
    }
}

module.exports = RenderComponentWalker;