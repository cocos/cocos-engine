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
import GLTFAsset from "../../assets/CCGLTFAsset";
import Asset from "../../assets/CCAsset";
import { default as GLTFUtils } from "./utils/gltf-utils";
/**
 * @typedef {import("../../renderer/core/input-assembler").default} InputAssemblers
 * */

@ccclass
export default class Mesh extends Asset {
    /**
     * @type {GLTFAsset}
     */
    @property(GLTFAsset)
    _gltfAsset;

    /**
     * @type {number}
     */
    @property(Number)
    _gltfIndex = -1;

    /**
     * @type {InputAssemblers[]}
     */
    _subMeshes = null;

    /**
     * @type {{jointIndices, bindposes}}
     */
    _skinning = null;

    /**
     * @type {cc.core.math.vec3}
     */
    _minPos = null;

    /**
     * @type {cc.core.math.vec3}
     */
    _maxPos = null;
    
    /**
     * !#en
     * Gets the native data of this mesh.
     * @return {GLTFAsset | Null} The native data, or null if this is an empty mesh.
     */
    getNativeAsset() {
        return this._gltfAsset;
    }

    /**
     * !#en
     * Gets the index into the native data of this mesh.
     * @return {number} The index into the native data.
     */
    getNativeAssetIndex() {
        return this._gltfIndex;
    }

    /**
     * !#en
     * Sets the native data of this mesh.
     * @param {GLTFAsset} gltfAsset The GLTF asset.
     * @param {number} gltfIndex An index to the GLTF meshes.
     */
    setNative(gltfAsset, gltfIndex) {
        this._gltfAsset = gltfAsset;
        this._gltfIndex = gltfIndex;
        this._update();
    }

    _update(app) {
        if (!this._gltfAsset) {
            return;
        }
        GLTFUtils.createMesh(app, this._gltfAsset, this._gltfIndex, this);
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
        return this._subMeshes.length;
    }

    /**
     * !#en
     * Gets the specified submesh.
     * @param {number} index Index of the specified submesh.
     */
    getSubMesh(index) {
        return this._subMeshes[index];
    }

    /**
     * !#en
     * Gets the skinning data associated with this mesh.
     */
    get skinning() {
        return this._skinning;
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
}