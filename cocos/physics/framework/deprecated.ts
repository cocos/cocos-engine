/**
 * @hidden
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty, removeProperty } from "../../core/utils/deprecated";
import { warnID } from '../../core/platform/debug';
import { BoxCollider } from "./components/colliders/box-collider";
import { SphereCollider } from "./components/colliders/sphere-collider";
import { CapsuleCollider } from "./components/colliders/capsule-collider";
import { CylinderCollider } from "./components/colliders/cylinder-collider";
import { MeshCollider } from "./components/colliders/mesh-collider";
import { RigidBody } from "./components/rigid-body";
import { Collider } from "./components/colliders/collider";
import { ccclass } from "../../core/data/class-decorator";
import { EColliderType } from "./physics-enum";

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

@ccclass('cc.RigidBodyComponent')
export class RigidBodyComponent extends RigidBody {
    constructor () {
        warnID(5400, 'RigidBodyComponent', 'RigidBody');
        super();
    }
}
@ccclass('cc.ColliderComponent')
export class ColliderComponent extends Collider {
    constructor (type: EColliderType) {
        warnID(5400, 'ColliderComponent', 'Collider');
        super(type);
    }
}
@ccclass('cc.BoxColliderComponent')
export class BoxColliderComponent extends BoxCollider {
    constructor () {
        warnID(5400, 'BoxColliderComponent', 'BoxCollider');
        super();
    }
}
@ccclass('cc.SphereColliderComponent')
export class SphereColliderComponent extends SphereCollider {
    constructor () {
        warnID(5400, 'SphereColliderComponent', 'SphereCollider');
        super();
    }
}
@ccclass('cc.CapsuleColliderComponent')
export class CapsuleColliderComponent extends CapsuleCollider {
    constructor () {
        warnID(5400, 'CapsuleColliderComponent', 'CapsuleCollider');
        super();
    }
}
@ccclass('cc.MeshColliderComponent')
export class MeshColliderComponent extends MeshCollider {
    constructor () {
        warnID(5400, 'MeshColliderComponent', 'MeshCollider');
        super();
    }
}
@ccclass('cc.CylinderColliderComponent')
export class CylinderColliderComponent extends CylinderCollider {
    constructor () {
        warnID(5400, 'CylinderColliderComponent', 'CylinderCollider');
        super();
    }
}