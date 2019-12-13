import { sphere } from '../../../core/geom-utils';
import { BuiltinShape } from './builtin-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { maxComponent } from '../../framework/util';
import { SphereColliderComponent } from '../../../../exports/physics-framework';

export class BuiltinSphereShape extends BuiltinShape implements ISphereShape {

    set radius (radius: number) {
        this.localSphere.radius = radius;
        const s = maxComponent(this.collider.node.worldScale);
        this.worldSphere.radius = this.localSphere.radius * s;
    }

    get localSphere () {
        return this._localShape as sphere;
    }

    get worldSphere () {
        return this._worldShape as sphere;
    }

    get sphereCollider () {
        return this.collider as SphereColliderComponent;
    }

    constructor (radius: number) {
        super();
        this._localShape = new sphere(0, 0, 0, radius);
        this._worldShape = new sphere(0, 0, 0, radius);
    }

    onLoad () {
        super.onLoad();
        this.radius = this.sphereCollider.radius;
    }

}
