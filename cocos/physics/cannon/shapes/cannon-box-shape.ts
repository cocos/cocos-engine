import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BoxColliderComponent } from '../../../../exports/physics-framework';

export class CannonBoxShape extends CannonShape implements IBoxShape {

    public get boxCollider () {
        return this.collider as BoxColliderComponent;
    }

    public get box () {
        return this._shape as CANNON.Box;
    }

    readonly halfExtent: CANNON.Vec3 = new CANNON.Vec3();
    constructor (size: Vec3) {
        super();
        Vec3.multiplyScalar(this.halfExtent, size, 0.5);
        this._shape = new CANNON.Box(this.halfExtent.clone());
    }

    set size (v: IVec3Like) {
        Vec3.multiplyScalar(this.halfExtent, v, 0.5);
        Vec3.multiply(this.box.halfExtents, this.halfExtent, this.collider.node.worldScale);
        this.box.updateConvexPolyhedronRepresentation();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.size = this.boxCollider.size;
    }
}
