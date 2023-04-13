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

import { ConfigurableConstraint, EConstraintMode, EDriverMode } from '../../framework';
import { IConfigurableConstraint } from '../../spec/i-physics-constraint';
import { CannonConstraint } from './cannon-constraint';
import { IVec3Like, errorID } from '../../../core';

const err = 9613;
export class CannonConfigurableJoint extends CannonConstraint implements IConfigurableConstraint {
    setAngularExtent (twist: number, swing1: number, swing2: number): void {
        errorID(err);
    }
    setConstraintMode (idx: number, v: EConstraintMode): void {
        errorID(err);
    }
    setLinearLimit (idx: number, lower: number, upper: number): void {
        errorID(err);
    }
    setLinearRestitution (v: number): void {
        errorID(err);
    }
    setSwingRestitution (v: number): void {
        errorID(err);
    }
    setTwistRestitution (v: number): void {
        errorID(err);
    }
    setLinearSoftConstraint (v: boolean): void {
        errorID(err);
    }
    setLinearStiffness (v: number): void {
        errorID(err);
    }
    setLinearDamping (v: number): void {
        errorID(err);
    }
    setSwingSoftConstraint (v: boolean): void {
        errorID(err);
    }
    setTwistSoftConstraint (v: boolean): void {
        errorID(err);
    }
    setSwingStiffness (v: number): void {
        errorID(err);
    }
    setSwingDamping (v: number): void {
        errorID(err);
    }
    setTwistStiffness (v: number): void {
        errorID(err);
    }
    setTwistDamping (v: number): void {
        errorID(err);
    }
    setDriverMode (idx: number, v: EDriverMode): void {
        errorID(err);
    }
    setLinearMotorTarget (v: IVec3Like): void {
        errorID(err);
    }
    setLinearMotorVelocity (v: IVec3Like): void {
        errorID(err);
    }
    setLinearMotorForceLimit (v: number): void {
        errorID(err);
    }
    setAngularMotorTarget (v: IVec3Like): void {
        errorID(err);
    }
    setAngularMotorVelocity (v: IVec3Like): void {
        errorID(err);
    }
    setAngularMotorForceLimit (v: number): void {
        errorID(err);
    }
    setPivotA (v: IVec3Like): void {
        errorID(err);
    }
    setPivotB (v: IVec3Like): void {
        errorID(err);
    }
    setAutoPivotB (v: boolean): void {
        errorID(err);
    }
    setAxis (v: IVec3Like): void {
        errorID(err);
    }
    setSecondaryAxis (v: IVec3Like): void {
        errorID(err);
    }

    setBreakForce (v: number): void {
        errorID(err);
    }
    setBreakTorque (v: number): void {
        errorID(err);
    }

    public get impl () {
        errorID(err);
        return this._impl;
    }

    get constraint (): ConfigurableConstraint {
        errorID(err);
        return this._com as ConfigurableConstraint;
    }

    onComponentSet (): void {
        errorID(err);
    }

    updateScale0 (): void {
        errorID(err);
    }

    updateScale1 (): void {
        errorID(err);
    }
}
