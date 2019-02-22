
import CANNON from 'cannon';
import { Vec3 } from '../../../core/value-types';
import { PhysicsBody } from './body';
import { getWrap, setWrap, toCannonVec3 } from './util';

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

/**
 * Base class for Constraint classes.
 */
export class Constraint {
    protected _cannonConstraint: CANNON.Constraint;

    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    protected constructor (cannonConstraint: CANNON.Constraint) {
        this._cannonConstraint = cannonConstraint;
        setWrap<Constraint>(this._cannonConstraint, this);
    }

    get first () {
        return getWrap<PhysicsBody>(this._cannonConstraint.bodyA);
    }

    get second () {
        return getWrap<PhysicsBody>(this._cannonConstraint.bodyB);
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

    public _getImpl () {
        return this._cannonConstraint;
    }
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
export class DistanceConstraint extends Constraint {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param distance The distance to keep. If undefined, it will be set to the current distance between bodyA and bodyB.
     * @param options Options.
     */
    constructor (first: PhysicsBody, second: PhysicsBody, distance?: number, options?: IDistanceConstraintOptions) {
        super(new CANNON.DistanceConstraint(
            first._getCannonBody(),
            second._getCannonBody(),
            distance!,
            options === undefined ? undefined : options.maxForce));
    }
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
export class PointToPointConstraint extends Constraint {
    /**
     * @param first The first body.
     * @param firstPivot The point relative to the center of mass of the first body which the first body is constrained to.
     * @param second The second body.
     * @param secondPivot The point relative to the center of mass of the second body which the second body is constrained to.
     * @param options Options.
     */
    constructor (first: PhysicsBody, firstPivot: Vec3, second: PhysicsBody, secondPivot: Vec3, options?: IPointToPointConstraintOptions) {
        super(new CANNON.PointToPointConstraint(
            first._getCannonBody(),
            toCannonVec3(firstPivot),
            second._getCannonBody(),
            toCannonVec3(secondPivot),
            options === undefined ? undefined : options.maxForce));
    }
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
export class LockConstraint extends Constraint {
    /**
     * @param first The first body.
     * @param second The second body.
     * @param options Options.
     */
    constructor (first: PhysicsBody, second: PhysicsBody, options?: ILockConstraintOptions) {
        super(new CANNON.LockConstraint(
            first._getCannonBody(),
            second._getCannonBody(),
            options));
    }
}
