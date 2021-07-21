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

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IVec3Like, Quat, Vec3 } from '../../../core';
import { AABB, Sphere } from '../../../core/geometry';
import { Collider, RigidBody, PhysicsMaterial, PhysicsSystem } from '../../framework';
import { IBaseShape } from '../../spec/i-physics-shape';
import { addReference, getShapeFlags, getShapeMaterials, getShapeWorldBounds, getTempTransform,
    PX, removeReference, _pxtrans, _trans } from '../physx-adapter';
import { EFilterDataWord3 } from '../physx-enum';
import { PhysXSharedBody } from '../physx-shared-body';
import { PhysXWorld } from '../physx-world';

export enum EPhysXShapeType {
    SPHERE,
    BOX,
    CAPSULE,
    CYLINDER,
    CONE,
    PLANE,
    TERRAIN,
    MESH,
}

export class PhysXShape implements IBaseShape {
    private static _MESH_SCALE: any;
    static get MESH_SCALE (): any {
        if (!this._MESH_SCALE) { this._MESH_SCALE = new PX.MeshScale(Vec3.ZERO, Quat.IDENTITY); }
        return this._MESH_SCALE;
    }

    get impl (): any { return this._impl; }
    get collider (): Collider { return this._collider; }
    get attachedRigidBody (): RigidBody | null { return null; }

    private static idCounter = 0;

    readonly id: number;
    readonly type: EPhysXShapeType;

    protected _impl: any = null;
    protected _collider: Collider = null as any;
    protected _flags: any;
    protected _sharedBody!: PhysXSharedBody;
    protected _rotation = new Quat(0, 0, 0, 1);
    protected _index = -1;
    protected _word3 = 0;

    constructor (type: EPhysXShapeType) {
        this.type = type;
        this.id = PhysXShape.idCounter++;
    }

    initialize (v: Collider): void {
        this._collider = v;
        this._flags = getShapeFlags(v.isTrigger);
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as PhysXWorld).getSharedBody(v.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        addReference(this, this._impl);
    }

    setIndex (v: number): void {
        this._index = v;
    }

    // virtual
    onComponentSet (): void { }

    // virtual
    updateScale (): void { }

    onLoad (): void {
        this.setMaterial(this._collider.sharedMaterial);
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
        removeReference(this, this._impl);
        this._impl.release();
        this._impl = null;
    }

    setMaterial (v: PhysicsMaterial | null): void {
        if (v == null) v = PhysicsSystem.instance.defaultMaterial;
        const mat = this.getSharedMaterial(v);
        this._impl.setMaterials(getShapeMaterials(mat));
    }

    protected getSharedMaterial (v: PhysicsMaterial): any {
        if (!PX.CACHE_MAT[v.id]) {
            const physics = this._sharedBody.wrappedWorld.physics;
            const mat = physics.createMaterial(v.friction, v.friction, v.restitution);
            mat.setFrictionCombineMode(PX.CombineMode.eMULTIPLY);
            mat.setRestitutionCombineMode(PX.CombineMode.eMULTIPLY);
            PX.CACHE_MAT[v.id] = mat;
            return mat;
        }
        const mat = PX.CACHE_MAT[v.id];
        mat.setStaticFriction(v.friction);
        mat.setDynamicFriction(v.friction);
        mat.setRestitution(v.restitution);
        return mat;
    }

    setAsTrigger (v: boolean): void {
        if (v) {
            this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v);
            this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
        } else {
            this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
            this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v);
        }
        if (this._index >= 0) {
            this._sharedBody.removeShape(this);
            this._sharedBody.addShape(this);
        }
    }

    setCenter (v: IVec3Like): void {
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.multiply(pos, v, this._collider.node.worldScale);
        Quat.copy(rot, this._rotation);
        const trans = getTempTransform(pos, rot);
        this._impl.setLocalPose(trans);
        if (this._collider.enabled && !this._collider.isTrigger) {
            this._sharedBody.updateCenterOfMass();
        }
    }

    getAABB (v: AABB): void {
        getShapeWorldBounds(this.impl, this._sharedBody.impl, 1, v);
    }

    getBoundingSphere (v: Sphere): void {
        AABB.toBoundingSphere(v, this._collider.worldBounds as AABB);
    }

    setGroup (v: number): void {
        this._sharedBody.setGroup(v);
    }

    getGroup (): number {
        return this._sharedBody.getGroup();
    }

    addGroup (v: number): void {
        this._sharedBody.addGroup(v);
    }

    removeGroup (v: number): void {
        this._sharedBody.removeGroup(v);
    }

    setMask (v: number): void {
        this._sharedBody.setMask(v);
    }

    getMask (): number {
        return this._sharedBody.getMask();
    }

    addMask (v: number): void {
        this._sharedBody.addMask(v);
    }

    removeMask (v: number): void {
        this._sharedBody.removeMask(v);
    }

    updateFilterData (filterData: any) {
        this._word3 = EFilterDataWord3.DETECT_CONTACT_CCD;
        if (this._collider.needTriggerEvent) {
            this._word3 |= EFilterDataWord3.DETECT_TRIGGER_EVENT;
        }
        if (this._collider.needCollisionEvent) {
            this._word3 |= EFilterDataWord3.DETECT_CONTACT_EVENT | EFilterDataWord3.DETECT_CONTACT_POINT;
        }
        filterData.word2 = this.id;
        filterData.word3 = this._word3;
        this._impl.setQueryFilterData(filterData);
        this._impl.setSimulationFilterData(filterData);
    }

    updateEventListener () {
        if (this._sharedBody) {
            this.updateFilterData(this._sharedBody.filterData);
        }
    }
}
