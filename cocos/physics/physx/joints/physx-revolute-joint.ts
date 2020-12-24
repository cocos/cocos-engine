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

import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { getTempTransform, PX, _pxtrans, _trans } from '../export-physx';
import { PhysXJoint } from './physx-joint';

export class PhysXRevoluteJoint extends PhysXJoint implements IHingeConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, cs.pivotA);
        Quat.rotationTo(rot, Vec3.UNIT_X, cs.axis);
        this._impl.setLocalPose(0, getTempTransform(pos, rot));
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Quat.rotationTo(rot, Vec3.UNIT_X, cs.axis);
        if (this.constraint.connectedBody) {
            Vec3.copy(pos, cs.pivotB);
        } else {
            Vec3.add(pos, this._rigidBody.node.worldPosition, cs.pivotA);
            Vec3.add(pos, pos, cs.pivotB);
            Quat.multiply(rot, rot, this._rigidBody.node.worldRotation);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, rot));
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
}
