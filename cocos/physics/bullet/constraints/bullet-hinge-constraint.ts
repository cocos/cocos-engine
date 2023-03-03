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

/* eslint-disable new-cap */
import { BulletConstraint } from './bullet-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint, PhysicsSystem } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { BulletCache, CC_QUAT_0, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { cocos2BulletQuat, cocos2BulletVec3, force2Impulse } from '../bullet-utils';
import { toRadian } from '../../../core/math';

export class BulletHingeConstraint extends BulletConstraint implements IHingeConstraint {
    setPivotA (v: IVec3Like): void {
        this.updateFrames();
    }

    setPivotB (v: IVec3Like): void {
        this.updateFrames();
    }

    setAxis (v: IVec3Like) {
        this.updateFrames();
    }

    setLimitEnabled (v: boolean): void {
        const constraint = this.constraint;
        if (constraint.limitData.enabled) {
            bt.HingeConstraint_setLimit(this._impl, toRadian(constraint.lowerLimit), toRadian(constraint.upperLimit), 0.9, 0.3, 1.0);
        } else {
            bt.HingeConstraint_setLimit(this._impl, 1, 0, 0.9, 0.3, 1.0);
        }
    }
    setLowerLimit (min: number): void {
        const constraint = this.constraint;
        if (constraint.limitData.enabled) {
            bt.HingeConstraint_setLimit(this._impl, toRadian(constraint.lowerLimit), toRadian(constraint.upperLimit), 0.9, 0.3, 1.0);
        }
    }
    setUpperLimit (max: number): void {
        const constraint = this.constraint;
        if (constraint.limitData.enabled) {
            bt.HingeConstraint_setLimit(this._impl, toRadian(constraint.lowerLimit), toRadian(constraint.upperLimit), 0.9, 0.3, 1.0);
        }
    }
    setMotorEnabled (v: boolean): void {
        const motorData = this.constraint.motorData;
        bt.HingeConstraint_enableMotor(this._impl, v);
        const velocity = -motorData.motorVelocity * PhysicsSystem.instance.fixedTimeStep;
        const impulse = force2Impulse(motorData.motorForceLimit, PhysicsSystem.instance.fixedTimeStep);
        bt.HingeConstraint_setMotorVelocity(this._impl, velocity);
        bt.HingeConstraint_setMaxMotorImpulse(this._impl, impulse);
    }
    setMotorVelocity (v: number): void {
        if (this.constraint.motorData.enabled) {
            const velocity = -v * PhysicsSystem.instance.fixedTimeStep;
            bt.HingeConstraint_setMotorVelocity(this._impl, velocity);
        }
    }
    setMotorForceLimit (v: number): void {
        if (this.constraint.motorData.enabled) {
            const impulse = force2Impulse(v, PhysicsSystem.instance.fixedTimeStep);
            bt.HingeConstraint_setMaxMotorImpulse(this._impl, impulse);
        }
    }

    get constraint (): HingeConstraint {
        return this._com as HingeConstraint;
    }

    onComponentSet () {
        const cb = this.constraint.connectedBody;
        const bodyA = (this._rigidBody.body as BulletRigidBody).impl;
        const bodyB = cb ? (cb.body as BulletRigidBody).impl : bt.TypedConstraint_getFixedBody();
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        this._impl = bt.HingeConstraint_new(bodyA, bodyB, trans0, trans1);
        this.updateFrames();

        const motorData = this.constraint.motorData;
        const limitData = this.constraint.limitData;
        this.setLimitEnabled(limitData.enabled);
        this.setLowerLimit(limitData.lowerLimit);
        this.setUpperLimit(limitData.upperLimit);
        this.setMotorEnabled(motorData.enabled);
        this.setMotorVelocity(motorData.motorVelocity);
        this.setMotorForceLimit(motorData.motorForceLimit);
    }

    updateFrames () {
        const cs = this.constraint;
        const node = cs.node;
        const v3_0 = CC_V3_0;
        const rot_0 = CC_QUAT_0;
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
        cocos2BulletVec3(bt.Transform_getOrigin(trans0), v3_0);
        const quat = BulletCache.instance.BT_QUAT_0;
        Quat.rotationTo(rot_0, Vec3.UNIT_Z, cs.axis);
        cocos2BulletQuat(quat, rot_0);
        bt.Transform_setRotation(trans0, quat);

        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        const cb = this.constraint.connectedBody;
        if (cb) {
            Vec3.multiply(v3_0, cb.node.worldScale, cs.pivotB);
        } else {
            Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            Vec3.add(v3_0, v3_0, cs.pivotB);
            Quat.multiply(rot_0, rot_0, node.worldRotation);
        }
        cocos2BulletVec3(bt.Transform_getOrigin(trans1), v3_0);
        cocos2BulletQuat(quat, rot_0);
        bt.Transform_setRotation(trans1, quat);
        bt.HingeConstraint_setFrames(this._impl, trans0, trans1);
    }

    updateScale0 () {
        this.updateFrames();
    }

    updateScale1 () {
        this.updateFrames();
    }
}
