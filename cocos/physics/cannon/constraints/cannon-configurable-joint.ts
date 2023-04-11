/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import CANNON from '@cocos/cannon';
import { EConstraintMode, EDriverMode, FixedConstraint } from '../../framework';
import { IConfigurableConstraint } from '../../spec/i-physics-constraint';
import { CannonConstraint } from './cannon-constraint';
import { IVec3Like } from '../../../core';

export class CannonConfigurableJoint extends CannonConstraint implements IConfigurableConstraint {
    setAngularExtent (twist: number, swing1: number, swing2: number): void {}
    setConstraintMode (idx: number, v: EConstraintMode): void {}
    setLinearLimit (idx: number, lower: number, upper: number): void {}
    setLinearRestitution (v: number): void {}
    setSwingRestitution (v: number): void {}
    setTwistRestitution (v: number): void {}
    setLinearSoftConstraint (v: boolean): void {}
    setLinearStiffness (v: number): void {}
    setLinearDamping (v: number): void {}
    setSwingSoftConstraint (v: boolean): void {}
    setTwistSoftConstraint (v: boolean): void {}
    setSwingStiffness (v: number): void {}
    setSwingDamping (v: number): void {}
    setTwistStiffness (v: number): void {}
    setTwistDamping (v: number): void {}
    setDriverMode (idx: number, v: EDriverMode): void {}
    setLinearMotorTarget (v: IVec3Like): void {}
    setLinearMotorVelocity (v: IVec3Like): void {}
    setLinearMotorForceLimit (v: number): void {}
    setAngularMotorTarget (v: IVec3Like): void {}
    setAngularMotorVelocity (v: IVec3Like): void {}
    setAngularMotorForceLimit (v: number): void {}
    setPivotA (v: IVec3Like): void {}
    setPivotB (v: IVec3Like): void {}
    setAutoPivotB (v: boolean): void {}
    setAxis (v: IVec3Like): void {}
    setSecondaryAxis (v: IVec3Like): void {}

    setBreakForce (v: number): void {}
    setBreakTorque (v: number): void {}

    public get impl () {
        return this._impl as CANNON.LockConstraint;
    }

    get constraint (): FixedConstraint {
        return this._com as FixedConstraint;
    }

    onComponentSet (): void {
    }

    updateScale0 (): void {
    }

    updateScale1 (): void {
    }
}
