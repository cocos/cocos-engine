import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { BoxColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

const v3_0 = new Vec3();

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
        return this._collider as BoxColliderComponent;
    }

    readonly halfExt: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
        this.halfExt = new Ammo.btVector3(0.5, 0.5, 0.5);
        this._btShape = new Ammo.btBoxShape(this.halfExt);
    }

    onComponentSet () {
        this.setSize(this.collider.size);
        this.setScale();
    }

    onDestroy () {
        super.onDestroy();
        Ammo.destroy(this.halfExt);
        (this.halfExt as any) = null;
    }

    setScale () {
        super.setScale();
        cocos2AmmoVec3(this.scale, this._collider.node.worldScale);
        this._btShape.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

}
