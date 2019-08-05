/**
 * @hidden
 */

import Ammo from 'ammo.js';
import { Quat, Vec3 } from '../../core/math';
import { Node } from '../../scene-graph';
import { Debugger } from './ammo/debugger';
import { AfterStepCallback, BeforeStepCallback,
    BoxShapeBase,
    ConstraintBase, DistanceConstraintBase,
    ICollisionCallback, ICollisionEvent,
    ICreateBodyOptions, IDistanceConstraintOptions,
    ILockConstraintOptions,
    IPointToPointConstraintOptions,
    IRaycastOptions, LockConstraintBase, PhysicsWorldBase,
    PointToPointConstraintBase, RigidBodyBase, ShapeBase, SphereShapeBase } from './api';
import { RaycastResult } from './raycast-result';

export class CollisionEvent {
    get target () {
        return this._target!;
    }

    get position () {
        return this._position;
    }

    get targetPosition () {
        return this._target;
    }

    get normal () {
        return this._normal;
    }

    get targetNormal () {
        return this._targetNormal;
    }

    public _normal: Vec3 = new Vec3();

    public _targetNormal: Vec3 = new Vec3();

    public _position: Vec3 = new Vec3();

    public _targetPosition: Vec3 = new Vec3();

    public _target: Node | null = null;

    public _swap (sourceNode: Node) {
        this._target = sourceNode;

        const p = this._position;
        this._position = this._targetPosition;
        this._targetPosition = p;

        const n = this._normal;
        this._normal = this._targetNormal;
        this._targetNormal = n;
    }
}

interface ICollisionState {
    valid: boolean;
}

interface ICollisionTriple {
    indexA: number;
    indexB: number;
    state: ICollisionState;
}

class CollisionStateManager {
    public static makeQuery (bodyIndexA: number, bodyIndexB: number) {
        return bodyIndexA + bodyIndexB;
    }

    private _map: Map<number, ICollisionTriple[]>;

    constructor () {
        this._map = new Map();
    }

    public query (bodyIndexA: number, bodyIndexB: number) {
        const hash = bodyIndexA + bodyIndexB;
        const triples = this._map.get(hash);
        if (!triples) {
            return undefined;
        } else {
            const triple = this._findTriple(triples, bodyIndexA, bodyIndexB);
            if (!triple) {
                return undefined;
            } else {
                return triple.state;
            }
        }
    }

    public emplace (bodyIndexA: number, bodyIndexB: number, state: ICollisionState) {
        const hash = bodyIndexA + bodyIndexB;
        let triples = this._map.get(hash);
        if (!triples) {
            triples = new Array();
            this._map.set(hash, triples);
        }
        const triple = this._findTriple(triples, bodyIndexA, bodyIndexB);
        if (triple) {
            return triple.state = state;
        } else {
            triples.push({
                indexA: bodyIndexA,
                indexB: bodyIndexB,
                state,
            });
        }
    }

    public invalidateAll () {
        this._map.forEach((triples) => triples.forEach((triple) => triple.state.valid = false));
    }

    public clear () {
        const emptyKeys: number[] = [];
        this._map.forEach((triples, key) => {
            const validTriples = triples.filter((triple) => triple.state.valid);
            if (validTriples.length === 0) {
                emptyKeys.push(key);
            } else {
                this._map.set(key, validTriples);
            }
        });
        emptyKeys.forEach((emptyKey) => {
            this._map.delete(emptyKey);
        });
    }

    private _findTriple (triples: ICollisionTriple[], bodyIndexA: number, bodyIndexB: number) {
        return triples.find((triple) =>
            (triple.indexA === bodyIndexA && triple.indexB === bodyIndexB) ||
            (triple.indexA === bodyIndexB && triple.indexB === bodyIndexA));
    }
}

export class AmmoWorld implements PhysicsWorldBase {

    get gravity () {
        return this._gravity;
    }

    get impl () {
        return this._ammoWorld;
    }
    private _ammoWorld: Ammo.btDiscreteDynamicsWorld;
    private _customBeforeStepListener: BeforeStepCallback[] = [];
    private _customAfterStepListener: AfterStepCallback[] = [];

    private _gravity: Vec3 = new Vec3(0, -9.81, 0);

    private _dispatcher: Ammo.btCollisionDispatcher;

    private _reverseBodyMap = new Map<Ammo.btRigidBody, AmmoRigidBody>();

