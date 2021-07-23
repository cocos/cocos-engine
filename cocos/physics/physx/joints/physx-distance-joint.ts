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
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans, getTempTransform, _pxtrans } from '../physx-adapter';
import { PhysXJoint } from './physx-joint';

export class PhysXDistanceJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.multiply(pos, cs.node.worldScale, cs.pivotA);
        Quat.copy(rot, Quat.IDENTITY);
        this._impl.setLocalPose(0, getTempTransform(pos, rot));
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, cs.pivotB);
        Quat.copy(rot, Quat.IDENTITY);
        if (cb) {
            Vec3.multiply(pos, cb.node.worldScale, cs.pivotB);
        } else {
            const node = cs.node;
            Vec3.multiply(pos, node.worldScale, cs.pivotA);
            Vec3.add(pos, pos, node.worldPosition);
            Vec3.add(pos, pos, cs.pivotB);
            Quat.multiply(rot, rot, node.worldRotation);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, rot));
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        this._impl = PX.createDistanceJoint(PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
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
