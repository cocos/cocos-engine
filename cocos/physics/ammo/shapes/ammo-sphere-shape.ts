import Ammo from '../ammo-instantiated';
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { SphereColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ISphereShape } from '../../spec/i-physics-shape';

const v3_0 = new Vec3();

export class AmmoSphereShape extends AmmoShape implements ISphereShape {

    setRadius (radius: number) {
        this.impl.setUnscaledRadius(radius);
        this.updateCompoundTransform();
    }

    get impl () {
        return this._btShape as Ammo.btSphereShape;
    }

    get collider () {
        return this._collider as SphereColliderComponent;
    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btSphereShape(0.5);
    }

    onComponentSet () {
        this.setRadius(this.collider.radius);
        this.setScale();
    }

    setScale () {
        super.setScale();
        const ws = this._collider.node.worldScale;
        const absX = Math.abs(ws.x);
        const absY = Math.abs(ws.y);
        const absZ = Math.abs(ws.z);
        const max_sp = Math.max(Math.max(absX, absY), absZ);
        v3_0.set(max_sp, max_sp, max_sp);
        cocos2AmmoVec3(this.scale, v3_0);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }
}
