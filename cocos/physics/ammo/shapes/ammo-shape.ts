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
import { Vec3, Quat } from '../../../core/math';
import { Collider, PhysicsMaterial, PhysicsSystem } from '../../../../exports/physics-framework';
import { AmmoWorld } from '../ammo-world';
import { AmmoBroadphaseNativeTypes, EAmmoSharedBodyDirty } from '../ammo-enum';
import { cocos2AmmoVec3, ammoDeletePtr, cocos2AmmoQuat } from '../ammo-util';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoSharedBody } from '../ammo-shared-body';
import { AABB, Sphere } from '../../../core/geometry';
import { AmmoConstant, CC_V3_0 } from '../ammo-const';

const v3_0 = CC_V3_0;

export class AmmoShape implements IBaseShape {
    updateEventListener (): void { }

    setMaterial (v: PhysicsMaterial | null) {
        if (!this._isTrigger && this._isEnabled && v) {
            if (this._btCompound) {
                this._btCompound.setMaterial(this._index, v.friction, v.restitution, v.rollingFriction, v.spinningFriction, 2);
            } else {
                this._sharedBody.body.setFriction(v.friction);
                this._sharedBody.body.setRestitution(v.restitution);
                this._sharedBody.body.setRollingFriction(v.rollingFriction);
                this._sharedBody.body.setSpinningFriction(v.spinningFriction);
                this._sharedBody.body.setUserIndex2(2);
            }
        }
    }

    setCenter (v: IVec3Like) {
        Vec3.copy(v3_0, v);
        v3_0.multiply(this._collider.node.worldScale);
        cocos2AmmoVec3(this.transform.getOrigin(), v3_0);
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
    readonly type: AmmoBroadphaseNativeTypes;

    protected _index = -1;
    protected _isEnabled = false;
    protected _isBinding = false;
    protected _isTrigger = false;
    protected _sharedBody!: AmmoSharedBody;
    protected _btShape!: Ammo.btCollisionShape;
    protected _btCompound: Ammo.btCompoundShape | null = null;
    protected _collider!: Collider;

    protected readonly transform: Ammo.btTransform;
    protected readonly quat: Ammo.btQuaternion;
    protected readonly scale: Ammo.btVector3;

    constructor (type: AmmoBroadphaseNativeTypes) {
        this.type = type;
        this.id = AmmoShape.idCounter++;
        this.quat = new Ammo.btQuaternion();
        this.transform = new Ammo.btTransform();
        this.transform.setIdentity();
        this.scale = new Ammo.btVector3(1, 1, 1);
    }

    getAABB (v: AABB) {
        const TRANS = AmmoConstant.instance.TRANSFORM;
        TRANS.setIdentity();
        TRANS.setRotation(cocos2AmmoQuat(AmmoConstant.instance.QUAT_0, this._collider.node.worldRotation));
        const MIN = AmmoConstant.instance.VECTOR3_0;
        const MAX = AmmoConstant.instance.VECTOR3_1;
        this._btShape.getAabb(TRANS, MIN, MAX);
        v.halfExtents.set((MAX.x() - MIN.x()) / 2, (MAX.y() - MIN.y()) / 2, (MAX.z() - MIN.z()) / 2);
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    getBoundingSphere (v: Sphere) {
        v.radius = this._btShape.getLocalBoundingSphere();
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    initialize (com: Collider) {
        this._collider = com;
        this._isBinding = true;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        this.setWrapper();
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
        this._btCompound = null;
        (this._collider as any) = null;
        const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
        (shape as any).wrapped = null;
        Ammo.destroy(this.quat);
        Ammo.destroy(this.scale);
        Ammo.destroy(this.transform);
        if (this._btShape !== AmmoConstant.instance.EMPTY_SHAPE) {
            Ammo.destroy(this._btShape);
            ammoDeletePtr(this._btShape, Ammo.btCollisionShape);
        }
        (this._btShape as any) = null;
        (this.transform as any) = null;
        (this.quat as any) = null;
        (this.scale as any) = null;
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

    setCompound (compound: Ammo.btCompoundShape | null) {
        if (this._btCompound) {
            this._btCompound.removeChildShape(this._btShape);
            this._index = -1;
        }
        if (compound) {
            this._index = compound.getNumChildShapes();
            compound.addChildShape(this.transform, this._btShape);
        }
        this._btCompound = compound;
    }

    setWrapper () {
        const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
        (shape as any).wrapped = this;
    }

    setScale () {
        this.setCenter(this._collider.center);
    }

    updateCompoundTransform () {
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        } else if (this._isEnabled && !this._isTrigger) {
            if (this._sharedBody && !this._sharedBody.bodyStruct.useCompound) {
                this._sharedBody.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
            }
        }
    }

    needCompound () {
        if (this.type === AmmoBroadphaseNativeTypes.TERRAIN_SHAPE_PROXYTYPE) { return true; }
        if (this._collider.center.equals(Vec3.ZERO)) { return false; }
        return true;
    }

    /** DEBUG */
    private static _debugTransform: Ammo.btTransform | null;
    debugTransform (n: Node) {
        if (AmmoShape._debugTransform == null) {
            AmmoShape._debugTransform = new Ammo.btTransform();
        }
        let wt: Ammo.btTransform;
        if (this._isTrigger) {
            wt = this._sharedBody.ghost.getWorldTransform();
        } else {
            wt = this._sharedBody.body.getWorldTransform();
        }
        const lt = this.transform;
        AmmoShape._debugTransform.setIdentity();
        AmmoShape._debugTransform.op_mul(wt).op_mul(lt);
        const origin = AmmoShape._debugTransform.getOrigin();
        n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        const rotation = AmmoShape._debugTransform.getRotation();
        n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        const scale = this.impl.getLocalScaling();
        n.scale = new Vec3(scale.x(), scale.y(), scale.z());
    }
}
