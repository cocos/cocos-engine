import Ammo from './ammo-instantiated';
import { AmmoShape } from './shapes/ammo-shape';

export interface IAmmoBodyStruct {
    readonly id: number;
    readonly body: Ammo.btRigidBody;
    readonly shape: Ammo.btCollisionShape;
    readonly worldQuat: Ammo.btQuaternion;
    readonly localInertia: Ammo.btVector3;
    readonly rbInfo: Ammo.btRigidBodyConstructionInfo;
    readonly startTransform: Ammo.btTransform;
    readonly motionState: Ammo.btDefaultMotionState;
    readonly wrappedShapes: AmmoShape[];
}

export interface IAmmoGhostStruct {
    readonly id: number;
    readonly ghost: Ammo.btCollisionObject;
    readonly shape: Ammo.btCollisionShape;
    readonly worldQuat: Ammo.btQuaternion;
    readonly wrappedShapes: AmmoShape[];
}