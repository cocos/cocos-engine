import Ammo from '@cocos/ammo';
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { BoxColliderComponent } from '../../../../exports/physics-framework';
import { cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-shape';

const v3_0 = new Vec3();

export class AmmoBoxShape extends AmmoShape implements IBoxShape {

    set size (size: Vec3) {
        Vec3.copy(v3_0, size);
        Vec3.multiply(v3_0, v3_0, this._collider.node.worldScale);
        cocos2AmmoVec3(this.scale, v3_0);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

    get boxShape () {
        return this._btShape as Ammo.btBoxShape;
    }

    get boxCollider () {
        return this._collider as BoxColliderComponent;
    }

    readonly halfExt: Ammo.btVector3;

    constructor (size: Vec3) {
        super(AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
        this.halfExt = new Ammo.btVector3(0.5, 0.5, 0.5);
        this._btShape = new Ammo.btBoxShape(this.halfExt);
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }

    onDestroy () {
        super.onDestroy();
        Ammo.destroy(this.halfExt);
        (this.halfExt as any) = null;
    }

    updateScale () {
        super.updateScale();
        this.size = this.boxCollider.size;
    }

}
