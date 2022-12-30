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

import { Enum, Vec2 } from '../../core';
import { Collider2D } from './components/colliders/collider-2d';

export enum ERigidBody2DType {
    /**
     * @en
     * zero mass, zero velocity, may be manually moved.
     * @zh
     * 零质量，零速度，可以手动移动。
     */
    Static = 0,
    /**
     * @en
     * zero mass, non-zero velocity set by user.
     * @zh
     * 零质量，可以被设置速度。
     */
    Kinematic = 1,
    /**
     * @en
     * positive mass, non-zero velocity determined by forces.
     * @zh
     * 有质量，可以设置速度，力等。
     */
    Dynamic = 2,
    /**
     * @en
     * An extension of Kinematic type, can be animated by Animation.
     * @zh
     * Kinematic 类型的扩展，可以被动画控制动画效果。
     */
    Animated = 3
}
Enum(ERigidBody2DType);

export enum ECollider2DType {
    None,
    BOX,
    CIRCLE,
    POLYGON,
}
Enum(ECollider2DType);

export enum EJoint2DType {
    None,
    DISTANCE,
    SPRING,
    WHEEL,
    MOUSE,
    FIXED,
    SLIDER,
    RELATIVE,
    HINGE,
}
Enum(EJoint2DType);

export enum PhysicsGroup {
    DEFAULT = 1,
}
Enum(PhysicsGroup);

/**
 * @en Enum for ERaycast2DType.
 * @zh 射线检测类型。
 * @enum ERaycast2DType.
 */
export enum ERaycast2DType {
    /**
     * @en
     * Detects closest collider on the raycast path.
     * @zh
     * 检测射线路径上最近的碰撞体。
     */
    Closest,
    /**
     * @en
     * Detects any collider on the raycast path.
     * Once detects a collider, will stop the searching process.
     * @zh
     * 检测射线路径上任意的碰撞体。
     * 一旦检测到任何碰撞体，将立刻结束检测其他的碰撞体。
     */
    Any,
    /**
     * @en
     * Detects all colliders on the raycast path.
     * One collider may return several collision points(because one collider may have several fixtures,
     * one fixture will return one point, the point may inside collider), AllClosest will return the closest one.
     * @zh
     * 检测射线路径上所有的碰撞体。
     * 同一个碰撞体上有可能会返回多个碰撞点(因为一个碰撞体可能由多个夹具组成，每一个夹具会返回一个碰撞点，碰撞点有可能在碰撞体内部)，AllClosest 删选同一个碰撞体上最近的哪一个碰撞点。
     */
    AllClosest,

    /**
     * @en
     * Detects all colliders on the raycast path.
     * One collider may return several collision points, All will return all these points.
     * @zh
     * 检测射线路径上所有的碰撞体。
     * 同一个碰撞体上有可能会返回多个碰撞点，All 将返回所有这些碰撞点。
     */
    All
}

export const Contact2DType = {
    None: 'none-contact',
    BEGIN_CONTACT: 'begin-contact',
    END_CONTACT: 'end-contact',
    PRE_SOLVE: 'pre-solve',
    POST_SOLVE: 'post-solve',
};

export interface RaycastResult2D {
    collider: Collider2D,
    fixtureIndex: number,
    point: Vec2,
    normal: Vec2,
    fraction: number
}

export enum EPhysics2DDrawFlags {
    None = 0,
    Shape = 0x0001, /// < draw shapes
    Joint = 0x0002, /// < draw joint connections
    Aabb = 0x0004, /// < draw axis aligned bounding boxes
    Pair = 0x0008, /// < draw broad-phase pairs
    CenterOfMass = 0x0010, /// < draw center of mass frame
    // #if B2_ENABLE_PARTICLE
    Particle = 0x0020, /// < draw particles
    // #endif
    // #if B2_ENABLE_CONTROLLER
    Controller = 0x0040, /// @see b2Controller list
    // #endif
    All = 0x003f,
}

export const PHYSICS_2D_PTM_RATIO = 32;
