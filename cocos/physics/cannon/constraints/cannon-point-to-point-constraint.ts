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

import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

const v3_0 = new Vec3();

export class CannonPointToPointConstraint extends CannonConstraint implements IPointToPointConstraint {
    public get impl (): CANNON.PointToPointConstraint {
        return this._impl as CANNON.PointToPointConstraint;
    }

    public get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        Vec3.multiply(this.impl.pivotA, cs.node.worldScale, cs.pivotA);
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const cb = cs.connectedBody;
        if (cb) {
            Vec3.multiply(this.impl.pivotB, cb.node.worldScale, cs.pivotB);
        } else {
            const node = cs.node;
            Vec3.multiply(v3_0, node.worldScale, cs.pivotA);
            Vec3.transformQuat(v3_0, v3_0, node.worldRotation);
            Vec3.add(v3_0, v3_0, node.worldPosition);
            Vec3.copy(this.impl.pivotB, v3_0);
        }
    }

    onComponentSet (): void {
        const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
        const cb = this.constraint.connectedBody;
        let bodyB: CANNON.Body = (CANNON.World as any).staticBody;
        if (cb) {
            bodyB = (cb.body as CannonRigidBody).impl;
        }
        this._impl = new CANNON.PointToPointConstraint(bodyA, null, bodyB);
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    updateScale0 (): void {
        this.setPivotA(this.constraint.pivotA);
    }

    updateScale1 (): void {
        this.setPivotB(this.constraint.pivotB);
    }
}
