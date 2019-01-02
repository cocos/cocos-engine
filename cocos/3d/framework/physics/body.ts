import CANNON from 'cannon';
import Vec3 from '../../../core/value-types/vec3';
import { vec3 } from '../../../core/vmath';
import Node from '../../../scene-graph/node';
import { PhysicsMaterial as PhysicsMaterial } from '../../assets/physics/material';
import { setWrap, getWrap } from './util';
import { Quat } from '../../../core/value-types';

export enum DataFlow {
    PUSHING,
    PULLING,
}

export class PhysicsBody {
    private _node: Node | null = null;

    private _material: PhysicsMaterial | null = null;

    private _cannonBody: CANNON.Body;

    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;

    private _onWorldBeforeStepListener: ((event: CANNON.IEvent) => any) | null = null;

    private _onWorldPostStepListener: ((event: CANNON.IEvent) => any) | null = null;

    private _cancelGravityListener: ((event: CANNON.IEvent) => any);

    private _shapes: Set<PhysicsShape> = new Set();

    private _dataflow: DataFlow = DataFlow.PULLING;

    private _useGravity = true;

    constructor() {
        const cannonBodyOptions: CANNON.IBodyOptions = {
            mass: 0,
            // material: new CANNON.Material(''),
        };

        this._cannonBody = new CANNON.Body(cannonBodyOptions);
        setWrap<PhysicsBody>(this._cannonBody, this);

        this._onCollidedListener = this._onCollided.bind(this);
        this._cannonBody.addEventListener('collide', this._onCollidedListener);

        this._cancelGravityListener = (event) => {
            const gravity = this._cannonBody.world.gravity;
            vec3.scaleAndAdd(this._cannonBody.force, this._cannonBody.force, gravity, this.mass * -1);
        };
    }

    public bind(node: Node) {
        this._node = node;
    }

    public destroy() {
        this._cannonBody.removeEventListener('collide', this._onCollidedListener);
    }

