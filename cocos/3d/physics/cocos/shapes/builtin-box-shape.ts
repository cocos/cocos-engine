import { Vec3 } from '../../../../core/math';
import { obb } from '../../../geom-utils';
import { BuiltinShape } from './builtin-shape';

export class BuiltinBoxShape extends BuiltinShape {

    private _localObb: obb;

    private _worldObb: obb;

    get halfExtents (): Vec3 {
        return this._localObb.halfExtents;
    }

    constructor (size: Vec3) {
        super();
        this._localObb = new obb();
        this._worldObb = new obb();
        this._localShape = this._localObb;
        this._worldShape = this._worldObb;
    }

    public setSize (size: Vec3) {
        Vec3.multiplyScalar(this._localObb.halfExtents, size, 0.5);
    }

}
