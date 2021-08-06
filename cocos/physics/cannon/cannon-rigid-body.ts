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

import CANNON from '@cocos/cannon';
import { Vec3 } from '../../core/math';
import { IRigidBody } from '../spec/i-rigid-body';
import { CannonSharedBody } from './cannon-shared-body';
import { CannonWorld } from './cannon-world';
import { PhysicsSystem } from '../framework/physics-system';
import { ERigidBodyType, RigidBody } from '../framework';
import { IVec3Like } from '../../core/math/type-define';

const v3_cannon0 = new CANNON.Vec3();
const v3_cannon1 = new CANNON.Vec3();

/**
 * wrapped shared body
 * dynamic
 * kinematic
 */
export class CannonRigidBody implements IRigidBody {
    get isAwake (): boolean {
        return this.impl.isAwake();
    }

    get isSleepy (): boolean {
        return this.impl.isSleepy();
    }

    get isSleeping (): boolean {
        return this.impl.isSleeping();
    }

    setAllowSleep (v: boolean) {
        if (this.impl.type !== CANNON.Body.DYNAMIC) return;
        this.impl.allowSleep = v;
        this._wakeUpIfSleep();
    }

    setMass (value: number) {
        if (this.impl.type !== CANNON.Body.DYNAMIC) return;
        this.impl.mass = value;
        this.impl.updateMassProperties();
        this._wakeUpIfSleep();
    }

    setType (v: ERigidBodyType) {
        switch (v) {
        case ERigidBodyType.DYNAMIC:
            this.impl.type = CANNON.Body.DYNAMIC;
            this.impl.allowSleep = this._rigidBody.allowSleep;
            this.setMass(this._rigidBody.mass);
            break;
        case ERigidBodyType.KINEMATIC:
            this.impl.type = CANNON.Body.KINEMATIC;
            this.impl.mass = 0;
            this.impl.allowSleep = false;
            this.impl.sleepState = CANNON.Body.AWAKE;
            this.impl.updateMassProperties();
            break;
        case ERigidBodyType.STATIC:
        default:
            this.impl.type = CANNON.Body.STATIC;
            this.impl.mass = 0;
            this.impl.allowSleep = true;
            this.impl.updateMassProperties();
            this.clearState();
            break;
        }
    }

    setLinearDamping (value: number) {
        this.impl.linearDamping = value;
    }

    setAngularDamping (value: number) {
        this.impl.angularDamping = value;
    }

    useGravity (value: boolean) {
        this.impl.useGravity = value;
        this._wakeUpIfSleep();
    }

    useCCD (value:boolean) {
        this.impl.ccdSpeedThreshold = value ? 0.01 : -1;
    }

    isUsingCCD () {
        return this.impl.ccdSpeedThreshold !== -1;
    }

    setLinearFactor (value: IVec3Like) {
        Vec3.copy(this.impl.linearFactor, value);
        this._wakeUpIfSleep();
    }

    setAngularFactor (value: IVec3Like) {
        Vec3.copy(this.impl.angularFactor, value);
        const fixR = Vec3.equals(this.impl.angularFactor, Vec3.ZERO);
        if (fixR !== this.impl.fixedRotation) {
            this.impl.fixedRotation = fixR;
            this.impl.updateMassProperties();
        }
        this._wakeUpIfSleep();
    }

    get impl () {
        return this._sharedBody.body;
    }

    get rigidBody () {
        return this._rigidBody;
    }

    get sharedBody () {
        return this._sharedBody;
    }

    get isEnabled () {
        return this._isEnabled;
    }

    private _rigidBody!: RigidBody;
    private _sharedBody!: CannonSharedBody;

    private _isEnabled = false;

    /** LIFECYCLE */

    initialize (com: RigidBody) {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._rigidBody.node, this);
        this._sharedBody.reference = true;
        this._sharedBody.wrappedBody = this;
    }

    onLoad () {
    }

    onEnable () {
        this._isEnabled = true;
        this.setType(this._rigidBody.type);
        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.useGravity(this._rigidBody.useGravity);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    /** INTERFACE */

    clearVelocity (): void {
        this.impl.velocity.setZero();
        this.impl.angularVelocity.setZero();
    }

    clearForces (): void {
        this.impl.force.setZero();
        this.impl.torque.setZero();
    }

    clearState (): void {
        this.clearVelocity();
        this.clearForces();
    }

    wakeUp (): void {
        return this.impl.wakeUp();
    }

    sleep (): void {
        return this.impl.sleep();
    }

    setSleepThreshold (v: number) {
        this.impl.sleepSpeedLimit = v;
        this._wakeUpIfSleep();
    }

    getSleepThreshold () {
        return this.impl.sleepSpeedLimit;
    }

    getLinearVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this.impl.velocity);
        return out;
    }

    setLinearVelocity (value: Vec3): void {
        this._wakeUpIfSleep();
        Vec3.copy(this.impl.velocity, value);
    }

    getAngularVelocity (out: Vec3): Vec3 {
        Vec3.copy(out, this.impl.angularVelocity);
        return out;
    }

    setAngularVelocity (value: Vec3): void {
        this._wakeUpIfSleep();
        Vec3.copy(this.impl.angularVelocity, value);
    }

    applyForce (force: Vec3, worldPoint?: Vec3) {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        if (worldPoint == null) worldPoint = Vec3.ZERO as Vec3;
        this.impl.applyForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, worldPoint));
    }

    applyImpulse (impulse: Vec3, worldPoint?: Vec3) {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        if (worldPoint == null) worldPoint = Vec3.ZERO as Vec3;
        this.impl.applyImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, worldPoint));
    }

    applyLocalForce (force: Vec3, localPoint?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        if (localPoint == null) localPoint = Vec3.ZERO as Vec3;
        this.impl.applyLocalForce(Vec3.copy(v3_cannon0, force), Vec3.copy(v3_cannon1, localPoint));
    }

    applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        if (localPoint == null) localPoint = Vec3.ZERO as Vec3;
        this.impl.applyLocalImpulse(Vec3.copy(v3_cannon0, impulse), Vec3.copy(v3_cannon1, localPoint));
    }

    applyTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        Vec3.add(this.impl.torque, this.impl.torque, torque);
    }

    applyLocalTorque (torque: Vec3): void {
        this._sharedBody.syncSceneToPhysics();
        this._wakeUpIfSleep();
        Vec3.copy(v3_cannon0, torque);
        this.impl.vectorToWorldFrame(v3_cannon0, v3_cannon0);
        Vec3.add(this.impl.torque, this.impl.torque, v3_cannon0);
    }

    /** group */
    getGroup (): number {
        return this.impl.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this.impl.collisionFilterGroup = v;
        this._wakeUpIfSleep();
    }

    addGroup (v: number): void {
        this.impl.collisionFilterGroup |= v;
        this._wakeUpIfSleep();
    }

    removeGroup (v: number): void {
        this.impl.collisionFilterGroup &= ~v;
        this._wakeUpIfSleep();
    }

    /** mask */
    getMask (): number {
        return this.impl.collisionFilterMask;
    }

    setMask (v: number): void {
        this.impl.collisionFilterMask = v;
        this._wakeUpIfSleep();
    }

    addMask (v: number): void {
        this.impl.collisionFilterMask |= v;
        this._wakeUpIfSleep();
    }

    removeMask (v: number): void {
        this.impl.collisionFilterMask &= ~v;
        this._wakeUpIfSleep();
    }

    protected _wakeUpIfSleep () {
        if (!this.impl.isAwake()) this.impl.wakeUp();
    }
}
