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
    /**
     * @en
     * Dynamic type.
     * @zh
     * 动态刚体。
     */
    DYNAMIC = 1,
    /**
     * @en
     * Static type.
     * @zh
     * 静态刚体。
     */
    STATIC = 2,
    /**
     * @en
     * Kinematic type.
     * @zh
     * 运动学刚体。
     */
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
    /**
     * @en
     * X axis.
     * @zh
     * X 轴。
     */
    X_AXIS,
    /**
     * @en
     * Y axis.
     * @zh
     * Y 轴。
     */
    Y_AXIS,
    /**
     * @en
     * Z axis.
     * @zh
     * Z 轴。
     */
    Z_AXIS,
}
Enum(EAxisDirection);

/**
 * @en
 * Degree of freedom.
 * @zh
 * 自由度。
 */
export enum ED6Axis {
    /**
     * @en
     * X axis.
     * @zh
     * X 轴。
     */
    X = 0,
    /**
     * @en
     * Y axis.
     * @zh
     * Y 轴。
     */
    Y = 1,
    /**
     * @en
     * Z axis.
     * @zh
     * Z 轴。
     */
    Z = 2,
    /**
     * @en
     * Swing 1, directs toward the local Y axis.
     * @zh
     * 摆动 1，其方向朝向 Y 轴。
     */
    SWING1 = 3,
    /**
     * @en
     * Swing 2, directs toward the local Z axis.
     * @zh
     * 摆动 2，其方向朝向 Z 轴。
     */
    SWING2 = 4,
    /**
     * @en
     * Twist, directs toward the local X axis.
     * @zh
     * 扭转，其方向朝向 X 轴。
     */
    TWIST = 5,
}
Enum(ED6Axis);

/**
 * @en
 * Simplex Type.
 * @zh
 * 单形体类型。
 */
export enum ESimplexType {
    /**
     * @en
     * Point.
     * @zh
     * 点。
     */
    VERTEX = 1,
    /**
     * @en
     * Line.
     * @zh
     * 线。
     */
    LINE = 2,
    /**
     * @en
     * Triangle.
     * @zh
     * 三角形。
     */
    TRIANGLE = 3,
    /**
     * @en
     * Tetrahedron.
     * @zh
     * 四面体。
     */
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
    /**
     * @en
     * Box collider.
     * @zh
     * 盒子碰撞体。
     */
    BOX,
    /**
     * @en
     * Sphere collider.
     * @zh
     * 球碰撞体。
     */
    SPHERE,
    /**
     * @en
     * Capsule collider.
     * @zh
     * 胶囊碰撞体。
     */
    CAPSULE,
    /**
     * @en
     * Cylinder collider.
     * @zh
     * 圆柱碰撞体。
     */
    CYLINDER,
    /**
     * @en
     * Cone collider.
     * @zh
     * 圆锥碰撞体。
     */
    CONE,
    /**
     * @en
     * Mesh collider.
     * @zh
     * 网格碰撞体。
     */
    MESH,
    /**
     * @en
     * Plane collider.
     * @zh
     * 平面碰撞体。
     */
    PLANE,
    /**
     * @en
     * Simplex collider.
     * @zh
     * 单形体碰撞体。
     */
    SIMPLEX,
    /**
     * @en
     * Terrain collider.
     * @zh
     * 地形碰撞体。
     */
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
    /**
     * @en
     * Point to point constraint.
     * @zh
     * 点对点约束。
     */
    POINT_TO_POINT,
    /**
     * @en
     * Hinge constraint.
     * @zh
     * 铰链约束。
     */
    HINGE,
    /**
     * @en
     * Fixed constraint.
     * @zh
     * 固定约束。
     */
    FIXED,

    /**
     * @en
     * Configurable constraint.
     * @zh
     * 可配置约束。
     */
    CONFIGURABLE,
}
Enum(EConstraintType);

/**
 * @en
 * Constraint Mode for degrees of freedom.
 * @zh
 * 自由度约束模式。
 */
export enum EConstraintMode {
    /**
     * @en
     * Free mode, the specified degrees of freedom are free to move.
     * @zh
     * 自由模式，指定的自由度可以自由移动。
     */
    FREE = 0,

    /**
     * @en
     * Limited mode, the specified degrees of freedom are limited.
     * @zh
     * 限制模式，指定的自由度受到限制。
     */
    LIMITED = 1,

    /**
     * @en
     * Locked mode, the specified degrees of freedom are locked.
     * @zh
     * 锁定模式，指定的自由度被锁定。
     */
    LOCKED = 2,
}
Enum(EConstraintMode);

/**
 * @en
 * Driver Type.
 * @zh
 * 驱动类型。
 */
export enum EDriverMode {
    /**
     * @en
     * Disabled.
     * @zh
     * 禁用。
     */
    DISABLED = 0,

    /**
     * @en
     * Servo motor, which targets the specified rotation angle.
     * @zh
     * 伺服电机，旋转到特定角度。
     */
    SERVO = 1,

    /**
     * @en
     * Induction motor, which targets the specified velocity.
     * @zh
     * 感应电机，旋转到特定速度。
     */
    INDUCTION = 2,
}
Enum(EDriverMode);

/**
 * @en
 * Character Controller Type.
 * @zh
 * 角色控制器类型。
 */
export enum ECharacterControllerType {
    /**
     * @en
     * Box Character Controller.
     * @zh
     * 盒体角色控制器。
     */
    BOX,
    /**
     * @en
     * Capsule Character Controller.
     * @zh
     * 胶囊体角色控制器。
     */
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
    /**
     * @en
     * Default group.
     * @zh
     * 默认分组。
     */
    DEFAULT = 1,
}
Enum(PhysicsGroup);

export enum EPhysicsDrawFlags {
    /**
     * @en
     * Draw nothing.
     * @zh
     * 不绘制。
    */
    NONE = 0,

    /**
     * @en
     * Draw wireframe
     * @zh
     * 绘制线框。
    */
    WIRE_FRAME = 0x0001,

    /**
     * @en
     * Draw Constraint.
     * @zh
     * 绘制约束
    */
    CONSTRAINT = 0x0002,

    /**
     * @en
     * Draw AABB.
     * @zh
     * 绘制包围盒。
    */
    AABB = 0x0004,
}
Enum(EPhysicsDrawFlags);
