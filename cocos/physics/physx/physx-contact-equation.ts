import { IVec3Like, Vec3, Quat } from '../../core';
import { IContactEquation, ICollisionEvent, Collider } from '../framework';
import { getContactNormal, getContactPosition } from './export-physx';

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
        Vec3.subtract(out, getContactPosition(this.impl), this.colliderA.node.worldPosition);
    }

    getLocalPointOnB (out: IVec3Like): void {
        Vec3.subtract(out, getContactPosition(this.impl), this.colliderB.node.worldPosition);
    }

    getWorldPointOnA (out: IVec3Like): void {
        Vec3.copy(out, getContactPosition(this.impl));
    }

    getWorldPointOnB (out: IVec3Like): void {
        Vec3.copy(out, getContactPosition(this.impl));
    }

    getLocalNormalOnB (out: IVec3Like): void {
        Quat.conjugate(quat, this.colliderB.node.worldRotation);
        Vec3.transformQuat(out, getContactNormal(this.impl), quat);
    }

    getWorldNormalOnB (out: IVec3Like): void {
        Vec3.copy(out, getContactNormal(this.impl));
    }
}
