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
        getContactPosition(this.impl, out, this.event.impl);
        Vec3.subtract(out, out, this.colliderA.node.worldPosition);
    }

    getLocalPointOnB (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
        Vec3.subtract(out, out, this.colliderB.node.worldPosition);
    }

    getWorldPointOnA (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
    }

    getWorldPointOnB (out: IVec3Like): void {
        getContactPosition(this.impl, out, this.event.impl);
    }

    getLocalNormalOnA (out: IVec3Like): void {
        this.getWorldNormalOnA(out);
        Quat.conjugate(quat, this.colliderA.node.worldRotation);
        Vec3.transformQuat(out, out, quat);
    }

    getLocalNormalOnB (out: IVec3Like): void {
        this.getWorldNormalOnB(out);
        Quat.conjugate(quat, this.colliderB.node.worldRotation);
        Vec3.transformQuat(out, out, quat);
    }

    getWorldNormalOnA (out: IVec3Like): void {
        getContactNormal(this.impl, out, this.event.impl);
        if (!this.isBodyA) Vec3.negate(out, out);
    }

    getWorldNormalOnB (out: IVec3Like): void {
        getContactNormal(this.impl, out, this.event.impl);
    }
}
