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

/**
 * @interface
 */
@ccclass('cc.MeshResource')
export class MeshResource {
    /**
     * 
     * @param {Mesh} mesh 
     */
    flush(mesh) {

    }
}
cc.MeshResource = MeshResource;

@ccclass('cc.Mesh')
export default class Mesh extends Asset {
    /**
     * @type {MeshResource}
     */
    @property(MeshResource)
    _resource = null;

    get resource() {
        return this._resource;
    }

    set resource(value) {
        this._resource = value;
        this.flush();
    }

    constructor() {
        super();

        /**
         * @type {cc.renderer.InputAssembler[]}
         */
        this._subMeshes = null;

        /**
         * @type {cc.core.math.vec3}
         */
        this._minPos = null;

        /**
         * @type {cc.core.math.vec3}
         */
        this._maxPos = null;
    }

    /**
     * 
     */
    flush() {
        if (this._resource) {
            this._resource.flush(this);
        }
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
cc.Mesh = Mesh;