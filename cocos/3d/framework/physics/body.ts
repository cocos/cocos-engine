import CANNON from 'cannon';
import { PhysicalMaterial } from '../../assets/physics/material';
import Node from '../../../scene-graph/node';

export class PhysicalBody {
    private _material: PhysicalMaterial | null = null;

    private _shape: PhysicalShape;

    private _cannonBody: CANNON.Body;

    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;

    constructor() {
        const cannonBodyOptions: CANNON.IBodyOptions = {};

        this._cannonBody = new CANNON.Body(cannonBodyOptions);

        this._onCollidedListener = this._onCollided.bind(this);
        this._cannonBody.addEventListener('collide', this._onCollidedListener);
    }

    public destroy() {
        this._cannonBody.removeEventListener('collide', this._onCollidedListener);
    }

    public _getCannonBody() {
        return this._cannonBody;
    }

    public addShape(shape: PhysicalShape) {
        this._cannonBody.addShape(shape._getCannonShape());
    }

    public getCenter(shape: PhysicalShape) {
        const iShape = this._cannonBody.shapes.indexOf(shape._getCannonShape());
        if (iShape >= 0) {
            const shapeOffset = this._cannonBody.shapeOffsets[iShape];
            return new cc.Vec3(shapeOffset.x, shapeOffset.y, shapeOffset.z);
        }
        throw new Error(`shape not found.`);
    }

    public setCenter(shape: PhysicalShape, center: cc.Vec3) {
        const iShape = this._cannonBody.shapes.indexOf(shape._getCannonShape());
        if (iShape >= 0) {
            this._cannonBody.shapeOffsets[iShape].set(center.x, center.y, center.z);
        }
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

    public push(node: Node) {
        // @ts-nocheck
        node.getPosition(this._cannonBody.position);
        // @ts-nocheck
        node.getRotation(this._cannonBody.quaternion);
    }

    public pull(node: Node) {
        const p = this._cannonBody.position;
        node.setPosition(p.x, p.y, p.z);
        const q = this._cannonBody.quaternion;
        node.setRotation(q.x, q.y, q.z, q.w);
    }

    private _onCollided(event: CANNON.ICollisionEvent) {
        console.log(`Collided: ${event.contact}`);
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