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

import { IRigidBody } from '../spec/i-rigid-body';
import { IVec3Like } from '../../core';
import { RigidBody, PhysicsSystem, ERigidBodyType } from '../framework';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltInWorld } from './builtin-world';

export class BuiltinRigidBody implements IRigidBody {
    get impl () { return this; }
    get isAwake () { return true; }
    get isSleepy () { return false; }
    get isSleeping () { return false; }

    get rigidBody () { return this._rigidBody; }
    get sharedBody () { return this._sharedBody; }

    private _rigidBody!: RigidBody;
    protected _sharedBody!: BuiltinSharedBody;

    initialize (com: RigidBody): void {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BuiltInWorld).getSharedBody(this._rigidBody.node, this);
        this._sharedBody.reference = true;
    }

    onEnable () {
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    setMass (v: number) { }
    setType (v: ERigidBodyType) { }
    setLinearDamping (v: number) { }
    setAngularDamping (v: number) { }
    useGravity (v: boolean) { }
    useCCD (v: boolean) { }
    isUseCCD () { return false; }
    setLinearFactor (v: IVec3Like) { }
    setAngularFactor (v: IVec3Like) { }
    setAllowSleep (v: boolean) { }
    wakeUp (): void { }
    sleep (): void { }
    clearState (): void { }
    clearForces (): void { }
    clearVelocity (): void { }
    setSleepThreshold (v: number): void { }
    getSleepThreshold (): number { return 0; }
    getLinearVelocity (out: IVec3Like): void { }
    setLinearVelocity (value: IVec3Like): void { }
    getAngularVelocity (out: IVec3Like): void { }
    setAngularVelocity (value: IVec3Like): void { }
    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyTorque (torque: IVec3Like): void { }
    applyLocalTorque (torque: IVec3Like): void { }

    setGroup (v: number): void {
        this._sharedBody.setGroup(v);
    }
    getGroup (): number {
        return this._sharedBody.getGroup();
    }
    addGroup (v: number): void {
        this._sharedBody.addGroup(v);
    }
    removeGroup (v: number): void {
        this._sharedBody.removeGroup(v);
    }
    setMask (v: number): void {
        this._sharedBody.setMask(v);
    }
    getMask (): number {
        return this._sharedBody.getMask();
    }
    addMask (v: number): void {
        this._sharedBody.addMask(v);
    }
    removeMask (v: number): void {
        this._sharedBody.removeMask(v);
    }
}
