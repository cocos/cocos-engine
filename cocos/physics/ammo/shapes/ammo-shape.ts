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
// import Ammo from '../instantiated';
import { Vec3, Quat } from '../../../core/math';
import { Collider, PhysicsMaterial, PhysicsSystem } from '../../../../exports/physics-framework';
import { AmmoWorld } from '../ammo-world';
import { btBroadphaseNativeTypes, EBtSharedBodyDirty } from '../ammo-enum';
import { cocos2BulletVec3 } from '../ammo-util';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoSharedBody } from '../ammo-shared-body';
import { AABB, Sphere } from '../../../core/geometry';
import { AmmoConstant, CC_V3_0 } from '../ammo-const';
import { AmmoInstance } from '../ammo-instance';
import { bt } from '../bullet.asmjs';

const v3_0 = CC_V3_0;

export class AmmoShape implements IBaseShape {
    updateEventListener (): void { }

    setMaterial (v: PhysicsMaterial | null) {
        if (!this._isTrigger && this._isEnabled && v) {
            if (this._btCompound) {
                // this._btCompound.setMaterial(this._index, v.friction, v.restitution, v.rollingFriction, v.spinningFriction, 2);
            } else {
                // this._sharedBody.body.setFriction(v.friction);
                // this._sharedBody.body.setRestitution(v.restitution);
                // this._sharedBody.body.setRollingFriction(v.rollingFriction);
                // this._sharedBody.body.setSpinningFriction(v.spinningFriction);
                // this._sharedBody.body.setUserIndex2(2);
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
        if (this._isTrigger === v) { return; }

        if (this._isEnabled) {
            this._sharedBody.removeShape(this, !v);
            this._sharedBody.addShape(this, v);
        }
        this._isTrigger = v;
    }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get impl () { return this._btShape; }
    get collider (): Collider { return this._collider; }
    get sharedBody (): AmmoSharedBody { return this._sharedBody; }
    get index () { return this._index; }

    private static idCounter = 0;
    readonly id: number;
    readonly type: btBroadphaseNativeTypes;

    protected _index = -1;
    protected _isEnabled = false;
    protected _isBinding = false;
    protected _isTrigger = false;
    protected _sharedBody!: AmmoSharedBody;
    protected _btShape!: Bullet.ptr;
    protected _btCompound: number | null = null;
    protected _collider!: Collider;

    protected readonly transform: Bullet.ptr;
    protected readonly quat: Bullet.ptr;
    protected readonly scale: Bullet.ptr;

    constructor (type: btBroadphaseNativeTypes) {
        this.type = type;
        this.id = AmmoShape.idCounter++;
        this.quat = bt.Quat_new(0, 0, 0, 1);
        this.transform = bt.Transform_new();
        this.scale = bt.Vec3_new(1, 1, 1);
    }

    getAABB (v: AABB) {
        // const TRANS = AmmoConstant.instance.TRANSFORM;
        // bt.Transform_setIdentity(TRANS);
        // TRANS.setRotation(cocos2AmmoQuat(AmmoConstant.instance.QUAT_0, this._collider.node.worldRotation));
        // const MIN = AmmoConstant.instance.VECTOR3_0;
        // const MAX = AmmoConstant.instance.VECTOR3_1;
        // this._btShape.getAabb(TRANS, MIN, MAX);
        // v.halfExtents.set((MAX.x() - MIN.x()) / 2, (MAX.y() - MIN.y()) / 2, (MAX.z() - MIN.z()) / 2);
        // Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    getBoundingSphere (v: Sphere) {
        // v.radius = this._btShape.getLocalBoundingSphere();
        // Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    initialize (com: Collider) {
        this._collider = com;
        this._isBinding = true;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        this.setWrapper();
    }

    setWrapper () {
        if (AmmoConstant.isNotEmptyShape(this._btShape)) {
            // AmmoInstance.setWrapper(this);
            // this._btShape.setUserPointerAsInt(Ammo.getPointer(this._btShape));
            // const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
            // (shape as any).wrapped = this;
        }
    }

    // virtual
    protected onComponentSet () { }

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
        // this._btCompound = null;
        // (this._collider as any) = null;
        // const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
        // (shape as any).wrapped = null;
        // Ammo.destroy(this.quat);
        // Ammo.destroy(this.scale);
        // Ammo.destroy(this.transform);
        // if (AmmoConstant.isNotEmptyShape(this._btShape)) {
        //     AmmoInstance.delWrapper(this);
        //     Ammo.destroy(this._btShape);
        //     ammoDeletePtr(this._btShape, Ammo.btCollisionShape);
        // }
        // (this._btShape as any) = null;
        // (this.transform as any) = null;
        // (this.quat as any) = null;
        // (this.scale as any) = null;
    }

    updateByReAdd () {
        if (this._isEnabled) {
            this._sharedBody.removeShape(this, this._isTrigger);
            this._sharedBody.addShape(this, this._isTrigger);
        }
    }

    /** group mask */
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

    setCompound (compound: number | null) {
        if (this._btCompound) {
            bt.CompoundShape_removeChildShape(this._btCompound, this._btShape);
            this._index = -1;
        }
        if (compound) {
            this._index = bt.CompoundShape_getNumChildShapes(compound);
            bt.CompoundShape_addChildShape(compound, this.transform, this._btShape);
        }
        this._btCompound = compound;
    }

    updateScale () {
        this.setCenter(this._collider.center);
    }

    updateCompoundTransform () {
        if (this._btCompound) {
            bt.CompoundShape_updateChildTransform(this._btCompound, this.index, this.transform, true);
        } else if (this._isEnabled && !this._isTrigger) {
            if (this._sharedBody && !this._sharedBody.bodyStruct.useCompound) {
                this._sharedBody.dirty |= EBtSharedBodyDirty.BODY_RE_ADD;
            }
        }
    }

    needCompound () {
        if (this.type === btBroadphaseNativeTypes.TERRAIN_SHAPE_PROXYTYPE) { return true; }
        if (this._collider.center.equals(Vec3.ZERO)) { return false; }
        return true;
    }
}
