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
    readonly selfCollider: ColliderComponent;

    /**
     * @en
     * Trigger another collider in event.
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
     * Point A in the collision contact equation.
     * @zh
     * 碰撞信息中的碰撞点A。
     */
    readonly contactA: Vec3;

    /**
     * @en
     * Point A in the collision contact equation.
     * @zh
     * 碰撞信息中的碰撞点B。
     */
    readonly contactB: Vec3;

    /**
     * @en
     * Normal in collision contact contact.
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
    readonly selfCollider: ColliderComponent;

    /**
     * @en
     * Another collider in collision.
     * @zh
     * 碰撞中的另一个碰撞器。
     */
    readonly otherCollider: ColliderComponent;

    // TODO: Provide interface to dynamic instantiate instead static data
    /**
     * @en
     * Information about all points of impact in a collision event.
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
export type CollisionCallback = (event?: ICollisionEvent) => void;
