
import { BuiltinShape } from './builtin-shape';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { capsule } from '../../../core/geometry';
import { EAxisDirection, CapsuleCollider } from '../../framework';

export class BuiltinCapsuleShape extends BuiltinShape implements ICapsuleShape {

    get localCapsule () {
        return this._localShape as capsule;
    }

    get worldCapsule () {
        return this._worldShape as capsule;
    }

    get collider () {
        return this._collider as CapsuleCollider;
    }

    constructor (radius = 0.5, height = 2, direction = EAxisDirection.Y_AXIS) {
        super();
        const halfHeight = (height - radius * 2) / 2;
        const h = halfHeight < 0 ? 0 : halfHeight;
        this._localShape = new capsule(radius, h, direction);
        this._worldShape = new capsule(radius, h, direction);
    }

    setRadius (v: number) {
        this.localCapsule.radius = v;
        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale
        );
    }

    setCylinderHeight (v: number) {
        this.localCapsule.halfHeight = v / 2;
        this.localCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale
        );
    }

    setDirection (v: EAxisDirection) {
        this.localCapsule.axis = v;
        this.localCapsule.updateCache();

        this.worldCapsule.axis = v;
        this.worldCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale
        );
    }

    onLoad () {
        super.onLoad();
        this.setRadius(this.collider.radius);
        this.setDirection(this.collider.direction);
    }
}