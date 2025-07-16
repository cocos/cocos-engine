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

import { IVec3Like, Vec3 } from '../../core';
import { CharacterController } from './components/character-controllers/character-controller';
import { Collider } from './components/colliders/collider';

/**
 * @en
 * The definition of the triggering event.
 * @zh
 * 触发事件。
 */
export interface ITriggerEvent {
    /**
     * @en
     * The type of trigger event.
     * @zh
     * 触发的事件类型。
     */
    readonly type: TriggerEventType;

    /**
     * @en
     * The collider component instance of the event owner.
     * @zh
     * 触发事件中的自己的碰撞器
     */
    readonly selfCollider: Collider;

    /**
     * @en
     * Trigger another collider in event.
     * @zh
     * 触发事件中的另一个碰撞器
     */
    readonly otherCollider: Collider;

    /**
     * @en
     * Gets the lowLevel object, through which all the exposed properties can be accessed.
     * @zh
     * 获取实现对象，通过它可以访问到底层暴露的所有属性。
     */
    readonly impl: any
}

/**
 * @en
 * The value type definition of the trigger event.
 * @zh
 * 触发事件的值类型定义。
 */
export type TriggerEventType = 'onTriggerEnter' | 'onTriggerStay' | 'onTriggerExit';

/**
 * @en
 * Signature definition of the callback function that triggers the event.
 * @zh
 * 触发事件的回调函数签名定义。
 */
export type TriggerCallback = (event?: ITriggerEvent) => void;

/**
 * @en
 * Collision information for collision events.
 * @zh
 * 碰撞事件的碰撞信息。
 */
export interface IContactEquation {
    /**
     * @en
     * Gets the lowLevel object, through which all the exposed properties can be accessed.
     * @zh
     * 获取实现对象，通过它可以访问到底层暴露的所有属性。
     */
    readonly impl: any;

    /**
     * @en
     * Gets whether the rigid body bound to the selfCollider is A.
     * @zh
     * 获取`selfCollider`所绑定的刚体是否为 A 。
     */
    readonly isBodyA: boolean;

    /**
     * @en
     * Gets the contact point relative to the rigid body A in the local coordinate system.
     * @zh
     * 获取本地坐标系中相对于刚体 A 的碰撞点。
     * @param out used to storage the output.
     */
    getLocalPointOnA (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact point relative to the rigid body B in the local coordinate system.
     * @zh
     * 获取本地坐标系中相对于刚体 B 的碰撞点。
     * @param out used to storage the output.
     */
    getLocalPointOnB (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact point relative to the rigid body A in the world coordinate system.
     * @zh
     * 获取世界坐标系中相对于刚体 A 的碰撞点。
     * @param out used to storage the output.
     */
    getWorldPointOnA (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact point relative to the rigid body B in the world coordinate system.
     * @zh
     * 获取世界坐标系中相对于刚体 B 的碰撞点。
     * @param out used to storage the output.
     */
    getWorldPointOnB (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact normal relative to the rigid body A in the local coordinate system.
     * @zh
     * 获取本地坐标系中相对于刚体 A 的碰撞法线。
     * @param out used to storage the output.
     */
    getLocalNormalOnA (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact normal relative to the rigid body B in the local coordinate system.
     * @zh
     * 获取本地坐标系中相对于刚体 B 的碰撞法线。
     * @param out used to storage the output.
     */
    getLocalNormalOnB (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact normal relative to the rigid body A in the world coordinate system.
     * @zh
     * 获取世界坐标系中相对于刚体 A 的碰撞法线。
     * @param out used to storage the output.
     */
    getWorldNormalOnA (out: IVec3Like): void;

    /**
     * @en
     * Gets the contact normal relative to the rigid body B in the world coordinate system.
     * @zh
     * 获取世界坐标系中相对于刚体 B 的碰撞法线。
     * @param out used to storage the output.
     */
    getWorldNormalOnB (out: IVec3Like): void;
}

/**
 * @en
 * The definition of the collision event.
 * @zh
 * 碰撞事件。
 */
export interface ICollisionEvent {
    /**
     * @en
     * The type of collision event.
     * @zh
     * 碰撞的事件类型。
     */
    readonly type: CollisionEventType;

    /**
     * @en
     * The collider component instance of the event owner.
     * @zh
     * 碰撞中的自己的碰撞器。
     */
    readonly selfCollider: Collider;

    /**
     * @en
     * Another collider in collision.
     * @zh
     * 碰撞中的另一个碰撞器。
     */
    readonly otherCollider: Collider;

    /**
     * @en
     * Information about all points of impact in a collision event.
     * @zh
     * 碰撞中的所有碰撞点的信息。
     */
    readonly contacts: IContactEquation[];

    /**
     * @en
     * Gets the lowLevel object, through which all the exposed properties can be accessed.
     * @zh
     * 获取实现对象，通过它可以访问到底层暴露的所有属性。
     */
    readonly impl: any;
}

/**
 * @en
 * Value type definitions for collision events.
 * @zh
 * 碰撞事件的值类型定义。
 */
export type CollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

/**
 * @en
 * Callback function signature definition for collision events.
 * @zh
 * 碰撞事件的回调函数签名定义。
 */
export type CollisionCallback = (event?: ICollisionEvent) => void;

/**
 * @en
 * The definition of the trigger event of the character controller.
 * @zh
 * 角色控制器触发事件的值类型定义。
 */
export type CharacterTriggerEventType = 'onControllerTriggerEnter' | 'onControllerTriggerStay' | 'onControllerTriggerExit';

/**
 * @en
 * Value type definitions fot the collision events of character controller.
 * @zh
 * 角色控制器碰撞事件的值类型定义。
 */
export type CharacterCollisionEventType = 'onControllerColliderHit';

/**
 * @en
 * Contact information of the collision event of character controller.
 * @zh
 * 角色控制器碰撞事件的碰撞信息。
 */
export class CharacterControllerContact {
    /**
     * @en
     * Character Controller in collision.
     * @zh
     * 碰撞中的角色控制器。
     */
    declare controller: CharacterController;

    /**
     * @en
     * Collider in collision.
     * @zh
     * 碰撞中的碰撞器。
     */
    declare collider: Collider;

    /**
     * @en
     * The contact point in the world coordinate system.
     * @zh
     * 世界坐标系中的碰撞点。
     */
    worldPosition: Vec3 = new Vec3();

    /**
     * @en
     * The contact normal in the world coordinate system.
     * @zh
     * 世界坐标系中的碰撞法线。
     */
    worldNormal: Vec3 = new Vec3();

    /**
     * @en
     * Motion direction.
     * @zh
     * 移动方向。
     */
    motionDirection: Vec3 = new Vec3();

    /**
     * @en
     * Motion length.
     * @zh
     * 移动长度。
     */
    motionLength = 0;
}
