/**
 * @hidden
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty } from "../../core";
import { BoxColliderComponent, SphereColliderComponent, CapsuleColliderComponent, RigidBodyComponent } from ".";

replaceProperty(PhysicsSystem, 'PhysicsSystem', [
    {
        "name": "ins",
        "newName": "instance"
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
