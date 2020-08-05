import { IContactEquation, ICollisionEvent } from "../framework";
import { IVec3Like, Vec3 } from "../../core";
import { CannonShape } from "./shapes/cannon-shape";

export class CannonContactEquation implements IContactEquation {

    get isBodyA (): boolean {
        const si = (this.event.selfCollider.shape as CannonShape).impl;
        const bj = this.impl!.bj;
        return si.body.id == bj.id;
    }

    impl: CANNON.ContactEquation | null = null;
    event: ICollisionEvent;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.rj);
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.ri);
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (this.impl) Vec3.add(out, this.impl.rj, this.impl.bj.position);
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (this.impl) Vec3.add(out, this.impl.ri, this.impl.bi.position);
    }

    getLocalNormalOnB (out: IVec3Like): void {
        if (this.impl) Vec3.copy(out, this.impl.ni);
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (this.impl) Vec3.transformQuat(out, this.impl.ni, this.impl.bi.quaternion);
    }

}