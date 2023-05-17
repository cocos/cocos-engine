/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { IVec2Like, Vec2 } from '../../core';
import { RigidBody2D } from '../framework/components/rigid-body-2d';
import { ERigidBody2DType } from '../framework/physics-types';

export interface IRigidBody2D extends ILifecycle {
    readonly impl: any;
    readonly rigidBody: RigidBody2D;
    readonly isAwake: boolean;
    readonly isSleeping: boolean;

    initialize (v: RigidBody2D): void;

    setType (v: ERigidBody2DType): void;

    setLinearDamping: (v: number) => void;
    setAngularDamping: (v: number) => void;
    setGravityScale: (v: number) => void;
    setFixedRotation: (v: boolean) => void;
    setAllowSleep: (v: boolean) => void;

    isActive: () => boolean;
    setActive: (v: boolean) => void;

    wakeUp (): void;
    sleep (): void;

    getMass (): number;
    getInertia (): number;

    getLinearVelocity<Out extends IVec2Like> (out: Out): Out;
    setLinearVelocity (value: IVec2Like): void;
    getLinearVelocityFromWorldPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out;
    getAngularVelocity (): number;
    setAngularVelocity (value: number): void;

    getLocalVector<Out extends IVec2Like> (worldVector: IVec2Like, out: Out): Out;
    getWorldVector<Out extends IVec2Like> (localVector: IVec2Like, out: Out): Out;
    getLocalPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out;
    getWorldPoint<Out extends IVec2Like> (localPoint: IVec2Like, out: Out): Out;
    getLocalCenter<Out extends IVec2Like> (out: Out): Out;
    getWorldCenter<Out extends IVec2Like> (out: Out): Out;

    applyForce (force: Vec2, point: Vec2, wake: boolean)
    applyForceToCenter (force: Vec2, wake: boolean)
    applyTorque (torque: number, wake: boolean)
    applyLinearImpulse (impulse: Vec2, point: Vec2, wake: boolean)
    applyLinearImpulseToCenter (impulse: Vec2, wake: boolean)
    applyAngularImpulse (impulse: number, wake: boolean)
}
