/**
 * @hidden
 */

import { ILifecycle } from './i-lifecycle'
import { IGroupMask } from './i-group-mask'
import { IVec3Like } from "../../core/math/type-define";
import { RigidBodyComponent } from '../framework/components/rigid-body-component';

export interface IRigidBody extends ILifecycle, IGroupMask {
    readonly impl: any;
    readonly rigidBody: RigidBodyComponent;
    readonly isAwake: boolean;
    readonly isSleepy: boolean;
    readonly isSleeping: boolean;

    initialize (v: RigidBodyComponent): void;

    setMass: (v: number) => void;
    setLinearDamping: (v: number) => void;
    setAngularDamping: (v: number) => void;
    setIsKinematic: (v: boolean) => void;
    useGravity: (v: boolean) => void;
    fixRotation: (v: boolean) => void;
    setLinearFactor: (v: IVec3Like) => void;
    setAngularFactor: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;

    wakeUp (): void;
    sleep (): void;
    clearState (): void;
    clearForces (): void;
    clearVelocity (): void;

    getLinearVelocity (out: IVec3Like): void;
    setLinearVelocity (value: IVec3Like): void;
    getAngularVelocity (out: IVec3Like): void;
    setAngularVelocity (value: IVec3Like): void;

    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void;
    applyTorque (torque: IVec3Like): void;
    applyLocalTorque (torque: IVec3Like): void;
}