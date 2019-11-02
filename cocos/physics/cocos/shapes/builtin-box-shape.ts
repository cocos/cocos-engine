import { Vec3 } from '../../../core/math';
import { obb } from '../../../core/geom-utils';
import { BuiltinShape } from './builtin-shape';
import { IBoxShape } from '../../spec/i-physics-spahe';
import { BoxColliderComponent } from '../../../../exports/physics-framework';

export class BuiltinBoxShape extends BuiltinShape implements IBoxShape {

    get localObb () {
        return this._localShape as obb;
    }

    get worldObb () {
        return this._worldShape as obb;
    }

    public get boxCollider () {
        return this.collider as BoxColliderComponent;
    }

    constructor (size: Vec3) {
        super();
        this._localShape = new obb();
        this._worldShape = new obb();
        Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);
        Vec3.copy(this.worldObb.halfExtents, this.localObb.halfExtents);
    }

    set size (size: Vec3) {
        Vec3.multiplyScalar(this.localObb.halfExtents, size, 0.5);
        Vec3.multiply(this.worldObb.halfExtents, this.localObb.halfExtents, this.collider.node.worldScale);
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }

}
