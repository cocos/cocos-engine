/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../core/math';
import { ERigidBodyType } from './physic-enum';
import { PhysicsRayResult } from './physics-ray-result';
import { ray } from '../core/geom-utils';
import { RecyclePool } from '../core';

// tslint:disable:interface-name
// tslint:disable:no-empty-interface

export interface IRaycastOptions {
    mask: number;
    group: number;
    queryTrigger: boolean;
    maxDistance: number;
}

export interface ICreateBodyOptions {
    name?: string;
}

export interface ITriggerEvent {
    type: ITriggerEventType;
    selfCollider: any;
    otherCollider: any;
    // selfRigidBody: any;
    // otherRigidBody: any;
}

export type ITriggerEventType = 'onTriggerEnter' | 'onTriggerStay' | 'onTriggerExit';

export type ITriggerCallback = (event: ITriggerEvent) => void;

export interface ICollisionEvent {
    type: ICollisionEventType;
    selfCollider: any;
    otherCollider: any;
    // selfRigidBody: any;
    // otherRigidBody: any;
    contacts: any;
}

export type ICollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

export type ICollisionCallback = (event: ICollisionEvent) => void;

export type BeforeStepCallback = () => void;

export type AfterStepCallback = () => void;

export interface BuiltInWorldBase {

    step (deltaTime: number, ...args: any): void;

    addBeforeStep (cb: BeforeStepCallback): void;

    removeBeforeStep (cb: BeforeStepCallback): void;

    addAfterStep (cb: AfterStepCallback): void;

    removeAfterStep (cb: AfterStepCallback): void;

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    raycastAny (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    raycastAll (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, resultes: PhysicsRayResult[]): boolean
}

export interface PhysicsWorldBase extends BuiltInWorldBase {

    defaultMaterial: any;

    setGravity (gravity: Vec3): void;

    getGravity (out: Vec3): void;

    getAllowSleep (): boolean;

    setAllowSleep (v: boolean): void;
}

export interface BuiltInRigidBodyBase {

    getGroup (): number;

    setGroup (v: number): void;

    addGroup (v: number): void;

    removeGroup (v: number): void;

    setMask (v: number): void;

    getMask (): number;

    addMask (v: number): void;

    removeMask (v: number): void;

    addShape (shape: ShapeBase, offset?: Vec3): void;

    removeShape (shape: ShapeBase): void;

    getPosition (out: Vec3): void;

    setPosition (value: Vec3): void;

    getRotation (out: Quat): void;

    setRotation (out: Quat): void;

    translateAndRotate (m: Mat4, rot: Quat): void;

    scaleAllShapes (scale: Vec3): void;

    getUserData (): any;

    setUserData (data: any): void;

    setWorld (world: PhysicsWorldBase | null): void;
}

export interface RigidBodyBase extends BuiltInRigidBodyBase {
    /** the body type */
    getType (): ERigidBodyType;

    setType (v: ERigidBodyType): void;

    wakeUp (): void;

    sleep (): void;

    isAwake (): boolean;

    isSleepy (): boolean;

    isSleeping (): boolean;

    getMass (): number;

    setMass (value: number): void;

    addCollisionCallback (callback: ICollisionCallback): void;

    removeCollisionCllback (callback: ICollisionCallback): void;

    /**
     * force
     */

    applyForce (force: Vec3, worldPoint?: Vec3): void;

    applyLocalForce (force: Vec3, localPoint?: Vec3): void;

    /**
     * impulse
     */

    applyImpulse (impulse: Vec3, worldPoint?: Vec3): void;

    applyLocalImpulse (impulse: Vec3, localPoint?: Vec3): void;

    /**
     * Torque
     */

    applyTorque (torque: Vec3): void;

    applyLocalTorque (torque: Vec3): void;

    getIsKinematic (): boolean;

    setIsKinematic (value: boolean): void;

    /**
     * linear damping
     */

    getLinearDamping (): number;

    setLinearDamping (value: number): void;

    /**
     * angular damping
     */

    getAngularDamping (): number;

    setAngularDamping (value: number): void;

    getUseGravity (): boolean;

    setUseGravity (value: boolean): void;

    getCollisionResponse (): boolean;

    setCollisionResponse (value: boolean): void;

    /**
     * linear velocity
     */

    getLinearVelocity (out?: Vec3): Vec3;

    setLinearVelocity (value: Vec3): void;

    /**
     * angular velocity
     */

    getAngularVelocity (out?: Vec3): Vec3;

    setAngularVelocity (value: Vec3): void;

    /**
     * linear factor
     */

    getLinearFactor (out?: Vec3): Vec3;

    setLinearFactor (value: Vec3): void;

    /**
     * angular factor
     */

    getAngularFactor (out?: Vec3): Vec3;

    setAngularFactor (value: Vec3): void;

    getFreezeRotation (): boolean;

    setFreezeRotation (value: boolean): void;

    /**
     * allow sleep
     */

    getAllowSleep (): boolean;

    setAllowSleep (v: boolean): void;
}

export interface PhysicMaterialBase {
    friction: number;
    restitution: number;
}

export interface ShapeBase {

    material?: PhysicMaterialBase | null;

    setCenter (center: Vec3): void;

    setScale (scale: Vec3): void;

    setRotation (rotation: Quat): void;

    getUserData (): any;

    setUserData (data: any): void;

    getCollisionResponse (): boolean;

    setCollisionResponse (value: boolean): void;

    addTriggerCallback (callback: ITriggerCallback): void;

    removeTriggerCallback (callback: ITriggerCallback): void;
}

export interface SphereShapeBase extends ShapeBase {
    // constructor (radius: number);

    setRadius (radius: number): void;
}

export interface BoxShapeBase extends ShapeBase {
    // constructor (size: Vec3);

    setSize (size: Vec3): void;
}

/**
 * Base class for Constraint classes.
 */
export interface ConstraintBase {
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
export interface DistanceConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
     * @param options Options.
     */
    // constructor (first: RigidBodyBase, second: RigidBodyBase, distance?: number, options?: IDistanceConstraintOptions);
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
export interface PointToPointConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param firstPivot The point relative to the center of mass of the first body which the first body is constrained to.
     * @param second The second body.
     * @param secondPivot The point relative to the center of mass of the second body which the second body is constrained to.
     * @param options Options.
     */
    // constructor (first: RigidBodyBase, firstPivot: Vec3, second: RigidBodyBase, secondPivot: Vec3, options?: IPointToPointConstraintOptions);
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
export interface LockConstraintBase extends ConstraintBase {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    // constructor (first: RigidBodyBase, second: RigidBodyBase, options?: ILockConstraintOptions);
}
