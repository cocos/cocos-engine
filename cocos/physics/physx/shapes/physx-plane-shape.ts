import { IVec3Like, Quat, Vec3 } from '../../../core';
import { aabb, sphere } from '../../../core/geometry';
import { Collider, RigidBody, PhysicMaterial, PlaneCollider } from '../../framework';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { getTempTransform, PX, _pxtrans, _trans } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXPlaneShape extends PhysXShape implements IPlaneShape {
    static PLANE_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.PLANE);
        if (!PhysXPlaneShape.PLANE_GEOMETRY) {
            PhysXPlaneShape.PLANE_GEOMETRY = new PX.PlaneGeometry();
        }
    }

    setNormal (v: IVec3Like): void {
        this.setCenter();
    }

    setConstant (v: number): void {
        this.setCenter();
    }

    setCenter (): void {
        const co = this.collider;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.scaleAndAdd(pos, co.center, co.normal, co.constant);
        Quat.rotationTo(rot, Vec3.UNIT_X, co.normal);
        const trans = getTempTransform(pos, rot);
        this._impl.setLocalPose(trans);
    }

    get collider (): PlaneCollider {
        return this._collider as PlaneCollider;
    }

    onComponentSet (): void {
        const co = this.collider;
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(co.sharedMaterial!);
        this._impl = physics.createShape(PhysXPlaneShape.PLANE_GEOMETRY, pxmat, true, this._flags);
        this.setCenter();
    }

    updateScale (): void {
        this.setCenter();
    }
}
