import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { CylinderColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoCylinderShape extends AmmoShape implements ICylinderShape {

    setHeight (v: number) {
    }

    setDirection (v: number) {
    }

    setRadius (v: number) {
    }

    get impl () {
        return this._btShape as Ammo.btCylinderShape;
    }

    get collider () {
        return this._collider as CylinderColliderComponent;
    }

    readonly halfExtents: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.CYLINDER_SHAPE_PROXYTYPE);
        this.halfExtents = new Ammo.btVector3(0.5, 1, 0.5);
        this._btShape = new Ammo.btCylinderShape(this.halfExtents);
    }

    onLoad () {
        super.onLoad();
    }

    updateScale () {
        super.updateScale();
    }

    /**
     * radius \ height \ scale
     */
    updateCylinderProp (radius: number, height: number, scale: IVec3Like) {
    }
}
