import { IVec3Like } from "../../core";

export interface ICollisionMatrix {
    [x: string]: number;
}

export interface IPhysicsMaterial {
    friction: number;
    rollingFriction: number;
    spinningFriction: number;
    restitution: number;
}

export interface IPhysicsConfig {
    gravity: IVec3Like;
    allowSleep: boolean;
    deltaTime: number;
    interpolation: number;
    maxSubSteps: number;
    collisionMatrix: ICollisionMatrix;
    defaultMaterial: IPhysicsMaterial;
    autoSimulation: boolean;
    useCollsionMatrix: boolean;
    useNodeChains: boolean;
}
