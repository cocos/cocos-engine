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



import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { HingeConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';
import { IVec3Like, Vec3 } from '../../../core';

const v3_0 = new Vec3();

export class CannonHingeConstraint extends CannonConstraint implements IHingeConstraint {
    public get impl () {
        return this._impl as CANNON.HingeConstraint;
    }

    public get constraint () {
        return this._com as HingeConstraint;
    }

    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        Vec3.multiply(this.impl.pivotA, this.constraint.node.worldScale, cs.pivotA);
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        if (cb) {
            Vec3.multiply(this.impl.pivotB, cb.node.worldScale, cs.pivotB);
        } else {
            const node = this.constraint.node;
            Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            Vec3.add(v3_0, v3_0, cs.pivotB);
            Vec3.copy(this.impl.pivotB, v3_0);
        }
    }

    setAxis (v: IVec3Like): void {
        Vec3.copy(this.impl.axisA, v);
        Vec3.copy((this.impl.equations[3] as CANNON.RotationalEquation).axisA, v);
        Vec3.copy((this.impl.equations[4] as CANNON.RotationalEquation).axisA, v);
        Vec3.copy((this.impl.equations[5] as CANNON.RotationalMotorEquation).axisA, v);
        if (this.constraint.connectedBody) {
            Vec3.copy(this.impl.axisB, v);
            Vec3.copy((this.impl.equations[3] as CANNON.RotationalEquation).axisB, v);
            Vec3.copy((this.impl.equations[4] as CANNON.RotationalEquation).axisB, v);
            Vec3.copy((this.impl.equations[5] as CANNON.RotationalMotorEquation).axisB, v);
        } else {
            Vec3.transformQuat(this.impl.axisB, v, this.constraint.node.worldRotation);
            Vec3.copy((this.impl.equations[3] as CANNON.RotationalEquation).axisB, this.impl.axisB);
            Vec3.copy((this.impl.equations[4] as CANNON.RotationalEquation).axisB, this.impl.axisB);
            Vec3.copy((this.impl.equations[5] as CANNON.RotationalMotorEquation).axisB, this.impl.axisB);
        }
    }

    onComponentSet () {
        const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
        const cb = this.constraint.connectedBody;
        let bodyB: CANNON.Body = (CANNON.World as any).staticBody;
        if (cb) {
            bodyB = (cb.body as CannonRigidBody).impl;
        }
        this._impl = new CANNON.HingeConstraint(bodyA, bodyB);
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
        this.setAxis(this.constraint.axis);
    }

    updateScale0 () {
        this.setPivotA(this.constraint.pivotA);
    }

    updateScale1 () {
        this.setPivotB(this.constraint.pivotB);
    }
}
