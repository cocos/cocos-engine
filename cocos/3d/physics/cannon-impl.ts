import CANNON from 'cannon';
import { Quat, Vec3 } from '../../core/value-types';
import { quat, vec3 } from '../../core/vmath';
import { AfterStepCallback, BeforeStepCallback,
    BoxShapeBase,
    ConstraintBase, DistanceConstraintBase,
    ICollisionCallback, ICollisionEvent,
    ICreateBodyOptions, IDistanceConstraintOptions,
    ILockConstraintOptions,
    IPointToPointConstraintOptions,
    IRaycastOptions, LockConstraintBase, PhysicsWorldBase,
    PointToPointConstraintBase, RaycastResultBase, RigidBodyBase, ShapeBase, SphereShapeBase } from './api';
import { stringfyQuat, stringfyVec3 } from './util';

const defaultCannonMaterial = new CANNON.Material('');
const defaultCannonContactMaterial = new CANNON.ContactMaterial(
    defaultCannonMaterial, defaultCannonMaterial, {
        friction: 0.06,
        restitution: 0,
    });

export class CannonWorld implements PhysicsWorldBase {
    private _cannonWorld: CANNON.World;
    private _customBeforeStepListener: BeforeStepCallback[] = [];
    private _customAfterStepListener: AfterStepCallback[] = [];
    private _onCannonPreStepListener: Function;
    private _onCannonPostStepListener: Function;

    constructor () {
        this._cannonWorld = new CANNON.World();
        setWrap<PhysicsWorldBase>(this._cannonWorld, this);
        this._cannonWorld.gravity.set(0, -9.81, 0);
        this._cannonWorld.broadphase = new CANNON.NaiveBroadphase();
        this._cannonWorld.defaultMaterial = defaultCannonMaterial;
        this._cannonWorld.defaultContactMaterial = defaultCannonContactMaterial;

        this._onCannonPreStepListener = this._onCannonPreStep.bind(this);
        this._onCannonPostStepListener = this._onCannonPostStep.bind(this);

        this._cannonWorld.addEventListener('preStep', this._onCannonPreStepListener);
        this._cannonWorld.addEventListener('postStep', this._onCannonPostStepListener);
    }

    public destroy () {
        this._cannonWorld.removeEventListener('preStep', this._onCannonPreStepListener);
        this._cannonWorld.removeEventListener('postStep', this._onCannonPostStepListener);
    }

