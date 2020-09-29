import { sphere } from '../../../core/geometry';
import { BuiltinShape } from './builtin-shape';
import { ISphereShape } from '../../spec/i-physics-shape';
import { maxComponent } from '../../framework/util';
import { SphereCollider } from '../../../../exports/physics-framework';

export class BuiltinSphereShape extends BuiltinShape implements ISphereShape {

    setRadius (radius: number) {
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

    get collider () {
        return this._collider as SphereCollider;
    }

    constructor (radius = 0.5) {
        super();
        this._localShape = new sphere(0, 0, 0, radius);
        this._worldShape = new sphere(0, 0, 0, radius);
    }

    onLoad () {
        super.onLoad();
        this.setRadius(this.collider.radius);
    }

}
