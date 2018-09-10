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
const {ccclass, property} = _decorator;
import { GLTFAsset } from "../../assets/CCGLTFAsset";
import { Asset } from "../../../index";

@ccclass
class Mesh extends Asset {
    /**
     * !#en
     * Gets the native data of this mesh.
     * @return {GLTFAsset | Null} The native data, or null if it had never been assigned.
     */
    @property(GLTFAsset)
    get native() {
        return this._native;
    }

    /**
     * !#en
     * Sets the native data to this mesh.
     * @param {GLTFAsset} value The native data.
     */
    set native(value) {
        this._native = value;
        this._onLoaded();
    }

    /**
     * !#en
     * Destory this mesh and immediately release its video memory. (Inherit from cc.Object.destroy)<br>
     * After destroy, this object is not usable any more.
     * You can use cc.isValid(obj) to check whether the object is destroyed before accessing it.
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

    _onLoaded() {

    }

    /**
     * @type {GLTFAsset}
     */
    _native = null;

    /**
     * @type {renderer.InputAssemblers}
     */
    _subMeshes = null;

    /**
     * @type {{jointIndices, bindposes}}
     */
    _skinning = null;
}