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

import Ammo from '../ammo-instantiated';
import { AmmoConstraint } from "./ammo-constraint";
import { IPointToPointConstraint } from "../../spec/i-physics-constraint";
import { IVec3Like, Vec3 } from "../../../core";
import { PointToPointConstraint } from "../../framework";
import { AmmoRigidBody } from "../ammo-rigid-body";
import { cocos2AmmoVec3 } from "../ammo-util";
import { CC_V3_0, CC_V3_1 } from '../ammo-const';

export class AmmoPointToPointConstraint extends AmmoConstraint implements IPointToPointConstraint {

    setPivotA (v: IVec3Like): void {
        if (this._pivotA) {
            Vec3.multiply(CC_V3_0, v, this._com.node.worldScale);
            cocos2AmmoVec3(this._pivotA, CC_V3_0);
            this.impl.setPivotA(this._pivotA);
        }
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(CC_V3_0, v);
        const cb = this._com.connectedBody;
        if (cb) {
            Vec3.multiply(CC_V3_0, v, cb.node.worldScale);
        } else {
            Vec3.add(CC_V3_0, CC_V3_0, this._com.node.worldPosition);
            Vec3.multiply(CC_V3_1, this.constraint.pivotA, this._com.node.worldScale);
            Vec3.add(CC_V3_0, CC_V3_0, CC_V3_1);
        }
        cocos2AmmoVec3(this._pivotB, CC_V3_0);
        this.impl.setPivotB(this._pivotB);
    }

    get impl (): Ammo.btPoint2PointConstraint {
        return this._impl as Ammo.btPoint2PointConstraint;
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    private _pivotA!: Ammo.btVector3;
    private _pivotB!: Ammo.btVector3;

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as AmmoRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: Ammo.btRigidBody | undefined;
            if (cb) {
                bodyB = (cb.body as AmmoRigidBody).impl;
            }
            this._pivotA = new Ammo.btVector3();
            this._pivotB = new Ammo.btVector3();
            if (bodyB) {
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, bodyB, this._pivotA, this._pivotB);
            } else {
                this._impl = new Ammo.btPoint2PointConstraint(bodyA, this._pivotA);
            }
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
