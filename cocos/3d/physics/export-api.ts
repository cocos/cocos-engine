import { Vec3 } from '../../core/value-types';
import { ColliderComponent } from '../framework/physics/collider/collider-component';
import { RigidBodyComponent } from '../framework/physics/rigid-body-component';

export interface ITriggerEvent {
    readonly type: TriggerEventType;
    readonly selfCollider: ColliderComponent;
    readonly otherCollider: ColliderComponent;
}

export type TriggerEventType = 'onTriggerEnter' | 'onTriggerStay' | 'onTriggerExit';

export type TriggerCallback = (event: ITriggerEvent) => void;

export interface IContactEquation {
    readonly contactA: Vec3;
    readonly contactB: Vec3;
    readonly normal: Vec3;
}

export interface ICollisionEvent {
    readonly type: CollisionEventType;
    readonly selfCollider: ColliderComponent;
    readonly otherCollider: ColliderComponent;
    readonly contacts: IContactEquation[];
}

export type CollisionEventType = 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';

export type CollisionCallback = (event: ICollisionEvent) => void;