    private _debugger: Debugger = new Debugger();

    private _collisionEvent: CollisionEvent = new CollisionEvent();
    private _collisionManager = new CollisionStateManager();

    private _hitPoint: Vec3 = new Vec3();
    private _hitNormal = new Vec3();

    constructor (options?: ICreateBodyOptions) {
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        this._dispatcher = dispatcher;
        const overlappingPairCache = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();
        this._ammoWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this._ammoWorld.setGravity(new Ammo.btVector3(this._gravity.x, this._gravity.y, this._gravity.z));
    }

    public destroy () {

    }

    public step (deltaTime: number) {
        this._callCustomBeforeSteps();
        this._ammoWorld.stepSimulation(deltaTime, 2);
        this._callCustomAfterSteps();

        if (!this._debugger.avaiable) {
            const scene = cc.director.getScene();
            if (scene) {
                const node = new Node('bullet-debugger');
                scene.addChild(node);
                this._debugger.bind(node);
                this._ammoWorld.setDebugDrawer(this._debugger.ammoDrawDebugger);
            }
        }

        this._debugger.clear();
        this._ammoWorld.debugDrawWorld();
        this._debugger.present();

        this._collisionManager.invalidateAll();
        const nManifolds = this._dispatcher.getNumManifolds();
        for (let iManifold = 0; iManifold < nManifolds; ++iManifold) {
            const manifold = this._dispatcher.getManifoldByIndexInternal(iManifold);
            const bodyA = this._getWrappedBody(manifold.getBody0());
            if (!bodyA) {
                continue;
            }
            const bodyB = this._getWrappedBody(manifold.getBody1());
            if (!bodyB) {
                continue;
            }
            const indexA = manifold.getBody0().getUserIndex();
            const indexB = manifold.getBody1().getUserIndex();
            const collisionState = this._collisionManager.query(indexA, indexB);
            if (!collisionState) {
                // this._dispatchCollisionEvent(manifold, bodyA, bodyB);
                this._collisionManager.emplace(indexA, indexB,  { valid: true });
                // console.log(`haha`);
            } else {
                collisionState.valid = true;
            }
        }
        this._collisionManager.clear();
    }

    public addBeforeStep (cb: BeforeStepCallback) {
        this._customBeforeStepListener.push(cb);
    }

    public removeBeforeStep (cb: BeforeStepCallback) {
        const i = this._customBeforeStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customBeforeStepListener.splice(i, 1);
    }

    public addAfterStep (cb: AfterStepCallback) {
        this._customAfterStepListener.push(cb);
    }

    public removeAfterStep (cb: AfterStepCallback) {
        const i = this._customAfterStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customAfterStepListener.splice(i, 1);
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const ammoFrom = new Ammo.btVector3();
        const ammoTo = new Ammo.btVector3();
        vec3CreatorToAmmo(ammoFrom, from);
        vec3CreatorToAmmo(ammoTo, to);

        const closestRayResultCallback = new Ammo.ClosestRayResultCallback(ammoFrom, ammoTo);
        // const rayCallBack = Ammo.castObject(closestRayResultCallback, Ammo.RayResultCallback);
        // rayCallBack.set_m_closestHitFraction(1);
        // rayCallBack.set_m_collisionObject(null);
        // closestRayResultCallback.get_m_rayFromWorld().setValue(from.x, from.y, from.z);
        // closestRayResultCallback.get_m_rayToWorld().setValue(to.x, to.y, to.z);

        this._ammoWorld.rayTest(ammoFrom, ammoTo, closestRayResultCallback);
        if (!closestRayResultCallback.hasHit()) {
            return false;
        }

        const ammoObject = closestRayResultCallback.get_m_collisionObject()!;
        const wrappedBody = this._getWrappedBody(ammoObject);
        if (!wrappedBody) {
            return false;
        }

        vec3AmmoToCreator(this._hitPoint, closestRayResultCallback.get_m_hitPointWorld());
        vec3AmmoToCreator(this._hitNormal, closestRayResultCallback.get_m_hitNormalWorld());
        const distance = Vec3.distance(from, this._hitPoint);

        throw new Error(`not impl.`);
        // result._assign(this._hitPoint, distance, null, wrappedBody);
        // return true;
    }

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        return false;
    }

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return false;
    }

    public addConstraint (constraint: ConstraintBase) {
    }

    public removeConstraint (constraint: ConstraintBase) {
    }

    public associate (rigidBody: AmmoRigidBody) {
        this._reverseBodyMap.set(rigidBody.impl, rigidBody);
    }

    public decouple (rigidBody: AmmoRigidBody) {
        this._reverseBodyMap.delete(rigidBody.impl);
    }

    private _dispatchCollisionEvent (contactPoint: Ammo.btManifoldPoint, bodyA: AmmoRigidBody, bodyB: AmmoRigidBody) {
        const collisionEvent = this._collisionEvent;
        vec3AmmoToCreator(collisionEvent._position, contactPoint.getPositionWorldOnA());
        vec3AmmoToCreator(collisionEvent._targetPosition, contactPoint.get_m_positionWorldOnB());
        vec3AmmoToCreator(collisionEvent._targetNormal, contactPoint.get_m_normalWorldOnB());
        Vec3.negate(collisionEvent.normal, collisionEvent.targetNormal);
        bodyA.dispatchCollisionWith(bodyB);
        bodyB.dispatchCollisionWith(bodyA);
    }

    private _getWrappedBody (ammoObject: Ammo.btCollisionObject) {
        const ammoRigid = Ammo.castObject<Ammo.btRigidBody>(ammoObject, Ammo.btRigidBody);
        const body = this._reverseBodyMap.get(ammoRigid);
        return body;
    }

    private _callCustomBeforeSteps () {
        // TO DO
        // Note there may be BUG if fx call removeBeforeStepCallback
        this._customBeforeStepListener.forEach((fx) => fx());
    }

    private _callCustomAfterSteps () {
        this._customAfterStepListener.forEach((fx) => fx());
    }
}
enum TransformSource {
    Scene,
    Phycis,
}

