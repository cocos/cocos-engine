import { ILifecycle } from '../../physics/spec/i-lifecycle';
import { IVec2Like, Vec2 } from '../../core';
import { RigidBody2D } from '../framework/components/rigid-body-2d';
import { ERigidBody2DType } from '../framework/physics-types';

export interface IRigidBody2D extends ILifecycle {
    readonly impl: any;
    readonly rigidBody: RigidBody2D;
    readonly isAwake: boolean;
    readonly isSleeping: boolean;

    initialize (v: RigidBody2D): void;

    setType (v: ERigidBody2DType): void;

    setLinearDamping: (v: number) => void;
    setAngularDamping: (v: number) => void;
    setGravityScale: (v: number) => void;
    setFixedRotation: (v: boolean) => void;
    setAllowSleep: (v: boolean) => void;

    isActive: () => boolean;
    setActive: (v: boolean) => void;

    wakeUp (): void;
    sleep (): void;

    getMass (): number;
    getInertia (): number;

    getLinearVelocity<Out extends IVec2Like> (out: Out): Out;
    setLinearVelocity (value: IVec2Like): void;
    getLinearVelocityFromWorldPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out;
    getAngularVelocity (): number;
    setAngularVelocity (value: number): void;

    getLocalVector<Out extends IVec2Like> (worldVector: IVec2Like, out: Out): Out;
    getWorldVector<Out extends IVec2Like> (localVector: IVec2Like, out: Out): Out;
    getLocalPoint<Out extends IVec2Like> (worldPoint: IVec2Like, out: Out): Out;
    getWorldPoint<Out extends IVec2Like> (localPoint: IVec2Like, out: Out): Out;
    getLocalCenter<Out extends IVec2Like> (out: Out): Out;
    getWorldCenter<Out extends IVec2Like> (out: Out): Out;

    applyForce (force: Vec2, point: Vec2, wake: boolean)
    applyForceToCenter (force: Vec2, wake: boolean)
    applyTorque (torque: number, wake: boolean)
    applyLinearImpulse (impulse: Vec2, point: Vec2, wake: boolean)
    applyLinearImpulseToCenter (impulse: Vec2, wake: boolean)
    applyAngularImpulse (impulse: number, wake: boolean)
}
