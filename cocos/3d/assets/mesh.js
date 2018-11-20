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

// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass, property } = _decorator;
import Asset from "../../assets/CCAsset";
import gfx from "../../renderer/gfx";
import { enums as gfxEnums } from "../../renderer/gfx/enums";
import InputAssembler from "../../renderer/core/input-assembler";
import BufferRange from "./utils/buffer-range";

/**
 * A vertex bundle describes a serials of vertex attributes.
 * These vertex attributes occupy a range of the buffer and
 * are interleaved, no padding bytes, in the range.
 */
@ccclass("cc.VertexBundle")
export class VertexBundle {
    /**
     * The data range of this bundle.
     * This range of data is essentially mapped to a GPU vertex buffer. 
     * @type {BufferRange}
     */
    @property(BufferRange)
    _data = null;

    /**
     * This bundle's vertices count.
     * @type {number}
     */
    @property(Number)
    _verticesCount = 0;

    /**
     * The attributes's formats.
     * @type {{name: string, type: number, num: number, normalize: boolean}[]}
     */
    @property
    _formats = [];
}
cc.VertexBundle = VertexBundle;

/**
 * A primitive is a geometry constituted with a list of
 * same topology primitive graphic(such as points, lines or triangles).
 */
@ccclass("cc.Primitive")
export class Primitive {

    /**
     * The vertex bundles that this primitive use.
     * @type {number[]}
     */
    @property([Number])
    _vertexBundelIndices = [];

    /**
     * The indices data range of this primitive.
     * @type {BufferRange}
     */
    @property(BufferRange)
    _indices = null;

    /**
     * The type of this primitive's indices.
     * @type {number}
     */
    @property(Number)
    _indexUnit = gfxEnums.INDEX_FMT_UINT16;

    /**
     * This primitive's topology.
     * @type {number}
     */
    @property(Number)
    _topology = gfxEnums.PT_TRIANGLES;
}
cc.Primitive = Primitive;

@ccclass('cc.Mesh')
export default class Mesh extends Asset {
    /**
     * The vertex bundles that this mesh owns.
     * @type {VertexBundle[]}
     */
    @property([VertexBundle])
    _vertexBundles = [];

    /**
     * @type {Primitive[]}
     */
    @property([Primitive])
    _primitives = [];

    /**
     * The min position of this mesh's vertices.
     */
    @property(cc.v3)
    _minPosition = null;

    /**
     * The max position of this mesh's vertices.
     */
    @property(cc.v3)
    _maxPosition = null;

    constructor() {
        super();

        /**
         * @type {InputAssembler[]}
         */
        this._subMeshes = null;

        /**
         * @type {Uint8Array}
         */
        this._data = null;
    }

    get _nativeAsset() {
        return this._data;
    }

    set _nativeAsset(value) {
        this._data = value;
    }

    /**
     * 
     */
    _lazyInitRenderResources() {
        if (this._subMeshes != null) {
            return;
        }

        this._subMeshes = [];

        if (this._data === null) {
            return;
        }
        const buffer = this._getBuffer();
        const vertexBuffers = this._vertexBundles.map((vertexBundle) => {
            return new gfx.VertexBuffer(
                cc.game._renderContext,
                new gfx.VertexFormat(vertexBundle._formats),
                gfx.USAGE_STATIC,
                new Uint8Array(buffer, vertexBundle._data._offset, vertexBundle._data._length),
                vertexBundle._verticesCount);
        });
        this._subMeshes = this._primitives.map((primitive) => {
            if (primitive._vertexBundelIndices.length === 0) {
                return null;
            }

            // Currently, an IA only has one vertex buffer.
            const vertexBuffer = vertexBuffers[primitive._vertexBundelIndices[0]];

            const indexBuffer = new gfx.IndexBuffer(
                cc.game._renderContext,
                primitive._indexUnit,
                gfx.USAGE_STATIC,
                new DataView(buffer, primitive._indices._offset, primitive._indices._length),
                primitive._indices._length / this._getIndexUnitSize(primitive._indexUnit)
            );

            return new InputAssembler(vertexBuffer, indexBuffer);
        });
    }

    /**
     * !#en
     * Destory this mesh and immediately release its video memory.
     */
    destroy() {
        if (this._subMeshes !== null) {
            // Destroy vertex buffer
            this._subMeshes[0]._vertexBuffer.destroy();
            // Destroy index buffers
            for (let i = 0; i < this._subMeshes.length; ++i) {
                this._subMeshes[i]._indexBuffer.destroy();
            }
            this._subMeshes = null;
        }

        return super.destroy();
    }

    /**
     * !#en
     * Submeshes count of this mesh.
     * @property {number}
     */
    get subMeshCount() {
        this._lazyInitRenderResources();
        return this._subMeshes.length;
    }

    /**
     * !#en
     * Gets the specified submesh.
     * @param {number} index Index of the specified submesh.
     */
    getSubMesh(index) {
        this._lazyInitRenderResources();
        return this._subMeshes[index];
    }

    get minPosition() {
        return this._minPosition;
    }

    get maxPosition() {
        return this._maxPosition;
    }

    // TODO
    // updateData () {
    //   // store the data
    //   if (this._persist) {
    //     if (this._data) {
    //       this._data.set(data, offset);
    //     } else {
    //       this._data = data;
    //     }
    //   }
    // }

    /**
     * @return {ArrayBuffer}
     */
    _getBuffer() {
        return this._data.buffer;
    }

    _getIndexUnitSize(indexUnit) {
        switch (indexUnit) {
        case gfxEnums.INDEX_FMT_UINT8:
            return 1;
        case gfxEnums.INDEX_FMT_UINT16:
            return 2;
        case gfxEnums.INDEX_FMT_UINT32:
            return 3;
        }
        return 1;
    }
}
cc.Mesh = Mesh;