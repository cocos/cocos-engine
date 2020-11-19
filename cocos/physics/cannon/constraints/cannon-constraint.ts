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
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { Constraint, RigidBody } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

CANNON.World['staticBody'] = new CANNON.Body();
CANNON.World['idToConstraintMap'] = {};

export class CannonConstraint implements IBaseConstraint {

    setConnectedBody (v: RigidBody | null): void {
        if (v) {
            this._impl.bodyB = (v.body as CannonRigidBody).impl;
        } else {
            this._impl.bodyB = CANNON.World['staticBody'];
        }
    }

    setEnableCollision (v: boolean): void {
        this._impl.collideConnected = v;
    }

    get impl () { return this._impl; }
    get constraint () { return this._com }

    protected _impl!: CANNON.Constraint;
    protected _com!: Constraint;
    protected _rigidBody: RigidBody | null = null;

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody;
        this.onComponentSet();
        this.setEnableCollision(v.enableCollision);
        CANNON.World['idToConstraintMap'][this._impl.id] = this._impl;
    }

    // virtual
    protected onComponentSet () { }

    onLoad () {

    }

    onEnable () {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
            sb.wrappedWorld.addConstraint(this);
        }
    }

    onDisable () {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
        }
    }

    onDestroy () {
        delete CANNON.World['idToConstraintMap'][this._impl.id];
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        (this._impl as any) = null;
    }
}
