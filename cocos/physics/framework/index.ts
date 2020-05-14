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
import { legacyCC } from '../../core/global-exports';

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

legacyCC.PhysicsSystem = PhysicsSystem;

legacyCC.ColliderComponent = ColliderComponent;
legacyCC.BoxColliderComponent = BoxColliderComponent;
legacyCC.SphereColliderComponent = SphereColliderComponent;

legacyCC.RigidBodyComponent = RigidBodyComponent;

legacyCC.PhysicMaterial = PhysicMaterial;
legacyCC.PhysicsRayResult = PhysicsRayResult;
legacyCC.ConstantForce = ConstantForce;

export * from './physics-interface';
export * from './physics-enum';

import './deprecated';
