import { IVec3Like, Quat, Vec3 } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { Collider, RigidBody, PhysicMaterial, PlaneCollider } from "../../framework";
import { IPlaneShape } from "../../spec/i-physics-shape";
import { PX, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXPlaneShape extends PhysXShape implements IPlaneShape {

    static PLANE_GEOMETRY;

    constructor () {
        super(EPhysXShapeType.PLANE);
        if (!PhysXPlaneShape.PLANE_GEOMETRY) PhysXPlaneShape.PLANE_GEOMETRY = new PX.PxPlaneGeometry();
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
        this._impl.setLocalPose(_trans);
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    onComponentSet () {
        const co = this.collider;
        Vec3.scaleAndAdd(_trans.translation, co.center, co.normal, co.constant);
        Quat.rotationTo(_trans.rotation, Vec3.UNIT_X, co.normal);
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(co.sharedMaterial!);
        this._impl = physics.createShape(PhysXPlaneShape.PLANE_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale () {
        this.setCenter();
    }
}
