import { IVec3Like } from '../../../core';
import { aabb, sphere } from '../../../core/geometry';
import { Collider, RigidBody, PhysicMaterial, BoxCollider } from '../../framework';
import { VEC3_0 } from '../../utils/util';
import { IBoxShape } from '../../spec/i-physics-shape';
import { PX, USE_BYTEDANCE } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXBoxShape extends PhysXShape implements IBoxShape {
    static BOX_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.BOX);
        if (!PhysXBoxShape.BOX_GEOMETRY) {
            if (USE_BYTEDANCE) {
                VEC3_0.set(0.5, 0.5, 0.5);
                PhysXBoxShape.BOX_GEOMETRY = new PX.BoxGeometry(VEC3_0);
            } else {
                PhysXBoxShape.BOX_GEOMETRY = new PX.PxBoxGeometry(0.5, 0.5, 0.5);
            }
        }
    }

    setSize (v: IVec3Like): void {
        this.updateScale();
    }

    get collider (): BoxCollider {
        return this._collider as BoxCollider;
    }

    onComponentSet (): void {
        this.updateGeometry();
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(this._collider.sharedMaterial!);
        this._impl = physics.createShape(PhysXBoxShape.BOX_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale (): void {
        this.updateGeometry();
        this._impl.setGeometry(PhysXBoxShape.BOX_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const co = this.collider;
        const ws = co.node.worldScale;
        VEC3_0.set(co.size);
        VEC3_0.multiplyScalar(0.5);
        VEC3_0.multiply3f(Math.abs(ws.x), Math.abs(ws.y), Math.abs(ws.z));
        if (USE_BYTEDANCE) {
            PhysXBoxShape.BOX_GEOMETRY.setHalfExtents(VEC3_0);
        } else {
            PhysXBoxShape.BOX_GEOMETRY.halfExtents = VEC3_0;
        }
    }
}