    public _onAdded() {
        this._onWorldBeforeStepListener = this._onWorldBeforeStep.bind(this);
        this._cannonBody.world.addEventListener('beforeStep', this._onWorldBeforeStepListener);

        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);
        this._cannonBody.world.addEventListener('postStep', this._onWorldPostStepListener);
    }

    public _onRemoved() {
        if (this._cannonBody.world) {
            if (this._onWorldPostStepListener) {
                this._cannonBody.world.removeEventListener('postStep', this._onWorldPostStepListener);
            }

            if (this._onWorldBeforeStepListener) {
                this._cannonBody.world.removeEventListener('beforeStep', this._onWorldBeforeStepListener);
            }

            this._cannonBody.world.removeEventListener('beforeStep', this._cancelGravityListener);
        }
    }

    public _getCannonBody() {
        return this._cannonBody;
    }

    public addShape(shape: PhysicsShape) {
        // if (this._node) {
        //     shape.__debugNodeName = this._node.name;
        // }
        if (this._node) {
            shape.scale = this._node.getWorldScale();
        }
        this._shapes.add(shape);
        this._cannonBody.addShape(shape._getCannonShape());
        this.commitShapesUpdate();
    }

    public removeShape(shape: PhysicsShape) {
        throw new Error(`not impl`);
    }

    public getCenter(shape: PhysicsShape) {
        const iShape = this._cannonBody.shapes.indexOf(shape._getCannonShape());
        if (iShape >= 0) {
            const shapeOffset = this._cannonBody.shapeOffsets[iShape];
            return new Vec3(shapeOffset.x, shapeOffset.y, shapeOffset.z);
        }
        throw new Error(`shape not found.`);
    }

    get velocity() {
        return this._cannonBody.velocity;
    }

    get force() {
        return this._cannonBody.force;
    }

    public applyForce(force: cc.Vec3, position?: cc.Vec3) {
        if (!position) {
            position = this._cannonBody.position;
        }
        this._cannonBody.applyForce(force, position);
    }

    get material() {
        return this._material;
    }

    set material(value) {
        this._material = value;
        if (!this._material) {
            return;
        }

        this._cannonBody.material = this._material._getImpl();
    }

    get mass() {
        return this._cannonBody.mass;
    }

    set mass(value) {
        this._cannonBody.mass = value;
        this._cannonBody.updateMassProperties();
        if (this._cannonBody.type !== CANNON.Body.KINEMATIC) {
            this._resetBodyTypeAccordingMess();
            this._onBodyTypeUpdated();
        }
    }

    get isKinematic() {
        return this._cannonBody.type === CANNON.Body.KINEMATIC;
    }

    set isKinematic(value) {
        if (value) {
            this._cannonBody.type = CANNON.Body.KINEMATIC;
        } else {
            this._resetBodyTypeAccordingMess();
        }
        this._onBodyTypeUpdated();
    }

    get useGravity() {
        return this._useGravity;
    }

    set useGravity(value) {
        this._useGravity = value;
        if (this._useGravity) {
            this._cannonBody.world.removeEventListener('beforeStep', this._cancelGravityListener);
        } else {
            this._cannonBody.world.addEventListener('beforeStep', this._cancelGravityListener);
        }
    }

    get freezeRotation() {
        return this._cannonBody.fixedRotation;
    }

    set freezeRotation(value) {
        this._cannonBody.fixedRotation = value;
        this._cannonBody.updateMassProperties();
    }

    get linearDamping() {
        return this._cannonBody.linearDamping;
    }

    set linearDamping(value) {
        this._cannonBody.linearDamping = value;
    }

    get angularDamping() {
        return this._cannonBody.angularDamping;
    }

    set angularDamping(value) {
        this._cannonBody.angularDamping = value;
    }

    get isTrigger() {
        return this._cannonBody.collisionResponse;
    }

    set isTrigger(value) {
        this._cannonBody.collisionResponse = value;
    }

    get dataFlow() {
        return this._dataflow;
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

    public setWorldPosition(position: Vec3) {
        this._cannonBody.position.set(position.x, position.y, position.z);
    }

    public setWorldScale(scale: Vec3) {
        this._pullScale(scale);
    }

    public setWorldRotation(rotation: Quat) {
        this._cannonBody.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }

    public pullTransform() {
        if (!this._node) {
            return;
        }
        // @ts-ignore
        this.setWorldPosition(this._node.getWorldPosition());
        // @ts-ignore
        this.setWorldScale(this._node.getWorldScale());
        // @ts-ignore
        this.setWorldRotation(this._node.getWorldRotation());
    }

    /**
     * Is this body currently in contact with the specified body?
     * @param {CannonBody} body The body to test against.
     */
    public isInContactWith(body: PhysicsBody) {
        if (!this._cannonBody.world) {
            return false;
        }

        return this._cannonBody.world.collisionMatrix.get(
            this._cannonBody.id, body._cannonBody.id) > 0;
    }

    public commitShapesUpdate() {
        this._cannonBody.updateBoundingRadius();
    }

    private _onCollided(event: CANNON.ICollisionEvent) {
        // console.log(`Collided {${getWrap<PhysicsBody>(event.body)._node.name}} and {${getWrap<PhysicsBody>(event.target)._node.name}}.`);
    }

    private _onWorldBeforeStep(event: CANNON.IEvent) {
        if (this._dataflow === DataFlow.PULLING) {
            this._pull();
        }
    }

    private _onWorldPostStep(event: CANNON.IEvent) {
        if (this._dataflow === DataFlow.PUSHING) {
            this._push();
        }
    }

    /**
     * Pull node's transform information into rigidbody.
     */
    private _pull() {
        if (!this._node) {
            return;
        }

        if (!this._node._hasChanged) {
            return;
        }

        this.pullTransform();
    }

    private _pullScale(scale: cc.Vec3) {
        let shapeUpdated = false;
        this._shapes.forEach((shape) => {
            let calcShapeOffset = false;
            if (shape._centerChanged) {
                shape._centerChanged = false;
                calcShapeOffset = true;
            }

            if (!vec3.exactEquals(scale, shape.scale)) {
                shape.scale = scale;
                shapeUpdated = true;
                calcShapeOffset = true;
            }

            if (calcShapeOffset) {
                const iShape = this._cannonBody.shapes.findIndex((cannonShape) => cannonShape === shape._getCannonShape());
                if (iShape >= 0) {
                    const shapeOffset = this._cannonBody.shapeOffsets[iShape];
                    vec3.multiply(shapeOffset, shape.center, scale);
                }
            }
        });
        if (shapeUpdated) {
            this.commitShapesUpdate();
        }
    }

    /**
     * Push the rigidbody's transform information back to node.
     */
    private _push() {
        if (!this._node) {
            return;
        }

        const p = this._cannonBody.position;
        this._node.setWorldPosition(p.x, p.y, p.z);
        if (!this._cannonBody.fixedRotation) {
            const q = this._cannonBody.quaternion;
            this._node.setWorldRotation(q.x, q.y, q.z, q.w);
        }
    }

    private _resetBodyTypeAccordingMess() {
        if (this.mass <= 0) {
            this._cannonBody.type = CANNON.Body.STATIC;
        } else {
            this._cannonBody.type = CANNON.Body.DYNAMIC
        }
    }

    private _onBodyTypeUpdated() {
        if (this._cannonBody.type !== CANNON.Body.STATIC) {
            this._dataflow = DataFlow.PUSHING;
        } else {
            this._dataflow = DataFlow.PULLING;
        }
    }
}

