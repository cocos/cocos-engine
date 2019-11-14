import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { maxComponent } from '../../framework/util';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { ISphereShape } from '../../spec/i-physics-spahe';
import { SphereColliderComponent } from '../../../../exports/physics-framework';

export class CannonSphereShape extends CannonShape implements ISphereShape {

    get sphereCollider () {
        return this.collider as SphereColliderComponent;
    }

    get sphere () {
        return this._shape as CANNON.Sphere;
    }

    get radius () {
        return this._radius;
    }

    set radius (v: number) {
        const max = maxComponent(this.collider.node.worldScale);
        this.sphere.radius = v * Math.abs(max);
        this.sphere.updateBoundingSphereRadius();
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
        this.radius = this.sphereCollider.radius;
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.radius = this.sphereCollider.radius;
    }

}
