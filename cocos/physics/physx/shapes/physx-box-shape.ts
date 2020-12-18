import { IVec3Like } from '../../../core';
import { BoxCollider } from '../../framework';
import { VEC3_0 } from '../../utils/util';
import { IBoxShape } from '../../spec/i-physics-shape';
import { PX } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXBoxShape extends PhysXShape implements IBoxShape {
    static BOX_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.BOX);
        if (!PhysXBoxShape.BOX_GEOMETRY) {
            VEC3_0.set(0.5, 0.5, 0.5);
            PhysXBoxShape.BOX_GEOMETRY = new PX.BoxGeometry(VEC3_0);
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
        VEC3_0.multiply(ws);
        VEC3_0.x = Math.abs(VEC3_0.x);
        VEC3_0.y = Math.abs(VEC3_0.y);
        VEC3_0.z = Math.abs(VEC3_0.z);
        PhysXBoxShape.BOX_GEOMETRY.setHalfExtents(VEC3_0);
    }
}
