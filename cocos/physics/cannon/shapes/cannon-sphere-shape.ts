import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { maxComponent } from '../../framework/util';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { SphereColliderComponent } from '../../../../exports/physics-framework';

export class CannonSphereShape extends CannonShape implements ISphereShape {

    get collider () {
        return this.collider as SphereColliderComponent;
    }

    get shape () {
        return this._shape as CANNON.Sphere;
    }

    get radius () {
        return this._radius;
    }

    set radius (v: number) {
        const max = maxComponent(this.collider.node.worldScale);
        this.shape.radius = v * Math.abs(max);
        this.shape.updateBoundingSphereRadius();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    private _radius: number;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._shape = new CANNON.Sphere(this._radius);
    }

    onLoad () {
        super.onLoad();
        this.radius = this.collider.radius;
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.radius = this.collider.radius;
    }

}
