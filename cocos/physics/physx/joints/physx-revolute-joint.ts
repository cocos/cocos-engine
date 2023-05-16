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

import { IVec3Like, Mat4, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { getTempTransform, PX, _pxtrans, _trans } from '../physx-adapter';
import { PhysXJoint } from './physx-joint';

const v3_0 = new Vec3();
const v3_1 = new Vec3();
const v3_2 = new Vec3();
const mat_0 = new Mat4();

export class PhysXRevoluteJoint extends PhysXJoint implements IHingeConstraint {
    private _rot = new Quat(Quat.IDENTITY);

    setPivotA (v: IVec3Like): void {
        this.updateFrames();
    }

    setPivotB (v: IVec3Like): void {
        this.updateFrames();
    }

    setAxis (v: IVec3Like): void {
        this.updateFrames();
    }

    get constraint (): HingeConstraint {
        return this._com as HingeConstraint;
    }

    onComponentSet (): void {
        this._impl = PX.createRevoluteJoint(PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
        this.updateFrames();
    }

    updateFrames () {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        const node = cs.node;

        Vec3.normalize(v3_0, cs.axis);
        Vec3.cross(v3_2, v3_0, Vec3.UNIT_Y); // z
        if (Vec3.len(v3_2) < 0.0001) {
            Vec3.cross(v3_1, Vec3.UNIT_Z, v3_0); // y
            Vec3.cross(v3_2, v3_0, v3_1); // z
        } else {
            Vec3.cross(v3_1, v3_2, v3_0); // y
        }

        Vec3.normalize(v3_1, v3_1);
        Vec3.normalize(v3_2, v3_2);

        mat_0.set(
            v3_0.x, v3_0.y, v3_0.z, 0, // x
            v3_1.x, v3_1.y, v3_1.z, 0, // y
            v3_2.x, v3_2.y, v3_2.z, 0, // z
            0, 0, 0, 1,
        );

        mat_0.getRotation(this._rot);
        Vec3.multiply(pos, cs.node.worldScale, cs.pivotA);
        this._impl.setLocalPose(0, getTempTransform(pos, this._rot));

        if (cb) {
            // orientation of axis in local space of body1
            Quat.multiply(this._rot, node.worldRotation, this._rot);
            Quat.invert(rot, cb.node.worldRotation);
            Quat.multiply(this._rot, rot, this._rot);
            // position in local space body0
            Vec3.multiply(pos, cb.node.worldScale, cs.pivotB);
        } else {
            // orientation of axis in local space of body1
            Quat.multiply(this._rot, node.worldRotation, this._rot);
            // position in world space
            Vec3.multiply(pos, node.worldScale, cs.pivotA);
            Vec3.transformQuat(pos, pos, node.worldRotation);
            Vec3.add(pos, pos, node.worldPosition);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, this._rot));
    }

    updateScale0 () {
        this.updateFrames();
    }

    updateScale1 () {
        this.updateFrames();
    }
}
