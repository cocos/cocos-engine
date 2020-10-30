import Ammo from '../ammo-instantiated';
import { AmmoShape } from "./ammo-shape";
import { CylinderCollider } from '../../../../exports/physics-framework';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { absMax } from '../../../core';
import { ammoDeletePtr } from '../ammo-util';

export class AmmoCylinderShape extends AmmoShape implements ICylinderShape {

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
        return this._btShape as Ammo.btCylinderShape;
    }

    get collider () {
        return this._collider as CylinderCollider;
    }

    readonly halfExtents: Ammo.btVector3;

    constructor () {
        super(AmmoBroadphaseNativeTypes.CYLINDER_SHAPE_PROXYTYPE);
        this.halfExtents = new Ammo.btVector3(0.5, 1, 0.5);
        this._btShape = new Ammo.btCylinderShape(this.halfExtents);
    }

    onComponentSet () {
        this.setRadius(this.collider.radius);
    }

    onDestroy () {
        Ammo.destroy(this.halfExtents);
        ammoDeletePtr(this.halfExtents, Ammo.btVector3);
        super.onDestroy();
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
            const halfH = wh / 2;
            this.impl.updateProp(wr, halfH, upAxis);
        } else if (upAxis == 0) {
            const wh = height * Math.abs(ws.x);
            const wr = radius * Math.abs(absMax(ws.y, ws.z));
            const halfH = wh / 2;
            this.impl.updateProp(wr, halfH, upAxis);
        } else {
            const wh = height * Math.abs(ws.z);
            const wr = radius * Math.abs(absMax(ws.x, ws.y));
            const halfH = wh / 2;
            this.impl.updateProp(wr, halfH, upAxis);
        }
        this.updateCompoundTransform();
    }

}
