import Ammo from '@cocos/ammo';
import { ColliderComponent, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';
import { Vec3 } from '../../core';

export const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as ColliderComponent,
    otherCollider: null as unknown as ColliderComponent,
};

export const CollisionEventObject = {
    type: 'onCollisionEnter' as CollisionEventType,
    selfCollider: null as unknown as ColliderComponent,
    otherCollider: null as unknown as ColliderComponent,
    contacts: [] as IContactEquation[],
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
