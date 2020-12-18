import { GFXAttributeName, Mesh, Quat } from '../../../core';
import { aabb, sphere } from '../../../core/geometry';
import { MeshCollider } from '../../framework';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { createConvexMesh, PX, _trans } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXCylinderShape extends PhysXShape implements ICylinderShape {
    constructor () {
        super(EPhysXShapeType.CYLINDER);
    }
    setRadius: (v: number) => void;
    setHeight: (v: number) => void;
    setDirection: (v: number) => void;
    get collider (): MeshCollider {
        return this._collider as MeshCollider;
    }

    onComponentSet (): void {
    }

    updateScale (): void {
        this.setCenter(this._collider.center);
    }
}
