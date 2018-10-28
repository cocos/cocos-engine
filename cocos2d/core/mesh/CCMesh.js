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

const MeshResource = require('./CCMeshResource');
const renderer = require('../renderer');
const renderEngine = require('../renderer/render-engine');
const gfx = renderEngine.gfx;

function applyColor (data, offset, value) {
    data[offset] = value._val;
}

function applyVec2 (data, offset, value) {
    data[offset] = value.x;
    data[offset + 1] = value.y;
}

function applyVec3 (data, offset, value) {
    data[offset] = value.x;
    data[offset + 1] = value.y;
    data[offset + 2] = value.z;
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
let Mesh = cc.Class({
    name: 'cc.Mesh',
    extends: cc.Asset,

    properties: {
        _resource: {
            default: null,
            type: MeshResource
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
        this._subMeshes = [];

        this._ibs = [];
        this._vbs = [];

        this._minPos = cc.v3();
        this._maxPos = cc.v3();

        this._resourceInited = false;
    },

    _initResource () {
        if (this._resourceInited || !this._resource) return;
        this._resourceInited = true;

        this._resource.flush(this);
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

        let data = new Uint8Array(vertexFormat._bytes * vertexCount);
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
            dirty: true
        };
    },

    /**
     * !#en
     * Set the vertex values.
     * !#zh 
     * 设置顶点数据
     * @method setVertices
     * @param {String} name - the attribute name, e.g. gfx.ATTR_POSITION
     * @param {[Vec2|Vec3|Color|Number]} values - the vertex values
     * @param {Number} [index] 
     */
    setVertices (name, values, index) {
        index = index || 0;
        let vb = this._vbs[index];

        let buffer = vb.buffer;
        let el = buffer._format._attr2el[name];
        if (!el) {
            return cc.warn(`Cannot find ${name} attribute in vertex defines.`);
        }


        // whether the values is expanded
        let isFlatMode = typeof values[0] === 'number';
        let elNum = el.num;

        let reader = Float32Array;
        let bytes = 4;
        if (name === gfx.ATTR_COLOR) {
            if (isFlatMode) {
                reader = Float32Array;
                bytes = 1;
            }
            else {
                reader = Uint32Array;
            }
        }

        let data = vb[reader.name];
        if (!data) {
            let vbData = vb.data;
            data = vb[reader.name] = new reader(vbData.buffer, vbData.byteOffset, vbData.byteLength / bytes);
        }

        let stride = el.stride / bytes;
        let offset = el.offset / bytes;

        if (isFlatMode) {
            for (let i = 0, l = (values.length / elNum); i < l; i++) {
                let sOffset = i * elNum;
                let dOffset = i * stride + offset;
                for (let j = 0; j < elNum; j++) {
                    data[dOffset + j] = values[sOffset + j];
                }
            }
        }
        else {
            let applyFunc;
            if (name === gfx.ATTR_COLOR) {
                applyFunc = applyColor;
            }
            else {

                if (elNum === 2) {
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
     * Set the sub mesh primitive type.
     * !#zh
     * 设置子网格绘制线条的方式。
     * @method setPrimitiveType
     * @param {Number} type 
     * @param {Number} index 
     */
    setPrimitiveType (type, index) {
        index = index || 0;
        let subMesh = this._subMeshes[index];
        if (!subMesh) {
            cc.warn(`Do not have sub mesh at index ${index}`);
            return;
        }
        this._subMeshes[index]._primitiveType = type;
    },

    /** 
     * !#en
     * Clear the buffer data.
     * !#zh
     * 清除网格创建的内存数据。
     * @method clear
    */
    clear () {
        this._subMeshes.length = 0;

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
                let buffer = vb.buffer, data = vb.data;
                buffer._numVertices = data.length;
                buffer._bytes = data.byteLength;
                buffer.update(0, data);
                vb.dirty = false;
            }
        }

        let ibs = this._ibs;
        for (let i = 0; i < ibs.length; i++) {
            let ib = ibs[i];

            if (ib.dirty) {
                let buffer = ib.buffer, data = ib.data;
                buffer._numIndices = data.length;
                buffer._bytes = data.byteLength;
                buffer.update(0, data);
                ib.dirty = false;
            }
        }
    }
});

cc.Mesh = module.exports = Mesh;
