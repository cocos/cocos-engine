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
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { Constraint, RigidBody } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';
import { getWrap } from '../../utils/util';
import { CannonSharedBody } from '../cannon-shared-body';

(CANNON.World as any).staticBody = new CANNON.Body();
(CANNON.World as any).idToConstraintMap = {};

export class CannonConstraint implements IBaseConstraint {
    setConnectedBody (v: RigidBody | null): void {
        if (this._connectedBody === v) return;

        const oldBody2 = this._connectedBody;
        if (oldBody2) {
            const oldSB2 = (oldBody2.body as CannonRigidBody).sharedBody;
            oldSB2.removeJoint(this, 1);
        }

        const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
        sb.removeJoint(this, 0);
        if (this._impl) {
            sb.wrappedWorld.removeConstraint(this);
            delete (CANNON.World as any).idToConstraintMap[this._impl.id];
            (this._impl as any) = null;
        }

        this._connectedBody = v;
        const connect = this._connectedBody;

        this.onComponentSet();
        this.setEnableCollision(this._com.enableCollision);
        (CANNON.World as any).idToConstraintMap[this._impl.id] = this._impl;

        sb.wrappedWorld.addConstraint(this);
        sb.addJoint(this, 0);

        if (connect) {
            const newSB2 = (connect.body as CannonRigidBody).sharedBody;
            newSB2.addJoint(this, 1);
        }
    }

    setEnableCollision (v: boolean): void {
        this._impl.collideConnected = v;
    }

    get impl (): CANNON.Constraint { return this._impl; }
    get constraint (): Constraint { return this._com; }

    protected _impl!: CANNON.Constraint;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;
    protected _connectedBody!: RigidBody | null;

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this._connectedBody = v.connectedBody;
        this.onComponentSet();
        this.setEnableCollision(v.enableCollision);
        (CANNON.World as any).idToConstraintMap[this._impl.id] = this._impl;
    }

    // virtual
    protected onComponentSet (): void { }

    // virtual
    updateScale0 (): void { }
    updateScale1 (): void { }

    onEnable (): void {
        const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
        sb.wrappedWorld.addConstraint(this);
        sb.addJoint(this, 0);
        const connect = this._connectedBody;
        if (connect) {
            const sb2 = (connect.body as CannonRigidBody).sharedBody;
            sb2.addJoint(this, 1);
        }
    }

    onDisable (): void {
        const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
        sb.wrappedWorld.removeConstraint(this);
        sb.removeJoint(this, 0);
        const connect = this._connectedBody;
        if (connect) {
            const sb2 = (connect.body as CannonRigidBody).sharedBody;
            sb2.removeJoint(this, 1);
        }
    }

    onDestroy (): void {
        delete (CANNON.World as any).idToConstraintMap[this._impl.id];
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        (this._connectedBody as any) = null;
        (this._impl as any) = null;
    }
}
