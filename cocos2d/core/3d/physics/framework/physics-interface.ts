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

import { Vec3 } from '../../../value-types';
import { PhysicsColliderComponent } from './components/collider/collider-component';

/**
 * !#en
 * Trigger event
 * !#zh
 * 触发事件。
 */
export interface ITriggerEvent {
    /**
     * !#en
     * The type of event fired
     * !#zh
     * 触发的事件类型
     */
    readonly type: TriggerEventType;

    /**
     * !#en
     * Triggers its own collider in the event
     * !#zh
     * 触发事件中的自己的碰撞器
     */
    readonly selfCollider: PhysicsColliderComponent;

    /**
     * !#en
     * Triggers another collider in the event
     * !#zh
     * 触发事件中的另一个碰撞器
     */
    readonly otherCollider: PhysicsColliderComponent;
}

/**
 * !#en
 * The value type definition of the trigger event.
 * !#zh
 * 触发事件的值类型定义。
 */
export type TriggerEventType = 'onTriggerEnter' | 'onTriggerStay' | 'onTriggerExit';

/**
 * !#en
 * The callback signature definition of the event that was fired.
 * !#zh
 * 触发事件的回调函数签名定义。
 */
export type TriggerCallback = (event: ITriggerEvent) => void;

/**
 * !#en
 * Collision information for collision events.
 * !#zh
 * 碰撞事件的碰撞信息。
 */
export interface IContactEquation {
    /**
     * !#en
     * The collision point A in the collision information.
     * !#zh
     * 碰撞信息中的碰撞点A。
     */
    readonly contactA: Vec3;

    /**
     * !#en
     * Collision point B in collision information.
     * !#zh
     * 碰撞信息中的碰撞点B。
     */
    readonly contactB: Vec3;

    /**
     * !#en
     * Normals in collision information.
     * !#zh
     * 碰撞信息中的法线。
     */
    readonly normal: Vec3;
}

/**
 * !#en
 * Collision events.
 * !#zh
 * 碰撞事件。
 */
export interface ICollisionEvent {
    /**
     * !#en
     * Event type of collision.
     * !#zh
     * 碰撞的事件类型。
     */
    readonly type: CollisionEventType;

    /**
     * !#en
     * Collider of its own in collision.
     * !#zh
     * 碰撞中的自己的碰撞器。
     */
    readonly selfCollider: PhysicsColliderComponent;

    /**
     * !#en
     * Another collider in the collision.
     * !#zh
     * 碰撞中的另一个碰撞器。
     */
    readonly otherCollider: PhysicsColliderComponent;

    /**
     * !#en
     * Information about all the points of impact in the collision.
     * !#zh
     * 碰撞中的所有碰撞点的信息。
     */
    readonly contacts: IContactEquation[];
}

/**
 * !#en
 * Value type definition for collision events.
 * !#zh
 * 碰撞事件的值类型定义。
 */
export type CollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

/**
 * !#en
 * The callback signature definition for the collision event.
 * !#zh
 * 碰撞事件的回调函数签名定义。
 */
export type CollisionCallback = (event: ICollisionEvent) => void;