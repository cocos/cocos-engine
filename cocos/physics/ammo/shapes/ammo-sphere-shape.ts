import { SphereShapeBase } from "../../api";
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";


export class AmmoSphereShape extends AmmoShape implements SphereShapeBase {

    private _ammoSphere: Ammo.btSphereShape;

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._ammoSphere = new Ammo.btSphereShape(this._radius);
        this._ammoShape = this._ammoSphere;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcRadius();
    }

    public setRadius (radius: number) {
        this._radius = radius;
        this._recalcRadius();
    }

    private _recalcRadius () {
        // const radius = this._radius * maxComponent(this._scale);
        // this._ammoSphere = new Ammo.btSphereShape(radius);
    }
}