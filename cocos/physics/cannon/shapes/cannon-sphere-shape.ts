import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { ShapeBase, SphereShapeBase } from '../../api';
import { maxComponent, setWrap } from '../../util';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/IPhysicsSpahe';

export class CannonSphereShape extends CannonShape implements ISphereShape {

    private get _sphere (): CANNON.Sphere {
        return this._shape as CANNON.Sphere;
    }

    private _radius: number;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._shape = new CANNON.Sphere(this._radius);
    }

    set radius (v: number) {
        this._sphere.radius = this._radius * maxComponent(this.collider.node.worldScale);

        if (this._body != null) {
            commitShapeUpdates(this._body);
        }
    }

    // public setScale (scale: Vec3): void {
    //     super.setScale(scale);
    //     this._recalcRadius();
    // }

    // public setRadius (radius: number) {
    //     this._radius = radius;
    //     this._recalcRadius();
    // }

    // public _devStrinfy () {
    //     return `Sphere(${super._devStrinfy()}, radius: ${this._sphere.radius})`;
    // }

    // private _recalcRadius () {
    //     this._sphere.radius = this._radius * maxComponent(this._scale);

    //     if (this._body != null) {
    //         commitShapeUpdates(this._body);
    //     }
    // }
}
