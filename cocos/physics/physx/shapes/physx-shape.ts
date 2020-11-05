
import { IVec3Like, Quat, Vec3 } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { Collider, RigidBody, PhysicMaterial, PhysicsSystem } from "../../framework";
import { IBaseShape } from "../../spec/i-physics-shape";
import { setWrap } from "../../utils/util";
import { PX, USE_BYTEDANCE, _pxtrans, _trans } from "../export-physx";
import { PhysXSharedBody } from "../physx-shared-body";
import { PhysXWorld } from "../physx-world";

export enum EPhysXShapeType {
    SPHERE,
    BOX,
    CAPSULE,
    PLANE,
    TERRAIN,
    MESH,
}

export class PhysXShape implements IBaseShape {

    get impl () { return this._impl; }
    get collider () { return this._collider; }
    get attachedRigidBody () { return null; }

    private static idCounter = 0;

    readonly id: number;
    readonly type: EPhysXShapeType;

    protected _impl: any = null;
    protected _collider: Collider = null as any;
    protected _flags: any;
    protected _sharedBody!: PhysXSharedBody;
    protected _rotation = new Quat(0, 0, 0, 1);

    constructor (type: EPhysXShapeType) {
        this.type = type;
        this.id = PhysXShape.idCounter++;
    }

    initialize (v: Collider): void {
        this._collider = v;
        if (USE_BYTEDANCE) {
            const flag = (v.isTrigger ? PX.ShapeFlag.eTRIGGER_SHAPE : PX.ShapeFlag.eSIMULATION_SHAPE)
                | PX.ShapeFlag.eSCENE_QUERY_SHAPE;
            this._flags = flag;
        } else {
            const flag = (v.isTrigger ? PX.PxShapeFlag.eTRIGGER_SHAPE.value : PX.PxShapeFlag.eSIMULATION_SHAPE.value)
                | PX.PxShapeFlag.eSCENE_QUERY_SHAPE.value;
            this._flags = new PX.PxShapeFlags(flag);
        }
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as PhysXWorld).getSharedBody(v.node);
        this._sharedBody.reference = true;
        this.onComponentSet();
        if (!USE_BYTEDANCE && this._impl) PX.IMPL_PTR[this._impl.$$.ptr] = this;
    }

    // virtual
    onComponentSet (): void { }

    // virtual
    updateScale () { }

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
        if (!USE_BYTEDANCE) {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
            this._impl.release();
        }
    }

    setMaterial (v: PhysicMaterial | null): void {
        if (v && this._impl) {
            const mat = this.getSharedMaterial(v);
            if (PX.VECTIR_MAT.size() > 0) {
                PX.VECTIR_MAT.set(0, mat);
            } else {
                PX.VECTIR_MAT.push_back(mat);
            }
            this._impl.setMaterials(PX.VECTIR_MAT);
        }
    }

    protected getSharedMaterial (v: PhysicMaterial) {
        if (!PX.CACHE_MAT[v._uuid]) {
            const physics = this._sharedBody.wrappedWorld.physics;
            const mat = physics.createMaterial(v.friction, v.friction, v.restitution);
            PX.CACHE_MAT[v._uuid] = mat;
            return mat;
        } else {
            const mat = PX.CACHE_MAT[v._uuid]
            mat.setStaticFriction(v.friction);
            mat.setDynamicFriction(v.friction);
            mat.setRestitution(v.restitution);
            return mat;
        }
    }

    setAsTrigger (v: boolean): void {
        if (USE_BYTEDANCE) {
            if (v) {
                this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v)
                this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
            } else {
                this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
                this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v)
            }
        } else {
            if (v) {
                this._impl.setFlag(PX.PxShapeFlag.eSIMULATION_SHAPE, !v)
                this._impl.setFlag(PX.PxShapeFlag.eTRIGGER_SHAPE, v);
            } else {
                this._impl.setFlag(PX.PxShapeFlag.eTRIGGER_SHAPE, v);
                this._impl.setFlag(PX.PxShapeFlag.eSIMULATION_SHAPE, !v)
            }
        }
    }

    setCenter (v: IVec3Like): void {
        Vec3.multiply(_trans.translation, v, this._collider.node.worldScale);
        Quat.copy(_trans.rotation, this._rotation);
        if (USE_BYTEDANCE) {
            const pos = _trans.translation;
            const rot = _trans.rotation;
            // _pxtrans.setPosition([pos.x, pos.y, pos.z]);
            // _pxtrans.setQuaternion([rot.x, rot.y, rot.z, rot.w]);
            // this._impl.setLocalPose(_pxtrans);
            const pt = new PX.Transform([pos.x, pos.y, pos.z],[rot.x, rot.y, rot.z, rot.w]);
            this._impl.setLocalPose(pt, true);
        } else {
            this._impl.setLocalPose(_trans);
        }
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

}

