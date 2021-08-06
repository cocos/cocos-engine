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

import Ammo from './instantiated';
import { Vec3, Node } from '../../core';
import { AmmoWorld } from './ammo-world';
import { cocos2AmmoVec3, ammo2CocosVec3 } from './ammo-util';
import { RigidBody, PhysicsSystem } from '../../../exports/physics-framework';
import { AmmoCollisionFlags, AmmoRigidBodyFlags, AmmoCollisionObjectStates, EAmmoSharedBodyDirty } from './ammo-enum';
import { IRigidBody } from '../spec/i-rigid-body';
import { ERigidBodyType } from '../framework/physics-enum';
import { AmmoSharedBody } from './ammo-shared-body';
import { IVec3Like } from '../../core/math/type-define';
import { AmmoConstant, CC_V3_0, CC_V3_1 } from './ammo-const';

const v3_0 = CC_V3_0;
const v3_1 = CC_V3_1;

export class AmmoRigidBody implements IRigidBody {
    get isAwake (): boolean {
        const state = this.impl.getActivationState();
        return state === AmmoCollisionObjectStates.ACTIVE_TAG
            || state === AmmoCollisionObjectStates.DISABLE_DEACTIVATION;
    }

    get isSleepy (): boolean {
        const state = this.impl.getActivationState();
        return state === AmmoCollisionObjectStates.WANTS_DEACTIVATION;
    }

    get isSleeping (): boolean {
        const state = this.impl.getActivationState();
        return state === AmmoCollisionObjectStates.ISLAND_SLEEPING;
    }

    setMass (value: number) {
        if (!this._rigidBody.isDynamic) return;
        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        const localInertia = this._sharedBody.bodyStruct.localInertia;
        localInertia.setValue(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        const shape = this.impl.getCollisionShape();
        if (shape.isCompound()) {
            if (this._sharedBody.bodyCompoundShape.getNumChildShapes() > 0) {
                shape.calculateLocalInertia(this._rigidBody.mass, localInertia);
            }
        } else {
            shape.calculateLocalInertia(this._rigidBody.mass, localInertia);
        }
        this.impl.setMassProps(value, localInertia);
        this._wakeUpIfSleep();
        this._sharedBody.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
    }

    setType (v: ERigidBodyType) {
        this._sharedBody.setType(v);
    }

    setLinearDamping (value: number) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
    }

    setAngularDamping (value: number) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
    }

    useGravity (value: boolean) {
        if (!this._rigidBody.isDynamic) return;
        let m_rigidBodyFlag = this.impl.getFlags();
        if (value) {
            m_rigidBodyFlag &= (~AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY);
        } else {
            this.impl.setGravity(cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, Vec3.ZERO));
            m_rigidBodyFlag |= AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        }
        this.impl.setFlags(m_rigidBodyFlag);
        this._wakeUpIfSleep();
        this._sharedBody.dirty |= EAmmoSharedBodyDirty.BODY_RE_ADD;
    }

    useCCD (value:boolean) {
        this.impl.setCcdMotionThreshold(value ? 0.01 : 0);
        this.impl.setCcdSweptSphereRadius(value ? 0.1 : 0);
        this._isUsingCCD = value;
    }

    isUsingCCD () {
        return this._isUsingCCD;
    }

    setLinearFactor (value: IVec3Like) {
        this.impl.setLinearFactor(cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, value));
        this._wakeUpIfSleep();
    }

    setAngularFactor (value: IVec3Like) {
        this.impl.setAngularFactor(cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, value));
        this._wakeUpIfSleep();
    }

    setAllowSleep (v: boolean) {
        if (!this._rigidBody.isDynamic) return;
        if (v) {
            this.impl.forceActivationState(AmmoCollisionObjectStates.ACTIVE_TAG);
        } else {
            this.impl.forceActivationState(AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        }
        this._wakeUpIfSleep();
    }

    get isEnabled () { return this._isEnabled; }
    get impl () { return this._sharedBody.body; }
    get rigidBody () { return this._rigidBody; }
    get sharedBody () { return this._sharedBody; }

    private static idCounter = 0;
    readonly id: number;

    private _isEnabled = false;
    private _isUsingCCD = false;
    private _sharedBody!: AmmoSharedBody;
    private _rigidBody!: RigidBody;

    constructor () {
        this.id = AmmoRigidBody.idCounter++;
    }

    clearState (): void {
        this.impl.clearState();
    }

    clearVelocity (): void {
        this.setLinearVelocity(Vec3.ZERO);
        this.setAngularVelocity(Vec3.ZERO);
    }

    clearForces (): void {
        this.impl.clearForces();
    }

    /** LIFECYCLE */

    initialize (com: RigidBody) {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._rigidBody.node, this);
        this._sharedBody.reference = true;
    }

    onEnable () {
        this._isEnabled = true;
        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this.useGravity(this._rigidBody.useGravity);
        this._sharedBody.bodyEnabled = true;
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.bodyEnabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    /** INTERFACE */

    wakeUp (force = true): void {
        this.impl.activate(force);
    }

    sleep (): any {
        return this.impl.wantsSleeping();
    }

    setSleepThreshold (v: number): void {
        this._wakeUpIfSleep();
        this.impl.setSleepingThresholds(v, v);
    }

    getSleepThreshold (): number {
        return this.impl.getLinearSleepingThreshold();
    }

    getLinearVelocity (out: Vec3): Vec3 {
        return ammo2CocosVec3(out, this.impl.getLinearVelocity());
    }

    setLinearVelocity (value: Readonly<Vec3>): void {
        this._wakeUpIfSleep();
        cocos2AmmoVec3(this.impl.getLinearVelocity(), value);
    }

    getAngularVelocity (out: Vec3): Vec3 {
        return ammo2CocosVec3(out, this.impl.getAngularVelocity());
    }

    setAngularVelocity (value: Readonly<Vec3>): void {
        this._wakeUpIfSleep();
        cocos2AmmoVec3(this.impl.getAngularVelocity(), value);
    }

    applyLocalForce (force: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        const quat = this._sharedBody.node.worldRotation;
        const v = Vec3.transformQuat(v3_0, force, quat);
        const rp = rel_pos ? Vec3.transformQuat(v3_1, rel_pos, quat) : Vec3.ZERO;
        this.impl.applyForce(
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, v),
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_1, rp),
        );
    }

    applyLocalTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        Vec3.transformQuat(v3_0, torque, this._sharedBody.node.worldRotation);
        this.impl.applyTorque(cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, v3_0));
    }

    applyLocalImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        const quat = this._sharedBody.node.worldRotation;
        const v = Vec3.transformQuat(v3_0, impulse, quat);
        const rp = rel_pos ? Vec3.transformQuat(v3_1, rel_pos, quat) : Vec3.ZERO;
        this.impl.applyImpulse(
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, v),
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_1, rp),
        );
    }

    applyForce (force: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        const rp = rel_pos || Vec3.ZERO;
        this.impl.applyForce(
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, force),
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_1, rp),
        );
    }

    applyTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        this.impl.applyTorque(cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, torque));
    }

    applyImpulse (impulse: Vec3, rel_pos?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        const rp = rel_pos || Vec3.ZERO;
        this.impl.applyImpulse(
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_0, impulse),
            cocos2AmmoVec3(AmmoConstant.instance.VECTOR3_1, rp),
        );
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

    protected _wakeUpIfSleep () {
        if (!this.isAwake) this.impl.activate(true);
    }
}
