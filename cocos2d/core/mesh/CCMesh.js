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

const renderer = require('../renderer');
const renderEngine = require('../renderer/render-engine');
const gfx = renderEngine.gfx;

function applyColor (data, offset, value) {
    data[offset] = value._val;
}

function applyVec2 (data, offset, value) {
    data[offset] = value.x;
    data[offset+1] = value.y;
}

function applyVec3 (data, offset, value) {
    data[offset] = value.x;
    data[offset+1] = value.y;
    data[offset+2] = value.z;
}


 /**
 * @module cc
 */
/**
 * !#en Mesh Asset.
 * !#zh 网格资源。
 * @class Mesh
 * @extends Asset
 */
var Mesh = cc.Class({
    name: 'cc.Mesh',
    extends: cc.Asset,

    properties: {
        _modelSetter: {
            set: function (model) {
                this._initWithModel(model);
            }
        },

        /**
         * !#en Get ir set the sub meshes.
         * !#zh 设置或者获取子网格。
         * @property {[renderEngine.InputAssembler]} subMeshes
         */
        subMeshes: {
            get () {
                return this._subMeshes;
            },
            set (v) {
                this._subMeshes = v;
            }
        }
    },

    ctor () {
        this._modelUuid = '';
        this._meshID = -1;
        this._model = null;

        this._subMeshes = [];

        this._ibs = [];
        this._vbs = [];
    },

    /**
     * !#en
     * Init vertex buffer according to the vertex format.
     * !#zh
     * 根据顶点格式初始化顶点内存。
     * @method init
     * @param {gfx.VertexFormat} vertexFormat - vertex format
     * @param {Number} vertexCount - how much vertex should be create in this buffer.
     * @param {Boolean} dynamic - whether or not to use dynamic buffer.
     */
    init (vertexFormat, vertexCount, dynamic) {
        this.clear();
        
        let data = new Uint8Array(vertexFormat._bytes*vertexCount);
        let vb = new gfx.VertexBuffer(
            renderer.device,
            vertexFormat,
            dynamic ? gfx.USAGE_STATIC : gfx.USAGE_DYNAMIC,
            data,
            vertexCount
        );

        this._vbs[0] = {
            buffer: vb,
            data: data,
            float32Data: new Float32Array(data.buffer),
            uint32Data: new Uint32Array(data.buffer),
            dirty: true
        };
    },
    
    /**
     * !#en
     * Set the vertex values.
     * !#zh 
     * 设置顶点数据
     * @method setVertexes
     * @param {String} name - the attribute name, e.g. gfx.ATTR_POSITION
     * @param {[Vec2|Vec3|Color]} values - the vertex values
     * @param {Number} [index] 
     */
    setVertexes (name, values, index) {
        index = index || 0;
        let vb = this._vbs[index];

        let buffer = vb.buffer;
        let el = buffer._format._attr2el[name];
        if (!el) {
            return cc.warn(`Cannot find ${name} attribute in vertex defines.`);
        }

        let stride = el.stride/4;
        let offset = el.offset/4;

        let data;
        let applyFunc;
        if (name === gfx.ATTR_COLOR) {
            data = vb.uint32Data;
            applyFunc = applyColor;
        }
        else {
            data = vb.float32Data;
            if (el.num === 2) {
                applyFunc = applyVec2;
            }
            else {
                applyFunc = applyVec3;
            }
        }

        for (let i = 0, l = values.length; i < l; i++) {
            let v = values[i];
            let vOffset = i * stride + offset;
            applyFunc(data, vOffset, v);
        }
        vb.dirty = true;
    },

    /**
     * !#en
     * Set the sub mesh indices.
     * !#zh
     * 设置子网格索引。
     * @method setIndices
     * @param {[Number]} indices - the sub mesh indices.
     * @param {Number} index - sub mesh index.
     */
    setIndices (indices, index) {
        index = index || 0;

        let data = new Uint16Array(indices);

        let ib = this._ibs[index];
        if (!ib) {
            let buffer = new gfx.IndexBuffer(
                renderer.device,
                gfx.INDEX_FMT_UINT16,
                gfx.USAGE_STATIC,
                data,
                data.length
            );

            this._ibs[index] = {
                buffer: buffer,
                data: data,
                dirty: false
            };

            let vb = this._vbs[0];
            this._subMeshes[index] = new renderEngine.InputAssembler(vb.buffer, buffer);
        }
        else {
            ib.data = data;
            ib.dirty = true
        }
    },

    /** 
     * !#en
     * Clear the buffer data.
     * !#zh
     * 清除网格创建的内存数据。
     * @method clear
    */
    clear () {
        let subMeshes = this._subMeshes;
        for (let i = 0; i < subMeshes.length; i++) {
            subMeshes[i].destroy();
        }
        subMeshes.length = 0;

        let ibs = this._ibs;
        for (let i = 0; i < ibs.length; i++) {
            ibs[i].buffer.destroy();
        }
        ibs.length = 0;

        let vbs = this._vbs;
        for (let i = 0; i < vbs.length; i++) {
            vbs[i].buffer.destroy();
        }
        vbs.length = 0;
    },

    destroy () {
        this.clear();
    },

    _uploadData () {
        let vbs = this._vbs;
        for (let i = 0; i < vbs.length; i++) {
            let vb = vbs[i];

            if (vb.dirty) {
                vb.buffer.update(0, vb.data);
                vb.dirty = false;
            }
        }

        let ibs = this._ibs;
        for (let i = 0; i < ibs.length; i++) {
            let ib = ibs[i];

            if (ib.dirty) {
                ib.buffer.update(0, ib.data);
                ib.dirty = false;
            }
        }
    },

    _initWithModel (model) {
        if (!model) return;
        this._model = model;
        this._model.initMesh(this);
    },

    _serialize: CC_EDITOR && function () {
        return {
            modelUuid: this._modelUuid,
            meshID: this._meshID,
        }
    },

    _deserialize (data, handle) {
        this._modelUuid = data.modelUuid;
        this._meshID = data.meshID;

        if (this._modelUuid) {
            handle.result.push(this, '_modelSetter', this._modelUuid);
        }
    }
});

cc.Mesh = module.exports = Mesh;
