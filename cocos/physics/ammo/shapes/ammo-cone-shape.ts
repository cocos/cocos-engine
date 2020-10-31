import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { ConeCollider } from '../../../../exports/physics-framework';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { absMax } from '../../../core';

export class AmmoConeShape extends AmmoShape implements ICylinderShape {

    setHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.height,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    get impl () {
        return this._btShape as Ammo.btConeShape;
    }

    get collider () {
        return this._collider as ConeCollider;
    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.CONE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btConeShape(0.5, 1);
    }

    onComponentSet () {
        this.setRadius(this.collider.radius);
    }

    setScale () {
        super.setScale();
        this.setRadius(this.collider.radius);
    }

    updateProperties (radius: number, height: number, direction: number, scale: IVec3Like) {
        const ws = scale;
        const upAxis = direction;
        if (upAxis == 1) {
            const wh = height * Math.abs(ws.y);
            const wr = radius * Math.abs(absMax(ws.x, ws.z));
            this.impl.setRadius(wr);
            this.impl.setHeight(wh);
        } else if (upAxis == 0) {
            const wh = height * Math.abs(ws.x);
            const wr = radius * Math.abs(absMax(ws.y, ws.z));
            this.impl.setRadius(wr);
            this.impl.setHeight(wh);
        } else {
            const wh = height * Math.abs(ws.z);
            const wr = radius * Math.abs(absMax(ws.x, ws.y));
            this.impl.setRadius(wr);
            this.impl.setHeight(wh);
        }
        this.impl.setConeUpIndex(upAxis);
        this.scale.setValue(1, 1, 1);
        this.impl.setLocalScaling(this.scale);
        this.updateCompoundTransform();
    }

}