    get impl () {
        return this._cannonWorld;
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    public step (deltaTime: number) {
        this._callCustomBeforeSteps();
        //this._cannonWorld.dispatchEvent(this._beforeStepEvent);
        this._cannonWorld.step(deltaTime);
        this._callCustomAfterSteps();
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

    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result_: RaycastResultBase): boolean {
        const result = result_ as unknown as CannonRaycastResult;
        const hit = (this._cannonWorld as any).raycastClosest(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result_: RaycastResultBase): boolean {
        const result = result_ as unknown as CannonRaycastResult;
        const hit = (this._cannonWorld as any).raycastAny(from, to, toCannonRaycastOptions(options), result._cannonResult);
        return hit;
    }

    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResultBase) => void): boolean {
        return (this._cannonWorld as any).raycastAll(from, to, toCannonRaycastOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new CannonRaycastResult();
            result._cannonResult = cannonResult;
            callback(result);
        });
    }

    // public addContactMaterial (contactMaterial: ContactMaterial) {
    //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    // }

    public addConstraint (constraint: CannonConstraint) {
        this._cannonWorld.addConstraint(constraint.impl);
    }

    public removeConstraint (constraint: CannonConstraint) {
        this._cannonWorld.removeConstraint(constraint.impl);
    }

    private _onCannonPreStep () {
        // this._callCustomBeforeSteps();
    }

    private _onCannonPostStep () {
        // this._callCustomAfterStep();
    }

    private _callCustomBeforeSteps () {
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

export class CannonRigidBody implements RigidBodyBase {

    get impl (): CANNON.Body {
        return this._cannonBody;
    }
    private _cannonBody: CANNON.Body;
    private _velocityResult: Vec3 = new Vec3();
    private _useGravity = true;
    private _cannonMaterial: CANNON.Material;
    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;
    private _onWorldBeforeStepListener: () => any;
    private _onWorldPostStepListener: (event: CANNON.ICollisionEvent) => any;
    private _collisionCallbacks: ICollisionCallback[] = [];
    private _shapes: CannonShape[] = [];
    private _transformSource: TransformSource = TransformSource.Scene;
    private _userData: any;
    private _world: CannonWorld | null = null;
    private _name: string;

    constructor (options?: ICreateBodyOptions) {
        options = options || {};
        this._name = options.name || '';
        this._cannonMaterial = defaultCannonMaterial;
        this._cannonBody = new CANNON.Body({
            material: this._cannonMaterial,
        });
        setWrap<RigidBodyBase>(this._cannonBody, this);

        this._onCollidedListener = this._onCollided.bind(this);
        this._onWorldBeforeStepListener = this._onWorldBeforeStep.bind(this);
        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);

        this._cannonBody.preStep = () => {
            this._onSelfPreStep();
        };

        this._cannonBody.postStep = () => {
            this._onSelfPostStep();
        };
    }

    public name () {
        return this._name;
    }

    public addShape (shape: CannonShape) {
        const index = this._shapes.length;
        this._shapes.push(shape);
        this._cannonBody.addShape(shape.impl);
        shape._setBody(this._cannonBody, index);
    }

    public removeShape (shape: CannonShape) {
        const i = this._shapes.indexOf(shape);
        if (i < 0) {
            return;
        }
        this._removeShape(i);
        for (let j = i + 1; j < this._shapes.length; ++j) {
            const s = this._shapes[j];
            s._setIndex(j - 1);
        }
        this._shapes.splice(i, 1);
    }

    public commitShapeUpdates () {
        this._cannonBody.updateMassProperties();
        this._cannonBody.updateBoundingRadius();
    }

    public getMass () {
        return this._cannonBody.mass;
    }

    public setMass (value: number) {
        this._cannonBody.mass = value;
        this._cannonBody.updateMassProperties();
        if (this._cannonBody.type !== CANNON.Body.KINEMATIC) {
            this._resetBodyTypeAccordingMess();
            this._onBodyTypeUpdated();
        }
    }

    public getIsKinematic () {
        return this._cannonBody.type === CANNON.Body.KINEMATIC;
    }

    public setIsKinematic (value: boolean) {
        if (value) {
            this._cannonBody.type = CANNON.Body.KINEMATIC;
        } else {
            this._resetBodyTypeAccordingMess();
        }
        this._onBodyTypeUpdated();
    }

    public getLinearDamping () {
        return this._cannonBody.linearDamping;
    }

    public setLinearDamping (value: number) {
        this._cannonBody.linearDamping = value;
    }

    public getAngularDamping () {
        return this._cannonBody.angularDamping;
    }

    public setAngularDamping (value: number) {
        this._cannonBody.angularDamping = value;
    }

    public getUseGravity (): boolean {
        return this._useGravity;
    }

    public setUseGravity (value: boolean) {
        this._useGravity = value;
    }

    public getIsTrigger (): boolean {
        return this._cannonBody.collisionResponse;
    }

    public setIsTrigger (value: boolean): void {
        this._cannonBody.collisionResponse = value;
    }

    public getVelocity (): Vec3 {
        vec3.copy(this._velocityResult, this._cannonBody.velocity);
        return this._velocityResult;
    }

    public setVelocity (value: Vec3): void {
        vec3.copy(this._cannonBody.velocity, value);
    }

    public getFreezeRotation (): boolean {
        return this._cannonBody.fixedRotation;
    }

    public setFreezeRotation (value: boolean) {
        this._cannonBody.fixedRotation = value;
        this._cannonBody.updateMassProperties();
    }

    public applyForce (force: Vec3, position?: Vec3) {
        if (!position) {
            position = new Vec3();
            vec3.copy(position, this._cannonBody.position);
        }
        this._cannonBody.applyForce(toCannonVec3(force), toCannonVec3(position));
    }

    public applyImpulse (impulse: Vec3) {
        this._cannonBody.applyImpulse(toCannonVec3(impulse), toCannonVec3(new Vec3()));
    }

    public setCollisionFilter (group: number, mask: number) {
        this._cannonBody.collisionFilterGroup = group;
        this._cannonBody.collisionFilterMask = mask;
    }

    public setWorld (world_: PhysicsWorldBase | null) {
        if (this._world) {
            this._cannonBody.world.removeEventListener('postStep', this._onWorldPostStepListener);
            // this._cannonBody.world.removeEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._world.removeBeforeStep(this._onWorldBeforeStepListener);
            this._cannonBody.removeEventListener('collide', this._onCollidedListener);
            this._cannonBody.world.remove(this._cannonBody);
            this._world = null;
        }

        const world = world_ as unknown as (CannonWorld | null);
        if (world) {
            world.impl.addBody(this._cannonBody);
            this._cannonBody.addEventListener('collide', this._onCollidedListener);
            world.addBeforeStep(this._onWorldBeforeStepListener);
            // this._cannonBody.world.addEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._cannonBody.world.addEventListener('postStep', this._onWorldPostStepListener);
        }
        this._world = world;
    }

    public isPhysicsManagedTransform (): boolean {
        return this._transformSource === TransformSource.Phycis;
    }

    public getPosition (out: Vec3) {
        vec3.copy(out, this._cannonBody.position);
    }

    public setPosition (value: Vec3) {
        vec3.copy(this._cannonBody.position, value);
        // console.log(`[[CANNON]] Set body position to ${stringfyVec3(value)}.`);
    }

    public getRotation (out: Quat) {
        quat.copy(out, this._cannonBody.quaternion);
    }

    public setRotation (value: Quat) {
        quat.copy(this._cannonBody.quaternion, value);
        // console.log(`[[CANNON]] Set body rotation to ${stringfyQuat(value)}.`);
    }

    public scaleAllShapes (scale: Vec3) {
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

    public _stringfyThis () {
        return `${this._name.length ? this._name : '<No-name>'}`;
    }

    private _resetBodyTypeAccordingMess () {
        if (this._cannonBody.mass <= 0) {
            this._cannonBody.type = CANNON.Body.STATIC;
        } else {
            this._cannonBody.type = CANNON.Body.DYNAMIC;
        }
    }

    private _onBodyTypeUpdated () {
        if (this._cannonBody) {
            if (this._cannonBody.type === CANNON.Body.STATIC) {
                this._transformSource = TransformSource.Scene;
            } else {
                this._transformSource = TransformSource.Phycis;
            }
        }
    }

    private _onCollided (event: CANNON.ICollisionEvent) {
        const evt: ICollisionEvent = {
            source: getWrap<RigidBodyBase>(event.body),
            target: getWrap<RigidBodyBase>((event as any).target),
        };
        for (const callback of this._collisionCallbacks) {
            callback(evt);
        }
    }

    private _onWorldBeforeStep () {
        // this._useGravity = false;
        if (!this._useGravity) {
            const gravity = this._cannonBody.world.gravity;
            vec3.scaleAndAdd(this._cannonBody.force, this._cannonBody.force, gravity, this._cannonBody.mass * -1);
        }
    }

    private _onWorldPostStep (event: CANNON.IEvent) {
    }

    private _onSelfPreStep () {
        // this._useGravity = false;
        // if (!this._useGravity) {
        //     const gravity = this._cannonBody.world.gravity;
        //     vec3.scaleAndAdd(this._cannonBody.force, this._cannonBody.force, gravity, this._cannonBody.mass * -1);
        // }
    }

    private _onSelfPostStep () {

    }

    private _removeShape (iShape: number) {
        const body = this._cannonBody;
        const shape = body.shapes[iShape];
        body.shapes.splice(iShape, 1);
        body.shapeOffsets.splice(iShape, 1);
        body.shapeOrientations.splice(iShape, 1);
        body.updateMassProperties();
        body.updateBoundingRadius();
        body.aabbNeedsUpdate = true;
        (shape as any).body = null;
    }
}

export class CannonShape implements ShapeBase {

    public get impl () {
        return this._cannonShape!;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _cannonShape: CANNON.Shape | null = null;

    protected _body: CANNON.Body | null = null;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    public constructor () {

    }

    public _setIndex (index: number) {
        this._index = index;
        this._recalcCenter();
    }

    public _setBody (body: CANNON.Body, index: number) {
        this._body = body;
        this._setIndex(index);
    }

    public setCenter (center: Vec3): void {
        vec3.copy(this._center, center);
        this._recalcCenter();
    }

    public setScale (scale: Vec3): void {
        vec3.copy(this._scale, scale);
        this._recalcCenter();
    }

    public setRotation (rotation: Quat): void {

    }

    private _recalcCenter () {
        if (!this._body) {
            return;
        }
        const shapeOffset = this._body.shapeOffsets[this._index];
        vec3.copy(shapeOffset, this._center);
        vec3.multiply(shapeOffset, shapeOffset, this._scale);
        // console.log(`[[CANNON]] Set shape offset to (${shapeOffset.x}, ${shapeOffset.y}, ${shapeOffset.z}).`);
    }
}

export class CannonSphereShape extends CannonShape implements SphereShapeBase {
    private _cannonSphere: CANNON.Sphere;

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._cannonSphere = new CANNON.Sphere(this._radius);
        setWrap<ShapeBase>(this._cannonSphere, this);
        this._cannonShape = this._cannonSphere;
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
        this._cannonSphere.radius = this._radius * maxComponent(this._scale);
        // console.log(`[[CANNON]] Set sphere radius to ${this._cannonSphere.radius}.`);
        this._cannonSphere.updateBoundingSphereRadius();
    }
}

export class CannonBoxShape extends CannonShape implements BoxShapeBase {
    private _cannonBox: CANNON.Box;
    private _halfExtent: CANNON.Vec3 = new CANNON.Vec3();

    constructor (size: Vec3) {
        super();
        vec3.scale(this._halfExtent, size, 0.5);
        this._cannonBox = new CANNON.Box(this._halfExtent);
        setWrap<ShapeBase>(this._cannonBox, this);
        this._cannonShape = this._cannonBox;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();
    }

    public setSize (size: Vec3) {
        vec3.scale(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    public _stringfyThis () {
        return `${this._body ? getWrap<CannonRigidBody>(this._body)._stringfyThis() : '<No-body>'}(Box)`;
    }

    private _recalcExtents () {
        vec3.multiply(this._cannonBox.halfExtents, this._halfExtent, this._scale);
        // console.log(`[[CANNON]] Set ${this._stringfyThis()} half extents to ${stringfyVec3(this._cannonBox.halfExtents)}.`);
        this._cannonBox.updateConvexPolyhedronRepresentation();
        this._cannonBox.updateBoundingSphereRadius();
    }
}

/**
 * Constraint options.
 */
export interface IConstraintOptions {
    /**
     * Set to true if you want the bodies to collide when they are connected.
     * @default true
     */
    collideConnected?: boolean;

    /**
     * @default true
     */
    wakeUpBodies?: boolean;
}

export class CannonConstraint implements ConstraintBase {
    protected _cannonConstraint: CANNON.Constraint;

    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    protected constructor (cannonConstraint: CANNON.Constraint) {
        this._cannonConstraint = cannonConstraint;
        setWrap<CannonConstraint>(this._cannonConstraint, this);
    }

    get first () {
        return getWrap<CannonRigidBody>(this._cannonConstraint.bodyA);
    }

    get second () {
        return getWrap<CannonRigidBody>(this._cannonConstraint.bodyB);
    }

    public enable () {
        this._cannonConstraint.enable();
    }

    public disable () {
        this._cannonConstraint.disable();
    }

    public update () {
        this._cannonConstraint.update();
    }

    public get impl () {
        return this._cannonConstraint;
    }
}

export class CannonDistanceConstraint extends CannonConstraint implements DistanceConstraintBase {
    constructor (first: CannonRigidBody, second: CannonRigidBody, distance?: number, options?: IDistanceConstraintOptions) {
        super(new CANNON.DistanceConstraint(
            first.impl,
            second.impl,
            distance!,
            options === undefined ? undefined : options.maxForce));
    }
}

export class CannonPointToPointConstraint extends CannonConstraint implements PointToPointConstraintBase {
    constructor (first: CannonRigidBody, firstPivot: Vec3, second: CannonRigidBody, secondPivot: Vec3, options?: IPointToPointConstraintOptions) {
        super(new CANNON.PointToPointConstraint(
            first.impl,
            toCannonVec3(firstPivot),
            second.impl,
            toCannonVec3(secondPivot),
            options === undefined ? undefined : options.maxForce));
    }
}

export class CannonLockConstraint extends CannonConstraint implements LockConstraintBase {
    constructor (first: CannonRigidBody, second: CannonRigidBody, options?: ILockConstraintOptions) {
        super(new CANNON.LockConstraint(
            first.impl,
            second.impl,
            options));
    }
}

export class CannonRaycastResult implements RaycastResultBase {
    public _cannonResult: CANNON.RaycastResult = new CANNON.RaycastResult();
    public _hitPoint: Vec3 = new Vec3();

    get hit () {
        return this._cannonResult.hasHit;
    }

    get hitPoint () {
        vec3.copy(this._hitPoint, this._cannonResult.hitPointWorld);
        return this._hitPoint;
    }

    get distance () {
        return this._cannonResult.distance;
    }

    get shape () {
        return getWrap<ShapeBase>(this._cannonResult.shape);
    }

    get body () {
        return getWrap<RigidBodyBase>(this._cannonResult.body);
    }
}

interface ICANNONRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    checkCollisionResponse?: boolean;
    skipBackfaces?: boolean;
}

function toCannonRaycastOptions (options: IRaycastOptions): ICANNONRaycastOptions {
    return toCannonOptions(options, {
        queryTriggerInteraction: 'checkCollisionResponse',
    });
}

interface IWrappedCANNON<T> {
    __cc_wrapper__: T;
}

function setWrap<Wrapper> (cannonObject: any, wrapper: Wrapper) {
    (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__ = wrapper;
}

function getWrap<Wrapper> (cannonObject: any) {
    return (cannonObject as unknown as IWrappedCANNON<Wrapper>).__cc_wrapper__;
}

function toCannonVec3 (value: Vec3) {
    return new CANNON.Vec3(value.x, value.y, value.z);
}

function toCannonOptions<T> (options: any, optionsRename?: { [x: string]: string; }) {
    const result = {};
    for (const key of Object.keys(options)) {
        let destKey = key;
        if (optionsRename) {
            const rename = optionsRename[key];
            if (rename) {
                destKey = rename;
            }
        }
        result[destKey] = options[key];
    }
    return result as T;
}

function maxComponent (v: Vec3) {
    return Math.max(v.x, Math.max(v.y, v.z));
}
