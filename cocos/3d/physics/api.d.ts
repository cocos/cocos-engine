import { Vec3, Quat } from '../../core/value-types';
import { Node } from '../../scene-graph';
import { RaycastResult } from './raycast-result';
import { ERigidBodyType } from './instance';

export interface IRaycastOptions {
    collisionFilterMask?: number;
    collisionFilterGroup?: number;
    queryTriggerInteraction?: boolean;
}

export interface ICreateBodyOptions {
    name?: string;
}

export interface ICollisionEvent {
    source: RigidBodyBase;

    target: RigidBodyBase;
}

export type ICollisionCallback = (event: ICollisionEvent) => void;

export type BeforeStepCallback = () => void;

export type AfterStepCallback = () => void;

export class PhysicsWorldBase {
    constructor ();

    step (deltaTime: number): void;

    addBeforeStep (cb: BeforeStepCallback): void;

    removeBeforeStep (cb: BeforeStepCallback): void;

    addAfterStep (cb: AfterStepCallback): void;

    removeAfterStep (cb: AfterStepCallback): void;

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean;
}

export class RigidBodyBase {
    constructor (options?: ICreateBodyOptions);

    /**获取/设置刚体类型 : ERigidBodyType*/
    getType (): ERigidBodyType;
    setType (v: ERigidBodyType): void;

    addShape (shape: ShapeBase): void;

    removeShape (shape: ShapeBase): void;

    getMass (): number;

    setMass (value: number): void;

    applyForce (force: Vec3, position?: Vec3): void;

    applyImpulse (impulse: Vec3, position?: Vec3): void;

    getIsKinematic (): boolean;

    setIsKinematic (value: boolean): void;

    getLinearDamping (): number;

    setLinearDamping (value: number): void;

    getAngularDamping (): number;

    setAngularDamping (value: number): void;

    getUseGravity (): boolean;

    setUseGravity (value: boolean): void;

    getIsTrigger (): boolean;

    setIsTrigger (value: boolean): void;

    getVelocity (): Vec3;

    setVelocity (value: Vec3): void;

    getFreezeRotation (): boolean;

    setFreezeRotation (value: boolean): void;

    /**
     * Set the collision filter of this body, remember that they are tested bitwise.
     * @param group The group which this body will be put into.
     * @param mask The groups which this body can collide with.
     */
    setCollisionFilter (group: number, mask: number): void;

    setWorld (world: PhysicsWorldBase | null): void;

    commitShapeUpdates (): void;

    isPhysicsManagedTransform (): boolean;

    getPosition (out: Vec3): void;

    setPosition (value: Vec3): void;

    getRotation (out: Quat): void;

    setRotation (out: Quat): void;

    scaleAllShapes (scale: Vec3): void;

    addCollisionCallback (callback: ICollisionCallback): void;

    removeCollisionCllback (callback: ICollisionCallback): void;

    getUserData (): any;

    setUserData (data: any): void;
}

export class ShapeBase {
    setCenter (center: Vec3): void;

    setScale (scale: Vec3): void;

    setRotation (rotation: Quat): void;

    getUserData (): any;

    setUserData (data: any): void;

    getCollisionResponse():boolean;

    setCollisionResponse(value:boolean):void;
}

export class SphereShapeBase extends ShapeBase {
    constructor (radius: number);

    setRadius (radius: number): void;
}

export class BoxShapeBase extends ShapeBase {
    constructor (size: Vec3);

    setSize (size: Vec3): void;
}

/**
 * Base class for Constraint classes.
 */
export class ConstraintBase {
    first: RigidBodyBase;
    second: RigidBodyBase;
    enable (): void;
    disable (): void;
    update (): void;
}

/**
 * DistanceConstraint options.
 */
export interface IDistanceConstraintOptions {
    /**
     * The maximum force that should be applied to constrain the bodies.
     */
    maxForce?: number;
}

/**
 * Constrains two bodies to be at a constant distance from each others center of mass.
 */
export class DistanceConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
     * @param options Options.
     */
    constructor (first: RigidBodyBase, second: RigidBodyBase, distance?: number, options?: IDistanceConstraintOptions);
}

/**
 * PointToPointConstraint options.
 */
export interface IPointToPointConstraintOptions {
    /**
     * The maximum force that should be applied to constrain the bodies.
     */
    maxForce?: number;
}

/**
 * Connects two bodies at given offset points.
 */
export class PointToPointConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param firstPivot The point relative to the center of mass of the first body which the first body is constrained to.
     * @param second The second body.
     * @param secondPivot The point relative to the center of mass of the second body which the second body is constrained to.
     * @param options Options.
     */
    constructor (first: RigidBodyBase, firstPivot: Vec3, second: RigidBodyBase, secondPivot: Vec3, options?: IPointToPointConstraintOptions);
}

/**
 * LockConstraint options.
 */
export interface ILockConstraintOptions {
    /**
     * The maximum force that should be applied to constrain the bodies.
     */
    maxForce?: number;
}

/**
 * The Lock constraint will remove all degrees of freedom between the bodies.
 */
export class LockConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    constructor (first: RigidBodyBase, second: RigidBodyBase, options?: ILockConstraintOptions);
}

export enum TransformSource {
    Scene,
    Phycis,
}