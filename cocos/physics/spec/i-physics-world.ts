import { IVec3Like } from "../../core/math/type-define";
import { PhysicsRayResult } from '../physics-ray-result';
import { ray } from '../../core/geom-utils';
import { RecyclePool } from '../../core';

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
    gravity: IVec3Like;
    allowSleep: boolean;
    defaultMaterial: any;
}