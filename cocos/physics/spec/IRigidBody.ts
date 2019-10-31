import { IVec3Like } from "../../core/math/type-define";

interface IRigidBody extends ILifecycle {
    mass: number;
    linearDamping: number;
    angularDamping: number;
    isKinematic: boolean;
    useGravity: boolean;
    fixedRotation: boolean;
    linearFactor: IVec3Like;
    angluarFactor: IVec3Like;
    allowSleep: boolean;
    readonly isAwake: boolean;
    readonly isSleepy: boolean;
    readonly isSleeping: boolean;

    wakeUp (): void;
    sleep (): void;

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