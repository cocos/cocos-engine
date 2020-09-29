/**
 * @category physics
 */

import { PhysicsSystem } from "./physics-system";
import { replaceProperty, removeProperty } from "../../core/utils/deprecated";
import { BoxCollider } from "./components/colliders/box-collider";
import { SphereCollider } from "./components/colliders/sphere-collider";
import { CapsuleCollider } from "./components/colliders/capsule-collider";
import { CylinderCollider } from "./components/colliders/cylinder-collider";
import { MeshCollider } from "./components/colliders/mesh-collider";
import { RigidBody } from "./components/rigid-body";
import { Collider } from "./components/colliders/collider";
import { js } from "../../core/utils/js";
import { legacyCC } from '../../core/global-exports';

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

/**
 * Alias of [[RigidBody]]
 * @deprecated Since v1.2
 */
export { RigidBody as RigidBodyComponent };
legacyCC.RigidBodyComponent = RigidBody;
js.setClassAlias(RigidBody, 'cc.RigidBodyComponent');
/**
 * Alias of [[Collider]]
 * @deprecated Since v1.2
 */
export { Collider as ColliderComponent };
legacyCC.ColliderComponent = Collider;
js.setClassAlias(Collider, 'cc.ColliderComponent');
/**
 * Alias of [[BoxCollider]]
 * @deprecated Since v1.2
 */
export { BoxCollider as BoxColliderComponent };
legacyCC.BoxColliderComponent = BoxCollider;
js.setClassAlias(BoxCollider, 'cc.BoxColliderComponent');
/**
 * Alias of [[SphereCollider]]
 * @deprecated Since v1.2
 */
export { SphereCollider as SphereColliderComponent };
legacyCC.SphereColliderComponent = SphereCollider;
js.setClassAlias(SphereCollider, 'cc.SphereColliderComponent');
/**
 * Alias of [[CapsuleCollider]]
 * @deprecated Since v1.2
 */
export { CapsuleCollider as CapsuleColliderComponent };
js.setClassAlias(CapsuleCollider, 'cc.CapsuleColliderComponent');
/**
 * Alias of [[MeshCollider]]
 * @deprecated Since v1.2
 */
export { MeshCollider as MeshColliderComponent };
js.setClassAlias(MeshCollider, 'cc.MeshColliderComponent');
/**
 * Alias of [[CylinderCollider]]
 * @deprecated Since v1.2
 */
export { CylinderCollider as CylinderColliderComponent };
js.setClassAlias(CylinderCollider, 'cc.CylinderColliderComponent');