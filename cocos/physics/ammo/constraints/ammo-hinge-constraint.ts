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

/* eslint-disable new-cap */
import { AmmoConstraint } from './ammo-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { AmmoRigidBody } from '../ammo-rigid-body';
import { AmmoConstant, CC_QUAT_0, CC_V3_0 } from '../ammo-const';

export class AmmoHingeConstraint extends AmmoConstraint implements IHingeConstraint {
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
        // const sb0 = (this._rigidBody.body as AmmoRigidBody).sharedBody;
        // const cb = this.constraint.connectedBody;
        // const bodyB = cb ? (cb.body as AmmoRigidBody).impl : (sb0.wrappedWorld.impl as any).getFixedBody();
        // const trans0 = AmmoConstant.instance.TRANSFORM;
        // const trans1 = AmmoConstant.instance.TRANSFORM_1;
        // this._impl = new Ammo.btHingeConstraint(sb0.body, bodyB, trans0, trans1);
        // this.updateFrames();
    }

    updateFrames () {
        // const cs = this.constraint;
        // const node = cs.node;
        // const v3_0 = CC_V3_0;
        // const rot_0 = CC_QUAT_0;
        // const trans0 = AmmoConstant.instance.TRANSFORM;
        // Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
        // cocos2AmmoVec3(trans0.getOrigin(), v3_0);
        // const quat = AmmoConstant.instance.QUAT_0;
        // Quat.rotationTo(rot_0, Vec3.UNIT_Z, cs.axis);
        // trans0.setRotation(cocos2AmmoQuat(quat, rot_0));

        // const trans1 = AmmoConstant.instance.TRANSFORM_1;
        // const cb = this.constraint.connectedBody;
        // if (cb) {
        //     Vec3.multiply(v3_0, cb.node.worldScale, cs.pivotB);
        // } else {
        //     Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
        //     Vec3.add(v3_0, v3_0, node.worldPosition);
        //     Vec3.add(v3_0, v3_0, cs.pivotB);
        //     Quat.multiply(rot_0, rot_0, node.worldRotation);
        // }
        // cocos2AmmoVec3(trans1.getOrigin(), v3_0);
        // trans1.setRotation(cocos2AmmoQuat(quat, rot_0));
        // (this.impl as any).setFrames(trans0, trans1);
    }

    updateScale0 () {
        this.updateFrames();
    }

    updateScale1 () {
        this.updateFrames();
    }
}
