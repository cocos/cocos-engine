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
import { IVec3Like, Vec3 } from '../../../core';
import { FixedConstraint } from '../../framework';
import { IFixedConstraint } from '../../spec/i-physics-constraint';
import { CannonConstraint } from './cannon-constraint';
import { CannonRigidBody } from '../cannon-rigid-body';

export class CannonLockConstraint extends CannonConstraint implements IFixedConstraint {
    protected _breakForce = 1e9;

    setBreakForce (v: number): void {
        this._breakForce = v;
        this.updateFrame();
    }
    setBreakTorque (v: number): void {
        // not supported
    }

    public get impl (): CANNON.LockConstraint {
        return this._impl as CANNON.LockConstraint;
    }

    get constraint (): FixedConstraint {
        return this._com as FixedConstraint;
    }

    onComponentSet (): void {
        this._breakForce = this.constraint.breakForce;
        this.updateFrame();
    }

    updateFrame (): void {
        const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
        const cb = this.constraint.connectedBody;
        let bodyB: CANNON.Body = (CANNON.World as any).staticBody;
        if (cb) {
            bodyB = (cb.body as CannonRigidBody).impl;
        }
        this._impl = new CANNON.LockConstraint(bodyA, bodyB, { maxForce: this._breakForce });
    }

    updateScale0 (): void {
        this.updateFrame();
    }

    updateScale1 (): void {
        this.updateFrame();
    }
}
