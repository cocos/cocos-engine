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

export interface IRigidBody {
    rigidBody: RigidBody3D;

    mass: number;
    linearDamping: number;
    angularDamping: number;
    isKinematic: boolean;
    useGravity: boolean;
    fixedRotation: boolean;
    linearFactor: IVec3Like;
    angularFactor: IVec3Like;
    allowSleep: boolean;
    readonly isAwake: boolean;
    readonly isSleepy: boolean;
    readonly isSleeping: boolean;

    wakeUp (): void;
    sleep (): void;

    getLinearVelocity (out: IVec3Like): void;
    setLinearVelocity (value: IVec3Like): void;
    getAngularVelocity (out: IVec3Like): void;
    setAngularVelocity (value: IVec3Like): void;

    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyTorque (torque: IVec3Like): void;
    applyLocalTorque (torque: IVec3Like): void;
}