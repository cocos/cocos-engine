
import { BuiltinShape } from './builtin-shape';
import { ICapsuleShape } from '../../spec/i-physics-shape';
import { ECapsuleDirection, CapsuleColliderComponent } from '../../framework/components/collider/capsule-collider-component';
import { capsule } from '../../../core/geom-utils';

export class BuiltinCapsuleShape extends BuiltinShape implements ICapsuleShape {

    get localCapsule () {
        return this._localShape as capsule;
    }

    get worldCapsule () {
        return this._worldShape as capsule;
    }

    get capsuleCollider () {
        return this.collider as CapsuleColliderComponent;
    }

    constructor (radius: number, height: number, direction = ECapsuleDirection.Y_AXIS) {
        super();
        const halfHeight = (height - radius * 2) / 2;
        const h = halfHeight < 0 ? 0 : halfHeight;
        this._localShape = new capsule(radius, h, direction);
        this._worldShape = new capsule(radius, h, direction);
    }

    set radius (v: number) {
        this.localCapsule.radius = v;

        const halfTotalHeight = this.capsuleCollider.height / 2;
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

    set height (v: number) {
        const hf = v / 2 - this.capsuleCollider.radius;
        this.localCapsule.halfHeight = hf;
        this.localCapsule.updateCache();

        this.transform(
            this._sharedBody.node.worldMatrix,
            this._sharedBody.node.worldPosition,
            this._sharedBody.node.worldRotation,
            this._sharedBody.node.worldScale
        );
    }

    set direction (v: ECapsuleDirection) {
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
        this.radius = this.capsuleCollider.radius;
        this.direction = this.capsuleCollider.direction;
    }
}