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

import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { getTempTransform, PX, _pxtrans, _trans } from '../physx-adapter';
import { PhysXJoint } from './physx-joint';

export class PhysXRevoluteJoint extends PhysXJoint implements IHingeConstraint {
    private _rot = new Quat(Quat.IDENTITY);

    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;

        Quat.rotationTo(rot, Vec3.UNIT_X, cs.axis);
        Vec3.multiply(pos, cs.node.worldScale, cs.pivotA);
        this._impl.setLocalPose(0, getTempTransform(pos, rot));

        if (!cs.connectedBody) this.setPivotB(cs.pivotB); // seems useless
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        const pos = _trans.translation;
        const rot = _trans.rotation;

        // rotation in local space body0
        Quat.rotationTo(this._rot, Vec3.UNIT_X, cs.axis);

        if (cb) {
            // orientation of axis in local space of body1
            Quat.invert(rot, cs.node.worldRotation);
            Quat.multiply(this._rot, rot, this._rot);
            Quat.multiply(this._rot, cb.node.worldRotation, this._rot);
            // position in local space body0
            Vec3.multiply(pos, cb.node.worldScale, cs.pivotB);
        } else {
            const node = cs.node;
            // orientation of axis in local space of body1
            Quat.multiply(this._rot, cs.node.worldRotation, this._rot);
            // position in world space
            Quat.invert(rot, cs.node.worldRotation);
            Vec3.multiply(pos, node.worldScale, cs.pivotB);
            Vec3.transformQuat(pos, pos, rot);
            Vec3.add(pos, pos, node.worldPosition);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, this._rot));
    }

    setAxis (v: IVec3Like): void {
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    get constraint (): HingeConstraint {
        return this._com as HingeConstraint;
    }

    onComponentSet (): void {
        this._impl = PX.createRevoluteJoint(PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    updateScale0 () {
        this.setPivotA(this.constraint.pivotA);
    }

    updateScale1 () {
        this.setPivotB(this.constraint.pivotB);
    }
}
