import Ammo from '../ammo-instantiated';
import { absMax } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { CapsuleCollider } from '../../../../exports/physics-framework';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoCapsuleShape extends AmmoShape implements ICapsuleShape {

    setCylinderHeight (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    setDirection (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    setRadius (v: number) {
        this.updateProperties(
            this.collider.radius,
            this.collider.cylinderHeight,
            this.collider.direction,
            this._collider.node.worldScale
        );
    }

    get impl () {
        return this._btShape as Ammo.btCapsuleShape;
    }

    get collider () {
        return this._collider as CapsuleCollider;
    }

    constructor () {
        super(AmmoBroadphaseNativeTypes.CAPSULE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btCapsuleShape(0.5, 1);
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
            const wr = radius * Math.abs(absMax(ws.x, ws.z));
            const halfH = height / 2 * Math.abs(ws.y);
            this.impl.updateProp(wr, halfH, upAxis);
        } else if (upAxis == 0) {
            const wr = radius * Math.abs(absMax(ws.y, ws.z));
            const halfH = height / 2 * Math.abs(ws.x);
            this.impl.updateProp(wr, halfH, upAxis);
        } else {
            const wr = radius * Math.abs(absMax(ws.x, ws.y));
            const halfH = height / 2 * Math.abs(ws.z);
            this.impl.updateProp(wr, halfH, upAxis);
        }
        this.updateCompoundTransform();
    }
}
