/**
 * @hidden
 */

import { PhysicsSystem } from './physics-system';
import { PhysicMaterial } from './assets/physic-material';
import { PhysicsRayResult } from './physics-ray-result';
import { BoxCollider } from './components/colliders/box-collider';
import { Collider } from './components/colliders/collider';
import { SphereCollider } from './components/colliders/sphere-collider';
import { CapsuleCollider } from './components/colliders/capsule-collider';
import { CylinderCollider } from './components/colliders/cylinder-collider';
import { ConeCollider } from './components/colliders/cone-collider';
import { MeshCollider } from './components/colliders/mesh-collider';
import { RigidBody } from './components/rigid-body';
import { ConstantForce } from './components/constant-force';
import { TerrainCollider } from './components/colliders/terrain-collider';
import { SimplexCollider } from './components/colliders/simplex-collider';
import { PlaneCollider } from './components/colliders/plane-collider';

// constraints
import { Constraint } from './components/constraints/constraint';
import { HingeConstraint } from './components/constraints/hinge-constraint';
import { PointToPointConstraint } from './components/constraints/point-to-point-constraint';

export {
    PhysicsSystem,
    PhysicsRayResult,

    Collider,
    BoxCollider,
    SphereCollider,
    CapsuleCollider,
    MeshCollider,
    CylinderCollider,
    ConeCollider,
    TerrainCollider,
    SimplexCollider,
    PlaneCollider,

    Constraint,
    HingeConstraint,
    PointToPointConstraint,

    RigidBody,

    PhysicMaterial,

    ConstantForce,
};

import { legacyCC } from '../../core/global-exports';
legacyCC.PhysicsSystem = PhysicsSystem;

legacyCC.PhysicMaterial = PhysicMaterial;
legacyCC.PhysicsRayResult = PhysicsRayResult;
legacyCC.ConstantForce = ConstantForce;

export * from './physics-interface';
export { EAxisDirection, ERigidBodyType } from './physics-enum';

export * from './deprecated';
