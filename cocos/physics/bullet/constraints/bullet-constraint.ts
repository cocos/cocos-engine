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

/* eslint-disable new-cap */
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { Constraint, RigidBody } from '../../framework';
import { BulletRigidBody } from '../bullet-rigid-body';
import { bt, EBulletType } from '../instantiated';

export abstract class BulletConstraint implements IBaseConstraint {
    setConnectedBody (v: RigidBody | null): void {
        // TODO: support dynamic change connected body
    }

    setEnableCollision (v: boolean): void {
        if (this._collided !== v) {
            this._collided = v;
            this.updateByReAdd();
        }
    }

    get impl () {
        return this._impl;
    }

    get constraint (): Constraint {
        return this._com;
    }

    dirty = 0;
    index = -1;

    protected _impl: Bullet.ptr = 0;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;
    protected _collided = false;

    updateByReAdd () {
        if (this._rigidBody && this.index >= 0) {
            const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
            sb.wrappedWorld.addConstraint(this);
        }
    }

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this._collided = v.enableCollision;
        this.onComponentSet();
    }

    // virtual
    protected abstract onComponentSet(): void;

    abstract updateScale0(): void;
    abstract updateScale1(): void;

    onEnable (): void {
        const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
        sb.wrappedWorld.addConstraint(this);
        sb.addJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as BulletRigidBody).sharedBody;
            sb2.addJoint(this, 1);
        }
    }

    onDisable (): void {
        const sb = (this._rigidBody.body as BulletRigidBody).sharedBody;
        sb.wrappedWorld.removeConstraint(this);
        sb.removeJoint(this, 0);
        const connect = this.constraint.connectedBody;
        if (connect) {
            const sb2 = (connect.body as BulletRigidBody).sharedBody;
            sb2.removeJoint(this, 1);
        }
    }

    onDestroy (): void {
        bt._safe_delete(this._impl, EBulletType.EBulletTypeTypedConstraint);
        (this._com as any) = null;
        (this._rigidBody as any) = null;
    }
}
