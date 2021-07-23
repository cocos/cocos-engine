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
import Ammo from '../instantiated';
import { AmmoConstraint } from './ammo-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { AmmoRigidBody } from '../ammo-rigid-body';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoConstant, CC_V3_0 } from '../ammo-const';

export class AmmoPointToPointConstraint extends AmmoConstraint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
        const pivotA = AmmoConstant.instance.VECTOR3_0;
        const cs = this.constraint;
        Vec3.multiply(CC_V3_0, cs.node.worldScale, cs.pivotA);
        cocos2AmmoVec3(pivotA, CC_V3_0);
        this.impl.setPivotA(pivotA);
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const node = this._rigidBody.node;
        const pivotB = AmmoConstant.instance.VECTOR3_0;
        const cb = cs.connectedBody;
        if (cb) {
            Vec3.multiply(CC_V3_0, cb.node.worldScale, cs.pivotB);
            cocos2AmmoVec3(pivotB, CC_V3_0);
        } else {
            Vec3.multiply(CC_V3_0, node.worldScale, cs.pivotA);
            Vec3.add(CC_V3_0, CC_V3_0, node.worldPosition);
            Vec3.add(CC_V3_0, CC_V3_0, cs.pivotB);
            cocos2AmmoVec3(pivotB, CC_V3_0);
        }
        this.impl.setPivotB(pivotB);
    }

    get impl (): Ammo.btPoint2PointConstraint {
        return this._impl as Ammo.btPoint2PointConstraint;
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        const bodyA = (this._rigidBody.body as AmmoRigidBody).impl;
        const cb = this.constraint.connectedBody;
        let bodyB: Ammo.btRigidBody | undefined;
        if (cb) {
            bodyB = (cb.body as AmmoRigidBody).impl;
        }
        const pivotA = AmmoConstant.instance.VECTOR3_0;
        if (bodyB) {
            const pivotB = AmmoConstant.instance.VECTOR3_1;
            this._impl = new Ammo.btPoint2PointConstraint(bodyA, bodyB, pivotA, pivotB);
        } else {
            this._impl = new Ammo.btPoint2PointConstraint(bodyA, pivotA);
        }
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
