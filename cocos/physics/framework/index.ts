/**
 * @hidden
 */

import { PhysicsSystem } from './physics-system';
import { PhysicMaterial } from './assets/physic-material';
import { PhysicsRayResult } from './physics-ray-result';
import { BoxCollider } from './components/colliders/box-collider-component';
import { Collider } from './components/colliders/collider-component';
import { SphereCollider } from './components/colliders/sphere-collider-component';
import { CapsuleCollider } from './components/colliders/capsule-collider-component';
import { CylinderCollider } from './components/colliders/cylinder-collider-component';
import { ConeCollider } from './components/colliders/cone-collider-component';
import { MeshCollider } from './components/colliders/mesh-collider-component';
import { RigidBody } from './components/rigid-body-component';
import { ConstantForce } from './components/constant-force';
import { TerrainCollider } from './components/colliders/terrain-collider-component';
import { SimplexCollider } from './components/colliders/simplex-collider-component';
import { PlaneCollider } from './components/colliders/plane-collider-component';

// constraints
import { Constraint } from './components/constraints/constraint-component';
import { HingeConstraint } from './components/constraints/hinge-constraint-component';
import { PointToPointConstraint } from './components/constraints/point-to-point-constraint-component';

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

    ConstantForce
};

import { legacyCC } from '../../core/global-exports';
legacyCC.PhysicsSystem = PhysicsSystem;

legacyCC.Collider = Collider;
legacyCC.BoxCollider = BoxCollider;
legacyCC.SphereCollider = SphereCollider;

legacyCC.RigidBody = RigidBody;

legacyCC.PhysicMaterial = PhysicMaterial;
legacyCC.PhysicsRayResult = PhysicsRayResult;
legacyCC.ConstantForce = ConstantForce;

export * from './physics-interface';
export { EAxisDirection, ERigidBodyType } from './physics-enum';

import './deprecated';
