import { IVec3Like, Quat, Vec3 } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { Collider, RigidBody, PhysicMaterial, PlaneCollider } from "../../framework";
import { IPlaneShape } from "../../spec/i-physics-shape";
import { PX, USE_BYTEDANCE, _pxtrans, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXPlaneShape extends PhysXShape implements IPlaneShape {

    static PLANE_GEOMETRY;

    constructor () {
        super(EPhysXShapeType.PLANE);
        if (!PhysXPlaneShape.PLANE_GEOMETRY) {
            if (USE_BYTEDANCE) {
                PhysXPlaneShape.PLANE_GEOMETRY = new PX.PlaneGeometry();
            } else {
                PhysXPlaneShape.PLANE_GEOMETRY = new PX.PxPlaneGeometry();
            }
        }
    }

    setNormal (v: IVec3Like) {
        this.setCenter();
    }

    setConstant (v: number) {
        this.setCenter();
    }

    setCenter () {
        const co = this.collider;
        Vec3.scaleAndAdd(_trans.translation, co.center, co.normal, co.constant);
        Quat.rotationTo(_trans.rotation, Vec3.UNIT_X, co.normal);
        if (USE_BYTEDANCE) {
            const pos = _trans.translation;
            const rot = _trans.rotation;
            // const pt = new PX.Transform([pos.x, pos.y, pos.z], [rot.x, rot.y, rot.z, rot.w]);
            // this._impl.setLocalPose(pt, true);
            _pxtrans.setPosition(pos);
            _pxtrans.setQuaternion(rot);
            this._impl.setLocalPose(_pxtrans);
        } else {
            this._impl.setLocalPose(_trans);
        }
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    onComponentSet () {
        const co = this.collider;
        const physics = this._sharedBody.wrappedWorld.physics as any;
        const pxmat = this.getSharedMaterial(co.sharedMaterial!);
        if (USE_BYTEDANCE) {
            this._impl = physics.createShape(PhysXPlaneShape.PLANE_GEOMETRY, pxmat);
        } else {
            this._impl = physics.createShape(PhysXPlaneShape.PLANE_GEOMETRY, pxmat, true, this._flags);
        }
        this.setCenter();
    }

    updateScale () {
        this.setCenter();
    }
}
