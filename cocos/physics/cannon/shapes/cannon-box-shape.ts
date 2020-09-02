import CANNON from '@cocos/cannon';
import { Vec3 } from '../../../core/math';
import { commitShapeUpdates } from '../cannon-util';
import { CannonShape } from './cannon-shape';
import { IBoxShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { BoxCollider } from '../../../../exports/physics-framework';

export class CannonBoxShape extends CannonShape implements IBoxShape {

    public get collider () {
        return this._collider as BoxCollider;
    }

    public get impl () {
        return this._shape as CANNON.Box;
    }

    readonly HALF_EXTENT: CANNON.Vec3;
    constructor () {
        super();
        this.HALF_EXTENT = new CANNON.Vec3(0.5, 0.5, 0.5);
        this._shape = new CANNON.Box(this.HALF_EXTENT.clone());
    }

    setSize (v: IVec3Like) {
        Vec3.multiplyScalar(this.HALF_EXTENT, v, 0.5);
        const ws = this.collider.node.worldScale;
        this.impl.halfExtents.x = this.HALF_EXTENT.x * Math.abs(ws.x);
        this.impl.halfExtents.y = this.HALF_EXTENT.y * Math.abs(ws.y);
        this.impl.halfExtents.z = this.HALF_EXTENT.z * Math.abs(ws.z);
        this.impl.updateConvexPolyhedronRepresentation();
        if (this._index != -1) {
            commitShapeUpdates(this._body);
        }
    }

    onLoad () {
        super.onLoad();
        this.setSize(this.collider.size);
    }

    setScale (scale: Vec3): void {
        super.setScale(scale);
        this.setSize(this.collider.size);
    }
}
