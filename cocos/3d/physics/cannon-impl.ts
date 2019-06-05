import CANNON from 'cannon';
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { clamp, mat4, quat, vec3 } from '../../core/vmath';
import {
    AfterStepCallback, BeforeStepCallback,
    BoxShapeBase,
    ConstraintBase, DistanceConstraintBase,
    ICollisionCallback, ICollisionEvent,
    ICreateBodyOptions, IDistanceConstraintOptions,
    ILockConstraintOptions,
    IPointToPointConstraintOptions,
    IRaycastOptions, LockConstraintBase, PhysicsWorldBase,
    PointToPointConstraintBase, RigidBodyBase, ShapeBase, SphereShapeBase,
} from './api';
import { ERigidBodyType, ETransformSource } from './physic-enum';
import { RaycastResult } from './raycast-result';
import { stringfyQuat, stringfyVec3 } from './util';

const defaultCannonMaterial = new CANNON.Material('');
const defaultCannonContactMaterial = new CANNON.ContactMaterial(
    defaultCannonMaterial, defaultCannonMaterial, {
        friction: 0.06,
        restitution: 0,
    });

export class CannonWorld implements PhysicsWorldBase {
    private _world: CANNON.World;
    private _customBeforeStepListener: BeforeStepCallback[] = [];
    private _customAfterStepListener: AfterStepCallback[] = [];
    private _onCannonPreStepListener: Function;
    private _onCannonPostStepListener: Function;
    private _raycastResult = new CANNON.RaycastResult();
    // private _initedBodys = new Set<CannonRigidBody>();

    constructor () {
        this._world = new CANNON.World();
        setWrap<PhysicsWorldBase>(this._world, this);
        // this._cannonWorld.allowSleep = true;
        this._world.gravity.set(0, -9.81, 0);
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this._world.defaultMaterial = defaultCannonMaterial;
        this._world.defaultContactMaterial = defaultCannonContactMaterial;

        this._onCannonPreStepListener = this._onCannonPreStep.bind(this);
        this._onCannonPostStepListener = this._onCannonPostStep.bind(this);

        this._world.addEventListener('preStep', this._onCannonPreStepListener);
        this._world.addEventListener('postStep', this._onCannonPostStepListener);
    }

    public destroy () {
        this._world.removeEventListener('preStep', this._onCannonPreStepListener);
        this._world.removeEventListener('postStep', this._onCannonPostStepListener);
    }

    get impl () {
        return this._world;
    }

    // get defaultContactMaterial () {
    //     return this._defaultContactMaterial;
    // }

