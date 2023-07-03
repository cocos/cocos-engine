/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

import { Vec2 } from '../../core';
import { Collider2D } from '../framework/components/colliders/collider-2d';

/**
 * @en
 * Contact impulses for reporting.
 * @zh
 * 用于返回给回调的接触冲量。
 */
export interface IPhysics2DImpulse {
    /**
     * @en
     * Normal impulses.
     * @zh
     * 法线方向的冲量。
     * @property normalImpulses
     */
    normalImpulses: number[],
    /**
     * @en
     * Tangent impulses.
     * @zh
     * 切线方向的冲量。
     * @property tangentImpulses
     */
    tangentImpulses: number[],
}

/**
 * @en
 * A world manifold.
 * @zh
 * 世界坐标系下的流形。
 */
export interface IPhysics2DWorldManifold {
    /**
     * @en
     * world contact point (point of intersection)
     * @zh
     * 碰撞点集合
     */
    points: Vec2[],

    /**
     * @en
     * a negative value indicates overlap.
     * @zh
     * 一个负数，用于指明重叠的部分。
     */
    separations: number[],

    /**
     * @en
     * world vector pointing from A to B.
     * @zh
     * 世界坐标系下由 A 指向 B 的向量。
     */
    normal: Vec2,
}

/**
 * @en Manifold Type.
 * @zh 流形类型。
 */
export enum Physics2DManifoldType {
    Circles,
    FaceA,
    FaceB
}

/**
* @en
* A manifold point is a contact point belonging to a contact manifold.
* It holds details related to the geometry and dynamics of the contact points.
* Note: the impulses are used for internal caching and may not
* provide reliable contact forces, especially for high speed collisions.
* @zh
* ManifoldPoint 是接触信息中的接触点信息。它拥有关于几何和接触点的详细信息。
* 注意：信息中的冲量用于系统内部缓存，提供的接触力可能不是很准确，特别是高速移动中的碰撞信息。
*/
export interface IPhysics2DManifoldPoint {
    /**
    * @en
    * The local point usage depends on the manifold type:
    * - Physics2DManifoldType.Circles: the local center of circleB.
    * - Physics2DManifoldType.FaceA: the local center of circleB or the clip point of polygonB.
    * - Physics2DManifoldType.FaceB: the clip point of polygonA.
    * @zh
    * 本地坐标点的用途取决于 manifold 的类型。
    * - Physics2DManifoldType.Circles: circleB 的本地中心点。
    * - Physics2DManifoldType.FaceA: circleB 的本地中心点 或者是 polygonB 的截取点。
    * - Physics2DManifoldType.FaceB: polygonB 的截取点。
    */
    localPoint: Vec2;
    /**
    * @en
    * Normal impulse.
    * @zh
    * 法线冲量。
    */
    normalImpulse: number;
    /**
    * @en
    * Tangent impulse.
    * @zh
    * 切线冲量。
    */
    tangentImpulse: number;
}

/**
 * @en Manifold.
 * @zh 流形。
 */
export interface IPhysics2DManifold {
    /**
     * @en
     * Manifold type.
     * @zh
     * Manifold 类型。
     */
    type: Physics2DManifoldType,
    /**
     * @en
     * The local point usage depends on the manifold type:
     * -Physics2DManifoldType.Circles: the local center of circleA.
     * -Physics2DManifoldType.FaceA: the center of faceA.
     * -Physics2DManifoldType.FaceB: the center of faceB.
     * @zh
     * 用途取决于 manifold 类型
     * -Physics2DManifoldType.Circles: circleA 的本地中心点。
     * -Physics2DManifoldType.FaceA: faceA 的本地中心点。
     * -Physics2DManifoldType.FaceB: faceB 的本地中心点。
     */
    localPoint: Vec2,
    /**
     * @en
     * -Physics2DManifoldType.Circles: not used.
     * -Physics2DManifoldType.FaceA: the normal on polygonA.
     * -Physics2DManifoldType.FaceB: the normal on polygonB.
     * @zh
     * -Physics2DManifoldType.Circles: 没被使用到。
     * -Physics2DManifoldType.FaceA: polygonA 的法向量。
     * -Physics2DManifoldType.FaceB: polygonB 的法向量。
     */
    localNormal: Vec2,

    /**
     * @en
     * the points of contact.
     * @zh
     * 接触点信息。
     */
    points: IPhysics2DManifoldPoint[],
}

/**
 * @en
 * PhysicsContact will be generated during begin and end collision as a parameter of the collision callback.
 * Note that contacts will be reused for speed up cpu time, so do not cache anything in the contact.
 * @zh
 * 物理接触会在开始和结束碰撞之间生成，并作为参数传入到碰撞回调函数中。
 * 注意：传入的物理接触会被系统进行重用，所以不要在使用中缓存里面的任何信息。
 */
export interface IPhysics2DContact {
    /**
     * @en
     * One of the collider that collided.
     * @zh
     * 发生碰撞的碰撞体之一。
     */
    colliderA: Collider2D | null;
    /**
     * @en
     * One of the collider that collided.
     * @zh
     * 发生碰撞的碰撞体之一。
     */
    colliderB: Collider2D | null;
    /**
     * @en
     * If set disabled to true, the contact will be ignored until contact end.
     * If you just want to disabled contact for current time step or sub-step, please use disabledOnce.
     * @zh
     * 如果 disabled 被设置为 true，那么直到接触结束此接触都将被忽略。
     * 如果只是希望在当前时间步或子步中忽略此接触，请使用 disabledOnce 。
     */
    disabled: boolean;
    /**
     * @en
     * Disabled contact for current time step or sub-step.
     * @zh
     * 在当前时间步或子步中忽略此接触。
     */
    disabledOnce: boolean;

    /**
     * @en
     * Get the world manifold.
     * @zh
     * 获取世界坐标系下的碰撞信息。
     */
    getWorldManifold (): IPhysics2DWorldManifold;

    /**
     * @en
     * Get the manifold.
     * @zh
     * 获取本地（局部）坐标系下的碰撞信息。
     */
    getManifold (): IPhysics2DManifold;

    /**
     * @en
     * Get the impulses.
     * Note: PhysicsImpulse can only used in onPostSolve callback.
     * @zh
     * 获取冲量信息。
     * 注意：这个信息只有在 onPostSolve 回调中才能获取到。
     */
    getImpulse (): IPhysics2DImpulse | null;

    /**
     * @en
     * Is this contact touching?
     * @zh
     * 返回碰撞体是否已经接触到。
     */
    isTouching (): boolean;
    /**
     * @en
     * Set the desired tangent speed for a conveyor belt behavior.
     * @zh
     * 为传送带设置期望的切线速度。
     */
    setTangentSpeed (value: number);
    /**
     * @en
     * Get the desired tangent speed.
     * @zh
     * 获取切线速度。
     */
    getTangentSpeed (): number;

    /**
     * @en
     * Override the default friction mixture. You can call this in onPreSolve callback.
     * @zh
     * 覆盖默认的摩擦力系数。你可以在 onPreSolve 回调中调用此函数。
     */
    setFriction (value: number);
    /**
     * @en
     * Get the friction.
     * @zh
     * 获取当前摩擦力系数。
     */
    getFriction (): number;
    /**
     * @en
     * Override the default restitution mixture. You can call this in onPreSolve callback.
     * @zh
     * 覆盖默认的恢复系数。你可以在 onPreSolve 回调中调用此函数。
     */
    setRestitution (restitution: number);
    /**
     * @en
     * Get the restitution.
     * @zh
     * 获取当前恢复系数。
     */
    getRestitution (): number;
}