interface IBufferedOptional<Storage> {
    hasValue: boolean;
    storage: Storage;
}

export class AmmoRigidBody implements RigidBodyBase {

    get impl (): Ammo.btRigidBody {
        return this._ammoRigidBody;
    }
    private static ID_COUNTER = 0;

    private _ammoRigidBody: Ammo.btRigidBody;
    private _compoundShape: Ammo.btCompoundShape;
    private _id: number = -1;
    private _worldPosition = new Vec3(0, 0, 0);
    private _worldRotation = new Quat();
    private _ammoWorldPositionBuffer = new Ammo.btVector3();
    private _ammoWorldRotationBuffer = new Ammo.btQuaternion();
    private _ammoShapeScalling = new Ammo.btVector3();
    private _mass = 0;
    private _isKinematic: boolean = false;
    private _linearDamping = 0;
    private _angularDamping = 0;
    private _velocityResult: Vec3 = new Vec3();
    private _world: AmmoWorld | null = null;
    private _useGravity = true;
    private _collisionCallbacks: ICollisionCallback[] = [];
    private _transformSource: TransformSource = TransformSource.Scene;
    private _userData: any;
    private _shapes: AmmoShape[] = [];
    private _transformBuffer = new Ammo.btTransform();
    private _ammoTransform = new Ammo.btTransform();
    private _beforeWorldStepCallback: () => void;
    private _nReconstructShapeRequest = 1;
    private _nReconstructBodyRequest = 1;
    private _changeRequests: {
        velocity: IBufferedOptional<Vec3>,
        forces: Array<{
            force: Vec3,
            position: Vec3,
        }>,
        applyImpulse: IBufferedOptional<Vec3>,
    } = {
        velocity: {
            hasValue: false,
            storage: new Vec3(),
        },
        forces: [],
        applyImpulse: {
            hasValue: false,
            storage: new Vec3(),
        },
    };

    private _motionState: Ammo.btDefaultMotionState;

    constructor () {
        this._transformBuffer.setIdentity();
        this._ammoTransform.setIdentity();
        this._compoundShape = new Ammo.btCompoundShape(true);
        this._id = AmmoRigidBody.ID_COUNTER++;
        this._ammoRigidBody = this._reconstructBody();
        this._beforeWorldStepCallback = this._beforeWorldStep.bind(this);
    }

    public addShape (shape_: ShapeBase) {
        const shape = shape_ as AmmoShape;
        shape._setBody(this);
        this._shapes.push(shape);
        this.commitShapeUpdates();
    }

    public removeShape (shape_: ShapeBase) {
        const shape = shape_ as AmmoShape;
        shape._setBody(null);
        const iShape = this._shapes.indexOf(shape);
        if (iShape >= 0) {
            this._shapes.splice(iShape, 1);
        }
        this.commitShapeUpdates();
    }

