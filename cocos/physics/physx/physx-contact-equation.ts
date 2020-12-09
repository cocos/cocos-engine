import { IVec3Like, Vec3, Quat } from '../../core';
import { IContactEquation, ICollisionEvent, Collider } from '../framework';
import { USE_BYTEDANCE } from './export-physx';

const quat = new Quat();
export class PhysXContactEquation implements IContactEquation {
    get isBodyA (): boolean {
        return this.colliderA.uuid === this.event.selfCollider.uuid;
    }

    impl: any = null;
    event: ICollisionEvent;
    colliderA!: Collider;
    colliderB!: Collider;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        if (USE_BYTEDANCE) {
            Vec3.subtract(out, this.impl.getPosition(), this.colliderA.node.worldPosition);
        } else {
            Vec3.subtract(out, this.impl.position, this.colliderA.node.worldPosition);
        }
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (USE_BYTEDANCE) {
            Vec3.subtract(out, this.impl.getPosition(), this.colliderB.node.worldPosition);
        } else {
            Vec3.subtract(out, this.impl.position, this.colliderB.node.worldPosition);
        }
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (USE_BYTEDANCE) {
            Vec3.copy(out, this.impl.getPosition());
        } else {
            Vec3.copy(out, this.impl.position);
        }
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (USE_BYTEDANCE) {
            Vec3.copy(out, this.impl.getPosition());
        } else {
            Vec3.copy(out, this.impl.position);
        }
    }

    getLocalNormalOnB (out: IVec3Like): void {
        Quat.conjugate(quat, this.colliderB.node.worldRotation);
        if (USE_BYTEDANCE) {
            Vec3.transformQuat(out, this.impl.getNormal(), quat);
        } else {
            Vec3.transformQuat(out, this.impl.normal, quat);
        }
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (USE_BYTEDANCE) {
            Vec3.copy(out, this.impl.getNormal());
        } else {
            Vec3.copy(out, this.impl.normal);
        }
    }
}
