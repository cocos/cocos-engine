
import { BuiltinShape } from './builtin-shape';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { CapsuleColliderComponent } from '../../framework/components/collider/capsule-collider-component';
import { capsule } from '../../../core/geometry';
import { EAxisDirection } from '../../framework';

export class BuiltinCapsuleShape extends BuiltinShape implements ICapsuleShape {

    get localCapsule () {
        return this._localShape as capsule;
    }

    get worldCapsule () {
        return this._worldShape as capsule;
    }

    get collider () {
        return this._collider as CapsuleColliderComponent;
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

        const halfTotalHeight = this.collider.height / 2;
        let halfHeight = halfTotalHeight - v;
        if (halfHeight < 0) halfHeight = 0;
        this.localCapsule.halfHeight = halfHeight;
        this.localCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale
        );
    }

    setHeight (v: number) {
        const hf = v / 2 - this.collider.radius;
        this.localCapsule.halfHeight = hf;
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