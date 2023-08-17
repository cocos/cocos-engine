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
import { Vec3, Quat, IVec3Like, geometry } from '../../../core';
import { getWrap, setWrap } from '../../utils/util';
import { commitShapeUpdates } from '../cannon-util';
import { PhysicsMaterial } from '../../framework/assets/physics-material';
import { IBaseShape } from '../../spec/i-physics-shape';
import { CannonSharedBody } from '../cannon-shared-body';
import { CannonWorld } from '../cannon-world';
import { TriggerEventType } from '../../framework/physics-interface';
import { PhysicsSystem } from '../../framework/physics-system';
import { Collider, RigidBody } from '../../framework';

const TriggerEventObject = {
    type: 'onTriggerEnter' as TriggerEventType,
    selfCollider: null as Collider | null,
    otherCollider: null as Collider | null,
    impl: null as unknown as CANNON.ITriggeredEvent,
};
const cannonQuat_0 = new CANNON.Quaternion();
const cannonVec3_0 = new CANNON.Vec3();
const cannonVec3_1 = new CANNON.Vec3();
export class CannonShape implements IBaseShape {
    updateEventListener (): void { }

    static readonly idToMaterial = {};

    get impl (): CANNON.Shape { return this._shape; }

    get collider (): Collider { return this._collider; }

    get attachedRigidBody (): RigidBody | null {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get sharedBody (): CannonSharedBody { return this._sharedBody; }

    setMaterial (mat: PhysicsMaterial | null): void {
        const mat1 = (mat == null) ? PhysicsSystem.instance.defaultMaterial : mat;

        if (CannonShape.idToMaterial[mat1.id] == null) {
            CannonShape.idToMaterial[mat1.id] = new CANNON.Material(mat1.id as any);
        }

        this._shape.material = CannonShape.idToMaterial[mat1.id];
        const smat = this._shape.material;
        smat.friction = mat1.friction;
        smat.restitution = mat1.restitution;
        const coef = (CANNON as any).CC_CONFIG.correctInelastic;
        (smat as any).correctInelastic = smat.restitution === 0 ? coef : 0;
    }

    setAsTrigger (v: boolean): void {
        this._shape.collisionResponse = !v;
        if (this._index >= 0) {
            this._body.updateHasTrigger();
        }
    }

    setCenter (v: IVec3Like): void {
        this._setCenter(v);
        if (this._index >= 0) {
            commitShapeUpdates(this._body);
        }
    }

    setAttachedBody (v: RigidBody | null): void {
        if (v) {
            if (this._sharedBody) {
                if (this._sharedBody.wrappedBody === v.body) return;
                this._sharedBody.reference = false;
            }

            this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(v.node);
            this._sharedBody.reference = true;
        } else {
            if (this._sharedBody) {
                this._sharedBody.reference = false;
            }

            this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._collider.node);
            this._sharedBody.reference = true;
        }
    }

    getAABB (v: geometry.AABB): void {
        Quat.copy(cannonQuat_0, this._collider.node.worldRotation);
        (this._shape as any).calculateWorldAABB(CANNON.Vec3.ZERO, cannonQuat_0, cannonVec3_0, cannonVec3_1);
        Vec3.subtract(v.halfExtents, cannonVec3_1, cannonVec3_0);
        Vec3.multiplyScalar(v.halfExtents, v.halfExtents, 0.5);
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    getBoundingSphere (v: geometry.Sphere): void {
        v.radius = this._shape.boundingSphereRadius;
        Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
    }

    protected _collider!: Collider;
    protected _shape!: CANNON.Shape;
    protected _offset = new CANNON.Vec3();
    protected _orient = new CANNON.Quaternion();
    protected _index = -1;
    protected _sharedBody!: CannonSharedBody;
    protected get _body (): CANNON.Body { return this._sharedBody.body; }
    protected onTriggerListener = this._onTrigger.bind(this);
    protected _isBinding = false;

    /** LIFECYCLE */

    initialize (comp: Collider): void {
        this._collider = comp;
        this._isBinding = true;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as CannonWorld).getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        setWrap(this._shape, this);
        this._shape.addEventListener('cc-trigger', this.onTriggerListener);
    }

    // virtual
    protected onComponentSet (): void { }

    onLoad (): void {
        this.setMaterial(this._collider.sharedMaterial);
        this.setCenter(this._collider.center);
        this.setAsTrigger(this._collider.isTrigger);
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
        this._shape.removeEventListener('cc-trigger', this.onTriggerListener);
        delete (CANNON.World as any).idToShapeMap[this._shape.id];
        (this._sharedBody as any) = null;
        setWrap(this._shape, null);
        (this._offset as any) = null;
        (this._orient as any) = null;
        (this._shape as any) = null;
        (this._collider as any) = null;
        (this.onTriggerListener as any) = null;
    }

    /** INTERFACE */

    /** group */
    getGroup (): number {
        return this._body.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this._body.collisionFilterGroup = v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    addGroup (v: number): void {
        this._body.collisionFilterGroup |= v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    removeGroup (v: number): void {
        this._body.collisionFilterGroup &= ~v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    /** mask */
    getMask (): number {
        return this._body.collisionFilterMask;
    }

    setMask (v: number): void {
        this._body.collisionFilterMask = v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    addMask (v: number): void {
        this._body.collisionFilterMask |= v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    removeMask (v: number): void {
        this._body.collisionFilterMask &= ~v;
        if (!this._body.isAwake()) this._body.wakeUp();
    }

    /**
     * change scale will recalculate center & size \
     * size handle by child class
     * @param scale
     */
    setScale (scale: IVec3Like): void {
        this._setCenter(this._collider.center);
    }

    setIndex (index: number): void {
        this._index = index;
    }

    setOffsetAndOrient (offset: CANNON.Vec3, orient: CANNON.Quaternion): void {
        Vec3.copy(offset, this._offset);
        Quat.copy(orient, this._orient);
        this._offset = offset;
        this._orient = orient;
    }

    protected _setCenter (v: IVec3Like): void {
        const lpos = this._offset as IVec3Like;
        Vec3.subtract(lpos, this._sharedBody.node.worldPosition, this._collider.node.worldPosition);
        Vec3.add(lpos, lpos, v);
        Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
    }

    protected _onTrigger (event: CANNON.ITriggeredEvent): void {
        TriggerEventObject.type = event.event;
        const self = getWrap<CannonShape>(event.selfShape);
        const other = getWrap<CannonShape>(event.otherShape);

        if (self && self.collider.needTriggerEvent) {
            TriggerEventObject.selfCollider = self.collider;
            TriggerEventObject.otherCollider = other ? other.collider : null;
            TriggerEventObject.impl = event;
            this._collider.emit(TriggerEventObject.type, TriggerEventObject);
        }
    }
}
