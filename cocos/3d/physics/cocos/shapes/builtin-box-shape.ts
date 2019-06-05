import { vec3 } from '../../../../core/vmath';
import { obb } from '../../../geom-utils';
import { BuiltinShape } from './builtin-shape';

export class BuiltinBoxShape extends BuiltinShape {

    private _localObb: obb;

    private _worldObb: obb;

    get halfExtents (): vec3 {
        return this._localObb.halfExtents;
    }

    constructor (size: vec3) {
        super();
        this._localObb = new obb();
        this._worldObb = new obb();
        this._localShape = this._localObb;
        this._worldShape = this._worldObb;
    }

    public setSize (size: vec3) {
        vec3.scale(this._localObb.halfExtents, size, 0.5);
    }

}
