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

export interface ICollisionDetect {

    step (deltaTime: number, ...args: any): void;

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, resultes: PhysicsRayResult[]): boolean
}
export interface IPhysicsWorld extends ICollisionDetect {
    readonly impl: any;
    setGravity: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;
    setDefaultMaterial: (v: PhysicMaterial) => void;
}