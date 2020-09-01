/**
 * @hidden
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty, removeProperty } from "../../core";
import { BoxCollider } from "./components/colliders/box-collider";
import { SphereCollider } from "./components/colliders/sphere-collider";
import { CapsuleCollider } from "./components/colliders/capsule-collider";
import { RigidBody } from "./components/rigid-body";
import { Collider } from "./components/colliders/collider";

replaceProperty(PhysicsSystem, 'PhysicsSystem', [
    {
        "name": "ins",
        "newName": "instance"
    }
]);

replaceProperty(PhysicsSystem.prototype, 'PhysicsSystem.prototype', [
    {
        "name": "deltaTime",
        "newName": "fixedTimeStep"
    },
    {
        "name": "maxSubStep",
        "newName": "maxSubSteps"
    }
]);

removeProperty(PhysicsSystem.prototype, 'PhysicsSystem.prototype', [
    {
        "name": "useFixedTime"
    }
]);

replaceProperty(Collider.prototype, 'Collider.prototype', [
    {
        "name": "attachedRigidbody",
        "newName": "attachedRigidBody"
    }
]);

replaceProperty(BoxCollider.prototype, 'BoxCollider.prototype', [
    {
        "name": "boxShape",
        "newName": "shape"
    }
]);

replaceProperty(SphereCollider.prototype, 'SphereCollider.prototype', [
    {
        "name": "sphereShape",
        "newName": "shape"
    }
]);

replaceProperty(CapsuleCollider.prototype, 'CapsuleCollider.prototype', [
    {
        "name": "capsuleShape",
        "newName": "shape"
    }
]);

replaceProperty(RigidBody.prototype, 'RigidBody.prototype', [
    {
        "name": "rigidBody",
        "newName": "body"
    }
]);
