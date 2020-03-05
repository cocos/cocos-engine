import Ammo from '@cocos/ammo';
import { Vec3, absMax } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { CapsuleColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoCapsuleShape extends AmmoShape implements ICapsuleShape {

    set height (v: number) {
        this.updateCapsuleProp(this.capsuleCollider.radius, v, this._collider.node.worldScale);
    }

    set direction (v: number) {
        this.btCapsule.setUpAxis(v);
    }

    set radius (v: number) {
        this.updateCapsuleProp(v, this.capsuleCollider.height, this._collider.node.worldScale);
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

    /**
     * radius \ height \ scale
     */
    updateCapsuleProp (radius: number, height: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = this.btCapsule.getUpAxis();
        const isd = this.btCapsule.getImplicitShapeDimensions();
        if (upAxis == 1) {
            const wh = height * Math.abs(ws.y);
            const wr = radius * absMax(ws.x, ws.z);
            const halfH = (wh - wr * 2) / 2;
            isd.setValue(wr, halfH, wr);
        } else if (upAxis == 0) {
            const wh = height * Math.abs(ws.x);
            const wr = radius * absMax(ws.y, ws.z);
            const halfH = (wh - wr * 2) / 2;
            isd.setValue(halfH, wr, wr);
        } else {
            const wh = height * Math.abs(ws.z);
            const wr = radius * absMax(ws.x, ws.y);
            const halfH = (wh - wr * 2) / 2;
            isd.setValue(wr, wr, halfH);
        }
        cocos2AmmoVec3(this.scale, Vec3.ONE);
        this.btCapsule.setLocalScaling(this.scale);
    }
}
