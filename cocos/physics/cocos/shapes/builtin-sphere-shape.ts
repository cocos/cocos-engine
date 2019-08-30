import { sphere } from '../../../core/geom-utils';
import { BuiltinShape } from './builtin-shape';

export class BuiltinSphereShape extends BuiltinShape {

    private _localSphere: sphere;

    private _worldSphere: sphere;

    public get radius () {
        return this._localSphere.radius;
    }

    constructor (radius: number) {
        super();
        this._localSphere = new sphere(0, 0, 0, radius);
        this._worldSphere = new sphere(0, 0, 0, radius);
        this._localShape = this._localSphere;
        this._worldShape = this._worldSphere;
    }

    public setRadius (radius: number) {
        this._localSphere.radius = radius;
    }
}
