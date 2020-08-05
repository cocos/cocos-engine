import { IContactEquation, ICollisionEvent } from "../framework";
import { IVec3Like, Vec3, Quat } from "../../core";
import { ammo2CocosVec3, ammo2CocosQuat } from "./ammo-util";
import { AmmoShape } from "./shapes/ammo-shape";
import { CC_QUAT_0, AmmoConstant } from "./ammo-const";

export class AmmoContactEquation implements IContactEquation {

    get isBodyA (): boolean {
        const sb = (this.event.selfCollider.shape as AmmoShape).sharedBody.body;
        const b0 = (this.event.impl as Ammo.btPersistentManifold).getBody0();
        return Ammo.compare(b0, sb);
    }

    impl: Ammo.btManifoldPoint | null = null;
    event: ICollisionEvent;

    constructor (event: ICollisionEvent) {
        this.event = event;
    }

    getLocalPointOnA (out: IVec3Like): void {
        if (this.impl) ammo2CocosVec3(out, this.impl.m_localPointA);
    }

    getLocalPointOnB (out: IVec3Like): void {
        if (this.impl) ammo2CocosVec3(out, this.impl.m_localPointB);
    }

    getWorldPointOnA (out: IVec3Like): void {
        if (this.impl) ammo2CocosVec3(out, this.impl.m_positionWorldOnA);
    }

    getWorldPointOnB (out: IVec3Like): void {
        if (this.impl) ammo2CocosVec3(out, this.impl.m_positionWorldOnB);
    }

    getLocalNormalOnB (out: IVec3Like): void {
        if (this.impl) {
            const inv_rot = CC_QUAT_0;
            const bt_rot = AmmoConstant.instance.QUAT_0;
            const body = (this.event.impl as Ammo.btPersistentManifold).getBody1();
            body.getWorldTransform().getBasis().getRotation(bt_rot);
            ammo2CocosQuat(inv_rot, bt_rot);
            Quat.invert(inv_rot, inv_rot);
            ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
            Vec3.transformQuat(out, out, inv_rot);
        }
    }

    getWorldNormalOnB (out: IVec3Like): void {
        if (this.impl) ammo2CocosVec3(out, this.impl.m_normalWorldOnB);
    }

}