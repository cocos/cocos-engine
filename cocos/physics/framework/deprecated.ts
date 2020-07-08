/**
 * @hidden
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty, removeProperty } from "../../core";
import { BoxColliderComponent } from "./components/collider/box-collider-component";
import { SphereColliderComponent } from "./components/collider/sphere-collider-component";
import { CapsuleColliderComponent } from "./components/collider/capsule-collider-component";
import { RigidBodyComponent } from "./components/rigid-body-component";
import { ColliderComponent } from "./components/collider/collider-component";

replaceProperty(PhysicsSystem, 'PhysicsSystem', [
    {
        "name": "ins",
        "newName": "instance"
    }
]);

replaceProperty(PhysicsSystem.prototype, 'PhysicsSystem', [
    {
        "name": "deltaTime",
        "newName": "fixedTimeStep"
    },
    {
        "name": "maxSubStep",
        "newName": "maxSubSteps"
    }
]);

removeProperty(PhysicsSystem.prototype, 'PhysicsSystem', [
    {
        "name": "useFixedTime"
    }
]);

replaceProperty(ColliderComponent.prototype, 'ColliderComponent.prototype', [
    {
        "name": "attachedRigidbody",
        "newName": "attachedRigidBody"
    }
]);

replaceProperty(BoxColliderComponent.prototype, 'BoxColliderComponent.prototype', [
    {
        "name": "boxShape",
        "newName": "shape"
    }
]);

replaceProperty(SphereColliderComponent.prototype, 'SphereColliderComponent.prototype', [
    {
        "name": "sphereShape",
        "newName": "shape"
    }
]);

replaceProperty(CapsuleColliderComponent.prototype, 'CapsuleColliderComponent.prototype', [
    {
        "name": "capsuleShape",
        "newName": "shape"
    }
]);

replaceProperty(RigidBodyComponent.prototype, 'RigidBodyComponent.prototype', [
    {
        "name": "rigidBody",
        "newName": "body"
    }
]);
