import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { maxComponent } from '../../framework/util';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { SphereColliderComponent } from '../../../../exports/physics-framework';

export class CannonSphereShape extends CannonShape implements ISphereShape {

    get collider () {
        return this._collider as SphereColliderComponent;
    }

    get impl () {
        return this._shape as CANNON.Sphere;
    }

    setRadius (v: number) {
        const max = maxComponent(this.collider.node.worldScale);
        this.impl.radius = v * Math.abs(max);
        this.impl.updateBoundingSphereRadius();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    constructor (radius = 0.5) {
        super();
        this._shape = new CANNON.Sphere(radius);
    }

    onLoad () {
        super.onLoad();
        this.setRadius(this.collider.radius);
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.setRadius(this.collider.radius);
    }

}
