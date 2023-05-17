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

import { Enum } from '../../core';

/**
 * @en
 * Rigid body type.
 * @zh
 * 刚体类型。
 */
export enum ERigidBodyType {
    DYNAMIC = 1,
    STATIC = 2,
    KINEMATIC = 4,
}
Enum(ERigidBodyType);

/**
 * @en
 * Axis Direction.
 * @zh
 * 轴方向。
 */
export enum EAxisDirection {
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
}
Enum(EAxisDirection);

/**
 * @en
 * Simplex Type.
 * @zh
 * 单形体类型。
 */
export enum ESimplexType {
    VERTEX = 1,
    LINE = 2,
    TRIANGLE = 3,
    TETRAHEDRON = 4,
}
Enum(ESimplexType);

/**
 * @en
 * Collider Type.
 * @zh
 * 碰撞体类型。
 */
export enum EColliderType {
    BOX,
    SPHERE,
    CAPSULE,
    CYLINDER,
    CONE,
    MESH,
    PLANE,
    SIMPLEX,
    TERRAIN,
}
Enum(EColliderType);

/**
 * @en
 * Constraint Type.
 * @zh
 * 约束类型。
 */
export enum EConstraintType {
    POINT_TO_POINT,
    HINGE,
    CONE_TWIST,
    FIXED,
}
Enum(EConstraintType);

/**
 * @en
 * Character Controller Type.
 * @zh
 * 角色控制器类型。
 */
export enum ECharacterControllerType {
    BOX,
    CAPSULE,
}
Enum(ECharacterControllerType);

/**
 * @en
 * Physics Group.
 * @zh
 * 物理分组。
 */
export enum PhysicsGroup {
    DEFAULT = 1,
}
Enum(PhysicsGroup);
