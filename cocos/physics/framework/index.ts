/**
 * @hidden
 */

import { PhysicsSystem } from './physics-system';
import { PhysicMaterial } from './assets/physic-material';
import { PhysicsRayResult } from './physics-ray-result';
import { BoxColliderComponent } from './components/collider/box-collider-component';
import { ColliderComponent } from './components/collider/collider-component';
import { SphereColliderComponent } from './components/collider/sphere-collider-component';
import { CapsuleColliderComponent } from './components/collider/capsule-collider-component';
import { CylinderColliderComponent } from './components/collider/cylinder-collider-component';
import { MeshColliderComponent } from './components/collider/mesh-collider-component';
import { RigidBodyComponent } from './components/rigid-body-component';
import { ConstantForce } from './components/constant-force';

export {
    PhysicsSystem,
    PhysicsRayResult,

    ColliderComponent,
    BoxColliderComponent,
    SphereColliderComponent,
    CapsuleColliderComponent,
    MeshColliderComponent,
    CylinderColliderComponent,

    RigidBodyComponent,

    PhysicMaterial,

    ConstantForce
};

legacyGlobalExports.PhysicsSystem = PhysicsSystem;

legacyGlobalExports.ColliderComponent = ColliderComponent;
legacyGlobalExports.BoxColliderComponent = BoxColliderComponent;
legacyGlobalExports.SphereColliderComponent = SphereColliderComponent;

legacyGlobalExports.RigidBodyComponent = RigidBodyComponent;

legacyGlobalExports.PhysicMaterial = PhysicMaterial;
legacyGlobalExports.PhysicsRayResult = PhysicsRayResult;
legacyGlobalExports.ConstantForce = ConstantForce;

export * from './physics-interface';
export * from './physics-enum';

import './deprecated';
import { legacyGlobalExports } from '../../core/global-exports';

