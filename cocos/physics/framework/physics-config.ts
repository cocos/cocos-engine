import { IVec3Like } from "../../core";

export interface IPhysicsConfig {
    gravity: IVec3Like;
    allowSleep: boolean;
    deltaTime: number;
    usdFixedTime: number;
    maxSubStep: number;
    collisionMatix: {};

    useNodeChains: boolean;
}
