
import { select } from '../framework/physics-selector';

import { PhysXWorld } from './physx-world';
import { PhysXRigidBody } from './physx-rigid-body';

import { PhysXSphereShape } from './shapes/physx-sphere-shape';
import { PhysXBoxShape } from './shapes/physx-box-shape';
import { PhysXCapsuleShape } from './shapes/physx-capsule-shape';
import { PhysXPlaneShape } from './shapes/physx-plane-shape';
import { USE_BYTEDANCE } from './export-physx';

let pcs: Constructor<PhysXCapsuleShape> | null = PhysXCapsuleShape;
if (USE_BYTEDANCE) pcs = null;

select('physx', {
    PhysicsWorld: PhysXWorld,
    RigidBody: PhysXRigidBody,

    BoxShape: PhysXBoxShape,
    SphereShape: PhysXSphereShape,
    CapsuleShape: pcs,
    // TrimeshShape: PhysXTrimeshShape,
    // CylinderShape: PhysXCylinderShape,
    // ConeShape: PhysXConeShape,
    // TerrainShape: PhysXTerrainShape,
    // SimplexShape: PhysXSimplexShape,
    PlaneShape: PhysXPlaneShape,

    // PointToPointConstraint: PhysXPointToPointConstraint,
    // HingeConstraint: PhysXHingeConstraint,
});

