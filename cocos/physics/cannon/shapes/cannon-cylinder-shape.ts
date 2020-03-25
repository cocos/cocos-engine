import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { CannonShape } from './cannon-shape';
import { ICylinderShape } from '../../spec/i-physics-shape';
import { CylinderColliderComponent } from '../../../../exports/physics-framework';
import { EAxisDirection } from '../../framework/physics-enum';

export class CannonCyliderShape extends CannonShape implements ICylinderShape {

    get collider () {
        return this._collider as CylinderColliderComponent;
    }

    get impl () {
        return this._shape as CANNON.Cylinder;
    }

    setRadius (v: number) {

    }

    setHeight (v: number) {

    }

    setDirection (v: number) {

    }

    constructor (radius = 0.5, height = 1, direction = EAxisDirection.Y_AXIS) {
        super();
        this._shape = new CANNON.Cylinder(radius, radius, height, 16);
    }

    onLoad () {
        super.onLoad();
        // this.setRadius(this.collider.radius);
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        // this.setRadius(this.collider.radius);
    }

}
