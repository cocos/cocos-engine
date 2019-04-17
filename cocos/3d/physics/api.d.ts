import { Quat, Vec3 } from '../../core/value-types';
import { Node } from '../../scene-graph';
import { ERigidBodyType } from './physic-enum';
import { RaycastResult } from './raycast-result';

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

    public step (deltaTime: number): void;

    public addBeforeStep (cb: BeforeStepCallback): void;

    public removeBeforeStep (cb: BeforeStepCallback): void;

    public addAfterStep (cb: AfterStepCallback): void;

    public removeAfterStep (cb: AfterStepCallback): void;

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => void): boolean;
}

export class RigidBodyBase {
    constructor (options?: ICreateBodyOptions);

    /** 获取/设置刚体类型 : ERigidBodyType */
    public getType (): ERigidBodyType;
    public setType (v: ERigidBodyType): void;

    /** 唤醒/睡眠刚体 */
    public wakeUp (): void;
    public sleep (): void;

    public addShape (shape: ShapeBase): void;

    public removeShape (shape: ShapeBase): void;

    public getMass (): number;

    public setMass (value: number): void;

    public applyForce (force: Vec3, position?: Vec3): void;

    public applyImpulse (impulse: Vec3, position?: Vec3): void;

    public getIsKinematic (): boolean;

    public setIsKinematic (value: boolean): void;

    public getLinearDamping (): number;

    public setLinearDamping (value: number): void;

    public getAngularDamping (): number;

    public setAngularDamping (value: number): void;

    public getUseGravity (): boolean;

    public setUseGravity (value: boolean): void;

    public getIsTrigger (): boolean;

    public setIsTrigger (value: boolean): void;

    public getVelocity (): Vec3;

    public setVelocity (value: Vec3): void;

    public getFreezeRotation (): boolean;

    public setFreezeRotation (value: boolean): void;

    /**
     * Set the collision filter of this body, remember that they are tested bitwise.
     * @param group The group which this body will be put into.
     * @param mask The groups which this body can collide with.
     */
    public setCollisionFilter (group: number, mask: number): void;

    public setWorld (world: PhysicsWorldBase | null): void;

    public commitShapeUpdates (): void;

    public isPhysicsManagedTransform (): boolean;

    public getPosition (out: Vec3): void;

    public setPosition (value: Vec3): void;

    public getRotation (out: Quat): void;

    public setRotation (out: Quat): void;

    public scaleAllShapes (scale: Vec3): void;

    public addCollisionCallback (callback: ICollisionCallback): void;

    public removeCollisionCllback (callback: ICollisionCallback): void;

    public getUserData (): any;

    public setUserData (data: any): void;
}

export class ShapeBase {
    public setCenter (center: Vec3): void;

    public setScale (scale: Vec3): void;

    public setRotation (rotation: Quat): void;

    public getUserData (): any;

    public setUserData (data: any): void;

    public getCollisionResponse (): boolean;

    public setCollisionResponse (value: boolean): void;
}

export class SphereShapeBase extends ShapeBase {
    constructor (radius: number);

    public setRadius (radius: number): void;
}

export class BoxShapeBase extends ShapeBase {
    constructor (size: Vec3);

    public setSize (size: Vec3): void;
}

/**
 * Base class for Constraint classes.
 */
export class ConstraintBase {
    public first: RigidBodyBase;
    public second: RigidBodyBase;
    public enable (): void;
    public disable (): void;
    public update (): void;
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