    public step (deltaTime: number) {
        this._callCustomBeforeSteps();

        // const initBodys: CannonRigidBody[] = [];
        // this._cannonWorld.bodies.forEach((b) => {
        //     const body = getWrap<CannonRigidBody>(b);
        //     if (!this._initedBodys.has(body)) {
        //         this._initedBodys.add(body);
        //         initBodys.push(body);
        //     }
        // });
        // if (initBodys.length !== 0) {
        //     console.log(`Frame ${this._cannonWorld.stepnumber} add bodys:\n${initBodys.map((b) => b._devStrinfy()).join('\n')}`);
        // }

        this._world.step(deltaTime);
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

    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._world as any).raycastClosest(from, to, toCannonRaycastOptions(options), this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean {
        const hit = (this._world as any).raycastAny(from, to, toCannonRaycastOptions(options), this._raycastResult);
        if (hit) {
            fillRaycastResult(result, this._raycastResult);
        }
        return hit;
    }

    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean {
        return (this._world as any).raycastAll(from, to, toCannonRaycastOptions(options), (cannonResult: CANNON.RaycastResult) => {
            const result = new RaycastResult();
            fillRaycastResult(result, cannonResult);
            callback(result);
        });
    }

    // public addContactMaterial (contactMaterial: ContactMaterial) {
    //     this._cannonWorld.addContactMaterial(contactMaterial._getImpl());
    // }

    public addConstraint (constraint: CannonConstraint) {
        this._world.addConstraint(constraint.impl);
    }

    public removeConstraint (constraint: CannonConstraint) {
        this._world.removeConstraint(constraint.impl);
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

function fillRaycastResult (result: RaycastResult, cannonResult: CANNON.RaycastResult) {
    result._assign(
        cannonResult.hitPointWorld,
        cannonResult.distance,
        getWrap<ShapeBase>(cannonResult.shape),
        getWrap<RigidBodyBase>(cannonResult.body),
    );
}

export class CannonRigidBody implements RigidBodyBase {

    get impl (): CANNON.Body {
        return this._body;
    }

    private _group: number = 1;
    private _body: CANNON.Body;
    private _velocityResult: Vec3 = new Vec3();
    private _useGravity = true;
    private _material: CANNON.Material;
    private _onCollidedListener: (event: CANNON.ICollisionEvent) => any;
    private _onWorldBeforeStepListener: () => any;
    private _onWorldPostStepListener: (event: CANNON.ICollisionEvent) => any;
    private _collisionCallbacks: ICollisionCallback[] = [];
    private _shapes: CannonShape[] = [];
    private _transformSource: ETransformSource = ETransformSource.SCENE;
    private _userData: any;
    private _world: CannonWorld | null = null;
    private _name: string;

    constructor (options?: ICreateBodyOptions) {
        options = options || {};
        this._name = options.name || '';
        this._material = defaultCannonMaterial;
        this._body = new CANNON.Body({
            material: this._material,
            type: ERigidBodyType.DYNAMIC,
        });
        setWrap<RigidBodyBase>(this._body, this);
        this._body.allowSleep = true;
        this._body.sleepSpeedLimit = 0.1; // Body will feel sleepy if speed<1 (speed == norm of velocity)
        this._body.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness

        this._onCollidedListener = this._onCollided.bind(this);
        this._onWorldBeforeStepListener = this._onWorldBeforeStep.bind(this);
        this._onWorldPostStepListener = this._onWorldPostStep.bind(this);

        this._body.preStep = () => {
            this._onSelfPreStep();
        };

        this._body.postStep = () => {
            this._onSelfPostStep();
        };
    }

    public getGroup (): number {
        return this._group;
    }

    public setGroup (v: number): void {
        this._group = clamp(v, 0, 31);
        this._body.collisionFilterGroup = 1 << v;
    }

    public getMask (): number {
        return this._body.collisionFilterMask;
    }

    public setMask (v: number): void {
        v = clamp(Math.floor(v), 0, 31);
        this._body.collisionFilterMask = 1 << v;
    }

    public addMask (v: number): void {
        v = Math.floor(v);
        this._body.collisionFilterMask += 1 << v;
    }

    public removeMask (v: number): void {
        v = clamp(Math.floor(v), 0, 31);
        this._body.collisionFilterMask -= 1 << v;
    }

    public wakeUp (): void {
        return this._body.wakeUp();
    }
    public sleep (): void {
        return this._body.sleep();
    }

    public name () {
        return this._name;
    }

    public getType (): ERigidBodyType {
        return this._body.type;
    }

    public setType (v: ERigidBodyType): void {
        this._body.type = v;
    }

    public addShape (shape: CannonShape, offset?: Vec3) {
        const index = this._shapes.length;
        this._shapes.push(shape);
        if (offset != null) {
            this._body.addShape(shape.impl, toCannonVec3(offset));
        } else {
            this._body.addShape(shape.impl);
        }
        shape._setBody(this._body, index);
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

    public getMass () {
        return this._body.mass;
    }

    public setMass (value: number) {
        this._body.mass = value;
        this._body.updateMassProperties();
        // if (this._cannonBody.type !== CANNON.Body.KINEMATIC) {
        //     // this._resetBodyTypeAccordingMess();
        //     // this._onBodyTypeUpdated();
        // }
    }

    public getIsKinematic () {
        return this._body.type === CANNON.Body.KINEMATIC;
    }

    public setIsKinematic (value: boolean) {
        if (value) {
            this._body.type = CANNON.Body.KINEMATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
            // this._resetBodyTypeAccordingMess();
        }
        // this._onBodyTypeUpdated();
    }

    public getLinearDamping () {
        return this._body.linearDamping;
    }

    public setLinearDamping (value: number) {
        this._body.linearDamping = value;
    }

    public getAngularDamping () {
        return this._body.angularDamping;
    }

    public setAngularDamping (value: number) {
        this._body.angularDamping = value;
    }

    public getUseGravity (): boolean {
        return this._useGravity;
    }

    public setUseGravity (value: boolean) {
        this._useGravity = value;
    }

    public getIsTrigger (): boolean {
        return this._body.collisionResponse;
    }

    public setIsTrigger (value: boolean): void {
        this._body.collisionResponse = !value;
    }

    public getVelocity (): Vec3 {
        vec3.copy(this._velocityResult, this._body.velocity);
        return this._velocityResult;
    }

    public setVelocity (value: Vec3): void {
        vec3.copy(this._body.velocity, value);
    }

    public getFreezeRotation (): boolean {
        return this._body.fixedRotation;
    }

    public setFreezeRotation (value: boolean) {
        this._body.fixedRotation = value;
        this._body.updateMassProperties();
    }

    public applyForce (force: Vec3, position?: Vec3) {
        if (!position) {
            position = new Vec3();
            vec3.copy(position, this._body.position);
        }
        this._body.wakeUp();
        this._body.applyForce(toCannonVec3(force), toCannonVec3(position));
    }

    public applyImpulse (impulse: Vec3) {
        this._body.wakeUp();
        this._body.applyImpulse(toCannonVec3(impulse), this._body.position);
    }

    public setCollisionFilter (group: number, mask: number) {
        this._body.collisionFilterGroup = group;
        this._body.collisionFilterMask = mask;
    }

    public setWorld (world_: PhysicsWorldBase | null) {
        if (this._world) {
            this._body.world.removeEventListener('postStep', this._onWorldPostStepListener);
            // this._cannonBody.world.removeEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._world.removeBeforeStep(this._onWorldBeforeStepListener);
            this._body.removeEventListener('collide', this._onCollidedListener);
            this._body.world.remove(this._body);
            this._world = null;
        }

        const world = world_ as unknown as (CannonWorld | null);
        if (world) {
            world.impl.addBody(this._body);
            this._body.addEventListener('collide', this._onCollidedListener);
            world.addBeforeStep(this._onWorldBeforeStepListener);
            // this._cannonBody.world.addEventListener('beforeStep', this._onWorldBeforeStepListener);
            this._body.world.addEventListener('postStep', this._onWorldPostStepListener);
        }
        this._world = world;
    }

    public isPhysicsManagedTransform (): boolean {
        return this._transformSource === ETransformSource.PHYSIC;
    }

    public getPosition (out: Vec3) {
        vec3.copy(out, this._body.position);
    }

    public setPosition (value: Vec3) {
        vec3.copy(this._body.position, value);
        // console.log(`[[CANNON]] Set body position to ${stringfyVec3(value)}.`);
    }

    public getRotation (out: Quat) {
        quat.copy(out, this._body.quaternion);
    }

    public setRotation (value: Quat) {
        quat.copy(this._body.quaternion, value);
        // console.log(`[[CANNON]] Set body rotation to ${stringfyQuat(value)}.`);
    }

    public translateAndRotate (m: Mat4, rot: Quat): void {
        mat4.getTranslation(this._body.position, m);
        quat.copy(this._body.quaternion, rot);
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

    public _devStrinfy () {
        const shapes = this._body.shapes.map((s) => getWrap<CannonShape>(s)._devStrinfy()).join('; ');
        return `Name: [[${this._name.length ? this._name : '<No-name>'}]], position: ${stringfyVec3(this._body.position)}, shapes: [${shapes}]`;
    }

    private _resetBodyTypeAccordingMess () {
        if (this._body.mass <= 0) {
            this._body.type = CANNON.Body.STATIC;
        } else {
            this._body.type = CANNON.Body.DYNAMIC;
        }
    }

    private _onBodyTypeUpdated () {
        if (this._body) {
            if (this._body.type === CANNON.Body.STATIC) {
                this._transformSource = ETransformSource.SCENE;
            } else {
                this._transformSource = ETransformSource.PHYSIC;
            }
        }
    }

    private _onCollided (event: CANNON.ICollisionEvent) {
        const evt: ICollisionEvent = {
            source: getWrap<RigidBodyBase>(event.body),
            target: getWrap<RigidBodyBase>((event as any).target),
        };
        for (const callback of this._collisionCallbacks) {
            // TODO : 目前的Canon无法支持Enter\Stay\Exit，目前碰撞仅触发两次Stay
            callback('onCollisionStay', evt);
        }
    }

    private _onWorldBeforeStep () {
    }

    private _onWorldPostStep (event: CANNON.IEvent) {
    }

    private _onSelfPreStep () {
        if (!this._useGravity) {
            this._body.force.y -= this._body.mass * this._body.world.gravity.y;
        }
    }

    private _onSelfPostStep () {

    }

    private _removeShape (iShape: number) {
        const body = this._body;
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
        return this._shape!;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _shape: CANNON.Shape | null = null;

    protected _body: CANNON.Body | null = null;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;

    public constructor () {

    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
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

    public getCollisionResponse (): boolean {
        return this.impl.collisionResponse;
    }

    public setCollisionResponse (v: boolean): void {
        this.impl.collisionResponse = v;
    }

    public _devStrinfy () {
        if (!this._body) {
            return `<NotAttached>`;
        }
        return `centerOffset: ${stringfyVec3(this._body.shapeOffsets[this._index])}`;
    }

    private _recalcCenter () {
        if (!this._body) {
            return;
        }
        const shapeOffset = this._body.shapeOffsets[this._index];
        vec3.copy(shapeOffset, this._center);
        vec3.multiply(shapeOffset, shapeOffset, this._scale);
        // console.log(`[[CANNON]] Set shape offset to (${shapeOffset.x}, ${shapeOffset.y}, ${shapeOffset.z}).`);

        commitShapeUpdates(this._body);
    }
}

export class CannonSphereShape extends CannonShape implements SphereShapeBase {
    private _sphere: CANNON.Sphere;

    private _radius: number = 0;

    constructor (radius: number) {
        super();
        this._radius = radius;
        this._sphere = new CANNON.Sphere(this._radius);
        setWrap<ShapeBase>(this._sphere, this);
        this._shape = this._sphere;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcRadius();
    }

    public setRadius (radius: number) {
        this._radius = radius;
        this._recalcRadius();
    }

    public _devStrinfy () {
        return `Sphere(${super._devStrinfy()}, radius: ${this._sphere.radius})`;
    }

    private _recalcRadius () {
        this._sphere.radius = this._radius * maxComponent(this._scale);
        // console.log(`[[CANNON]] Set sphere radius to ${this._cannonSphere.radius}.`);

        if (this._body != null) {
            commitShapeUpdates(this._body);
        }
    }
}

export class CannonBoxShape extends CannonShape implements BoxShapeBase {
    private _box: CANNON.Box;
    private _halfExtent: CANNON.Vec3 = new CANNON.Vec3();

    constructor (size: Vec3) {
        super();
        vec3.scale(this._halfExtent, size, 0.5);
        // attention : here should use clone
        this._box = new CANNON.Box(this._halfExtent.clone());
        setWrap<ShapeBase>(this._box, this);
        setWrap<ShapeBase>(this._box.convexPolyhedronRepresentation, this);
        this._shape = this._box;
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();

        // Another implementation method
        // see https://github.com/schteppe/cannon.js/issues/270
        // if (this._body) {
        //     const body = this._body;
        //     const shape = this._cannonBox;
        //     const iShape = body.shapes.indexOf(shape);
        //     if (iShape >= 0) {
        //         body.shapes.splice(iShape, 1);
        //         body.shapeOffsets.splice(iShape, 1);
        //         body.shapeOrientations.splice(iShape, 1);
        //         body.updateMassProperties();
        //         body.updateBoundingRadius();
        //         body.aabbNeedsUpdate = true;
        //         (shape as any).body = null;
        //     }
        // }
        // vec3.multiply(this._cannonBox.halfExtents, this._cannonBox.halfExtents, scale);
        // if (this._body) { this._body.addShape(this._cannonBox); }
    }

    public setSize (size: Vec3) {
        vec3.scale(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    public _stringfyThis () {
        return `${this._body ? getWrap<CannonRigidBody>(this._body)._stringfyThis() : '<No-body>'}(Box)`;
    }

    public _devStrinfy () {
        return `Box(${super._devStrinfy()}, halfExtents: ${stringfyVec3(this._box.halfExtents)})`;
    }

    private _recalcExtents () {
        vec3.multiply(this._box.halfExtents, this._halfExtent, this._scale);
        // console.log(`[[CANNON]] Set ${this._stringfyThis()} half extents to ${stringfyVec3(this._cannonBox.halfExtents)}.`);
        this._box.updateConvexPolyhedronRepresentation();
        setWrap<ShapeBase>(this._box.convexPolyhedronRepresentation, this);

        if (this._body != null) {
            commitShapeUpdates(this._body);
        }
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
    protected _constraint: CANNON.Constraint;

    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    protected constructor (constraint: CANNON.Constraint) {
        this._constraint = constraint;
        setWrap<CannonConstraint>(this._constraint, this);
    }

    get first () {
        return getWrap<CannonRigidBody>(this._constraint.bodyA);
    }

    get second () {
        return getWrap<CannonRigidBody>(this._constraint.bodyB);
    }

    public enable () {
        this._constraint.enable();
    }

    public disable () {
        this._constraint.disable();
    }

    public update () {
        this._constraint.update();
    }

    public get impl () {
        return this._constraint;
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

function commitShapeUpdates (body: CANNON.Body) {
    body.updateMassProperties();
    body.updateBoundingRadius();
    body.aabbNeedsUpdate = true;
}
