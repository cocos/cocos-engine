import CANNON from '@cocos/cannon';
import { Vec3, Quat } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IPlaneShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { PlaneCollider } from '../../../../exports/physics-framework';

export class CannonPlaneShape extends CannonShape implements IPlaneShape {

    public get collider () {
        return this._collider as PlaneCollider;
    }

    public get impl () {
        return this._shape as CANNON.Plane;
    }

    constructor () {
        super();
        this._shape = new CANNON.Plane();
    }

    setNormal (v: IVec3Like) {
        Quat.rotationTo(this._orient, Vec3.UNIT_Z, v);
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    setConstant (v: number) {
        Vec3.scaleAndAdd(this._offset, this._collider.center, this.collider.normal, v);
    }

    onLoad () {
        super.onLoad();
        this.setConstant(this.collider.constant);
        this.setNormal(this.collider.normal);
    }

    _setCenter (v: IVec3Like) {
        super._setCenter(v);
        this.setConstant(this.collider.constant);
    }
}
