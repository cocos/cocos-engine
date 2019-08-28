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
const EventTarget = require('../event/event-target');

import InputAssembler from '../../renderer/core/input-assembler';
import gfx from '../../renderer/gfx';
import { Primitive, VertexBundle, MeshData} from './mesh-data';

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
                this.initWithBuffer();
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
        },

        subDatas : {
            get () {
                return this._subDatas;
            }
        }
    },

    ctor () {
        this._subMeshes = [];
        this._subDatas = [];
        this.loaded = false;
    },

    initWithBuffer () {
        this._subMeshes.length = 0;

        let primitives = this._primitives;
        for (let i = 0; i < primitives.length; i++) {
            let primitive = primitives[i];
            
            // ib
            let ibrange = primitive.data;
            let ibData = new Uint8Array(this._buffer, ibrange.offset, ibrange.length);

            // vb
            let vertexBundle = this._vertexBundles[primitive.vertexBundleIndices[0]];
            let vbRange = vertexBundle.data;
            let gfxVFmt = new gfx.VertexFormat(vertexBundle.formats);
            // Mesh binary may have several data format, must use Uint8Array to store data.
            let vbData = new Uint8Array(this._buffer, vbRange.offset, vbRange.length);
            
            let canBatch = this._canVertexFormatBatch(gfxVFmt);

            let meshData = new MeshData();
            meshData.vData = vbData;
            meshData.iData = ibData;
            meshData.vfm = gfxVFmt;
            meshData.offset = vbRange.offset;
            meshData.canBatch = canBatch;
            this._subDatas.push(meshData);

            if (CC_JSB && CC_NATIVERENDERER) {
                meshData.vDirty = true;
            } else {
                let vbBuffer = new gfx.VertexBuffer(
                    renderer.device,
                    gfxVFmt,
                    gfx.USAGE_STATIC,
                    vbData
                );
    
                let ibBuffer = new gfx.IndexBuffer(
                    renderer.device,
                    primitive.indexUnit,
                    gfx.USAGE_STATIC,
                    ibData
                );
    
                // create sub meshes
                this._subMeshes.push(new InputAssembler(vbBuffer, ibBuffer));
            }
        }
        this.loaded = true;
        this.emit('load');
    },

    _canVertexFormatBatch (format) {
        let aPosition = format._attr2el[gfx.ATTR_POSITION];
        let canBatch = !aPosition || 
            (aPosition.type === gfx.ATTR_TYPE_FLOAT32 && 
            format._bytes % 4 === 0);
        return canBatch;
    },

    /**
     * !#en
     * Init vertex buffer according to the vertex format.
     * !#zh
     * 根据顶点格式初始化顶点内存。
     * @method init
     * @param {gfx.VertexFormat} vertexFormat - vertex format
     * @param {Number} vertexCount - how much vertex should be create in this buffer.
     * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
     */
    init (vertexFormat, vertexCount, dynamic) {
        this.clear();

        let data = new Uint8Array(vertexFormat._bytes * vertexCount);
        let meshData = new MeshData();
        meshData.vData = data;
        meshData.vfm = vertexFormat;
        meshData.vDirty = true;
        meshData.canBatch = this._canVertexFormatBatch(vertexFormat);
        
        if (!(CC_JSB && CC_NATIVERENDERER)) {
            let vb = new gfx.VertexBuffer(
                renderer.device,
                vertexFormat,
                dynamic ? gfx.USAGE_DYNAMIC : gfx.USAGE_STATIC,
                data,
            );

            meshData.vb = vb;   
        }

        this._subDatas.push(meshData);
        this.loaded = true;
        this.emit('load');
        this.emit('init-format');
    },

    /**
     * !#en
     * Set the vertex values.
     * !#zh 
     * 设置顶点数据
     * @method setVertices
     * @param {String} name - the attribute name, e.g. gfx.ATTR_POSITION
     * @param {[Vec2] | [Vec3] | [Color] | [Number] | Uint8Array | Float32Array} values - the vertex values
     */
    setVertices (name, values, index) {
        index = index || 0;
        let subData = this._subDatas[index];

        let el = subData.vfm.element(name);
        if (!el) {
            return cc.warn(`Cannot find ${name} attribute in vertex defines.`);
        }

        // whether the values is expanded
        let isFlatMode = typeof values[0] === 'number';
        let elNum = el.num;
        let data;
        let bytes = 4;
        if (name === gfx.ATTR_COLOR) {
            if (!isFlatMode) {
                data = subData.getVData(Uint32Array);
            }
            else {
                data = subData.getVData();
                bytes = 1;
            }
        } 
        else {
            data = subData.getVData(Float32Array);
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
        subData.vDirty = true;
    },

    /**
     * !#en
     * Set the sub mesh indices.
     * !#zh
     * 设置子网格索引。
     * @method setIndices
     * @param {[Number]|Uint16Array|Uint8Array} indices - the sub mesh indices.
     * @param {Number} [index] - sub mesh index.
     * @param {Boolean} [dynamic] - whether or not to use dynamic buffer.
     */
    setIndices (indices, index, dynamic) {
        index = index || 0;

        let iData = indices;
        if (indices instanceof Uint16Array) {
            iData = new Uint8Array(indices.buffer, indices.byteOffset, indices.byteLength);
        }
        else if (Array.isArray(indices)) {
            iData = new Uint16Array(indices);
            iData = new Uint8Array(iData.buffer, iData.byteOffset, iData.byteLength);
        }

        let usage = dynamic ? gfx.USAGE_DYNAMIC : gfx.USAGE_STATIC;

        let subData = this._subDatas[index];
        if (!subData.ib) {
            subData.iData = iData;
            if (!(CC_JSB && CC_NATIVERENDERER)) {
                let buffer = new gfx.IndexBuffer(
                    renderer.device,
                    gfx.INDEX_FMT_UINT16,
                    usage,
                    iData,
                    iData.byteLength / gfx.IndexBuffer.BYTES_PER_INDEX[gfx.INDEX_FMT_UINT16]
                );

                subData.ib = buffer;
                this._subMeshes[index] = new InputAssembler(subData.vb, buffer);
            }
        }
        else {
            subData.iData = iData;
            subData.iDirty = true;
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

        let subDatas = this._subDatas;
        for (let i = 0, len = subDatas.length; i < len; i++) {
            let vb = subDatas[i].vb;
            if (vb) {
                vb.destroy();
            }
            
            let ib = subDatas[i].ib;
            if (ib) {
                ib.destroy();
            }
        }
        subDatas.length = 0;
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
        let subDatas = this._subDatas;
        for (let i = 0, len = subDatas.length; i < len; i++) {
            let subData = subDatas[i];

            if (subData.vDirty) {
                let buffer = subData.vb, data = subData.vData;
                buffer.update(0, data);
                subData.vDirty = false;
            }

            if (subData.iDirty) {
                let buffer = subData.ib, data = subData.iData;
                buffer.update(0, data);
                subData.iDirty = false;
            }
        }
    }
});

cc.Mesh = module.exports = Mesh;
