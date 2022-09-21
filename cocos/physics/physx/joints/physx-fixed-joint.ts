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

import { IVec3Like } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans } from '../physx-adapter';
import { PhysXWorld } from '../physx-world';
import { PhysXJoint } from './physx-joint';

export class PhysXFixedJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
    }

    setPivotB (v: IVec3Like): void {
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            this._impl = PX.PxFixedJointCreate(PhysXInstance.physics, null, _trans, null, _trans);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
