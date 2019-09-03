/**
 * @hidden
 */

import { PhysicMaterial } from '../cocos/physics/assets/physic-material';
import { BoxColliderComponent } from '../cocos/physics/components/collider/box-collider-component';
import { ColliderComponent } from '../cocos/physics/components/collider/collider-component';
import { SphereColliderComponent } from '../cocos/physics/components/collider/sphere-collider-component';
import { RigidBodyComponent } from '../cocos/physics/components/rigid-body-component';

export * from '../cocos/physics/components';
export {
    ColliderComponent,
    BoxColliderComponent,
    SphereColliderComponent,
    RigidBodyComponent,
    PhysicMaterial
};

cc.ColliderComponent = ColliderComponent;
cc.BoxColliderComponent = BoxColliderComponent;
cc.SphereColliderComponent = SphereColliderComponent;
cc.RigidBodyComponent = RigidBodyComponent;
cc.PhysicMaterial = PhysicMaterial;