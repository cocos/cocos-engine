import { Quat, Vec3 } from '../../../core';
import cylinder from '../../../core/primitive/cylinder';
import { ConeCollider, EAxisDirection } from '../../framework';
import { IConeShape } from '../../spec/i-physics-shape';
import { createConvexMesh, createMeshGeometryFlags, PX, _trans } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXConeShape extends PhysXShape implements IConeShape {
    static CONVEX_MESH: any;
    geometry: any;

    constructor () {
        super(EPhysXShapeType.CONE);
    }

    setRadius (v: number): void {
        this.updateGeometry();
    }

    setHeight (v: number): void {
        this.updateGeometry();
    }

    setDirection (v: number): void {
        this.updateGeometry();
    }

    get collider (): ConeCollider {
        return this._collider as ConeCollider;
    }

    onComponentSet (): void {
        const collider = this.collider;
        const physics = this._sharedBody.wrappedWorld.physics;
        if (!PhysXConeShape.CONVEX_MESH) {
            const cooking = this._sharedBody.wrappedWorld.cooking;
            const primitive = cylinder(0, 0.5, 1, { radialSegments: 32, heightSegments: 1 });
            PhysXConeShape.CONVEX_MESH = createConvexMesh(primitive.positions, cooking, physics);
        }
        const meshScale = PhysXShape.MESH_SCALE;
        meshScale.setScale(Vec3.ONE);
        meshScale.setRotation(Quat.IDENTITY);
        const convexMesh = PhysXConeShape.CONVEX_MESH;
        const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
        this.geometry = new PX.ConvexMeshGeometry(convexMesh, meshScale, createMeshGeometryFlags(0, true));
        this.updateGeometry();
        this._impl = physics.createShape(this.geometry, pxmat, true, this._flags);
    }

    updateScale (): void {
        this.updateGeometry();
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const collider = this.collider;
        const r = collider.radius;
        const h = collider.height;
        const a = collider.direction
        const scale = _trans.translation;
        Vec3.copy(scale, collider.node.worldScale);
        scale.y *= Math.max(0.0001, h / 1);
        const xz = Math.max(0.0001, r / 0.5);
        scale.x *= xz; scale.z *= xz;
        const quat = _trans.rotation;
        switch (a) {
            case EAxisDirection.X_AXIS:
                Quat.fromEuler(quat, 0, 0, 90);
                break;
            case EAxisDirection.Y_AXIS:
                Quat.copy(quat, Quat.IDENTITY);
                break;
            case EAxisDirection.Z_AXIS:
                Quat.fromEuler(quat, 90, 0, 0);
                break;
        }
        const meshScale = PhysXShape.MESH_SCALE;
        meshScale.setScale(scale);
        meshScale.setRotation(quat);
        this.geometry.setScale(meshScale);
    }
}
