import CANNON from 'cannon';
import { PhysicalMaterial } from '../../assets/physics/material';

export class PhysicalBody {
    private _material: PhysicalMaterial | null = null;

    private _shape: PhysicalShape;

    private _cannonBody: CANNON.Body;

    constructor(shape: PhysicalShape) {
        this._shape = shape;

        const cannonBodyOptions: CANNON.IBodyOptions = {};

        this._cannonBody = new CANNON.Body(cannonBodyOptions);

        this.shape = this._shape;
    }

    _getCannonBody() {
        return this._cannonBody;
    }

    get shape() {
        return this._shape;
    }

    set shape(value) {
        this._shape = value;
        this._cannonBody.shapes = [];
        this._cannonBody.addShape(this.shape._getCannonShape());
    }

    get center() {
        const shapeOffset = this._cannonBody.shapeOffsets[0];
        return new cc.Vec3(shapeOffset.x, shapeOffset.y, shapeOffset.z);
    }

    /**
     * @type {cc.Vec3}
     */
    set center(value) {
        const shapeOffset = this._cannonBody.shapeOffsets[0];
        shapeOffset.set(value.x, value.y, value.z);
    }

    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        if (!this._material) {
            return;
        }

        if (!this._cannonBody.material) {
            this._cannonBody.material = new CANNON.Material(this._material.name);
        }

        this._cannonBody.material.friction = this._material.friction;
        this._cannonBody.material.restitution = this._material.restitution;
    }

    get drag() {
        return this._cannonBody.linearDamping;
    }

    set drag(value) {
        this._cannonBody.linearDamping = value;
    }

    get angularDrag() {
        return this._cannonBody.angularDamping;
    }

    set angularDrag(value) {
        this._cannonBody.angularDamping = value;
    }
}

export class PhysicalShape {
    constructor(private _cannonShape: CANNON.Shape) {

    }

    _getCannonShape<T extends CANNON.Shape>() {
        return this._cannonShape as T;
    }
}

export class PhysicalBoxShape extends PhysicalShape {
    constructor(size: cc.Vec3) {
        super(new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)));
    }

    get size() {
        const halfExtents = this._getCannonShape<CANNON.Box>().halfExtents;
        return new cc.Vec3(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    }

    set size(value) {
        this._getCannonShape<CANNON.Box>().halfExtents = new CANNON.Vec3(value.x / 2, value.y / 2, value.z / 2);
    }
}

export class PhysicalSphereShape extends PhysicalShape {
    constructor(radius: number) {
        super(new CANNON.Sphere(radius));
    }

    get radius() {
        return this._getCannonShape<CANNON.Sphere>().radius;
    }

    set radius(value) {
        this._getCannonShape<CANNON.Sphere>().radius = value;
    }
}