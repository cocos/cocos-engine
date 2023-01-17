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
import { HingeConstraint } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { BulletCache, CC_QUAT_0, CC_QUAT_1, CC_V3_0 } from '../bullet-cache';
import { bt } from '../instantiated';
import { cocos2BulletQuat, cocos2BulletVec3 } from '../bullet-utils';

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
    }

    updateFrames () {
        const cs = this.constraint;
        const node = cs.node;
        const v3_0 = CC_V3_0;
        const rot_0 = CC_QUAT_0;
        const rot_1 = CC_QUAT_1;
        const trans0 = BulletCache.instance.BT_TRANSFORM_0;

        // offset of axis in local frame of bodyA
        Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
        cocos2BulletVec3(bt.Transform_getOrigin(trans0), v3_0);
        // rotation of axis in local frame of bodyA
        const quat = BulletCache.instance.BT_QUAT_0;
        Quat.rotationTo(rot_1, Vec3.UNIT_Z, cs.axis);
        cocos2BulletQuat(quat, rot_1);
        bt.Transform_setRotation(trans0, quat);

        const trans1 = BulletCache.instance.BT_TRANSFORM_1;
        const cb = this.constraint.connectedBody;
        if (cb) {
            // offset of axis in local frame of bodyB
            Vec3.multiply(v3_0, cb.node.worldScale, cs.pivotB);
            // rotation of axis in local frame of bodyB
            Quat.invert(rot_0, node.worldRotation);
            Quat.multiply(rot_1, rot_0, rot_1);
            Quat.multiply(rot_1, cb.node.worldRotation, rot_1);
        } else {
            // offset of axis in local frame of bodyB
            Quat.invert(rot_0, node.worldRotation);
            Vec3.multiply(v3_0, node.worldScale, cs.pivotB);
            Vec3.transformQuat(v3_0, v3_0, rot_0);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            // rotation of axis in local frame of bodyB
            Quat.multiply(rot_1, node.worldRotation, rot_1);
        }
        cocos2BulletVec3(bt.Transform_getOrigin(trans1), v3_0);
        cocos2BulletQuat(quat, rot_1);
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
