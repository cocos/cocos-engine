/**
 * @hidden
 */

import { PhysicsSystem } from './physics-system';
import { PhysicMaterial } from './assets/physic-material';
import { PhysicsRayResult } from './physics-ray-result';
import { BoxColliderComponent } from './components/colliders/box-collider-component';
import { ColliderComponent } from './components/colliders/collider-component';
import { SphereColliderComponent } from './components/colliders/sphere-collider-component';
import { CapsuleColliderComponent } from './components/colliders/capsule-collider-component';
import { CylinderColliderComponent } from './components/colliders/cylinder-collider-component';
import { ConeColliderComponent } from './components/colliders/cone-collider-component';
import { MeshColliderComponent } from './components/colliders/mesh-collider-component';
import { RigidBodyComponent } from './components/rigid-body-component';
import { ConstantForce } from './components/constant-force';
import { TerrainColliderComponent } from './components/colliders/terrain-collider-component';
import { SimplexColliderComponent } from './components/colliders/simplex-collider-component';
import { PlaneColliderComponent } from './components/colliders/plane-collider-component';

export {
    PhysicsSystem,
    PhysicsRayResult,

    ColliderComponent,
    BoxColliderComponent,
    SphereColliderComponent,
    CapsuleColliderComponent,
    MeshColliderComponent,
    CylinderColliderComponent,
    ConeColliderComponent,
    TerrainColliderComponent,
    SimplexColliderComponent,
    PlaneColliderComponent,

    RigidBodyComponent,

    PhysicMaterial,

    ConstantForce
};

import { legacyCC } from '../../core/global-exports';
legacyCC.PhysicsSystem = PhysicsSystem;

legacyCC.ColliderComponent = ColliderComponent;
legacyCC.BoxColliderComponent = BoxColliderComponent;
legacyCC.SphereColliderComponent = SphereColliderComponent;

legacyCC.RigidBodyComponent = RigidBodyComponent;

legacyCC.PhysicMaterial = PhysicMaterial;
legacyCC.PhysicsRayResult = PhysicsRayResult;
legacyCC.ConstantForce = ConstantForce;

export * from './physics-interface';
export { EAxisDirection, ERigidBodyType } from './physics-enum';

import './deprecated';