    public commitShapeUpdates () {
        ++this._nReconstructShapeRequest;
    }

    public getMass () {
        return this._mass;
    }

    public setMass (value: number) {
        this._mass = value;
        if (this._mass > 0) {
            this._transformSource = TransformSource.Phycis;
        }

        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
        }
        const localInertia = new Ammo.btVector3(0, 0, 0);
        this._compoundShape.calculateLocalInertia(this._mass, localInertia);
        this._ammoRigidBody.setMassProps(this._mass, localInertia);
        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
        }
    }

    public getIsKinematic () {
        return this._isKinematic;
    }

    public setIsKinematic (value: boolean) {
        this._isKinematic = value;
        // TO DO
    }

    public getLinearDamping () {
        return this._linearDamping;
    }

    public setLinearDamping (value: number) {
        this._linearDamping = value;
        this._updateDamping();
    }

    public getAngularDamping () {
        return this._angularDamping;
    }

    public setAngularDamping (value: number) {
        this._angularDamping = value;
        this._updateDamping();
    }

    public getUseGravity (): boolean {
        return this._useGravity;
    }

    public setUseGravity (value: boolean) {
        this._useGravity = value;
        if (value) {
            if (this._world) {
                const worldGravity = this._world.gravity;
                this._ammoRigidBody.setGravity(new Ammo.btVector3(worldGravity.x, worldGravity.y, worldGravity.z));
            }
        } else {
            this._ammoRigidBody.setGravity(new Ammo.btVector3(0, 0, 0));
        }
    }

    public getIsTrigger (): boolean {
        // TO DO
        return true;
    }

    public setIsTrigger (value: boolean): void {
        // TO DO
    }

    public getVelocity (): Vec3 {
        const linearVelocity = this._ammoRigidBody.getLinearVelocity();
        vec3AmmoToCreator(this._velocityResult, linearVelocity);
        return this._velocityResult;
    }

    public setVelocity (value: Vec3): void {
        this._changeRequests.velocity.hasValue = true;
        Vec3.copy(this._changeRequests.velocity.storage, value);
    }

    public getFreezeRotation (): boolean {
        // TO DO
        return false;
    }

    public setFreezeRotation (value: boolean) {
        // TO DO
    }

    public applyForce (force: Vec3, position?: Vec3) {
        if (!position) {
            position = new Vec3();
            const p = this._ammoRigidBody.getWorldTransform().getOrigin();
            vec3AmmoToCreator(position, p);
        }
        this._changeRequests.forces.push({
            force,
            position,
        });
    }

    public applyImpulse (impulse: Vec3) {
        const ammoImpulse = new Ammo.btVector3(0, 0, 0);
        vec3CreatorToAmmo(ammoImpulse, impulse);
        this._ammoRigidBody.applyCentralImpulse(ammoImpulse);
    }

    public setCollisionFilter (group: number, mask: number) {
        // TO DO
    }

    public _getInternalID () {
        return this._id;
    }

    public setWorld (world_: PhysicsWorldBase | null) {
        if (this._world) {
            this._world.decouple(this);
            this._world.impl.removeRigidBody(this.impl);
            this._world.removeBeforeStep(this._beforeWorldStepCallback);
            this._world = null;
        }

        const world = world_ as unknown as (AmmoWorld | null);
        if (world) {
            world.associate(this);
            world.impl.addRigidBody(this.impl);
            world.addBeforeStep(this._beforeWorldStepCallback);
        }
        this._world = world;
    }

    public isPhysicsManagedTransform (): boolean {
        return this._transformSource === TransformSource.Phycis;
    }

    public getPosition (out: Vec3) {
        const physTransform = this._transformBuffer;
        this._ammoRigidBody.getMotionState().getWorldTransform(physTransform);
        const physOrigin = physTransform.getOrigin();
        vec3AmmoToCreator(this._worldPosition, physOrigin);
        Vec3.copy(out, this._worldPosition);
    }

    public setPosition (value: Vec3) {
        Vec3.copy(this._worldPosition, value);
        this._updateTransform();
    }

    public getRotation (out: Quat) {
        const physTransform = this._transformBuffer;

        this._ammoRigidBody.getMotionState().getWorldTransform(physTransform);
        const physRotation = physTransform.getRotation();
        quatAmmoToCreator(this._worldRotation, physRotation);
        Quat.copy(out, this._worldRotation);
    }

    public setRotation (value: Quat) {
        Quat.copy(this._worldRotation, value);
        this._updateTransform();
    }

    public _updateTransform () {
        this._ammoTransform.setIdentity();
        vec3CreatorToAmmo(this._ammoWorldPositionBuffer, this._worldPosition);
        this._ammoTransform.setOrigin(this._ammoWorldPositionBuffer);
        quatCreatorToAmmo(this._ammoWorldRotationBuffer, this._worldRotation);
        this._ammoTransform.setRotation(this._ammoWorldRotationBuffer);
        this._ammoRigidBody.setWorldTransform(this._ammoTransform);
        this._motionState.setWorldTransform(this._ammoTransform);
        console.log(`[[Set AMMO Transform]] ` +
            `Name: ${this._getName()}; ` +
            `Position: ${toString(this._worldPosition)}; ` +
            `Rotation: ${toString(this._worldRotation)}`);
    }

    public scaleAllShapes (scale: Vec3) {
        // vec3CreatorToAmmo(this._ammoShapeScalling, scale);
        for (const shape of this._shapes) {
            shape.setScale(scale);
        }
    }

    public addCollisionCallback (callback: ICollisionCallback): void {
        this._collisionCallbacks.push(callback);
    }

    public removeCollisionCllback (callback: ICollisionCallback): void {
        const i = this._collisionCallbacks.indexOf(callback);
        if (i >= 0) {
            this._collisionCallbacks.splice(i, 1);
        }
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public dispatchCollisionWith (target: AmmoRigidBody) {
        this._collisionCallbacks.forEach((fx) => {
            fx({
                source: this,
                target,
            });
        });
    }

    private _updateDamping () {
        this._ammoRigidBody.setDamping(this._linearDamping, this._angularDamping);
    }

    private _reconstructCompoundShape () {
        this._compoundShape = new Ammo.btCompoundShape();
        for (const shape of this._shapes) {
            this._compoundShape.addChildShape(shape.transform, shape.impl);
        }
        ++this._nReconstructBodyRequest;
    }

    private _getName () {
        return this._userData ? this._userData.name : '<Constructor>';
    }

    private _reconstructBody () {
        if (this._world) {
            this._world.impl.removeRigidBody(this.impl);
            this._world.decouple(this);
        }

        vec3CreatorToAmmo(this._ammoWorldPositionBuffer, this._worldPosition);
        quatCreatorToAmmo(this._ammoWorldRotationBuffer, this._worldRotation);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(this._ammoWorldPositionBuffer);
        transform.setRotation(this._ammoWorldRotationBuffer);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        this._compoundShape.calculateLocalInertia(this._mass, localInertia);

        this._motionState = new Ammo.btDefaultMotionState(transform);
        const rigidBodyConstructionInfo = new Ammo.btRigidBodyConstructionInfo(this._mass, this._motionState, this._compoundShape, localInertia);
        this._ammoRigidBody = new Ammo.btRigidBody(rigidBodyConstructionInfo);
        this._ammoRigidBody.setUserIndex(this._id);

        this.setUseGravity(this._useGravity);

        this._ammoRigidBody.setRestitution(0);
        this._ammoRigidBody.setFriction(0.7745967);
        // this._bodyImpl.setRollingFriction(0.3);

        // this._ammoRigidBody.setCollisionFlags(this._ammoRigidBody.getCollisionFlags() | CF_CUSTOM_MATERIAL_CALLBACK);

        this._updateDamping();

        if (this._world) {
            this._world.impl.addRigidBody(this.impl);
            this._world.associate(this);
        }
        console.log(`[[Reconstruct AMMO Rigidbody]] ` +
            `Name: ${this._getName()}; ` +
            `Position: ${toString(this._worldPosition)}; ` +
            `Rotation: ${toString(this._worldRotation)}`);
        return this._ammoRigidBody;
    }

    private _beforeWorldStep () {
        if (this._nReconstructShapeRequest) {
            this._reconstructCompoundShape();
            this._nReconstructShapeRequest = 0;
        }
        if (this._nReconstructBodyRequest) {
            this._reconstructBody();
            this._nReconstructBodyRequest = 0;
        }
        if (this._changeRequests.velocity.hasValue) {
            this._changeRequests.velocity.hasValue = false;
            const v = new Ammo.btVector3();
            vec3CreatorToAmmo(v, this._changeRequests.velocity.storage);
            this._ammoRigidBody.setLinearVelocity(v);
        }
        for (const { force, position } of this._changeRequests.forces) {
            const ammoForce = new Ammo.btVector3(0, 0, 0);
            vec3CreatorToAmmo(ammoForce, force);
            const ammoPosition = new Ammo.btVector3(0, 0, 0);
            vec3CreatorToAmmo(ammoPosition, position);
            this._ammoRigidBody.applyForce(ammoForce, ammoPosition);
        }
        this._changeRequests.forces.length = 0;
    }
}

