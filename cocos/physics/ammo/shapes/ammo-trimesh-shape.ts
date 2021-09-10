/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable new-cap */
import Ammo from '../instantiated';
import { AmmoShape } from './ammo-shape';
import { warnID } from '../../../core';
import { Mesh } from '../../../3d/assets';
import { MeshCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, cocos2AmmoTriMesh } from '../ammo-util';
import { btBroadphaseNativeTypes } from '../ammo-enum';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { AmmoConstant } from '../ammo-const';

export class AmmoTrimeshShape extends AmmoShape implements ITrimeshShape {
    public get collider () {
        return this._collider as MeshCollider;
    }

    public get impl () {
        return this._btShape as Ammo.btBvhTriangleMeshShape | Ammo.btConvexTriangleMeshShape;
    }

    setMesh (v: Mesh | null) {
        if (!this._isBinding) return;

        if (this._btShape != null && AmmoConstant.isNotEmptyShape(this._btShape)) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const btTriangleMesh: Ammo.btTriangleMesh = this._getBtTriangleMesh(mesh);
                if (this.collider.convex) {
                    this._btShape = new Ammo.btConvexTriangleMeshShape(btTriangleMesh, true);
                } else {
                    this._btShape = new Ammo.btBvhTriangleMeshShape(btTriangleMesh, true, true);
                }
                cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
                this._btShape.setMargin(0.01);
                this._btShape.setLocalScaling(this.scale);
                this.setWrapper();
                this.setCompound(this._btCompound);
                this.updateByReAdd();
            } else {
                this._btShape = AmmoConstant.instance.EMPTY_SHAPE;
            }
        }
    }

    private refBtTriangleMesh: Ammo.btTriangleMesh | null = null;

    constructor () {
        super(btBroadphaseNativeTypes.TRIANGLE_MESH_SHAPE_PROXYTYPE);
    }

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onDestroy () {
        if (this.refBtTriangleMesh) { Ammo.destroy(this.refBtTriangleMesh); }
        super.onDestroy();
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        super.setCompound(compound);
        this.impl.setUserIndex(this._index);
    }

    updateScale () {
        super.updateScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

    private _getBtTriangleMesh (mesh: Mesh): Ammo.btTriangleMesh {
        let btTriangleMesh: Ammo.btTriangleMesh;
        const cache = (Ammo as any).CC_CACHE;
        if (cache.btTriangleMesh.enable) {
            if (cache.btTriangleMesh[mesh._uuid] == null) {
                const btm = new Ammo.btTriangleMesh();
                cache.btTriangleMesh[mesh._uuid] = btm;
                cocos2AmmoTriMesh(btm, mesh);
            }
            btTriangleMesh = cache.btTriangleMesh[mesh._uuid];
        } else {
            this.refBtTriangleMesh = btTriangleMesh = new Ammo.btTriangleMesh();
            cocos2AmmoTriMesh(btTriangleMesh, mesh);
        }
        return btTriangleMesh;
    }
}
