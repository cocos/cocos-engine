/**
 * @hidden
 */

import { IVec3Like } from "../../core/math/type-define";
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { ray } from '../../core/geometry';
import { RecyclePool } from '../../core';
import { PhysicMaterial } from "../framework";

export interface IRaycastOptions {
    mask: number;
    group: number;
    queryTrigger: boolean;
    maxDistance: number;
}

export interface IPhysicsWorld {
    readonly impl: any;
    setGravity: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;
    setDefaultMaterial: (v: PhysicMaterial) => void;
    step (deltaTime: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean
    raycastClosest (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;
    emitEvents (): void;
    syncSceneToPhysics (): void;
}