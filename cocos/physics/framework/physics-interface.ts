/**
 * @category physics
 */

import { Vec3 } from '../../core/math';
import { ColliderComponent } from './components/collider/collider-component';

/**
 * @en
 * The definition of the triggering event.
 * @zh
 * 触发事件。
 */
export interface ITriggerEvent {
    /**
     * @zh
     * 触发的事件类型
     */
    readonly type: TriggerEventType;

    /**
     * @zh
     * 触发事件中的自己的碰撞器
     */
    readonly selfCollider: ColliderComponent;

    /**
     * @zh
     * 触发事件中的另一个碰撞器
     */
    readonly otherCollider: ColliderComponent;
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
export type TriggerCallback = (event: ITriggerEvent) => void;

/**
 * @en
 * Collision information for collision events.
 * @zh
 * 碰撞事件的碰撞信息。
 */
export interface IContactEquation {
    /**
     * @zh
     * 碰撞信息中的碰撞点A。
     */
    readonly contactA: Vec3;

    /**
     * @zh
     * 碰撞信息中的碰撞点B。
     */
    readonly contactB: Vec3;

    /**
     * @zh
     * 碰撞信息中的法线。
     */
    readonly normal: Vec3;
}

/**
 * @en
 * The definition of the collision event.
 * @zh
 * 碰撞事件。
 */
export interface ICollisionEvent {
    /**
     * @zh
     * 碰撞的事件类型。
     */
    readonly type: CollisionEventType;

    /**
     * @zh
     * 碰撞中的自己的碰撞器。
     */
    readonly selfCollider: ColliderComponent;

    /**
     * @zh
     * 碰撞中的另一个碰撞器。
     */
    readonly otherCollider: ColliderComponent;

    /**
     * @zh
     * 碰撞中的所有碰撞点的信息。
     */
    readonly contacts: IContactEquation[];
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
export type CollisionCallback = (event: ICollisionEvent) => void;
