import Ammo from '@cocos/ammo';
import { Vec3, absMaxComponent } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { CapsuleColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICapsuleShape } from '../../spec/i-physics-shape';

const v3_0 = new Vec3();

export class AmmoCapsuleShape extends AmmoShape implements ICapsuleShape {
    set height (v: number) {

    }

    set direction (v: number) {

    }

    set radius (radius: number) {
        const ws = this._collider.node.worldScale;
        const s = absMaxComponent(ws);
        const wr = this.radius * Math.abs(s);
        const wh = this.height * Math.abs(ws.y);
        let h = wh - wr * 2;
        if (h < 0) h = 0;
        const halfH = h / 2;
        // this.btCapsule
    }

    get btCapsule () {
        return this._btShape as Ammo.btCapsuleShape;
    }

    get capsuleCollider () {
        return this._collider as CapsuleColliderComponent;
    }

    constructor (radius: number, height: number) {
        super(AmmoBroadphaseNativeTypes.CAPSULE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btCapsuleShape(0.5, 1);
    }

    onLoad () {
        super.onLoad();
        this.radius = this.capsuleCollider.radius;
    }

    updateScale () {
        super.updateScale();
        this.radius = this.capsuleCollider.radius;
    }
}
