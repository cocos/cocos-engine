import Ammo from '@cocos/ammo';
import { ColliderComponent, TriggerEventType, CollisionEventType, IContactEquation } from '../../../exports/physics-framework';

// export const defaultShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
// export const defaultInertia = new Ammo.btVector3();
// defaultShape.calculateLocalInertia(10, defaultInertia);
// export const defaultMotionState = new Ammo.btDefaultMotionState();
// export const defaultRigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(10, defaultMotionState, defaultShape, defaultInertia);

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
    emptyShape = new Ammo.btEmptyShape();
}