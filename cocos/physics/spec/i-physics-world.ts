/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { IVec3Like, RecyclePool, geometry, IQuatLike } from '../../core';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { EPhysicsDrawFlags, PhysicsMaterial } from '../framework';

export interface IRaycastOptions {
    mask: number;
    group: number;
    queryTrigger: boolean;
    maxDistance: number;
}

export interface IPhysicsWorld {
    readonly impl: any;
    debugDrawFlags: EPhysicsDrawFlags;
    debugDrawConstraintSize: number;
    setGravity: (v: IVec3Like) => void;
    setAllowSleep: (v: boolean) => void;
    setDefaultMaterial: (v: PhysicsMaterial) => void;
    step (fixedTimeStep: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
    raycast (worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean
    raycastClosest (worldRay: geometry.Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean;
    sweepBox (worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepBoxClosest (worldRay: geometry.Ray, halfExtent: IVec3Like, orientation: IQuatLike,
        options: IRaycastOptions, result: PhysicsRayResult): boolean;
    sweepSphere (worldRay: geometry.Ray, radius: number,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepSphereClosest (worldRay: geometry.Ray, radius: number,
        options: IRaycastOptions, result: PhysicsRayResult): boolean;
    sweepCapsule (worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike,
        options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean;
    sweepCapsuleClosest (worldRay: geometry.Ray, radius: number, height: number, orientation: IQuatLike,
        options: IRaycastOptions, result: PhysicsRayResult): boolean;
    emitEvents (): void;
    syncSceneToPhysics (): void;
    syncAfterEvents (): void;
    destroy (): void;
}
