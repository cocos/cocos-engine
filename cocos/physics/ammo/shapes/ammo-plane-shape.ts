import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { PlaneCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, ammoDeletePtr } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoPlaneShape extends AmmoShape implements IPlaneShape {

    setNormal (v: IVec3Like) {
        cocos2AmmoVec3(this.impl.getPlaneNormal(), v);
        this.updateCompoundTransform();
    }

    setConstant (v: number) {
        this.impl.setPlaneConstant(v);
        this.updateCompoundTransform();
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

    get impl () {
        return this._btShape as Ammo.btStaticPlaneShape;
    }

    get collider () {
        return this._collider as PlaneCollider;
    }

    readonly NORMAL: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.STATIC_PLANE_PROXYTYPE);
        this.NORMAL = new Ammo.btVector3(0, 1, 0);
    }

    onComponentSet () {
        cocos2AmmoVec3(this.NORMAL, this.collider.normal);
        this._btShape = new Ammo.btStaticPlaneShape(this.NORMAL, this.collider.constant);
        this.setScale();
    }

    onDestroy () {
        super.onDestroy();
        Ammo.destroy(this.NORMAL);
        ammoDeletePtr(this.NORMAL, Ammo.btVector3);
        (this.NORMAL as any) = null;
    }

}
