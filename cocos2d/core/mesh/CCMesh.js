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

const renderEngine = require('../renderer');
const EventTarget = require('../event/event-target');

import InputAssembler from '../../renderer/core/input-assembler';
import gfx from '../../renderer/gfx';
import { Primitive, VertexBundle, MeshRenderData} from './mesh-data';

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
    mixins: [EventTarget],

    properties: {
        _nativeAsset: {
            override: true,
            get () {
                return this._buffer;
            },
            set (bin) {
                this._buffer = ArrayBuffer.isView(bin) ? bin.buffer : bin;
            }
        },

        _vertexBundles: {
            default: null,
            type: VertexBundle
        },
        _primitives: {
            default: null,
            Primitive
        },
        _minPos: cc.v3(),
        _maxPos: cc.v3(),

        /**
         * !#en Get ir set the sub meshes.
         * !#zh 设置或者获取子网格。
         * @property {[InputAssembler]} subMeshes
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
        this._renderData = new MeshRenderData();

        if (CC_JSB && CC_NATIVERENDERER) {
            this._nativeObj = new renderer.MeshNative();
        }
    },

    onLoad () {
        this._subMeshes.length = 0;
        this._initSubMesh();
    },

    _initSubMesh () {
        let primitives = this._primitives;
        for (let i = 0; i < primitives.length; i++) {
            let primitive = primitives[i];

            let vertexBundle = this._vertexBundles[primitive.vertexBundleIndices[0]];
            let vbRange = vertexBundle.data;
            let gfxVFmt = new gfx.VertexFormat(vertexBundle.formats);
            this._renderData.vertexFormat = gfxVFmt;
   
            // ib
            let ibrange = primitive.data;
            let ibData = new Uint16Array(this._buffer, ibrange.offset, ibrange.length / 2);
            let ibBuffer = new gfx.IndexBuffer(
                renderEngine.device,
                primitive.indexUnit,
                gfx.USAGE_STATIC,
                ibData,
                ibData.length
            );

            // vb
            let vbData = new Float32Array(this._buffer, vbRange.offset, vbRange.length / 4);
            let vbBuffer = new gfx.VertexBuffer(
                renderEngine.device,
                gfxVFmt,
                gfx.USAGE_STATIC,
                vbData,
                vertexBundle.verticesCount
            );

            // create sub meshes
            this._ibs.push({ buffer: ibBuffer});
            this._vbs.push({ buffer: vbBuffer});
            this._subMeshes.push(new InputAssembler(vbBuffer, ibBuffer));
            this._renderData.updateMesh(index, vbData, ibData, vbRange.offset);
        }
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

        let data = new Float32Array(vertexFormat._bytes * vertexCount / 4);
        this._renderData.setVertices(0, data);
        this._renderData.vertexFormat = vertexFormat;

        let vb = new gfx.VertexBuffer(
            renderEngine.device,
            vertexFormat,
            dynamic ? gfx.USAGE_DYNAMIC : gfx.USAGE_STATIC,
            data,
            vertexCount
        );
        
        this._vbs[0] = {
            buffer: vb,
            dirty: true
        };

        this.emit('init-format');
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
        
        if (!this._renderData.vertexFormat) {
            return cc.warn(`VertexFormat is not init`);
        }
        let el = this._renderData.vertexFormat.element(name);
        if (!el) {
            return cc.warn(`Cannot find ${name} attribute in vertex defines.`);
        }
      
        // whether the values is expanded
        let isFlatMode = typeof values[0] === 'number';
        let elNum = el.num;

        let bytes = 4;
        let data;
        if (name === gfx.ATTR_COLOR) {
            if (isFlatMode) {
                data = this._renderData.vDatas[index]
                bytes = 1;
            }
            else {
                data = this._renderData.uintVDatas[index]
            }
        } else {
            data = this._renderData.vDatas[index]
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

        if (!(CC_JSB && CC_NATIVERENDERER)) {
            let vb = this._vbs[index];
            vb.dirty = true;
        }
    },

    /**
     * !#en
     * Set the sub mesh indices.
     * !#zh
     * 设置子网格索引。
     * @method setIndices
     * @param {[Number]} indices - the sub mesh indices.
     * @param {Number} index - sub mesh index.
     * @param {Boolean} dynamic - whether or not to use dynamic buffer.
     */
    setIndices (indices, index, dynamic) {
        index = index || 0;

        let data = new Uint16Array(indices);
        let usage = dynamic ? gfx.USAGE_DYNAMIC : gfx.USAGE_STATIC;

        let ib = this._ibs[index];
        if (!ib) {
            let buffer = new gfx.IndexBuffer(
                renderEngine.device,
                gfx.INDEX_FMT_UINT16,
                usage,
                data,
                data.length
            );

            this._ibs[index] = {
                buffer: buffer,
                dirty: false
            };

            let vb = this._vbs[0];
            this._subMeshes[index] = new InputAssembler(vb.buffer, buffer);
        }
        else {
            ib.dirty = true
        }

        this._renderData.setIndices(0, data);
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

        this._renderData.clear();
    },

    /**
     * !#en Set mesh bounding box
     * !#zh 设置网格的包围盒
     * @method setBoundingBox
     * @param {Vec3} min 
     * @param {Vec3} max 
     */
    setBoundingBox (min, max) {
        this._minPos = min;
        this._maxPos = max;
    },

    destroy () {
        this.clear();
    },

    _uploadData () {
        let vbs = this._vbs;
        for (let i = 0; i < vbs.length; i++) {
            let vb = vbs[i];

            if (vb.dirty) {
                let buffer = vb.buffer, data = this._renderData.vDatas[i];
                buffer._numVertices = data.byteLength / buffer._format._bytes;
                buffer._bytes = data.byteLength;
                buffer.update(0, data);
                vb.dirty = false;
            }
        }

        let ibs = this._ibs;
        for (let i = 0; i < ibs.length; i++) {
            let ib = ibs[i];

            if (ib.dirty) {
                let buffer = ib.buffer, data = this._renderData.iDatas[i];
                buffer._numIndices = data.length;
                buffer._bytes = data.byteLength;
                buffer.update(0, data);
                ib.dirty = false;
            }
        }
    }
});

cc.Mesh = module.exports = Mesh;
