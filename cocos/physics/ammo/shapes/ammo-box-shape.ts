import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { BoxCollider } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3, ammoDeletePtr } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { CC_V3_0 } from '../ammo-const';

const v3_0 = CC_V3_0;

export class AmmoBoxShape extends AmmoShape implements IBoxShape {

    setSize (size: IVec3Like) {
        Vec3.multiplyScalar(v3_0, size, 0.5);
        cocos2AmmoVec3(this.halfExt, v3_0);
        this.impl.setUnscaledHalfExtents(this.halfExt);
        this.updateCompoundTransform();
    }

    get impl () {
        return this._btShape as Ammo.btBoxShape;
    }

    get collider () {
        return this._collider as BoxCollider;
    }

    readonly halfExt: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
        this.halfExt = new Ammo.btVector3(0.5, 0.5, 0.5);
    }

    onComponentSet () {
        const s = this.collider.size;
        this.halfExt.setValue(s.x / 2, s.y / 2, s.z / 2);
        this._btShape = new Ammo.btBoxShape(this.halfExt);
        this.setScale();
    }

    onDestroy () {
        Ammo.destroy(this.halfExt);
        ammoDeletePtr(this.halfExt, Ammo.btVector3);
        (this.halfExt as any) = null;
        super.onDestroy();
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

}
