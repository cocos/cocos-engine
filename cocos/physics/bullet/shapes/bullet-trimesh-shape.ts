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

import { BulletShape } from './bullet-shape';
import { warnID } from '../../../core';
import { Mesh } from '../../../3d/assets';
import { MeshCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3, cocos2BulletTriMesh } from '../bullet-utils';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { BulletCache } from '../bullet-cache';
import { bt, EBulletType } from '../instantiated';
import { BulletTriangleMesh } from '../bullet-triangle-mesh';

export class BulletTrimeshShape extends BulletShape implements ITrimeshShape {
    private static mapTrimesh2BVH = {};

    public get collider () {
        return this._collider as MeshCollider;
    }

    setMesh (v: Mesh | null) {
        if (!this._isInitialized) return;

        if (this._impl && BulletCache.isNotEmptyShape(this._impl)) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const btTriangleMesh = this._getBtTriangleMesh(mesh);
                if (this.collider.convex) {
                    this._impl = bt.ConvexTriangleMeshShape_new(btTriangleMesh);
                } else if (BulletTrimeshShape.mapTrimesh2BVH[mesh.hash] == null) { // triangle mesh and bvh is not built
                    this._impl = bt.BvhTriangleMeshShape_new(btTriangleMesh, true, true);
                    BulletTrimeshShape.mapTrimesh2BVH[mesh.hash] = bt.BvhTriangleMeshShape_getOptimizedBvh(this._impl);
                } else if (BulletTrimeshShape.mapTrimesh2BVH[mesh.hash]) { // triangle mesh and bvh is already built
                    this._impl = bt.BvhTriangleMeshShape_new(btTriangleMesh, true, false);
                    bt.BvhTriangleMeshShape_setOptimizedBvh(this._impl, BulletTrimeshShape.mapTrimesh2BVH[mesh.hash]);
                }
                const bt_v3 = BulletCache.instance.BT_V3_0;
                cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
                bt.CollisionShape_setMargin(this._impl, 0.01);
                bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
                this.setCompound(this._compound);
                this.updateByReAdd();
                this.setWrapper();
            } else {
                this._impl = bt.EmptyShape_static();
            }
        }
    }

    private refBtTriangleMesh: Bullet.ptr = 0;
    private triangleMesh!: BulletTriangleMesh;

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onDestroy () {
        if (this.refBtTriangleMesh) {  bt._safe_delete(this.refBtTriangleMesh, EBulletType.EBulletTypeTriangleMesh); }
        if (this.triangleMesh) { this.triangleMesh.reference = false; }
        super.onDestroy();
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletCache.instance.BT_V3_0;
        cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }

    private _getBtTriangleMesh (mesh: Mesh): Bullet.ptr {
        this.triangleMesh = BulletTriangleMesh.getBulletTriangleMesh(mesh.hash, mesh);
        if (!this.triangleMesh.bulletTriangleMeshInternal) {
            console.warn('BulletTrimeshShape::_getBtTriangleMesh() return null');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.triangleMesh.bulletTriangleMeshInternal;
    }
}
