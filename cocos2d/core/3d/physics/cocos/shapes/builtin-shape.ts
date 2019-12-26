/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { BuiltinSharedBody } from '../builtin-shared-body';
import { IBuiltinShape } from '../builtin-interface';
import { Collider3D, PhysicsMaterial, RigidBody3D } from '../../exports/physics-framework';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../spec/i-common';
import { BuiltInWorld } from '../builtin-world';

const Vec3 = cc.Vec3;

export class BuiltinShape implements IBaseShape {
    set material (v: PhysicsMaterial) { }
    set isTrigger (v: boolean) { }
    get attachedRigidBody (): RigidBody3D | null { return null; }

    set center (v: IVec3Like) {
        Vec3.copy(this._localShape.center, v);
    }

    get localShape () {
        return this._worldShape;
    }

    get worldShape () {
        return this._worldShape;
    }

    get sharedBody () {
        return this._sharedBody;
    }

    get collider () {
        return this._collider;
    }

    /** id generator */
    private static idCounter: number = 0;
    readonly id: number = BuiltinShape.idCounter++;;

    protected _sharedBody!: BuiltinSharedBody;
    protected _collider!: Collider3D;
    protected _localShape!: IBuiltinShape;
    protected _worldShape!: IBuiltinShape;

    __preload (comp: Collider3D) {
        this._collider = comp;
        this._sharedBody = (cc.director.getPhysics3DManager().physicsWorld as BuiltInWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
    }

    onLoad () {
        this.center = this._collider.center;
    }

    onEnable () {
        this._sharedBody.addShape(this);
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._sharedBody.removeShape(this);
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._collider as any) = null;
        (this._localShape as any) = null;
        (this._worldShape as any) = null;
    }

    transform (m: cc.Mat4, pos: cc.Vec3, rot: cc.Quat, scale: cc.Vec3) {
        this._localShape.transform(m, pos, rot, scale, this._worldShape);
    }

}
