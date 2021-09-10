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

import { Vec3 } from '../../../core/math';
import { Collider, PhysicsMaterial, PhysicsSystem } from '../../../../exports/physics-framework';
import { BulletWorld } from '../bullet-world';
import { EBtSharedBodyDirty } from '../bullet-enum';
import { cocos2BulletQuat, cocos2BulletVec3 } from '../bullet-utils';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BulletSharedBody } from '../bullet-shared-body';
import { AABB, Sphere } from '../../../core/geometry';
import { BulletConst, CC_V3_0 } from '../bullet-const';
import { bt } from '../bullet.asmjs';
import { EColliderType } from '../../framework';

const v3_0 = CC_V3_0;

export abstract class BulletShape implements IBaseShape {
    updateEventListener (): void { }

    setMaterial (v: PhysicsMaterial | null) {
        if (!this._isTrigger && this._isEnabled && v) {
            if (this._compound) {
                bt.CompoundShape_setMaterial(this._compound, this._index, v.friction, v.restitution, v.rollingFriction, v.spinningFriction);
            } else {
                bt.CollisionObject_setMaterial(this._sharedBody.body, v.friction, v.restitution, v.rollingFriction, v.spinningFriction);
            }
        }
    }

    setCenter (v: IVec3Like) {
        Vec3.copy(v3_0, v);
        v3_0.multiply(this._collider.node.worldScale);
        cocos2BulletVec3(bt.Transform_getOrigin(this.transform), v3_0);
        this.updateCompoundTransform();
    }

    setAsTrigger (v: boolean) {
        if (this._isTrigger === v) return;

        if (this._isEnabled) {
            this._sharedBody.removeShape(this, !v);
            this._sharedBody.addShape(this, v);
        }
        this._isTrigger = v;
    }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) return this._sharedBody.wrappedBody.rigidBody;
        return null;
    }

    get impl () { return this._impl; }
    get collider (): Collider { return this._collider; }
    get sharedBody (): BulletSharedBody { return this._sharedBody; }
    get index () { return this._index; }

    private static idCounter = 0;
    readonly id = BulletShape.idCounter++;
    protected _index = -1;
    protected _isEnabled = false;
    protected _isTrigger = false;
    protected _isInitialized = false;
    protected _impl: Bullet.ptr = 0;
    protected _compound: Bullet.ptr = 0;
    protected readonly quat = bt.Quat_new(0, 0, 0, 1);
    protected readonly transform = bt.Transform_new();
    protected _collider!: Collider;
    protected _sharedBody!: BulletSharedBody;

    getAABB (v: AABB) {
        const bt_transform = BulletConst.instance.BT_TRANSFORM_0;
        bt.Transform_setIdentity(bt_transform);
        bt.Transform_setRotation(bt_transform, cocos2BulletQuat(BulletConst.instance.BT_QUAT_0, this._collider.node.worldRotation));
        const MIN = BulletConst.instance.BT_V3_0;
        const MAX = BulletConst.instance.BT_V3_1;
        bt.CollisionShape_getAabb(this._impl, bt_transform, MIN, MAX);
        v.halfExtents.x = (bt.Vec3_x(MAX) - bt.Vec3_x(MIN)) / 2;
        v.halfExtents.y = (bt.Vec3_y(MAX) - bt.Vec3_y(MIN)) / 2;
        v.halfExtents.z = (bt.Vec3_z(MAX) - bt.Vec3_z(MIN)) / 2;
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    getBoundingSphere (v: Sphere) {
        v.radius = bt.CollisionShape_getLocalBoundingSphere(this._impl);
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    initialize (com: Collider) {
        this._collider = com;
        this._isInitialized = true;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BulletWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        this.setWrapper();
    }

    setWrapper () {
        if (BulletConst.isNotEmptyShape(this._impl)) {
            bt.CollisionShape_setUserPointer(this._impl, this._impl);
            BulletConst.setWrapper(this._impl, this);
        }
    }

    // virtual
    protected abstract onComponentSet (): void;

    onLoad () {
        this.setCenter(this._collider.center);
        this.setAsTrigger(this._collider.isTrigger);
    }

    onEnable () {
        this._isEnabled = true;
        this._sharedBody.addShape(this, this._isTrigger);

        this.setMaterial(this.collider.sharedMaterial);
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.removeShape(this, this._isTrigger);
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._collider as any) = null;
        bt.Quat_del(this.quat);
        bt.Transform_del(this.transform);
        if (this._compound) bt.CollisionShape_del(this._compound);
        if (BulletConst.isNotEmptyShape(this._impl)) {
            bt.CollisionShape_del(this._impl);
            BulletConst.delWrapper(this._impl);
        }
    }

    updateByReAdd () {
        if (this._isEnabled) {
            this._sharedBody.removeShape(this, this._isTrigger);
            this._sharedBody.addShape(this, this._isTrigger);
        }
    }

    getGroup (): number {
        return this._sharedBody.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this._sharedBody.collisionFilterGroup = v;
    }

    addGroup (v: number): void {
        this._sharedBody.collisionFilterGroup |= v;
    }

    removeGroup (v: number): void {
        this._sharedBody.collisionFilterGroup &= ~v;
    }

    getMask (): number {
        return this._sharedBody.collisionFilterMask;
    }

    setMask (v: number): void {
        this._sharedBody.collisionFilterMask = v;
    }

    addMask (v: number): void {
        this._sharedBody.collisionFilterMask |= v;
    }

    removeMask (v: number): void {
        this._sharedBody.collisionFilterMask &= ~v;
    }

    setCompound (compound: Bullet.ptr) {
        if (this._compound) {
            bt.CompoundShape_removeChildShape(this._compound, this._impl);
            this._index = -1;
        }
        if (compound) {
            this._index = bt.CompoundShape_getNumChildShapes(compound);
            bt.CompoundShape_addChildShape(compound, this.transform, this._impl);
        }
        this._compound = compound;
    }

    updateScale () {
        this.setCenter(this._collider.center);
    }

    updateCompoundTransform () {
        if (this._compound) {
            bt.CompoundShape_updateChildTransform(this._compound, this._index, this.transform, true);
        } else if (this._isEnabled && !this._isTrigger) {
            if (this._sharedBody && !this._sharedBody.bodyStruct.useCompound) {
                this._sharedBody.dirty |= EBtSharedBodyDirty.BODY_RE_ADD;
            }
        }
    }

    needCompound () {
        if (this._collider.type === EColliderType.TERRAIN) { return true; }
        if (this._collider.center.equals(Vec3.ZERO)) { return false; }
        return true;
    }
}
