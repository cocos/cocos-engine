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

import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class CannonPointToPointConstraint extends CannonConstraint implements IPointToPointConstraint {

    public get impl () {
        return this._impl as CANNON.PointToPointConstraint;
    }

    public get constraint () {
        return this._com as PointToPointConstraint;
    }

    setPivotA (v: IVec3Like): void {
        Vec3.multiply(v3_0, v, this._com.node.worldScale);
        Vec3.copy(this.impl.pivotA, v3_0);
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(v3_0, v);
        const cb = this.constraint.connectedBody;
        if (cb) {
            Vec3.multiply(v3_0, v3_0, cb.node.worldScale);
        } else {
            Vec3.add(v3_0, v3_0, this._com.node.worldPosition);
            Vec3.multiply(v3_1, this.constraint.pivotA, this._com.node.worldScale);
            Vec3.add(v3_0, v3_0, v3_1);
        }
        Vec3.copy(this.impl.pivotB, v3_0);
    }

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: CANNON.Body = CANNON.World['staticBody'];
            if (cb) {
                bodyB = (cb.body as CannonRigidBody).impl;
            }
            this._impl = new CANNON.PointToPointConstraint(bodyA, null, bodyB);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
