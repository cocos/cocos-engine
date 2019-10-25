import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { ShapeBase, SphereShapeBase } from '../../api';
import { maxComponent, setWrap } from '../../util';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';

export class CannonSphereShape extends CannonShape implements SphereShapeBase {
    private _sphere: CANNON.Sphere;

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._sphere = new CANNON.Sphere(this._radius);
        setWrap<ShapeBase>(this._sphere, this);
        this._shape = this._sphere;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcRadius();
    }

    public setRadius (radius: number) {
        this._radius = radius;
        this._recalcRadius();
    }

    public _devStrinfy () {
        return `Sphere(${super._devStrinfy()}, radius: ${this._sphere.radius})`;
    }

    private _recalcRadius () {
        this._sphere.radius = this._radius * maxComponent(this._scale);

        if (this._body != null) {
            commitShapeUpdates(this._body);
        }
    }
}
