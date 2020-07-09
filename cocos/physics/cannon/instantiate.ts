
import { PHYSICS_CANNON } from 'internal:constants';
import { instantiate } from '../framework/physics-selector';

import { CannonRigidBody } from './cannon-rigid-body';
import { CannonWorld } from './cannon-world';

import { CannonBoxShape } from './shapes/cannon-box-shape';
import { CannonSphereShape } from './shapes/cannon-sphere-shape';
import { CannonTrimeshShape } from './shapes/cannon-trimesh-shape';
import { CannonCylinderShape } from './shapes/cannon-cylinder-shape';
import { CannonConeShape } from './shapes/cannon-cone-shape';
import { CannonTerrainShape } from './shapes/cannon-terrain-shape';
import { CannonSimplexShape } from './shapes/cannon-simplex-shape';
import { CannonPlaneShape } from './shapes/cannon-plane-shape';

import { CannonPointToPointConstraint } from './constraints/cannon-point-to-point-constraint';

if (PHYSICS_CANNON) {
    instantiate({
        PhysicsWorld: CannonWorld,
        RigidBody: CannonRigidBody,

        BoxShape: CannonBoxShape,
        SphereShape: CannonSphereShape,
        TrimeshShape: CannonTrimeshShape,
        CylinderShape: CannonCylinderShape,
        ConeShape: CannonConeShape,
        TerrainShape: CannonTerrainShape,
        SimplexShape: CannonSimplexShape,
        PlaneShape: CannonPlaneShape,

        PointToPointConstraint: CannonPointToPointConstraint,
    });
}

import './deprecated';