export class PhysicsShape {
    // public __debugNodeName: string = '';

    private _scale: cc.Vec3 = new cc.Vec3(1.0, 1.0, 1.0);

    private _center: cc.Vec3 = new cc.Vec3(0, 0, 0);

    public _centerChanged = true;

    public get center() {
        return this._center;
    }

    public set center(value) {
        vec3.copy(this._center, value);
    }

    constructor(private _cannonShape: CANNON.Shape) {
        setWrap<PhysicsShape>(this._cannonShape, this);
    }

    public get scale() {
        return this._scale;
    }

    public set scale(value) {
        vec3.copy(this._scale, value);
        this._onShapeParamUpdated();
    }

    public _getCannonShape<T extends CANNON.Shape>() {
        return this._cannonShape as T;
    }

    protected _onShapeParamUpdated() {
    }
}

export class PhysicsBoxShape extends PhysicsShape {
    private _size: cc.Vec3;

    constructor(size: Vec3) {
        super(new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)));

        this._size = new cc.Vec3(size.x, size.y, size.z);
    }

    public get size() {
        return this._size;
    }

    public set size(value) {
        vec3.copy(this._size, value);
        this._onShapeParamUpdated();
    }

    protected _onShapeParamUpdated() {
        const shape = this._getCannonShape<CANNON.Box>();
        if (!shape.halfExtents) {
            shape.halfExtents = new CANNON.Vec3();
        }

        const newHalfExtents = shape.halfExtents;
        vec3.multiply(newHalfExtents, this._size, this.scale);
        vec3.scale(newHalfExtents, newHalfExtents, 0.5);
        // shape.updateBoundingSphereRadius();
        shape.updateConvexPolyhedronRepresentation();

        // console.log(`Set ${this.__debugNodeName} halfExtents to ${shape.halfExtents.x}, ${shape.halfExtents.y},${shape.halfExtents.z}.`);
    }
}

export class PhysicsSphereShape extends PhysicsShape {
    private _radius: number;

    constructor(radius: number) {
        super(new CANNON.Sphere(radius));

        this._radius = radius;
    }

    public get radius() {
        return this._radius;
    }

    public set radius(value) {
        this._radius = value;
        this._onShapeParamUpdated();
    }

    protected _onShapeParamUpdated() {
        const shape = this._getCannonShape<CANNON.Sphere>();
        shape.radius = this._radius * maxComponent(this.scale);
        // shape.updateBoundingSphereRadius();

        // console.log(`Set ${this.__debugNodeName} radius to ${shape.radius}.`);
    }
}

function maxComponent(v: { x: number, y: number, z: number }) {
    return Math.max(v.x, Math.max(v.y, v.z));
}
