/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { IVec3Like } from "../../../value-types/math";
import { RigidBody3D } from '../framework/components/rigid-body-component';

/**
 * Rigid body interface
 * @class IRigidBody
 */
export interface IRigidBody {
    /**
     * @property {RigidBody3D} rigidBody
     */
    rigidBody: RigidBody3D;

    /**
     * @property {number} mass
     */
    mass: number;
    /**
     * @property {number} linearDamping
     */
    linearDamping: number;
    /**
     * @property {number} angularDamping
     */
    angularDamping: number;
    /**
     * @property {boolean} isKinematic
     */
    isKinematic: boolean;
    /**
     * @property {boolean} useGravity
     */
    useGravity: boolean;
    /**
     * @property {boolean} fixedRotation
     */
    fixedRotation: boolean;
    /**
     * @property {IVec3Like} linearFactor
     */
    linearFactor: IVec3Like;
    /**
     * @property {IVec3Like} angularFactor
     */
    angularFactor: IVec3Like;
    /**
     * @property {boolean} allowSleep
     */
    allowSleep: boolean;
    /**
     * @property {boolean} isAwake
     * @readonly
     */
    readonly isAwake: boolean;
    /**
     * @property {boolean} isSleepy
     * @readonly
     */
    readonly isSleepy: boolean;
    /**
     * @property {boolean} isSleeping
     * @readonly
     */
    readonly isSleeping: boolean;

    /**
     * @method wakeUp
     */
    wakeUp (): void;
    /**
     * @method sleep
     */
    sleep (): void;

    /**
     * @method getLinearVelocity
     * @param {IVec3Like} out
     */
    getLinearVelocity (out: IVec3Like): void;
    /**
     * @method setLinearVelocity
     * @param {IVec3Like} out
     */
    setLinearVelocity (value: IVec3Like): void;
    /**
     * @method getAngularVelocity
     * @param {IVec3Like} out
     */
    getAngularVelocity (out: IVec3Like): void;
    /**
     * @method setAngularVelocity
     * @param {IVec3Like} out
     */
    setAngularVelocity (value: IVec3Like): void;

    /**
     * @method applyForce
     * @param {IVec3Like} force
     * @param {IVec3Like} relativePoint
     */
    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    /**
     * @method applyLocalForce
     * @param {IVec3Like} force
     * @param {IVec3Like} relativePoint
     */
    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    /**
     * @method applyImpulse
     * @param {IVec3Like} force
     * @param {IVec3Like} relativePoint
     */
    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    /**
     * @method applyLocalImpulse
     * @param {IVec3Like} force
     * @param {IVec3Like} relativePoint
     */
    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    /**
     * @method applyTorque
     * @param {IVec3Like} torque
     */
    applyTorque (torque: IVec3Like): void;
    /**
     * @method applyLocalTorque
     * @param {IVec3Like} torque
     */
    applyLocalTorque (torque: IVec3Like): void;
}