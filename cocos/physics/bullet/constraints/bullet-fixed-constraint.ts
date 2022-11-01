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

/* eslint-disable new-cap */
import { BulletConstraint } from './bullet-constraint';
import { IFixedConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Quat, Vec3, Mat4 } from '../../../core';
import { FixedConstraint, HingeConstraint, PhysicsSystem } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { BulletCache, CC_MAT4_0, CC_QUAT_0, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { bullet2CocosVec3, cocos2BulletQuat, cocos2BulletVec3 } from '../bullet-utils';
import { BulletWorld } from '../bullet-world';

export class BulletFixedConstraint extends BulletConstraint implements IFixedConstraint {
    setBreakForce (v: number): void {
        // bt.TypedConstraint_setMaxImpulseThreshold(this._impl, v);
    }

    setBreakTorque (v: number): void {
        // not supported
    }

    get constraint (): FixedConstraint {
        return this._com as FixedConstraint;
    }

    onComponentSet () {
        const cb = this.constraint.connectedBody;
        const bodyA = (this._rigidBody.body as BulletRigidBody).sharedBody;
        const bodyB = cb ? (cb.body as BulletRigidBody).sharedBody : (PhysicsSystem.instance.physicsWorld as BulletWorld).getSharedBody(bodyA.node);
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        this._impl = bt.FixedConstraint_new(bodyA.body, bodyB.body, trans0, trans1);
        this.setBreakForce(this.constraint.breakForce);
        this.setBreakTorque(this.constraint.breakTorque);
        this.updateFrames();
    }

    updateFrames () {
        const cb = this.constraint.connectedBody;
        const bodyA = (this._rigidBody.body as BulletRigidBody).sharedBody;
        const bodyB = cb ? (cb.body as BulletRigidBody).sharedBody : (PhysicsSystem.instance.physicsWorld as BulletWorld).getSharedBody(bodyA.node);

        const pos : Vec3 = CC_V3_0;
        const rot : Quat = CC_QUAT_0;
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;
        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        const quat = BulletCache.instance.BT_QUAT_0;

        const trans = CC_MAT4_0;
        Mat4.fromRT(trans, bodyA.node.worldRotation, bodyA.node.position);
        Mat4.invert(trans, trans);
        Mat4.getRotation(rot, trans);
        Mat4.getTranslation(pos, trans);
        cocos2BulletVec3(bt.Transform_getOrigin(trans0), pos);
        cocos2BulletQuat(quat, rot);
        bt.Transform_setRotation(trans0, quat);

        Mat4.fromRT(trans, bodyB.node.worldRotation, bodyB.node.position);
        Mat4.invert(trans, trans);
        Mat4.getRotation(rot, trans);
        Mat4.getTranslation(pos, trans);
        cocos2BulletVec3(bt.Transform_getOrigin(trans1), pos);
        cocos2BulletQuat(quat, rot);
        bt.Transform_setRotation(trans1, quat);

        bt.FixedConstraint_setFrames(this._impl, trans0, trans1);
    }

    updateScale0 () {
        this.updateFrames();
    }

    updateScale1 () {
        this.updateFrames();
    }
}
