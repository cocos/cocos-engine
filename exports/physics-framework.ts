/**
 * @hidden
 */

import { BoxColliderComponent } from '../cocos/3d/framework/physics/collider/box-collider-component';
import { ColliderComponent } from '../cocos/3d/framework/physics/collider/collider-component';
import { SphereColliderComponent } from '../cocos/3d/framework/physics/collider/sphere-collider-component';
import { RigidBodyComponent } from '../cocos/3d/framework/physics/rigid-body-component';

export * from '../cocos/3d/framework/physics';
export {
    ColliderComponent,
    BoxColliderComponent,
    SphereColliderComponent,
    RigidBodyComponent,
};

cc.ColliderComponent = ColliderComponent;
cc.BoxColliderComponent = BoxColliderComponent;
cc.SphereColliderComponent = SphereColliderComponent;
cc.RigidBodyComponent = RigidBodyComponent;
