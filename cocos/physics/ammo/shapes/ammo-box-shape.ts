import { BoxShapeBase } from "../../api";
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";


export class AmmoBoxShape extends AmmoShape implements BoxShapeBase {

    private _ammoBox: Ammo.btBoxShape;
    private _halfExtent: Vec3 = new Vec3();

    constructor (size: Vec3) {
        super();
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        const halfExtents = this._halfExtent;
        this._ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
        this._ammoShape = this._ammoBox;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();
    }

    public setSize (size: Vec3) {
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    private _recalcExtents () {
        const halfExtents = new Vec3();
        Vec3.multiply(halfExtents, this._halfExtent, this._scale);
        this._ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
    }
}