export class AmmoShape implements ShapeBase {

    public get impl () {
        return this._ammoShape!;
    }

    get transform () {
        return this._transform;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _ammoShape: Ammo.btCollisionShape | null = null;

    protected _body: AmmoRigidBody | null = null;

    private _transform: Ammo.btTransform;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;

    public constructor () {
        this._transform = new Ammo.btTransform();
        this._transform.setIdentity();
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public _setBody (body: AmmoRigidBody | null) {
        this._body = body;
    }

    public setCenter (center: Vec3): void {
        Vec3.copy(this._center, center);
        this._recalcCenter();
    }

    public setScale (scale: Vec3): void {
        Vec3.copy(this._scale, scale);
        this._recalcCenter();
    }

    public setRotation (rotation: Quat): void {
        // TO DO
    }

    private _recalcCenter () {
        if (!this._body) {
            return;
        }
        // TO DO
    }
}

export class AmmoSphereShape extends AmmoShape implements SphereShapeBase {
    private _ammoSphere: Ammo.btSphereShape;

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._ammoSphere = new Ammo.btSphereShape(this._radius);
        this._ammoShape = this._ammoSphere;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcRadius();
    }

    public setRadius (radius: number) {
        this._radius = radius;
        this._recalcRadius();
    }

    private _recalcRadius () {
        const radius = this._radius * maxComponent(this._scale);
        this._ammoSphere = new Ammo.btSphereShape(radius);
    }
}

export class AmmoBoxShape extends AmmoShape implements BoxShapeBase {
    private _ammoBox: Ammo.btBoxShape;
    private _halfExtent: Vec3 = new Vec3();

