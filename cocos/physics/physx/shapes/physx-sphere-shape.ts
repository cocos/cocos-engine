
import { IVec3Like } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { Collider, RigidBody, PhysicMaterial, SphereCollider } from "../../framework";
import { ISphereShape } from "../../spec/i-physics-shape";
import { PX, USE_BYTEDANCE } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXSphereShape extends PhysXShape implements ISphereShape {

    static SPHERE_GEOMETRY;

    constructor () {
        super(EPhysXShapeType.SPHERE);
        if (!PhysXSphereShape.SPHERE_GEOMETRY) {
            if (USE_BYTEDANCE) {
                PhysXSphereShape.SPHERE_GEOMETRY = new PX.SphereGeometry(0.5);
            } else {
                PhysXSphereShape.SPHERE_GEOMETRY = new PX.PxSphereGeometry(0.5);
            }
        }
    }

    setRadius (v: number): void {
        this.updateScale();
    }

    get collider () {
        return this._collider as SphereCollider;
    }

    onComponentSet () {
        this.updateGeometry();
        const physics = this._sharedBody.wrappedWorld.physics as any;
        const pxmat = this.getSharedMaterial(this.collider.sharedMaterial!);
        if (USE_BYTEDANCE) {
            this._impl = physics.createShape(PhysXSphereShape.SPHERE_GEOMETRY, pxmat);
            const v = this._collider.isTrigger;
            if (v) {
                this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v)
                this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
            } else {
                this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, v);
                this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !v)
            }
        } else {
            this._impl = physics.createShape(PhysXSphereShape.SPHERE_GEOMETRY, pxmat, true, this._flags);
        }
    }

    updateScale () {
        this.updateGeometry();
        this._impl.setGeometry(PhysXSphereShape.SPHERE_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry () {
        const co = this.collider;
        const ws = co.node.worldScale;
        const absX = Math.abs(ws.x);
        const absY = Math.abs(ws.y);
        const absZ = Math.abs(ws.z);
        const max_sp = Math.max(Math.max(absX, absY), absZ);
        if (USE_BYTEDANCE) {
            PhysXSphereShape.SPHERE_GEOMETRY.setRadius(co.radius * max_sp);
        } else {
            PhysXSphereShape.SPHERE_GEOMETRY.radius = co.radius * max_sp;
        }
    }
}
