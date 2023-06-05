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

import { Mat4, Quat, Vec3, IVec3Like, geometry } from '../../../core';
import { BuiltinSharedBody } from '../builtin-shared-body';
import { IBuiltinShape } from '../builtin-interface';
import { Collider, RigidBody, PhysicsMaterial, PhysicsSystem } from '../../../../exports/physics-framework';
import { IBaseShape } from '../../spec/i-physics-shape';
import { BuiltInWorld } from '../builtin-world';

export class BuiltinShape implements IBaseShape {
    getAABB (v: geometry.AABB): void { }
    getBoundingSphere (v: geometry.Sphere): void { }
    updateEventListener (): void { }
    setMaterial (v: PhysicsMaterial | null): void { }
    setAsTrigger (v: boolean): void { }
    get attachedRigidBody (): RigidBody | null { return null; }

    setCenter (v: IVec3Like): void {
        Vec3.copy(this._localShape.center, v);
    }

    get localShape (): IBuiltinShape {
        return this._localShape;
    }

    get worldShape (): IBuiltinShape {
        return this._worldShape;
    }

    get impl (): IBuiltinShape {
        return this._worldShape;
    }

    get sharedBody (): BuiltinSharedBody {
        return this._sharedBody;
    }

    get collider (): Collider {
        return this._collider;
    }

    /** id generator */
    private static idCounter = 0;
    readonly id: number = BuiltinShape.idCounter++;

    protected _sharedBody!: BuiltinSharedBody;
    protected _collider!: Collider;
    protected _localShape!: IBuiltinShape;
    protected _worldShape!: IBuiltinShape;

    initialize (comp: Collider): void {
        this._collider = comp;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BuiltInWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
    }

    onLoad (): void {
        this.setCenter(this._collider.center);
    }

    onEnable (): void {
        this._sharedBody.addShape(this);
        this._sharedBody.enabled = true;
    }

    onDisable (): void {
        this._sharedBody.removeShape(this);
        this._sharedBody.enabled = false;
    }

    onDestroy (): void {
        this._sharedBody.reference = false;
        (this._collider as any) = null;
        (this._localShape as any) = null;
        (this._worldShape as any) = null;
    }

    transform (m: Mat4 | Readonly<Mat4>, pos: Vec3 | Readonly<Vec3>, rot: Quat | Readonly<Quat>, scale: Vec3 | Readonly<Vec3>): void {
        this._localShape.transform(m, pos, rot, scale, this._worldShape);
    }

    /** group */
    public getGroup (): number {
        return this._sharedBody.getGroup();
    }

    public setGroup (v: number): void {
        this._sharedBody.setGroup(v);
    }

    public addGroup (v: number): void {
        this._sharedBody.addGroup(v);
    }

    public removeGroup (v: number): void {
        this._sharedBody.removeGroup(v);
    }

    /** mask */
    public getMask (): number {
        return this._sharedBody.getMask();
    }

    public setMask (v: number): void {
        this._sharedBody.setMask(v);
    }

    public addMask (v: number): void {
        this._sharedBody.addMask(v);
    }

    public removeMask (v: number): void {
        this._sharedBody.removeMask(v);
    }
}