    constructor (size: Vec3) {
        super();
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        const halfExtents = this._halfExtent;
        this._ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
        this._ammoShape = this._ammoBox;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();
    }

    public setSize (size: Vec3) {
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    private _recalcExtents () {
        const halfExtents = new Vec3();
        Vec3.multiply(halfExtents, this._halfExtent, this._scale);
        this._ammoBox = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
    }
}

export function vec3CreatorToAmmo (ammoVec3: Ammo.btVector3, ccVec3: Vec3) {
    ammoVec3.setX(ccVec3.x);
    ammoVec3.setY(ccVec3.y);
    ammoVec3.setZ(ccVec3.z);
}

export function vec3AmmoToCreator (ccVec3: Vec3, ammoVec3: Ammo.btVector3) {
    ccVec3.x = ammoVec3.x();
    ccVec3.y = ammoVec3.y();
    ccVec3.z = ammoVec3.z();
}

export function quatCreatorToAmmo (ammoQuat: Ammo.btQuaternion, ccQuat: Quat) {
    ammoQuat.setX(ccQuat.x);
    ammoQuat.setY(ccQuat.y);
    ammoQuat.setZ(ccQuat.z);
    ammoQuat.setW(ccQuat.w);
}

export function quatAmmoToCreator (ccQuat: Quat, ammoQuat: Ammo.btQuaternion) {
    ccQuat.x = ammoQuat.x();
    ccQuat.y = ammoQuat.y();
    ccQuat.z = ammoQuat.z();
    ccQuat.w = ammoQuat.w();
}

function maxComponent (v: Vec3) {
    return Math.max(v.x, Math.max(v.y, v.z));
}

function toString (value: Vec3 | Quat): string {
    if (value instanceof Vec3) {
        return `(x: ${value.x}, y: ${value.y}, z: ${value.z})`;
    } else if (value instanceof Quat) {
        if (Quat.strictEquals(value, new Quat())) {
            return `<No-rotation>`;
        } else {
            return `(x: ${value.x}, y: ${value.y}, z: ${value.z}, w: ${value.w})`;
        }
    }
    return '';
}
