import { IVec3Like, Quat, Vec3 } from '../../../core';
import { aabb, sphere } from '../../../core/geometry';
import { Collider, RigidBody, PhysicMaterial, PhysicsSystem } from '../../framework';
import { IBaseShape } from '../../spec/i-physics-shape';
import { EFilterDataWord3, getShapeFlags, getShapeMaterials, getTempTransform, PX, _pxtrans, _trans } from '../export-physx';
import { PhysXSharedBody } from '../physx-shared-body';
import { PhysXWorld } from '../physx-world';

export enum EPhysXShapeType {
    SPHERE,
    BOX,
    CAPSULE,
    PLANE,
    TERRAIN,
    MESH,
}

export class PhysXShape implements IBaseShape {
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
        this.setMaterial(this._collider.sharedMaterial);
        if (this._impl) {
            if (this._impl.$$) {
                PX.IMPL_PTR[this._impl.$$.ptr] = this;
            } else {
                PX.IMPL_PTR[this.id] = this;
            }
        }
    }

    setIndex (v: number): void {
        this._index = v;
    }

    // virtual
    onComponentSet (): void { }

    // virtual
    updateScale (): void { }

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
        if (this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
            this._impl.release();
        } else {
            PX.IMPL_PTR[this.id] = null;
            delete PX.IMPL_PTR[this.id];
            // this._impl.release();
        }
    }

    setMaterial (v: PhysicMaterial | null): void {
        if (!this._impl) return;
        if (v == null) v = PhysicsSystem.instance.defaultMaterial;
        const mat = this.getSharedMaterial(v);
        if (this._impl.$$) this._impl.setMaterials(getShapeMaterials(mat));
    }

    protected getSharedMaterial (v: PhysicMaterial): any {
        if (!PX.CACHE_MAT[v._uuid]) {
            const physics = this._sharedBody.wrappedWorld.physics;
            const mat = physics.createMaterial(v.friction, v.rollingFriction, v.restitution);
            mat.setFrictionCombineMode(PX.CombineMode.eMULTIPLY);
            mat.setRestitutionCombineMode(PX.CombineMode.eMULTIPLY);
            PX.CACHE_MAT[v._uuid] = mat;
            return mat;
        }
        const mat = PX.CACHE_MAT[v._uuid];
        mat.setStaticFriction(v.friction);
        mat.setDynamicFriction(v.rollingFriction);
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
        if (this._collider.enabled) this._sharedBody.updateCenterOfMass();
    }

    getAABB (v: aabb): void { }

    getBoundingSphere (v: sphere): void { }

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
