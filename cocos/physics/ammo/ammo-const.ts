import Ammo from './ammo-instantiated';
import { Collider, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';
import { Vec3, Quat } from '../../core';

export const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    impl: null,
};

export const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    contacts: [] as IContactEquation[],
    impl: null,
};

export class AmmoConstant {
    private static _instance: AmmoConstant;
    static get instance () {
        if (AmmoConstant._instance == null) AmmoConstant._instance = new AmmoConstant;
        return AmmoConstant._instance;
    }
    readonly EMPTY_SHAPE = new Ammo.btEmptyShape();
    readonly TRANSFORM = new Ammo.btTransform();
    readonly VECTOR3_0 = new Ammo.btVector3();
    readonly VECTOR3_1 = new Ammo.btVector3();
    readonly QUAT_0 = new Ammo.btQuaternion();
}

export const CC_V3_0 = new Vec3();
export const CC_V3_1 = new Vec3();
export const CC_QUAT_0 = new Quat();
