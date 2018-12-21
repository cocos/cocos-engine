import CANNON from 'cannon';
import { PhysicsMaterial as PhysicsMaterial } from '../../assets/physics/material';
import Node from '../../../scene-graph/node';
import Vec3 from '../../../core/value-types/vec3';

export enum RigidBodyType {
    STATIC,
    DYNAMIC,
    KINEMATIC,
}

export class RigidBody {
    private _node: Node;

    private _material: PhysicsMaterial | null = null;

    private _cannonBody: CANNON.Body;

    private _type: RigidBodyType = RigidBodyType.STATIC;

    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;

    private _onWorldPostStepListener: ((event: CANNON.IEvent) => any) | null = null;

    constructor(node: Node) {
        this._node = node;

        const cannonBodyOptions: CANNON.IBodyOptions = {};

        this._cannonBody = new CANNON.Body(cannonBodyOptions);

        this._onCollidedListener = this._onCollided.bind(this);
        this._cannonBody.addEventListener('collide', this._onCollidedListener);
    }

    public destroy() {
        this._cannonBody.removeEventListener('collide', this._onCollidedListener);
    }

    public _onAdded() {
        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);
        this._cannonBody.world.addEventListener('postStep', this._onWorldPostStepListener);
    }

    public _onRemoved() {
        if (this._cannonBody.world && this._onWorldPostStepListener) {
            this._cannonBody.world.removeEventListener('postStep', this._onWorldPostStepListener);
        }
    }

    public _getCannonBody() {
        return this._cannonBody;
    }

    public addShape(shape: PhysicsShape) {
        this._cannonBody.addShape(shape._getCannonShape());
    }

    public getCenter(shape: PhysicsShape) {
        const iShape = this._cannonBody.shapes.indexOf(shape._getCannonShape());
        if (iShape >= 0) {
            const shapeOffset = this._cannonBody.shapeOffsets[iShape];
            return new Vec3(shapeOffset.x, shapeOffset.y, shapeOffset.z);
        }
        throw new Error(`shape not found.`);
    }

    public setCenter(shape: PhysicsShape, center: Vec3) {
        const iShape = this._cannonBody.shapes.indexOf(shape._getCannonShape());
        if (iShape >= 0) {
            this._cannonBody.shapeOffsets[iShape].set(center.x, center.y, center.z);
        }
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
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

    get mass() {
        return this._cannonBody.mass;
    }

    set mass(value) {
        this._cannonBody.mass = value;
        this._cannonBody.updateMassProperties();
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

    get isTrigger() {
        return this._cannonBody.collisionResponse;
    }

    set isTrigger(value) {
        this._cannonBody.collisionResponse = value;
    }

    /**
     * Set the collision filter of this body, remember that they are tested bitwise.
     * @param {number} group The group which this body will be put into.
     * @param {number} mask The groups which this body can collide with.
     */
    public setCollisionFilter(group: number, mask: number) {
        this._cannonBody.collisionFilterGroup = group;
        this._cannonBody.collisionFilterMask = mask;
    }

    public setworldPosition(position: Vec3) {
        this._cannonBody.position.set(position.x, position.y, position.z);
    }

    /**
     * Is this body currently in contact with the specified body?
     * @param {CannonBody} body The body to test against.
     */
    public isInContactWith(body: RigidBody) {
        if (!this._cannonBody.world) {
            return false;
        }

        return this._cannonBody.world.collisionMatrix.get(
            this._cannonBody.id, body._cannonBody.id) > 0;
    }

    /**
     * Pull the entity's transform information back to rigidbody.
     */
    public pull() {
        const p = this._cannonBody.position;
        this._node.setWorldPosition(p.x, p.y, p.z);
        const q = this._cannonBody.quaternion;
        this._node.setWorldRotation(q.x, q.y, q.z, q.w);
    }

    private _onCollided(event: CANNON.ICollisionEvent) {
        console.log(`Collided: ${event.contact}`);
    }

    private _onWorldPostStep(event: CANNON.IEvent) {
        if (this._type === RigidBodyType.STATIC) {
            this._push();
        }
    }

    /**
     * Push the rigidbody's transform information forward to entity.
     */
    private _push() {
        // @ts-nocheck
        this._node.getWorldPosition(this._cannonBody.position);
        // @ts-nocheck
        this._node.getWorldRotation(this._cannonBody.quaternion);
    }
}

export class PhysicsShape {
    constructor(private _cannonShape: CANNON.Shape) {

    }

    public _getCannonShape<T extends CANNON.Shape>() {
        return this._cannonShape as T;
    }
}

export class PhysicsBoxShape extends PhysicsShape {
    constructor(size: Vec3) {
        super(new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)));
    }

    get size() {
        const halfExtents = this._getCannonShape<CANNON.Box>().halfExtents;
        return new Vec3(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
    }

    set size(value) {
        this._getCannonShape<CANNON.Box>().halfExtents = new CANNON.Vec3(value.x / 2, value.y / 2, value.z / 2);
    }
}

export class PhysicsSphereShape extends PhysicsShape {
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
