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

import { BulletShape } from './bullet-shape';
import { warnID } from '../../../core';
import { Mesh } from '../../../3d/assets';
import { MeshCollider } from '../../../../exports/physics-framework';
import { cocos2BulletVec3, cocos2BulletTriMesh } from '../bullet-utils';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { BulletConst } from '../bullet-const';
import { bt } from '../bullet.asmjs';

export class BulletTrimeshShape extends BulletShape implements ITrimeshShape {
    public get collider () {
        return this._collider as MeshCollider;
    }

    setMesh (v: Mesh | null) {
        if (!this._isInitialized) return;

        if (this._impl && BulletConst.isNotEmptyShape(this._impl)) {
            // TODO: change the mesh after initialization
            warnID(9620);
        } else {
            const mesh = v;
            if (mesh && mesh.renderingSubMeshes.length > 0) {
                const btTriangleMesh = this._getBtTriangleMesh(mesh);
                if (this.collider.convex) {
                    this._impl = bt.ConvexTriangleMeshShape_new(btTriangleMesh);
                } else {
                    this._impl = bt.BvhTriangleMeshShape_new(btTriangleMesh, true, true);
                }
                const bt_v3 = BulletConst.instance.BT_V3_0;
                cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
                bt.CollisionShape_setMargin(this._impl, 0.01);
                bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
                this.setWrapper();
                this.setCompound(this._compound);
                this.updateByReAdd();
            } else {
                this._impl = bt.EmptyShape_static();
            }
        }
    }

    private refBtTriangleMesh: Bullet.ptr = 0;

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    onDestroy () {
        if (this.refBtTriangleMesh) { bt.TriangleMesh_del(this.refBtTriangleMesh); }
        super.onDestroy();
    }

    setCompound (compound: Bullet.ptr) {
        super.setCompound(compound);
        bt.CollisionShape_setUserIndex(this._impl, this._index);
    }

    updateScale () {
        super.updateScale();
        const bt_v3 = BulletConst.instance.BT_V3_0;
        cocos2BulletVec3(bt_v3, this._collider.node.worldScale);
        bt.CollisionShape_setLocalScaling(this._impl, bt_v3);
        this.updateCompoundTransform();
    }

    private _getBtTriangleMesh (mesh: Mesh): Bullet.ptr {
        let btTriangleMesh: Bullet.ptr;
        if (ENABLE_CACHE) {
            if (CACHE[mesh._uuid] == null) {
                const btm = bt.TriangleMesh_new();
                CACHE[mesh._uuid] = btm;
                cocos2BulletTriMesh(btm, mesh);
            }
            btTriangleMesh = CACHE[mesh._uuid];
        } else {
            this.refBtTriangleMesh = btTriangleMesh = bt.TriangleMesh_new();
            cocos2BulletTriMesh(btTriangleMesh, mesh);
        }
        return btTriangleMesh;
    }
}

// TODO: refactor
const CACHE = {};
const ENABLE_CACHE = true;
