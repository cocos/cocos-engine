import { absMax, Quat } from '../../../core';
import { CapsuleCollider, EAxisDirection } from '../../framework';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { PX } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXCapsuleShape extends PhysXShape implements ICapsuleShape {
    static CAPSULE_GEOMETRY: any;

    constructor () {
        super(EPhysXShapeType.CAPSULE);
        if (!PhysXCapsuleShape.CAPSULE_GEOMETRY) {
            PhysXCapsuleShape.CAPSULE_GEOMETRY = new PX.CapsuleGeometry(0.5, 0.5);
        }
    }

    setCylinderHeight (v: number): void {
        this.updateScale();
    }

    setDirection (v: number): void {
        this.updateScale();
    }

    setRadius (v: number): void {
        this.updateScale();
    }

    get collider (): CapsuleCollider {
        return this._collider as CapsuleCollider;
    }

    onComponentSet (): void {
        this.updateGeometry();
        const physics = this._sharedBody.wrappedWorld.physics;
        const pxmat = this.getSharedMaterial(this._collider.sharedMaterial!);
        this._impl = physics.createShape(PhysXCapsuleShape.CAPSULE_GEOMETRY, pxmat, true, this._flags);
    }

    updateScale (): void {
        this.updateGeometry();
        this._impl.setGeometry(PhysXCapsuleShape.CAPSULE_GEOMETRY);
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const co = this.collider;
        const ws = co.node.worldScale;
        const upAxis = co.direction;
        let r = 0.5; let hf = 0.5;
        if (upAxis === EAxisDirection.Y_AXIS) {
            r = co.radius * Math.abs(absMax(ws.x, ws.z));
            hf = co.cylinderHeight / 2 * Math.abs(ws.y);
            Quat.fromEuler(this._rotation, 0, 0, 90);
        } else if (upAxis === EAxisDirection.X_AXIS) {
            r = co.radius * Math.abs(absMax(ws.y, ws.z));
            hf = co.cylinderHeight / 2 * Math.abs(ws.x);
            Quat.fromEuler(this._rotation, 0, 0, 0);
        } else {
            r = co.radius * Math.abs(absMax(ws.x, ws.y));
            hf = co.cylinderHeight / 2 * Math.abs(ws.z);
            Quat.fromEuler(this._rotation, 0, 90, 0);
        }
        PhysXCapsuleShape.CAPSULE_GEOMETRY.setRadius(Math.max(0.0001, r));
        PhysXCapsuleShape.CAPSULE_GEOMETRY.setHalfHeight(Math.max(0.0001, hf));
    }
}
