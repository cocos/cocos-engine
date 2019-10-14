import Ammo from 'ammo.js';
import { SphereShapeBase } from "../../api";
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { SphereColliderComponent } from '../../../../exports/physics-framework';

export class AmmoSphereShape extends AmmoShape implements SphereShapeBase {

    public get ammoSphere (): Ammo.btSphereShape {
        return this._ammoShape as Ammo.btSphereShape;
    }

    public get sphereCollider (): SphereColliderComponent {
        return this.collider as SphereColliderComponent;
    }

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
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

    public __preload () {
        super.__preload();
        /** 构造Sphere */
        this._ammoShape = new Ammo.btSphereShape(this.sphereCollider.radius);
        /** 初始化Box形状属性 */
        // this._ammoShape.getLocalScaling()
    }
}