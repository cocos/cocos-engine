import Ammo from '@cocos/ammo';
import { Vec3 } from "../../../core";
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
        const max_sp = Math.abs(Math.max(Math.max(ws.x, ws.y), ws.z));
        v3_0.set(radius, radius, radius);
        v3_0.multiplyScalar(max_sp * 2);
        cocos2AmmoVec3(this.scale, v3_0);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

    get btCapsule () {
        return this._btShape as Ammo.btCapsuleShape;
    }

    get capsuleCollider () {
        return this._collider as CapsuleColliderComponent;
    }

    constructor (radius: number, height: number) {
        super(AmmoBroadphaseNativeTypes.CAPSULE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btCapsuleShape(radius, height);
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
