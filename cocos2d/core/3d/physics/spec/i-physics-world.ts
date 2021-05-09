/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import { IVec3Like } from "../../../value-types/math";
import { PhysicsRayResult } from '../framework/physics-ray-result';

/**
 * Ray cast options
 * @class IRaycastOptions
 */
export interface IRaycastOptions {
    /**
     * @property {number} groupIndex
     */
    groupIndex: number;
    /**
     * @property {boolean} queryTrigger
     */
    queryTrigger: boolean;
    /**
     * @property {number} maxDistance
     */
    maxDistance: number;
}

/**
 * Collision detect
 * @class ICollisionDetect
 */
export interface ICollisionDetect {

    step (deltaTime: number, ...args: any): void;

    /**
     * Ray cast, and return information of the closest hit.
     * @method raycastClosest
     * @param {Ray} worldRay
     * @param {IRaycastOptions} options
     * @param {PhysicsRayResult} out
     * @return {boolean} True if any body was hit.
     */
    raycastClosest (worldRay: cc.geomUtils.Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @method raycast
     * @param {Ray} worldRay
     * @param {IRaycastOptions} options
     * @param {RecyclePool} pool
     * @param {PhysicsRayResult[]} resultes
     * @return {boolean} True if any body was hit.
     */
    raycast (worldRay: cc.geomUtils.Ray, options: IRaycastOptions, pool: cc.RecyclePool, resultes: PhysicsRayResult[]): boolean
}

/**
 * Physics world interface
 * @class IPhysicsWorld
 */
export interface IPhysicsWorld extends ICollisionDetect {
    gravity: IVec3Like;
    allowSleep: boolean;
    defaultMaterial: any;
    syncSceneToPhysics?: () => void;
    syncPhysicsToScene?: () => void;
    emitEvents?: () => void;
}